/**
 * SM-2 scheduling, matching Anki's default deck preset.
 *
 * Kept as pure functions over a plain state object: no database, no clock,
 * no randomness except what is passed in. That is what makes the behaviour
 * checkable against Anki's documented defaults in scheduler.test.ts rather
 * than by feel, and it is why `now` and `rng` are parameters.
 *
 * Ease is stored as a percentage (250 = 250%), the way Anki shows it.
 * Intervals are in DAYS for review cards and MINUTES for learning steps —
 * the two never mix, because a card in a learning step has no day interval
 * yet and pretending otherwise is how graduating gets miscounted.
 */

export type Grade = 1 | 2 | 3 | 4; // Again, Hard, Good, Easy

export const GRADE_LABELS: Record<Grade, string> = {
  1: "Again",
  2: "Hard",
  3: "Good",
  4: "Easy",
};

/**
 * `new`        never studied
 * `learning`   working through the learning steps for the first time
 * `review`     graduated; interval measured in days
 * `relearning` lapsed from review, working back through the relearning steps
 */
export type CardState = "new" | "learning" | "review" | "relearning";

export interface SchedulingState {
  state: CardState;
  /** Index into the learning (or relearning) steps. */
  step: number;
  /** Percent, Anki-style. 250 = 250%. */
  ease: number;
  /** Days. Only meaningful once the card has graduated. */
  intervalDays: number;
  /** Epoch ms. */
  due: number;
  lapses: number;
  reps: number;
}

export interface Settings {
  /** Minutes. Anki default: 1 min, 10 min. */
  learningSteps: number[];
  /** Minutes. Anki default: a single 10 min step. */
  relearningSteps: number[];
  /** Days given when a card graduates on Good. */
  graduatingInterval: number;
  /** Days given when a new card is answered Easy. */
  easyInterval: number;
  /** Percent. */
  startingEase: number;
  /** Multiplier applied on top of ease for Easy. */
  easyBonus: number;
  /** Multiplier for Hard on a review card. */
  hardFactor: number;
  /** Percent floor, so a hard card cannot spiral to daily forever. */
  minEase: number;
  /** Days. */
  maximumInterval: number;
  /** Days a lapsed card gets once it finishes relearning. */
  lapseInterval: number;
  newPerDay: number;
  reviewsPerDay: number;
  /** Hour of the local day the counters roll over. Anki uses 4am. */
  rolloverHour: number;
  fuzz: boolean;
}

export const DEFAULT_SETTINGS: Settings = {
  learningSteps: [1, 10],
  relearningSteps: [10],
  graduatingInterval: 1,
  easyInterval: 4,
  startingEase: 250,
  easyBonus: 1.3,
  hardFactor: 1.2,
  minEase: 130,
  maximumInterval: 365,
  lapseInterval: 1,
  newPerDay: 20,
  reviewsPerDay: 200,
  rolloverHour: 4,
  fuzz: true,
};

export const MINUTE = 60_000;
export const DAY = 86_400_000;

export function newCardState(settings: Settings, now: number): SchedulingState {
  return {
    state: "new",
    step: 0,
    ease: settings.startingEase,
    intervalDays: 0,
    due: now,
    lapses: 0,
    reps: 0,
  };
}

/**
 * The start of the study day containing `now`.
 *
 * The day rolls over at 4am rather than midnight so a session that runs past
 * midnight still counts against the day it started in — reviewing at 00:30
 * should not hand you a fresh batch of 20 new cards.
 */
export function dayStart(now: number, rolloverHour: number): number {
  const d = new Date(now);
  const boundary = new Date(d.getFullYear(), d.getMonth(), d.getDate(), rolloverHour, 0, 0, 0);
  if (d.getTime() < boundary.getTime()) boundary.setDate(boundary.getDate() - 1);
  return boundary.getTime();
}

/** Which study day a timestamp belongs to, as a stable key. */
export function dayKey(ts: number, rolloverHour: number): string {
  return new Date(dayStart(ts, rolloverHour)).toISOString().slice(0, 10);
}

/**
 * Anki's interval fuzz: a small random spread so cards answered together on
 * one day do not come back together forever after. Bigger intervals get a
 * proportionally smaller spread, and anything under ~2.5 days is left alone
 * because there is nowhere for it to go.
 */
export function fuzzedInterval(days: number, rng: () => number): number {
  if (days < 2.5) return Math.round(days);
  let pct: number;
  if (days < 7) pct = 0.25;
  else if (days < 30) pct = 0.15;
  else pct = 0.05;
  const spread = Math.max(1, Math.round(days * pct));
  // Inclusive range [days - spread, days + spread].
  const offset = Math.round((rng() * 2 - 1) * spread);
  return Math.max(1, Math.round(days) + offset);
}

function clampInterval(days: number, settings: Settings): number {
  return Math.max(1, Math.min(Math.round(days), settings.maximumInterval));
}

function clampEase(ease: number, settings: Settings): number {
  return Math.max(settings.minEase, Math.round(ease));
}

function stepsFor(state: CardState, settings: Settings): number[] {
  return state === "relearning" ? settings.relearningSteps : settings.learningSteps;
}

/**
 * The result of answering a card: the new scheduling state, plus what the
 * review log needs to record.
 */
export interface AnswerResult {
  next: SchedulingState;
  /** Days, or 0 when the card is still inside a learning step. */
  intervalDays: number;
  /** Minutes until it is due again, for the sub-day cases. */
  intervalMinutes: number;
}

