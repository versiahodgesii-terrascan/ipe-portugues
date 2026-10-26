import { useCallback, useEffect, useRef, useState } from "react";
import {
  db, getSettings, logReview, type Entry, type SettingsRow,
} from "./db";
import { buildQueue, type Queue } from "./queue";
import { answerCard, previewIntervals, GRADE_LABELS, type Grade } from "./scheduler";
import { dayKey } from "./scheduler";

export function Review() {
  const [queue, setQueue] = useState<Queue | null>(null);
  const [entry, setEntry] = useState<Entry | null>(null);
  const [settings, setSettings] = useState<SettingsRow | null>(null);
  const [revealed, setRevealed] = useState(false);
  const busy = useRef(false);

  const load = useCallback(async () => {
    const s = await getSettings();
    setSettings(s);
    const q = await buildQueue();
    setQueue(q);
    setRevealed(false);
    const first = q.cards[0];
    setEntry(first ? (await db.entries.get(first.entryId)) ?? null : null);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const card = queue?.cards[0];

  const answer = useCallback(async (grade: Grade) => {
    if (!card || !settings || busy.current) return;
    busy.current = true;
    const now = Date.now();
    const result = answerCard(card, grade, now, settings);
    const introducedOn = card.state === "new" ? dayKey(now, settings.rolloverHour) : card.introducedOn;
    await db.cards.update(card.id!, { ...result.next, introducedOn });
    await logReview({
      cardId: card.id!, entryId: card.entryId, at: now, grade,
      intervalDays: result.intervalDays, intervalMinutes: result.intervalMinutes,
      ease: result.next.ease, stateBefore: card.state, stateAfter: result.next.state,
    }, settings.rolloverHour);
    busy.current = false;
    await load();
  }, [card, settings, load]);

  // Space reveals, 1–4 grade. The keyboard is the whole point on a laptop.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!card) return;
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;
      if (!revealed && (e.code === "Space" || e.code === "Enter")) {
        e.preventDefault();
        setRevealed(true);
        return;
      }
      if (revealed) {
        if (e.code === "Space" || e.code === "Enter") { e.preventDefault(); void answer(3); return; }
        const n = Number(e.key);
        if (n >= 1 && n <= 4) { e.preventDefault(); void answer(n as Grade); }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [card, revealed, answer]);

  if (!queue || !settings) return <div className="page"><p className="empty">Loading…</p></div>;

  if (!card || !entry) {
    return (
      <div className="page">
        <div className="eyebrow">Today</div>
        <h1 className="title">Nothing due</h1>
        <p className="muted">
          You have cleared the queue. New cards appear as you add them; reviews come back
          on their own schedule.
        </p>
      </div>
    );
  }

  const front = card.direction === "en-pt" ? entry.english : entry.portuguese;
  const back = card.direction === "en-pt" ? entry.portuguese : entry.english;
  const previews = previewIntervals(card, settings);

  return (
    <div className="page">
      <div className="counts">
        <span><b>{queue.counts.new}</b> new</span>
        <span><b>{queue.counts.learning}</b> learning</span>
        <span><b>{queue.counts.review}</b> review</span>
      </div>

      <div className="prompt">
        <div className="eyebrow">{card.direction === "en-pt" ? "Say it in Portuguese" : "What does it mean"}</div>
        <div className="prompt-front">{front}</div>
        {revealed && <div className="prompt-back">{back}</div>}
        {revealed && entry.notes && <div className="prompt-notes">{entry.notes}</div>}
      </div>

      {!revealed ? (
        <button className="btn-primary" onClick={() => setRevealed(true)}>
          Show answer
        </button>
      ) : (
        <div className="grades">
          {([1, 2, 3, 4] as Grade[]).map((g) => (
            <button key={g} className="grade" data-grade={g} onClick={() => void answer(g)}>
              <b>{GRADE_LABELS[g]}</b>
              <span>{previews[g]}</span>
            </button>
          ))}
        </div>
      )}
      <p className="small muted" style={{ textAlign: "center", marginTop: 16 }}>
        {revealed ? "1 Again · 2 Hard · 3 Good · 4 Easy" : "Space to show the answer"}
      </p>
    </div>
  );
}
