import { useEffect, useMemo, useState } from "react";
import {
  db, deleteEntry, setSuspended, updateEntry,
  type Card, type Entry,
} from "./db";
import { formatDays } from "./scheduler";

type Sort = "added" | "due";

export function Browse({ onToast }: { onToast: (msg: string) => void }) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<Sort>("added");
  const [editing, setEditing] = useState<Entry | null>(null);

  async function load() {
    setEntries(await db.entries.toArray());
    setCards(await db.cards.toArray());
  }
  useEffect(() => { void load(); }, []);

  const byEntry = useMemo(() => {
    const m = new Map<number, Card[]>();
    for (const c of cards) {
      const list = m.get(c.entryId) ?? [];
      list.push(c);
      m.set(c.entryId, list);
    }
    return m;
  }, [cards]);

  const visible = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const filtered = entries.filter((e) => {
      if (!needle) return true;
      return (
        e.english.toLowerCase().includes(needle) ||
        e.portuguese.toLowerCase().includes(needle) ||
        e.notes.toLowerCase().includes(needle)
      );
    });
    return filtered.sort((a, b) => {
      if (sort === "added") return b.created - a.created;
      const dueA = Math.min(...(byEntry.get(a.id!) ?? []).map((c) => c.due), Infinity);
      const dueB = Math.min(...(byEntry.get(b.id!) ?? []).map((c) => c.due), Infinity);
      return dueA - dueB;
    });
  }, [entries, q, sort, byEntry]);

  async function remove(e: Entry) {
    if (!confirm(`Delete “${e.portuguese}”? This removes both cards and their history.`)) return;
    await deleteEntry(e.id!);
    onToast("Deleted");
    await load();
  }

  async function toggleSuspend(entry: Entry) {
    const list = byEntry.get(entry.id!) ?? [];
    const anyActive = list.some((c) => !c.suspended);
    for (const c of list) await setSuspended(c.id!, anyActive);
    onToast(anyActive ? "Suspended" : "Resumed");
    await load();
  }

  return (
    <div className="page">
      <div className="eyebrow">Everything you saved</div>
      <h1 className="title">Browse</h1>

      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search" />

      <div style={{ display: "flex", gap: 8, margin: "16px 0 8px" }}>
        <button className="chip" data-on={sort === "added"} onClick={() => setSort("added")}>Newest</button>
        <button className="chip" data-on={sort === "due"} onClick={() => setSort("due")}>Due first</button>
        <span className="small muted" style={{ marginLeft: "auto", alignSelf: "center" }}>
          {visible.length} of {entries.length}
        </span>
      </div>

      {visible.length === 0 && <p className="empty">Nothing matches.</p>}

      {visible.map((e) => {
        const list = byEntry.get(e.id!) ?? [];
        const suspended = list.length > 0 && list.every((c) => c.suspended);
        return (
          <div className="entry" key={e.id}>
            {editing && editing.id === e.id ? (
              <EditForm
                entry={editing}
                onCancel={() => setEditing(null)}
                onSave={async (patch) => {
                  await updateEntry(e.id!, patch);
                  setEditing(null);
                  onToast("Saved");
                  await load();
                }}
              />
            ) : (
              <>
                <div className="entry-pt">{e.portuguese}</div>
                <div className="entry-en">{e.english}</div>
                {e.notes && <div className="small muted" style={{ marginTop: 4 }}>{e.notes}</div>}
                <div className="entry-meta">
                  {list.map((c) => (
                    <span key={c.id}>
                      {c.direction === "en-pt" ? "EN→PT" : "PT→EN"}{" "}
                      {cardMeta(c)}
                    </span>
                  ))}
                  {suspended && <span className="sage">suspended</span>}
                </div>
                <div className="entry-actions">
                  <button className="btn-quiet" onClick={() => setEditing(e)}>Edit</button>
                  <button className="btn-quiet" onClick={() => void toggleSuspend(e)}>
                    {suspended ? "Resume" : "Suspend"}
                  </button>
                  <button className="btn-quiet sage" onClick={() => void remove(e)}>Delete</button>
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}

/**
 * A card still inside a learning step has no day interval, so showing "0d"
 * next to it reads as an error. It says what it is instead.
 */
function cardMeta(c: Card): string {
  if (c.state === "new") return "new";
  if (c.state === "learning" || c.state === "relearning") {
    const mins = Math.max(0, Math.round((c.due - Date.now()) / 60_000));
    return `${c.state === "relearning" ? "relearning" : "learning"} · ${mins}m`;
  }
  return `${dueLabel(c)} · ${formatDays(c.intervalDays || 0)} · ${c.ease}%`;
}

function dueLabel(c: Card): string {
  if (c.state === "new") return "new";
  const days = Math.round((c.due - Date.now()) / 86_400_000);
  if (days < 0) return "due";
  if (days === 0) return "today";
  if (days === 1) return "tomorrow";
  return `in ${days}d`;
}

function EditForm({ entry, onSave, onCancel }: {
  entry: Entry;
  onSave: (patch: Partial<Entry>) => void;
  onCancel: () => void;
}) {
  const [english, setEnglish] = useState(entry.english);
  const [portuguese, setPortuguese] = useState(entry.portuguese);
  const [notes, setNotes] = useState(entry.notes);

  return (
    <div>
      <label className="field"><span>English</span>
        <input value={english} onChange={(e) => setEnglish(e.target.value)} /></label>
      <label className="field"><span>Portuguese</span>
        <input value={portuguese} onChange={(e) => setPortuguese(e.target.value)} /></label>
      <label className="field"><span>Notes</span>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} /></label>
      <div style={{ display: "flex", gap: 8 }}>
        <button className="btn-quiet" onClick={onCancel}>Cancel</button>
        <button className="btn-quiet" onClick={() => onSave({
          english: english.trim(), portuguese: portuguese.trim(), notes: notes.trim(),
        })}>Save</button>
      </div>
    </div>
  );
}
