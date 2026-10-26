import { useEffect, useRef, useState } from "react";
import { addEntry, findDuplicate } from "./db";

export function Add({ onToast }: { onToast: (msg: string) => void }) {
  const [english, setEnglish] = useState("");
  const [portuguese, setPortuguese] = useState("");
  const [notes, setNotes] = useState("");
  const [duplicate, setDuplicate] = useState<string | null>(null);
  const firstField = useRef<HTMLInputElement>(null);

  // Warn as you type, not on save: finding out after you pressed the button
  // means retyping it.
  useEffect(() => {
    let cancelled = false;
    const t = setTimeout(async () => {
      const hit = portuguese.trim() ? await findDuplicate(portuguese) : undefined;
      if (!cancelled) setDuplicate(hit ? hit.english : null);
    }, 250);
    return () => { cancelled = true; clearTimeout(t); };
  }, [portuguese]);

  const canSave = english.trim().length > 0 && portuguese.trim().length > 0;

  async function save(e?: React.FormEvent) {
    e?.preventDefault();
    if (!canSave) return;
    await addEntry({
      english: english.trim(),
      portuguese: portuguese.trim(),
      notes: notes.trim(),
    });
    setEnglish(""); setPortuguese(""); setNotes(""); setDuplicate(null);
    firstField.current?.focus();
    onToast("Added");
  }

  return (
    <div className="page">
      <div className="eyebrow">After practice</div>
      <h1 className="title">Add</h1>

      <form onSubmit={save}>
        <label className="field">
          <span>English — what you wanted to say</span>
          <input ref={firstField} value={english} onChange={(e) => setEnglish(e.target.value)}
                 autoFocus autoCapitalize="sentences" />
        </label>

        <label className="field">
          <span>Portuguese — how to say it</span>
          <input value={portuguese} onChange={(e) => setPortuguese(e.target.value)}
                 autoCapitalize="sentences" lang="pt-BR" />
        </label>
        {duplicate && <p className="warn">Already saved — “{duplicate}”</p>}

        <label className="field">
          <span>Notes — context, an example, a grammar point</span>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
        </label>


        <button type="submit" className="btn-primary" disabled={!canSave}>Save</button>
      </form>
    </div>
  );
}
