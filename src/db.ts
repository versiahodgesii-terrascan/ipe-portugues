import Dexie, { type Table } from "dexie";
import {
  DEFAULT_SETTINGS, newCardState, dayKey,
  type Settings, type SchedulingState, type Grade,
} from "./scheduler";

/**
 * One thing you wanted to say and could not. The unit you type in.
 */
export interface Entry {
  id?: number;
  english: string;
  portuguese: string;
  notes: string;
  created: number;
}

/** Which way round a card is asked. */
export type Direction = "en-pt" | "pt-en";

/**
 * One side of one entry, with its own schedule — the same split Anki makes
 * between a note and its cards. Producing the Portuguese and recognising it
 * are different skills and they are learned at different speeds, so they
 * cannot share an interval.
 */
export interface Card extends SchedulingState {
  id?: number;
  entryId: number;
  direction: Direction;
  suspended: boolean;
  /** The study day this card was introduced, so the new-card limit is per day. */
  introducedOn?: string;
}

export interface ReviewLog {
  id?: number;
  cardId: number;
  entryId: number;
  at: number;
  /** The study day, for streaks and daily counts. */
  day: string;
  grade: Grade;
  /** Days, or 0 for a sub-day learning step. */
  intervalDays: number;
  intervalMinutes: number;
  ease: number;
  stateBefore: string;
  stateAfter: string;
}

export interface SettingsRow extends Settings {
  id: number;
  /** Create the reversed Portuguese → English card too. */
  reversed: boolean;
}

class IpeCardsDB extends Dexie {
  entries!: Table<Entry, number>;
  cards!: Table<Card, number>;
  reviews!: Table<ReviewLog, number>;
  settings!: Table<SettingsRow, number>;

  constructor() {
    super("ipe-cards");
    this.version(1).stores({
      entries: "++id, portuguese, english, source, created, *tags",
      cards: "++id, entryId, direction, state, due, suspended",
      reviews: "++id, cardId, entryId, at, day",
      settings: "id",
    });
    // v2 drops source and tags. They were a filing system for words, and the
    // words are the point — you look things up by searching for them, not by
    // remembering which conversation they came from.
    this.version(2).stores({
      entries: "++id, portuguese, english, created",
    }).upgrade((tx) =>
      tx.table("entries").toCollection().modify((e) => {
        delete e.source;
        delete e.tags;
      }),
    );
  }
}

export const db = new IpeCardsDB();

export const DEFAULT_SETTINGS_ROW: SettingsRow = {
  id: 1,
  ...DEFAULT_SETTINGS,
  reversed: true,
};

export async function getSettings(): Promise<SettingsRow> {
  const row = await db.settings.get(1);
  if (row) return { ...DEFAULT_SETTINGS_ROW, ...row };
  await db.settings.put(DEFAULT_SETTINGS_ROW);
  return DEFAULT_SETTINGS_ROW;
}

export async function saveSettings(patch: Partial<SettingsRow>): Promise<void> {
  const current = await getSettings();
  await db.settings.put({ ...current, ...patch, id: 1 });
}

/** Case- and accent-insensitive key, so "está" and "esta" collide on purpose. */
export function normalizeText(s: string): string {
  return s.trim().toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

export async function findDuplicate(portuguese: string, excludeId?: number): Promise<Entry | undefined> {
  const key = normalizeText(portuguese);
  if (!key) return undefined;
  const all = await db.entries.toArray();
  return all.find((e) => normalizeText(e.portuguese) === key && e.id !== excludeId);
}

/**
 * Add an entry and its cards. The reversed card is created only when the
 * setting is on; turning the setting on later does not retro-create cards for
 * old entries, which is also how Anki behaves.
 */
export async function addEntry(
  input: Omit<Entry, "id" | "created">,
  opts?: { reversed?: boolean },
): Promise<number> {
  const settings = await getSettings();
  const reversed = opts?.reversed ?? settings.reversed;
  const now = Date.now();
  return db.transaction("rw", db.entries, db.cards, async () => {
    const entryId = await db.entries.add({ ...input, created: now });
    const directions: Direction[] = reversed ? ["en-pt", "pt-en"] : ["en-pt"];
    for (const direction of directions) {
      await db.cards.add({
        entryId, direction, suspended: false,
        ...newCardState(settings, now),
      });
    }
    return entryId;
  });
}

export async function updateEntry(id: number, patch: Partial<Entry>): Promise<void> {
  await db.entries.update(id, patch);
}

export async function deleteEntry(id: number): Promise<void> {
  await db.transaction("rw", db.entries, db.cards, db.reviews, async () => {
    await db.entries.delete(id);
    await db.cards.where("entryId").equals(id).delete();
    await db.reviews.where("entryId").equals(id).delete();
  });
}

export async function setSuspended(cardId: number, suspended: boolean): Promise<void> {
  await db.cards.update(cardId, { suspended });
}

export async function logReview(row: Omit<ReviewLog, "id" | "day">, rolloverHour: number): Promise<void> {
  await db.reviews.add({ ...row, day: dayKey(row.at, rolloverHour) });
}
