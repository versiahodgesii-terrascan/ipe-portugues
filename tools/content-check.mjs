/* Content invariants for Ipê. Run from anywhere: node .../tools/content-check.mjs
   Loads the real content.js, so it checks the data the app actually ships. */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// relative to this file, not to the shell's working directory
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = f => fs.readFileSync(path.join(ROOT, f), "utf8");

const g = {};
new Function("globalThis", read("js/verbs.js")).call(g, g);
new Function("globalThis", read("js/content.js")).call(g, g);
const UNITS = g.PT_UNITS;
const { ALL_VERBS, TENSE_ORDER, isIrregular } = g.PT_VERBS;

const fail = [];
const note = (id, msg) => fail.push(`${id}: ${msg}`);
// matches norm() in app.js
const norm = s => String(s).toLowerCase().replace(/[.,!?¿¡;:"“”…]/g, "").replace(/\s+/g, " ").trim();

for (const u of UNITS) {
  if (!u.mc.length && !u.gen) note(u.id, "no multiple-choice items");

  u.mc.forEach(q => {
    if (q.o.length !== 4) note(q.id, `${q.o.length} options, expected 4`);
    // options are compared exactly by the app, so only exact duplicates are a bug
    if (new Set(q.o).size !== q.o.length) note(q.id, `duplicate options ${JSON.stringify(q.o)}`);
    if (q.o.some(o => !String(o).trim())) note(q.id, "blank option");
    if (!q.t || !q.e || !q.r) note(q.id, "missing tag, explanation or rule");
  });

  u.build.forEach(q => {
    if (!q.en || !q.a || !q.a.length) note(q.id, "missing prompt or answer");
    if (!q.bank) { note(q.id, "no tile bank"); return; }
    // THE invariant: every accepted answer must be spellable from the bank
    q.a.forEach(alt => {
      const pool = q.bank.map(w => w.toLowerCase());
      const missing = [];
      alt.split(" ").forEach(w => {
        const k = pool.indexOf(w.toLowerCase());
        if (k < 0) missing.push(w); else pool.splice(k, 1);
      });
      if (missing.length) note(q.id, `accepted answer "${alt}" needs ${JSON.stringify(missing)}, not in the bank`);
    });
    // two identical tiles the learner cannot tell apart, beyond what an answer needs
    const counts = {};
    q.bank.forEach(w => (counts[w.toLowerCase()] = (counts[w.toLowerCase()] || 0) + 1));
    const maxNeed = w => Math.max(...q.a.map(a => a.split(" ").filter(x => x.toLowerCase() === w).length));
    Object.keys(counts).forEach(w => {
      if (counts[w] > Math.max(1, maxNeed(w))) note(q.id, `tile "${w}" appears ${counts[w]} times`);
    });
    // a distractor that accidentally completes a correct answer would be unfair
    if (q.bank.length > 12) note(q.id, `${q.bank.length} tiles is too many to scan`);
  });
}

/* The track is sized to fill the course exactly, so what has to hold is that
   the generated half is still big enough to carry its share, and that every
   verb still gets practised in every tense. */
/* Every unit must be able to fill all ten slots of each of its four lessons
   from its own material, with dictation never reusing a sentence the same
   lesson is already showing as tiles. Uses the app's own slot table. */
const SLOTS = g.PT_SLOTS;
const dictTotal = {};
for (const u of UNITS) {
  for (let level = 0; level < 4; level++) {
    const typedN = u.drill ? SLOTS.typed[level] : 0;
    const want = (u.drill ? SLOTS.dictDrilled : SLOTS.dictPlain)[level];
    const buildN = u.build.length ? Math.max(1, Math.min(SLOTS.build[level], u.build.length - want)) : 0;
    const dictN = Math.min(want, u.build.length - buildN);
    const mcN = SLOTS.size - typedN - buildN - dictN;
    const at = `${u.id} lesson ${level + 1}`;
    if (mcN < 1) fail.push(`${at}: ${mcN} multiple-choice slots, needs at least 1`);
    if (mcN > u.mc.length) fail.push(`${at}: needs ${mcN} mc, unit has only ${u.mc.length}`);
    if (buildN + dictN > u.build.length) fail.push(`${at}: needs ${buildN + dictN} sentences, unit has ${u.build.length}`);
    if (typedN + buildN + dictN + mcN !== SLOTS.size) fail.push(`${at}: slots sum to ${typedN + buildN + dictN + mcN}, not ${SLOTS.size}`);
    dictTotal[u.id] = (dictTotal[u.id] || 0) + dictN;
  }
  // a unit with sentences to spare must be heard at least once somewhere
  if (u.build.length >= 2 && !dictTotal[u.id]) fail.push(`${u.id}: never gets a dictation in any of its 4 lessons`);
}

const LESSONS_PER_UNIT = 4, TOTAL = 500, WINDOW = 10, STEP = 3;
const hand = UNITS.length;
const genUnits = TOTAL / LESSONS_PER_UNIT - hand;
if (!Number.isInteger(genUnits)) fail.push(`${TOTAL} lessons does not divide into units of ${LESSONS_PER_UNIT}`);
if (genUnits < 1) fail.push(`${hand} hand-written units already exceed the ${TOTAL}-lesson course`);

const windows = genUnits - 1;
const per = Math.floor(windows / TENSE_ORDER.length);
const extra = windows % TENSE_ORDER.length;
if (per < 1) fail.push(`only ${windows} windows for ${TENSE_ORDER.length} tenses`);

const verbs = ALL_VERBS.slice().sort((a, b) => (isIrregular(a) - isIrregular(b)) || a.localeCompare(b, "pt"));
const windowAt = i => Array.from({ length: WINDOW }, (_, k) => verbs[(i * STEP + k) % verbs.length]);
TENSE_ORDER.forEach((t, ti) => {
  const n = per + (ti < extra ? 1 : 0);
  const covered = new Set();
  for (let i = 0; i < n; i++) {
    const vs = windowAt(i);
    // the 4 lessons of a unit must partition its 40 prompts, with no repeat
    const combos = vs.flatMap(v => [0, 1, 2, 3].map(p => v + "/" + p));
    const all = new Set();
    for (let level = 0; level < LESSONS_PER_UNIT; level++) {
      const start = (level * 10) % combos.length;
      const slice = Array.from({ length: 10 }, (_, k) => combos[(start + k) % combos.length]);
      if (new Set(slice).size !== 10) fail.push(`g-${t}-${i} lesson ${level + 1} repeats a prompt`);
      slice.forEach(c => all.add(c));
    }
    if (all.size !== combos.length) fail.push(`g-${t}-${i} covers ${all.size}/${combos.length} of its prompts`);
    vs.forEach(v => covered.add(v));
  }
  const missing = verbs.filter(v => !covered.has(v));
  if (missing.length) fail.push(`${t}: ${missing.length} verbs never practised (${missing.slice(0, 4).join(", ")})`);
});
const total = (hand + genUnits) * LESSONS_PER_UNIT;

const banks = UNITS.flatMap(u => u.build.map(q => q.bank.length));
console.log(`units ${hand} hand-written + ${genUnits} generated = ${total} lessons (${per}-${per + (extra ? 1 : 0)} windows per tense)`);
console.log(`mc ${UNITS.reduce((n, u) => n + u.mc.length, 0)} · build ${UNITS.reduce((n, u) => n + u.build.length, 0)} · tile bank ${Math.min(...banks)}–${Math.max(...banks)}`);
const dp = UNITS.map(u => dictTotal[u.id] || 0);
console.log(`dictation per unit ${Math.min(...dp)}\u2013${Math.max(...dp)} across its 4 lessons (idiom units ${UNITS.filter(u => +u.id.slice(1) >= 26).map(u => dictTotal[u.id]).join("/")})`);
console.log(`verb prompts ${(ALL_VERBS.length * TENSE_ORDER.length * 4).toLocaleString("en")} (${ALL_VERBS.filter(isIrregular).length} irregular verbs)`);
console.log(fail.length ? `\nFAIL (${fail.length})\n` + fail.join("\n") : "\nall content invariants hold");
process.exit(fail.length ? 1 : 0);
