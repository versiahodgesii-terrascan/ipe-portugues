/* Content invariants for Ipê. Run: node tools/content-check.mjs
   Loads the real content.js, so it checks the data the app actually ships. */
import fs from "fs";

const g = {};
new Function("globalThis", fs.readFileSync("js/verbs.js", "utf8")).call(g, g);
new Function("globalThis", fs.readFileSync("js/content.js", "utf8")).call(g, g);
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
console.log(`verb prompts ${(ALL_VERBS.length * TENSE_ORDER.length * 4).toLocaleString("en")} (${ALL_VERBS.filter(isIrregular).length} irregular verbs)`);
console.log(fail.length ? `\nFAIL (${fail.length})\n` + fail.join("\n") : "\nall content invariants hold");
process.exit(fail.length ? 1 : 0);