/**
 * Answer a card.
 *
 * `rng` is injected so tests are deterministic; pass Math.random in the app.
 */
export function answerCard(
  card: SchedulingState,
  grade: Grade,
  now: number,
  settings: Settings,
  rng: () => number = Math.random,
): AnswerResult {
  const reps = card.reps + 1;
  const inLearning = card.state === "new" || card.state === "learning" || card.state === "relearning";

  if (inLearning) {
    const relearning = card.state === "relearning";
    const steps = stepsFor(relearning ? "relearning" : "learning", settings);

    if (grade === 1) {
      // Back to the first step. Ease is untouched here: the lapse penalty is
      // applied once, when the card falls OUT of review, not on every failed
      // repetition of the step.
      const minutes = steps[0] ?? 1;
      return {
        next: { ...card, state: relearning ? "relearning" : "learning", step: 0, due: now + minutes * MINUTE, reps },
        intervalDays: 0,
        intervalMinutes: minutes,
      };
    }

    if (grade === 2) {
      // Hard repeats the current step. On the first step Anki waits the
      // average of the first two, which is gentler than repeating 1 min and
      // stops a hard card cycling every sixty seconds.
      const current = steps[card.step] ?? steps[0] ?? 1;
      const next = steps[card.step + 1];
      const minutes = card.step === 0 && next !== undefined ? (current + next) / 2 : current;
      return {
        next: { ...card, state: relearning ? "relearning" : "learning", due: now + minutes * MINUTE, reps },
        intervalDays: 0,
        intervalMinutes: minutes,
      };
    }

    if (grade === 3) {
      const nextStep = card.step + 1;
      if (nextStep < steps.length) {
        const minutes = steps[nextStep];
        return {
          next: { ...card, state: relearning ? "relearning" : "learning", step: nextStep, due: now + minutes * MINUTE, reps },
          intervalDays: 0,
          intervalMinutes: minutes,
        };
      }
      // Graduating. A lapsed card returns on the lapse interval, a brand new
      // one on the graduating interval.
      const days = clampInterval(relearning ? settings.lapseInterval : settings.graduatingInterval, settings);
      return {
        next: { ...card, state: "review", step: 0, intervalDays: days, due: now + days * DAY, reps },
        intervalDays: days,
        intervalMinutes: 0,
      };
    }

    // Easy: skip the remaining steps entirely.
    const days = clampInterval(relearning ? Math.max(settings.lapseInterval, settings.easyInterval) : settings.easyInterval, settings);
    return {
      next: { ...card, state: "review", step: 0, intervalDays: days, due: now + days * DAY, reps },
      intervalDays: days,
      intervalMinutes: 0,
    };
  }

  // ── Review card ───────────────────────────────────────────────────────
  if (grade === 1) {
    // A lapse: the ease penalty lands here, once, and the card drops into
    // relearning rather than being given a new day interval straight away.
    const ease = clampEase(card.ease - 20, settings);
    const minutes = settings.relearningSteps[0] ?? 10;
    return {
      next: {
        ...card,
        state: "relearning",
        step: 0,
        ease,
        lapses: card.lapses + 1,
        due: now + minutes * MINUTE,
        reps,
      },
      intervalDays: 0,
      intervalMinutes: minutes,
    };
  }

  let ease = card.ease;
  let raw: number;
  if (grade === 2) {
    ease = clampEase(card.ease - 15, settings);
    raw = card.intervalDays * settings.hardFactor;
  } else if (grade === 3) {
    raw = card.intervalDays * (card.ease / 100);
  } else {
    ease = clampEase(card.ease + 15, settings);
    raw = card.intervalDays * (card.ease / 100) * settings.easyBonus;
  }

  // An interval must always move forward, even when rounding would not.
  raw = Math.max(card.intervalDays + 1, raw);
  const fuzzed = settings.fuzz ? fuzzedInterval(raw, rng) : Math.round(raw);
  const days = clampInterval(fuzzed, settings);

  return {
    next: { ...card, state: "review", step: 0, ease, intervalDays: days, due: now + days * DAY, reps },
    intervalDays: days,
    intervalMinutes: 0,
  };
}

/**
 * What each button would give, for the labels under them — unfuzzed, the way
 * Anki previews it. Showing a fuzzed number would be a number the card does
 * not actually get.
 */
export function previewIntervals(
  card: SchedulingState,
  settings: Settings,
): Record<Grade, string> {
  const out = {} as Record<Grade, string>;
  for (const g of [1, 2, 3, 4] as Grade[]) {
    const r = answerCard(card, g, 0, { ...settings, fuzz: false });
    out[g] = r.intervalDays > 0 ? formatDays(r.intervalDays) : formatMinutes(r.intervalMinutes);
  }
  return out;
}

export function formatMinutes(minutes: number): string {
  if (minutes < 1) return "<1m";
  if (minutes < 60) return `${Math.round(minutes)}m`;
  const hours = minutes / 60;
  return hours < 24 ? `${Math.round(hours)}h` : `${Math.round(hours / 24)}d`;
}

export function formatDays(days: number): string {
  if (days < 30) return `${Math.round(days)}d`;
  if (days < 365) return `${(days / 30).toFixed(1)}mo`;
  return `${(days / 365).toFixed(1)}y`;
}
