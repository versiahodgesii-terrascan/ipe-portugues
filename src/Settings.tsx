import { useEffect, useRef, useState } from "react";
import { addEntry, getSettings, saveSettings, type SettingsRow } from "./db";
import { exportCSV, exportJSON, importCSV, importJSON, download } from "./backup";

export function SettingsScreen({ onToast }: { onToast: (msg: string) => void }) {
  const [s, setS] = useState<SettingsRow | null>(null);
  const csvInput = useRef<HTMLInputElement>(null);
  const jsonInput = useRef<HTMLInputElement>(null);

  useEffect(() => { void getSettings().then(setS); }, []);
  if (!s) return <div className="page" />;

  async function patch(p: Partial<SettingsRow>) {
    await saveSettings(p);
    setS(await getSettings());
  }

  const num = (key: keyof SettingsRow, label: string, hint?: string) => (
    <label className="field">
      <span>{label}</span>
      <input type="number" inputMode="numeric" value={String(s![key])}
             onChange={(e) => void patch({ [key]: Number(e.target.value) } as Partial<SettingsRow>)} />
      {hint && <span className="small muted" style={{ marginTop: 4 }}>{hint}</span>}
    </label>
  );

  return (
    <div className="page">
      <div className="eyebrow">How it behaves</div>
      <h1 className="title">Settings</h1>

      <h2 className="section">Cards</h2>
      <div className="row">
        <span className="row-label">Also ask Portuguese → English</span>
        <button className="chip" data-on={s.reversed}
                onClick={() => void patch({ reversed: !s.reversed })}>
          {s.reversed ? "On" : "Off"}
        </button>
      </div>
      <p className="small muted" style={{ marginTop: 8 }}>
        Applies to entries you add from now on, the way Anki does — it will not create or
        remove cards for what you already have.
      </p>

      <h2 className="section">Daily limits</h2>
      {num("newPerDay", "New cards a day")}
      {num("reviewsPerDay", "Reviews a day")}
      {num("maximumInterval", "Maximum interval", "Days. Anki's default is 365.")}
      {num("rolloverHour", "Day starts at", "Hour, 0–23. Anki rolls over at 4.")}

      <h2 className="section">Backup</h2>
      <div className="row">
        <span className="row-label">Spreadsheet</span>
        <span style={{ display: "flex", gap: 8 }}>
          <button className="btn-quiet" onClick={async () =>
            download("ipe-cards.csv", await exportCSV(), "text/csv")}>Export CSV</button>
          <button className="btn-quiet" onClick={() => csvInput.current?.click()}>Import</button>
        </span>
      </div>
      <p className="small muted" style={{ marginTop: 8 }}>
        CSV carries the words only. Use the JSON backup when the schedule matters.
      </p>

      <div className="row" style={{ marginTop: 16 }}>
        <span className="row-label">Full backup</span>
        <span style={{ display: "flex", gap: 8 }}>
          <button className="btn-quiet" onClick={async () =>
            download(`ipe-cards-${new Date().toISOString().slice(0, 10)}.json`,
                     await exportJSON(), "application/json")}>Export JSON</button>
          <button className="btn-quiet" onClick={() => jsonInput.current?.click()}>Restore</button>
        </span>
      </div>

      <input ref={csvInput} type="file" accept=".csv,text/csv" hidden
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          const r = await importCSV(await file.text(), (entry) => addEntry(entry));
          onToast(`Imported ${r.added}${r.skipped ? `, skipped ${r.skipped}` : ""}`);
          e.target.value = "";
        }} />

      <input ref={jsonInput} type="file" accept=".json,application/json" hidden
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          if (!confirm("Restoring replaces everything currently on this device. Continue?")) {
            e.target.value = ""; return;
          }
          try {
            const r = await importJSON(await file.text());
            onToast(`Restored ${r.entries} entries`);
            setS(await getSettings());
          } catch (err) {
            alert((err as Error).message);
          }
          e.target.value = "";
        }} />
    </div>
  );
}
