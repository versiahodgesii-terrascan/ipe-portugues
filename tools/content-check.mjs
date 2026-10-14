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

const LESSONS_PER_UNIT = 4, TOTAL = 500;
const hand = UNITS.length;
const genUnits = 12 * TENSE_ORDER.length + 1;
const total = (hand + genUnits) * LESSONS_PER_UNIT;
if (total !== TOTAL) fail.push(`course is ${total} lessons, expected ${TOTAL}`);

const banks = UNITS.flatMap(u => u.build.map(q => q.bank.length));
console.log(`units ${hand} hand-written + ${genUnits} generated = ${total} lessons`);
console.log(`mc ${UNITS.reduce((n, u) => n + u.mc.length, 0)} · build ${UNITS.reduce((n, u) => n + u.build.length, 0)} · tile bank ${Math.min(...banks)}–${Math.max(...banks)}`);
console.log(`verb prompts ${(ALL_VERBS.length * TENSE_ORDER.length * 4).toLocaleString("en")} (${ALL_VERBS.filter(isIrregular).length} irregular verbs)`);
console.log(fail.length ? `\nFAIL (${fail.length})\n` + fail.join("\n") : "\nall content invariants hold");
process.exit(fail.length ? 1 : 0);
