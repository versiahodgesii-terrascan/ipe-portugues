import { db, getSettings, type Card } from "./db";
import { dayStart, dayKey } from "./scheduler";

export interface Queue {
  /** Cards due now, in the order they should be shown. */
  cards: Card[];
  counts: { new: number; learning: number; review: number };
}

/**
 * Build today's queue.
 *
 * Three rules, all Anki's:
 *  - learning cards whose step is already due come first, because a step
 *    missed is a step that did not happen;
 *  - new cards are capped per day, counted by the day they were INTRODUCED,
 *    so re-opening the app does not hand out a fresh twenty;
 *  - reviews are capped too, oldest due first, so a backlog drains in the
 *    order it built up rather than at random.
 */
export async function buildQueue(now = Date.now()): Promise<Queue> {
  const settings = await getSettings();
  const today = dayKey(now, settings.rolloverHour);

  const all = await db.cards.filter((c) => !c.suspended).toArray();

  const learning = all
    .filter((c) => (c.state === "learning" || c.state === "relearning") && c.due <= now)
    .sort((a, b) => a.due - b.due);

  const introducedToday = all.filter((c) => c.introducedOn === today).length;
  const newRemaining = Math.max(0, settings.newPerDay - introducedToday);
  const fresh = all
    .filter((c) => c.state === "new")
    .sort((a, b) => (a.entryId - b.entryId) || (a.id! - b.id!))
    .slice(0, newRemaining);

  const reviewedToday = await db.reviews
    .where("day").equals(today)
    .filter((r) => r.stateBefore === "review")
    .count();
  const reviewRemaining = Math.max(0, settings.reviewsPerDay - reviewedToday);
  const due = all
    .filter((c) => c.state === "review" && c.due <= now)
    .sort((a, b) => a.due - b.due)
    .slice(0, reviewRemaining);

  // Interleave rather than front-loading every new card: twenty unknown words
  // in a row is where a session stops being review and starts being a lesson.
  const mixed: Card[] = [];
  const queueNew = [...fresh];
  const queueDue = [...due];
  const ratio = queueNew.length > 0 ? Math.max(1, Math.round(queueDue.length / queueNew.length)) : 0;
  let sinceNew = 0;
  while (queueNew.length || queueDue.length) {
    if (queueDue.length && (sinceNew < ratio || !queueNew.length)) {
      mixed.push(queueDue.shift()!);
      sinceNew++;
    } else if (queueNew.length) {
      mixed.push(queueNew.shift()!);
      sinceNew = 0;
    }
  }

  return {
    cards: [...learning, ...mixed],
    counts: { new: fresh.length, learning: learning.length, review: due.length },
  };
}

/** Cards that will come back inside this session — learning steps under 20 min. */
export function dueAgainSoon(cards: Card[], now: number): Card[] {
  return cards
    .filter((c) => (c.state === "learning" || c.state === "relearning") && c.due > now && c.due - now <= 20 * 60_000)
    .sort((a, b) => a.due - b.due);
}

export async function dueTomorrow(now = Date.now()): Promise<number> {
  const settings = await getSettings();
  const start = dayStart(now, settings.rolloverHour) + 86_400_000;
  const end = start + 86_400_000;
  return db.cards.filter((c) => !c.suspended && c.due >= start && c.due < end).count();
}

/** Consecutive days with at least one review, counting back from today. */
export async function streak(now = Date.now()): Promise<number> {
  const settings = await getSettings();
  const days = new Set((await db.reviews.toArray()).map((r) => r.day));
  let count = 0;
  let cursor = dayStart(now, settings.rolloverHour);
  // Today not yet reviewed does not break a streak that is still alive.
  if (!days.has(dayKey(cursor, settings.rolloverHour))) cursor -= 86_400_000;
  while (days.has(dayKey(cursor, settings.rolloverHour))) {
    count++;
    cursor -= 86_400_000;
  }
  return count;
}
