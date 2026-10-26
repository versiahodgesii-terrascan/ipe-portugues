import { describe, it, expect } from "vitest";
import {
  answerCard, newCardState, DEFAULT_SETTINGS, dayStart, dayKey,
  fuzzedInterval, previewIntervals, DAY, MINUTE,
  type SchedulingState, type Settings,
} from "./scheduler";

const S: Settings = { ...DEFAULT_SETTINGS, fuzz: false };
const NOW = Date.UTC(2026, 0, 15, 12, 0, 0);

const review = (over: Partial<SchedulingState> = {}): SchedulingState => ({
  state: "review", step: 0, ease: 250, intervalDays: 10,
  due: NOW, lapses: 0, reps: 5, ...over,
});

describe("new cards walk the learning steps", () => {
  it("Good moves to the second step: 10 minutes", () => {
    const r = answerCard(newCardState(S, NOW), 3, NOW, S);
    expect(r.next.state).toBe("learning");
    expect(r.next.step).toBe(1);
    expect(r.intervalMinutes).toBe(10);
    expect(r.next.due).toBe(NOW + 10 * MINUTE);
  });

  it("Good twice graduates at the graduating interval of 1 day", () => {
    const first = answerCard(newCardState(S, NOW), 3, NOW, S).next;
    const r = answerCard(first, 3, NOW, S);
    expect(r.next.state).toBe("review");
    expect(r.intervalDays).toBe(1);
    expect(r.next.due).toBe(NOW + DAY);
  });

  it("Again returns to the first step: 1 minute", () => {
    const second = answerCard(newCardState(S, NOW), 3, NOW, S).next;
    const r = answerCard(second, 1, NOW, S);
    expect(r.next.step).toBe(0);
    expect(r.intervalMinutes).toBe(1);
    expect(r.next.state).toBe("learning");
  });

  it("Easy graduates immediately at the easy interval of 4 days", () => {
    const r = answerCard(newCardState(S, NOW), 4, NOW, S);
    expect(r.next.state).toBe("review");
    expect(r.intervalDays).toBe(4);
  });

  it("Hard on the first step waits the average of the first two steps", () => {
    const r = answerCard(newCardState(S, NOW), 2, NOW, S);
    expect(r.intervalMinutes).toBe(5.5);
    expect(r.next.step).toBe(0);
  });

  it("a new card does not change ease while in learning", () => {
    const r = answerCard(newCardState(S, NOW), 1, NOW, S);
    expect(r.next.ease).toBe(250);
  });
});

describe("review cards follow SM-2", () => {
  it("Good multiplies the interval by the ease and leaves ease alone", () => {
    const r = answerCard(review(), 3, NOW, S);
    expect(r.intervalDays).toBe(25); // 10 × 2.50
    expect(r.next.ease).toBe(250);
  });

  it("Hard drops ease by 15 and multiplies the interval by 1.2", () => {
    const r = answerCard(review(), 2, NOW, S);
    expect(r.next.ease).toBe(235);
    expect(r.intervalDays).toBe(12); // 10 × 1.2
  });

  it("Easy adds 15 to ease and applies the 1.3 bonus on top of the old ease", () => {
    const r = answerCard(review(), 4, NOW, S);
    expect(r.next.ease).toBe(265);
    expect(r.intervalDays).toBe(33); // 10 × 2.50 × 1.3 = 32.5 → 33
  });

  it("Again drops ease by 20, counts a lapse and enters relearning", () => {
    const r = answerCard(review(), 1, NOW, S);
    expect(r.next.ease).toBe(230);
    expect(r.next.state).toBe("relearning");
    expect(r.next.lapses).toBe(1);
    expect(r.intervalMinutes).toBe(10);
    expect(r.intervalDays).toBe(0);
  });

  it("a lapsed card that finishes relearning comes back at 1 day", () => {
    const lapsed = answerCard(review(), 1, NOW, S).next;
    const r = answerCard(lapsed, 3, NOW, S);
    expect(r.next.state).toBe("review");
    expect(r.intervalDays).toBe(1);
  });

  it("an interval always moves forward, even when the maths would not", () => {
    const r = answerCard(review({ intervalDays: 1, ease: 130 }), 2, NOW, S);
    expect(r.intervalDays).toBeGreaterThan(1);
  });
});

describe("limits hold", () => {
  it("ease never falls below the 130 floor", () => {
    let card = review({ ease: 140 });
    for (let i = 0; i < 10; i++) card = answerCard(card, 1, NOW, S).next;
    expect(card.ease).toBe(130);
  });

  it("intervals are capped at the maximum", () => {
    const r = answerCard(review({ intervalDays: 300 }), 4, NOW, S);
    expect(r.intervalDays).toBe(365);
  });

  it("the cap is configurable", () => {
    const r = answerCard(review({ intervalDays: 300 }), 4, NOW, { ...S, maximumInterval: 180 });
    expect(r.intervalDays).toBe(180);
  });
});

describe("fuzz", () => {
  it("leaves short intervals alone", () => {
    expect(fuzzedInterval(1, () => 0)).toBe(1);
    expect(fuzzedInterval(2, () => 1)).toBe(2);
  });

  it("spreads longer intervals both ways but never below 1", () => {
    const low = fuzzedInterval(10, () => 0);   // rng 0 → -spread
    const high = fuzzedInterval(10, () => 1);  // rng 1 → +spread
    expect(low).toBeLessThan(10);
    expect(high).toBeGreaterThan(10);
    expect(low).toBeGreaterThanOrEqual(1);
  });

  it("is proportionally smaller for long intervals", () => {
    const spreadShort = fuzzedInterval(10, () => 1) - 10;
    const spreadLong = fuzzedInterval(200, () => 1) - 200;
    expect(spreadLong / 200).toBeLessThan(spreadShort / 10);
  });
});

describe("the day rolls over at 4am", () => {
  it("3am belongs to the previous day", () => {
    const threeAM = new Date(2026, 0, 15, 3, 0, 0).getTime();
    const start = dayStart(threeAM, 4);
    expect(new Date(start).getDate()).toBe(14);
    expect(new Date(start).getHours()).toBe(4);
  });

  it("5am belongs to the same day", () => {
    const fiveAM = new Date(2026, 0, 15, 5, 0, 0).getTime();
    expect(new Date(dayStart(fiveAM, 4)).getDate()).toBe(15);
  });

  it("midnight and 3:59am share a day key with the evening before", () => {
    const evening = new Date(2026, 0, 14, 22, 0, 0).getTime();
    const afterMidnight = new Date(2026, 0, 15, 3, 59, 0).getTime();
    expect(dayKey(afterMidnight, 4)).toBe(dayKey(evening, 4));
  });
});

describe("button previews", () => {
  it("show the unfuzzed interval each button would give", () => {
    const p = previewIntervals(review(), S);
    expect(p[1]).toBe("10m");
    expect(p[2]).toBe("12d");
    expect(p[3]).toBe("25d");
    expect(p[4]).toBe("1.1mo"); // 33 days, shown in months past 30 as Anki does
  });

  it("show minutes for a new card", () => {
    const p = previewIntervals(newCardState(S, NOW), S);
    expect(p[1]).toBe("1m");
    expect(p[3]).toBe("10m");
    expect(p[4]).toBe("4d");
  });
});
