import { useEffect, useState } from "react";
import { db, getSettings } from "./db";
import { dueTomorrow, streak } from "./queue";
import { dayKey } from "./scheduler";

export function Stats() {
  const [s, setS] = useState({ today: 0, streak: 0, total: 0, tomorrow: 0, cards: 0, suspended: 0 });

  useEffect(() => {
    void (async () => {
      const settings = await getSettings();
      const today = dayKey(Date.now(), settings.rolloverHour);
      const [reviewedToday, total, cards, suspended, tomorrow, run] = await Promise.all([
        db.reviews.where("day").equals(today).count(),
        db.entries.count(),
        db.cards.count(),
        db.cards.filter((c) => c.suspended).count(),
        dueTomorrow(),
        streak(),
      ]);
      setS({ today: reviewedToday, streak: run, total, tomorrow, cards, suspended });
    })();
  }, []);

  return (
    <div className="page stats">
      <div className="eyebrow">Where you are</div>
      <h1 className="title">Stats</h1>

      <div className="display">{s.today}</div>
      <p className="muted display-caption">
        reviews today{s.streak > 0 && ` · ${s.streak}-day streak`}
      </p>

      <h2 className="section">Collection</h2>
      <div className="row"><span className="row-label">Entries</span><span className="row-value">{s.total}</span></div>
      <div className="row"><span className="row-label">Cards</span><span className="row-value">{s.cards}</span></div>
      <div className="row"><span className="row-label">Suspended</span><span className="row-value">{s.suspended}</span></div>
      <div className="row"><span className="row-label">Due tomorrow</span><span className="row-value">{s.tomorrow}</span></div>
    </div>
  );
}
