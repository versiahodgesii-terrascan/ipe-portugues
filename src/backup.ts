import { db, type Entry } from "./db";

/** RFC-4180 quoting: anything with a comma, quote or newline gets wrapped. */
function csvCell(value: string): string {
  return /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

export async function exportCSV(): Promise<string> {
  const entries = await db.entries.orderBy("created").toArray();
  const header = ["English", "Portuguese", "Notes"];
  const rows = entries.map((e) =>
    [e.english, e.portuguese, e.notes].map(csvCell).join(","),
  );
  return [header.join(","), ...rows].join("\n");
}

/** Small hand-rolled parser — quoted fields, doubled quotes, embedded newlines. */
export function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"') {
        if (text[i + 1] === '"') { cell += '"'; i++; }
        else quoted = false;
      } else cell += c;
      continue;
    }
    if (c === '"') { quoted = true; continue; }
    if (c === ",") { row.push(cell); cell = ""; continue; }
    if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(cell); cell = "";
      if (row.some((v) => v !== "")) rows.push(row);
      row = [];
      continue;
    }
    cell += c;
  }
  row.push(cell);
  if (row.some((v) => v !== "")) rows.push(row);
  return rows;
}

/**
 * CSV import adds entries and their cards. It carries no scheduling — a
 * spreadsheet round-trip is for the words, not the schedule. Use the JSON
 * backup when the schedule matters.
 */
export async function importCSV(
  text: string,
  addEntry: (e: Omit<Entry, "id" | "created">) => Promise<number>,
): Promise<{ added: number; skipped: number }> {
  const rows = parseCSV(text);
  if (rows.length === 0) return { added: 0, skipped: 0 };
  const header = rows[0].map((h) => h.trim().toLowerCase());
  const looksLikeHeader = header.includes("english") && header.includes("portuguese");
  const body = looksLikeHeader ? rows.slice(1) : rows;
  const idx = (name: string, fallback: number) => {
    const i = header.indexOf(name);
    return looksLikeHeader && i >= 0 ? i : fallback;
  };
  const iEn = idx("english", 0), iPt = idx("portuguese", 1), iNotes = idx("notes", 2);

  let added = 0, skipped = 0;
  for (const r of body) {
    const english = (r[iEn] ?? "").trim();
    const portuguese = (r[iPt] ?? "").trim();
    if (!english || !portuguese) { skipped++; continue; }
    // A file exported before source and tags were removed still imports —
    // the extra columns are simply ignored rather than rejected.
    await addEntry({
      english, portuguese,
      notes: (r[iNotes] ?? "").trim(),
    });
    added++;
  }
  return { added, skipped };
}

/** Everything, scheduling included. This is the real backup. */
export async function exportJSON(): Promise<string> {
  const [entries, cards, reviews, settings] = await Promise.all([
    db.entries.toArray(), db.cards.toArray(), db.reviews.toArray(), db.settings.toArray(),
  ]);
  return JSON.stringify(
    { format: "ipe-cards", version: 1, exported: new Date().toISOString(), entries, cards, reviews, settings },
    null, 2,
  );
}

/**
 * Replaces everything. Destructive on purpose — a backup that merged would
 * silently double every card it could not match.
 */
export async function importJSON(text: string): Promise<{ entries: number; cards: number }> {
  const data = JSON.parse(text);
  if (data.format !== "ipe-cards") throw new Error("Not an Ipê Cards backup file.");
  await db.transaction("rw", db.entries, db.cards, db.reviews, db.settings, async () => {
    await Promise.all([db.entries.clear(), db.cards.clear(), db.reviews.clear(), db.settings.clear()]);
    if (data.entries?.length) await db.entries.bulkAdd(data.entries);
    if (data.cards?.length) await db.cards.bulkAdd(data.cards);
    if (data.reviews?.length) await db.reviews.bulkAdd(data.reviews);
    if (data.settings?.length) await db.settings.bulkAdd(data.settings);
  });
  return { entries: data.entries?.length ?? 0, cards: data.cards?.length ?? 0 };
}

export function download(filename: string, text: string, type: string): void {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
