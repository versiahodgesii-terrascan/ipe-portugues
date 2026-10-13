/* Ipê — Brazilian Portuguese practice app.
   Plain JS, no build step. All progress lives in localStorage on the device. */
(() => {
  "use strict";
  const { TENSES, TENSE_ORDER, PERSONS, conjugate, ALL_VERBS, meaning, isIrregular } = window.PT_VERBS;
  const UNITS = window.PT_UNITS;
  const LESSONS_PER_UNIT = 4;
  const LESSON_SIZE = 10;
  const INTERVALS = [0, 1, 3, 7, 16, 35]; // days until next review, by SRS box
  const STORE_KEY = "ipe-progress-v1";
  const GOALS = [[10, "Casual"], [20, "Regular"], [30, "Serious"], [50, "Intense"]];

  /* ---------------- utilities ---------------- */
  const $ = (s, el = document) => el.querySelector(s);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const pick = a => a[Math.floor(Math.random() * a.length)];
  const today = () => { const d = new Date(); return Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86400000; };
  const weekday = n => "SMTWTFS"[new Date(n * 86400000).getUTCDay()];
  const norm = s => String(s).toLowerCase().replace(/[.,!?¿¡;:"“”…]/g, "").replace(/\s+/g, " ").trim();
  const bare = s => s.normalize("NFD").replace(/[̀-ͯ]/g, "");
  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
  const isStandalone = () => window.navigator.standalone === true || window.matchMedia("(display-mode: standalone)").matches;

  /* ---------------- icons ---------------- */
  const sv = (d, fill) => `<svg class="i" viewBox="0 0 24 24" aria-hidden="true" ${fill ? 'fill="currentColor"' : 'fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"'}>${d}</svg>`;
  const I = {
    flame: sv('<path d="M12 2.5c.9 3.4 5 5.6 5 10.2a5 5 0 0 1-10 0c0-2.3 1.2-3.9 2.4-5 .3 1.7 1 2.7 2 3.2-.6-3-.4-5.9.6-8.4z"/>', true),
    bolt: sv('<path d="M13.2 2 4.5 13.6h6.6L10 22l9-12h-6.8z"/>', true),
    check: sv('<path d="M20 6 9 17l-5-5" stroke-width="3"/>'),
    x: sv('<path d="M18 6 6 18M6 6l12 12" stroke-width="3"/>'),
    close: sv('<path d="M18 6 6 18M6 6l12 12"/>'),
    speaker: sv('<path d="M11 5 6 9H3v6h3l5 4z" fill="currentColor"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/>'),
    path: sv('<circle cx="6" cy="5" r="2.5"/><circle cx="18" cy="12" r="2.5"/><circle cx="6" cy="19" r="2.5"/><path d="M8.3 6.1 15.7 10.9M15.7 13.1 8.3 17.9"/>'),
    repeat: sv('<path d="M17 2l4 4-4 4"/><path d="M3 11V9a3 3 0 0 1 3-3h15"/><path d="M7 22l-4-4 4-4"/><path d="M21 13v2a3 3 0 0 1-3 3H3"/>'),
    book: sv('<path d="M4 4h6a2 2 0 0 1 2 2v14a2 2 0 0 0-2-2H4z"/><path d="M20 4h-6a2 2 0 0 0-2 2v14a2 2 0 0 1 2-2h6z"/>'),
    user: sv('<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>'),
    bulb: sv('<path d="M9 18h6M10 21.5h4M12 2.5a6.5 6.5 0 0 0-3.8 11.8V16h7.6v-1.7A6.5 6.5 0 0 0 12 2.5z"/>'),
    star: sv('<path d="M12 2.8l2.8 5.8 6.3.9-4.6 4.4 1.1 6.3L12 17.2l-5.6 3 1.1-6.3L2.9 9.5l6.3-.9z"/>', true),
    target: sv('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/>'),
    clock: sv('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
    trophy: sv('<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/>'),
    share: sv('<path d="M12 3v12M8 7l4-4 4 4"/><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"/>')
  };

  /* ---------------- state ---------------- */
  const DEFAULT = {
    v: 1, xp: 0, days: {}, streak: 0, bestStreak: 0, lastDay: null, goal: 20, lessons: 0,
    units: {}, srs: {}, onboarded: false, installDismissed: false,
    settings: { sound: true, autoplay: true, slow: false, voiceURI: "" }
  };
  const clone = o => JSON.parse(JSON.stringify(o));
  function load() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) {
        const s = Object.assign(clone(DEFAULT), JSON.parse(raw));
        s.settings = Object.assign({}, DEFAULT.settings, s.settings);
        return s;
      }
    } catch (e) { /* storage unavailable */ }
    return clone(DEFAULT);
  }
  let S = load();
  function save() { try { localStorage.setItem(STORE_KEY, JSON.stringify(S)); } catch (e) { /* ignore */ } }
  const unitState = id => (S.units[id] = S.units[id] || { done: 0, c: 0, n: 0 });
  const streakNow = () => (S.lastDay != null && S.lastDay >= today() - 1 ? S.streak : 0);
  const xpToday = () => S.days[today()] || 0;

  const INDEX = {};
  UNITS.forEach(u => {
    u.mc.forEach(q => (INDEX[q.id] = { kind: "mc", q, u }));
    u.build.forEach(q => (INDEX[q.id] = { kind: "build", q, u }));
  });

  /* ---------------- sound & speech ---------------- */
  let actx;
  function tone(seq) {
    if (!S.settings.sound) return;
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      if (actx.state === "suspended") actx.resume();
      const t0 = actx.currentTime + 0.01;
      seq.forEach(([f, start, dur, type = "sine", vol = 0.12]) => {
        const o = actx.createOscillator(), g = actx.createGain();
        o.type = type; o.frequency.value = f;
        g.gain.setValueAtTime(0.0001, t0 + start);
        g.gain.exponentialRampToValueAtTime(vol, t0 + start + 0.015);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + start + dur);
        o.connect(g).connect(actx.destination);
        o.start(t0 + start); o.stop(t0 + start + dur + 0.03);
      });
    } catch (e) { /* audio unavailable */ }
  }
  const sOk = () => tone([[659, 0, 0.12], [988, 0.08, 0.24]]);
  const sBad = () => tone([[196, 0, 0.28, "triangle", 0.14]]);
  const sWin = () => tone([[523, 0, 0.14], [659, 0.11, 0.14], [784, 0.22, 0.14], [1047, 0.33, 0.4]]);

  let voice = null, ptVoices = [];
  const hasTTS = "speechSynthesis" in window;

  /* Rank the installed pt-BR voices by how good they actually sound.
     iOS ships a COMPACT Luciana by default, which is the robotic one. The
     Enhanced / Premium versions (and Siri voices on iOS 17+) are a different
     class entirely, but they only appear here once the user downloads them in
     Settings > Accessibility > Spoken Content > Voices. The old code took the
     first name match, so a downloaded Premium voice sitting right there would
     lose to the compact one. Higher score wins. */
  function voiceScore(v) {
    const n = (v.name || "").toLowerCase();
    let s = 0;
    if (/siri/.test(n)) s += 50;            // iOS 17+ neural voices
    if (/premium/.test(n)) s += 40;
    if (/enhanced/.test(n)) s += 30;
    if (/google/.test(n)) s += 25;          // Android/desktop Chrome
    if (/luciana|francisca|joana/.test(n)) s += 10;
    if (/felipe|ricardo|daniel/.test(n)) s += 8;
    if (/compact/.test(n)) s -= 20;
    if (v.localService) s += 2;             // on-device: no network stall
    return s;
  }
  function pickVoice() {
    const vs = speechSynthesis.getVoices();
    ptVoices = vs.filter(v => v.lang && /^pt[-_]?br/i.test(v.lang.replace("_", "-")));
    if (!ptVoices.length) ptVoices = vs.filter(v => /^pt/i.test(v.lang || ""));
    ptVoices.sort((a, b) => voiceScore(b) - voiceScore(a) || a.name.localeCompare(b.name));
    const saved = S.settings.voiceURI && ptVoices.find(v => v.voiceURI === S.settings.voiceURI);
    voice = saved || ptVoices[0] || null;
  }
  if (hasTTS) { pickVoice(); speechSynthesis.onvoiceschanged = pickVoice; }
  function speak(text) {
    if (!hasTTS || !text) return;
    try {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "pt-BR"; if (voice) u.voice = voice;
      // 0.92 rather than 0.95: the compact iOS voice runs its syllables together
      // at full speed, which is the single biggest thing making it hard to hear.
      u.rate = S.settings.slow ? 0.7 : 0.92;
      u.pitch = 1;
      speechSynthesis.speak(u);
    } catch (e) { /* ignore */ }
  }

  /* ---------------- exercise factories ---------------- */
  const PRON = [["eu"], ["ele", "ela", "você", "a gente"], ["nós"], ["eles", "elas", "vocês"]];
  function makeTyped(verb, tense, p) {
    const c = conjugate(verb);
    if (tense === "part") {
      const [subj, aux] = pick([["Eu", "tinha"], ["Ela", "tinha"], ["Nós", "tínhamos"], ["Eles", "tinham"], ["A gente", "tinha"]]);
      return { kind: "type", key: `v:${verb}:part`, verb, tense, before: `${subj} já ${aux} `, after: " quando o telefone tocou.", answer: c.part, row: `particípio: <b>${esc(c.part)}</b> · gerúndio: ${esc(c.ger)}` };
    }
    if (p == null) p = Math.floor(Math.random() * 4);
    const pr = pick(PRON[p]);
    const before = cap(`${TENSES[tense].lead} ${pr} `);
    const after = tense === "isub" || tense === "fsub" ? "…" : ".";
    const row = c[tense].map((f, i) => (i === p ? `<b>${esc(f)}</b>` : esc(f))).join(", ");
    return { kind: "type", key: `v:${verb}:${tense}`, verb, tense, p, before, after, answer: c[tense][p], row };
  }
  const makeMC = q => ({ kind: "mc", key: q.id, q, opts: shuffle(q.o) });
  const makeBuild = q => ({ kind: "build", key: q.id, q, tiles: shuffle([...q.a[0].split(" "), ...q.x]).map((w, i) => ({ w, i })) });

  function exFromKey(k) {
    if (k.startsWith("v:")) { const [, verb, tense] = k.split(":"); return makeTyped(verb, tense); }
    const e = INDEX[k]; if (!e) return null;
    return e.kind === "mc" ? makeMC(e.q) : makeBuild(e.q);
  }
  const seen = id => (S.srs[id] ? S.srs[id].s : 0);

  function buildLesson(unit, level) {
    const typedN = unit.drill ? [3, 4, 5, 5][level] : 0;
    const buildN = Math.min(unit.build.length, [1, 2, 2, 3][level]);
    const mcN = LESSON_SIZE - typedN - buildN;
    const mcs = shuffle(unit.mc).sort((a, b) => seen(a.id) - seen(b.id)).slice(0, mcN).map(makeMC);
    const builds = shuffle(unit.build).slice(0, buildN).map(makeBuild);
    const typed = [], used = new Set();
    for (let guard = 0; typed.length < typedN && guard < 80; guard++) {
      const v = pick(unit.drill.verbs), t = pick(unit.drill.tenses);
      if (used.has(v + t)) continue;
      used.add(v + t); typed.push(makeTyped(v, t));
    }
    const rest = shuffle([...mcs.slice(1), ...builds, ...typed]);
    return [mcs[0], ...rest].filter(Boolean);
  }

  function dueKeys() {
    const t = today();
    return Object.entries(S.srs).filter(([k, r]) => r.d <= t && (k.startsWith("v:") || INDEX[k]))
      .sort((a, b) => a[1].b - b[1].b || b[1].w - a[1].w).map(([k]) => k);
  }
  function buildReview() {
    let keys = dueKeys();
    let label = "Review";
    if (!keys.length) {
      keys = Object.entries(S.srs).filter(([, r]) => r.w > 0).sort((a, b) => b[1].w - a[1].w).map(([k]) => k);
      label = "Mistakes practice";
    }
    let ex = shuffle(keys.slice(0, 24)).slice(0, 12).map(exFromKey).filter(Boolean);
    if (ex.length < 6) {
      const started = UNITS.filter(u => unitState(u.id).done > 0);
      const pool = started.length ? started : [UNITS[0]];
      while (ex.length < LESSON_SIZE) {
        const u = pick(pool);
        ex.push(u.drill && Math.random() < 0.5 ? makeTyped(pick(u.drill.verbs), pick(u.drill.tenses)) : makeMC(pick(u.mc)));
      }
      if (!keys.length) label = "Mixed practice";
    }
    return { ex, label };
  }

  function recordSRS(key, ok) {
    const r = S.srs[key] || { b: 0, d: today(), w: 0, s: 0 };
    r.s++;
    if (ok) { r.b = Math.min(r.b + 1, INTERVALS.length - 1); r.d = today() + INTERVALS[r.b]; }
    else { r.b = 0; r.d = today(); r.w++; }
    S.srs[key] = r;
  }

  /* ---------------- app chrome ---------------- */
  let tab = "learn";
  const TABS = { learn: ["Learn", I.path], review: ["Review", I.repeat], guide: ["Guide", I.book], profile: ["Profile", I.user] };

  function renderChrome() {
    const st = streakNow(), doneToday = S.lastDay === today();
    const elS = $("#stStreak");
    elS.className = "stat streak" + (doneToday ? "" : " off");
    elS.innerHTML = `${I.flame}<span>${st}</span>`;
    elS.setAttribute("aria-label", `${st}-day streak`);
    const x = xpToday(), frac = Math.min(1, x / S.goal), C = 2 * Math.PI * 12;
    $("#stGoal").innerHTML = `<svg class="ring" viewBox="0 0 30 30" aria-hidden="true"><circle class="bg" cx="15" cy="15" r="12"/><circle class="fg" cx="15" cy="15" r="12" stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - frac)}" transform="rotate(-90 15 15)"/></svg><span>${x}/${S.goal}</span>`;
    $("#stGoal").setAttribute("aria-label", `${x} of ${S.goal} XP today`);
    const due = dueKeys().length;
    Object.entries(TABS).forEach(([k, [label, icon]]) => {
      const b = $("#tab-" + k);
      b.innerHTML = `${icon}<span>${label}</span>${k === "review" && due ? `<span class="badge">${due > 99 ? "99+" : due}</span>` : ""}`;
      if (k === tab) b.setAttribute("aria-current", "page"); else b.removeAttribute("aria-current");
    });
  }

  function render() {
    renderChrome();
    const m = $("#main");
    m.innerHTML = { learn: viewLearn, review: viewReview, guide: viewGuide, profile: viewProfile }[tab]();
    if (tab === "learn") {
      const cur = $(".node.current");
      if (cur && !render.scrolled) { render.scrolled = true; cur.scrollIntoView({ block: "center" }); }
    }
  }

  document.querySelector(".tabbar").addEventListener("click", e => {
    const b = e.target.closest(".tab"); if (!b) return;
    tab = b.dataset.tab; render(); window.scrollTo(0, 0);
  });

  /* ---------------- Learn ---------------- */
  function currentPos() {
    for (const u of UNITS) { const d = unitState(u.id).done; if (d < LESSONS_PER_UNIT) return { u: u.id, l: d }; }
    return { u: null, l: null };
  }
  function viewLearn() {
    const pos = currentPos();
    const showInstall = !isStandalone() && !S.installDismissed;
    const offsets = [0, 52, 0, -52];
    let reachedCurrent = false;
    const units = UNITS.map(u => {
      const st = unitState(u.id);
      const isCur = pos.u === u.id;
      const cls = st.done >= LESSONS_PER_UNIT ? "done" : isCur ? "" : reachedCurrent || pos.u === null ? "later" : "later";
      if (isCur) reachedCurrent = true;
      const nodes = Array.from({ length: LESSONS_PER_UNIT }, (_, i) => {
        const done = i < st.done, cur = isCur && i === st.done;
        const c = done ? "done" : cur ? "current" : "";
        const label = `Unit ${u.n}, lesson ${i + 1}${done ? ", completed" : cur ? ", up next" : ""}`;
        return `<div class="node-wrap" style="transform:translateX(${offsets[i]}px)">
          ${cur ? `<div class="bubble">Start</div>` : ""}
          <button class="node ${c}" data-act="lesson" data-u="${u.id}" data-l="${i}" aria-label="${label}">${done ? I.check : cur ? I.star : i + 1}</button>
        </div>`;
      }).join("");
      return `<section class="unit ${cls}" aria-label="Unit ${u.n}: ${esc(u.title)}">
        <div class="banner">
          <div class="txt"><span class="eyebrow">Unit ${u.n} · ${Math.min(st.done, 4)}/4</span><h3>${esc(u.title)}</h3><small>${esc(u.en)}</small></div>
          <button class="tipbtn" data-act="tip" data-u="${u.id}">${I.bulb}Tips</button>
        </div>
        <div class="path">${nodes}</div>
      </section>`;
    }).join("");
    return `<div class="view">
      ${showInstall ? `<div class="install">${I.share}<p><b>Install on your iPhone.</b> In Safari, tap the Share button, then <b>Add to Home Screen</b>. It works offline after that.</p><button data-act="dismiss-install" aria-label="Dismiss">${I.close}</button></div>` : ""}
      ${pos.u === null ? `<div class="card"><h3>Course complete. Parabéns!</h3><p class="muted" style="margin:6px 0 0">Keep your streak with daily reviews, or replay any lesson.</p></div>` : ""}
      ${units}
    </div>`;
  }

  /* ---------------- Review ---------------- */
  function itemLabel(k) {
    if (k.startsWith("v:")) {
      const [, verb, tense] = k.split(":");
      return [`${verb} · ${TENSES[tense].pt}`, meaning(verb)];
    }
    const e = INDEX[k]; if (!e) return [k, ""];
    if (e.kind === "build") return [e.q.a[0], e.q.en];
    const s = e.q.s.includes("___") ? e.q.s.replace("___", e.q.o[0]) : e.q.o[0];
    return [s, `Unit ${e.u.n} · ${e.q.t}`];
  }
  function viewReview() {
    const due = dueKeys();
    const seenN = Object.keys(S.srs).length;
    const missed = Object.entries(S.srs).filter(([, r]) => r.w > 0).sort((a, b) => b[1].w - a[1].w || a[1].b - b[1].b).slice(0, 12);
    const strength = b => (b <= 1 ? ["pill", "Weak"] : b <= 3 ? ["pill mid", "Getting there"] : ["pill good", "Strong"]);
    return `<div class="view">
      <div class="card hero-review">
        <span class="eyebrow">Spaced review</span>
        <div class="big">${due.length} <small>${due.length === 1 ? "item" : "items"} due today</small></div>
        <p class="muted" style="margin:0">${seenN ? "Items you miss come back the same day. Items you get right come back after 1, 3, 7, 16 and 35 days." : "Finish a lesson and the items you practiced will show up here on a schedule."}</p>
        <button class="btn block" data-act="review">${due.length ? "Start review" : missed.length ? "Practice mistakes" : "Mixed practice"}</button>
      </div>
      ${missed.length ? `<div class="card"><h3>Most missed</h3><div class="list">${missed.map(([k, r]) => {
        const [a, b] = itemLabel(k), [cls, txt] = strength(r.b);
        return `<div class="li"><div class="t"><b>${esc(a)}</b><span>${esc(b)} · missed ${r.w}×</span></div><span class="${cls}">${txt}</span></div>`;
      }).join("")}</div></div>` : ""}
    </div>`;
  }

  /* ---------------- Guide ---------------- */
  const G = { tab: "verbs", verb: "fazer", q: "" };
  function viewGuide() {
    const seg = `<div class="seg" role="group" aria-label="Guide section">${[["verbs", "Verb tables"], ["tenses", "Tenses"], ["tips", "Unit tips"]].map(([k, l]) => `<button data-act="gtab" data-k="${k}" aria-pressed="${G.tab === k}">${l}</button>`).join("")}</div>`;
    let body = "";
    if (G.tab === "verbs") {
      const list = ALL_VERBS.filter(v => !G.q || bare(v).includes(bare(G.q.toLowerCase())) || meaning(v).toLowerCase().includes(G.q.toLowerCase()));
      const c = conjugate(G.verb);
      body = `
        <input class="search" id="vsearch" type="search" placeholder="Search a verb or meaning" value="${esc(G.q)}" autocomplete="off" autocapitalize="off" spellcheck="false">
        <div class="verbchips">${list.map(v => `<button class="vchip ${isIrregular(v) ? "irr" : ""}" data-act="verb" data-v="${esc(v)}" aria-pressed="${v === G.verb}">${esc(v)}</button>`).join("") || `<span class="muted">No verb matches “${esc(G.q)}”.</span>`}</div>
        <p class="muted" style="margin:0;font-size:13px">Dashed outline = irregular. Tap any form to hear it.</p>
        <div class="vhead"><h2>${esc(G.verb)}</h2><span class="muted">${esc(meaning(G.verb))}</span><button class="iconbtn" data-act="say" data-t="${esc(G.verb)}" aria-label="Hear ${esc(G.verb)}">${I.speaker}</button></div>
        <div class="chips"><span class="chip">particípio: <b>${esc(c.part)}</b></span><span class="chip">gerúndio: <b>${esc(c.ger)}</b></span></div>
        <div class="tgrid">${TENSE_ORDER.map(t => `<div class="tcard"><h4>${TENSES[t].pt}</h4><table>${c[t].map((f, i) => `<tr><td>${PERSONS[i]}</td><td><button data-act="say" data-t="${esc(f)}">${esc(f)}</button></td></tr>`).join("")}</table></div>`).join("")}</div>`;
    } else if (G.tab === "tenses") {
      const f = conjugate("falar"), z = conjugate("fazer");
      body = `<div class="card">${[...TENSE_ORDER, "part"].map(t => {
        const T = TENSES[t];
        const ex = t === "part" ? `falar → ${f.part} · fazer → ${z.part}` : `falar → ${f[t].join(", ")}<br>fazer → ${z[t].join(", ")}`;
        return `<div class="tense-item"><h3>${T.pt} <span class="muted" style="font-weight:500;font-size:15px">· ${T.en}</span></h3><p>${esc(T.use)}</p><p class="sig">Signals: ${esc(T.signals)}</p><p class="ex">${ex}</p></div>`;
      }).join("")}</div>`;
    } else {
      body = `<div class="card">${UNITS.map(u => `<div class="tense-item"><span class="eyebrow">Unit ${u.n}</span><h3>${esc(u.title)}</h3><p>${esc(u.tip)}</p></div>`).join("")}</div>`;
    }
    return `<div class="view">${seg}${body}</div>`;
  }
  document.addEventListener("input", e => {
    if (e.target.id === "vsearch") {
      G.q = e.target.value;
      const pos = e.target.selectionStart;
      render();
      const s = $("#vsearch"); s.focus(); try { s.setSelectionRange(pos, pos); } catch (err) { /* ignore */ }
    }
  });

  /* ---------------- Profile ---------------- */
  function viewProfile() {
    const t = today();
    const days = Array.from({ length: 7 }, (_, i) => t - 6 + i);
    const vals = days.map(d => S.days[d] || 0);
    const max = Math.max(S.goal * 1.25, ...vals, 10);
    const W = 320, H = 150, pad = 22, bw = 26, gap = (W - 2 * pad - 7 * bw) / 6, base = H - 22, top = 14;
    const y = v => base - (v / max) * (base - top);
    const bars = vals.map((v, i) => {
      const x = pad + i * (bw + gap);
      return `<rect class="bar ${i === 6 ? "today" : ""}" x="${x}" y="${y(v)}" width="${bw}" height="${Math.max(0, base - y(v))}" rx="5"/>
        <text x="${x + bw / 2}" y="${H - 6}" text-anchor="middle">${i === 6 ? "Today" : weekday(days[i])}</text>
        ${v ? `<text x="${x + bw / 2}" y="${y(v) - 5}" text-anchor="middle">${v}</text>` : ""}`;
    }).join("");
    const chart = `<svg class="chart" viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="XP earned over the last 7 days">
      <line class="base" x1="${pad - 6}" x2="${W - pad + 6}" y1="${base}" y2="${base}"/>
      <line class="goal" x1="${pad - 6}" x2="${W - pad + 6}" y1="${y(S.goal)}" y2="${y(S.goal)}"/>
      <text x="${W - pad + 6}" y="${y(S.goal) - 5}" text-anchor="end">goal ${S.goal}</text>${bars}</svg>`;
    const units = UNITS.map(u => {
      const s = unitState(u.id), p = s.n ? Math.round((s.c / s.n) * 100) : null;
      return `<div class="urow"><span>${u.n}. ${esc(u.title)}</span><div class="m"><i style="width:${p ?? 0}%"></i></div><span class="p">${p == null ? "—" : p + "%"}</span></div>`;
    }).join("");
    const sw = (k, label, sub) => `<div class="setrow"><div class="t">${label}${sub ? `<span>${sub}</span>` : ""}</div><button class="switch" role="switch" aria-checked="${!!S.settings[k]}" data-act="toggle" data-k="${k}" aria-label="${label}"></button></div>`;
    return `<div class="view">
      <div class="statgrid">
        <div class="sbox" style="color:var(--gold)">${I.flame}<div><b>${streakNow()}</b><span>Day streak</span></div></div>
        <div class="sbox" style="color:var(--accent)">${I.bolt}<div><b>${S.xp}</b><span>Total XP</span></div></div>
        <div class="sbox" style="color:var(--ok)">${I.trophy}<div><b>${S.bestStreak}</b><span>Best streak</span></div></div>
        <div class="sbox" style="color:var(--ink)">${I.check}<div><b>${S.lessons}</b><span>Sessions done</span></div></div>
      </div>
      <div class="card" style="display:flex;flex-direction:column;gap:10px"><h3>This week</h3>${chart}</div>
      <div class="card"><h3 style="margin-bottom:6px">Accuracy by unit</h3>${units}</div>
      <div class="card">
        <h3 style="margin-bottom:10px">Daily goal</h3>
        <div class="seg" role="group" aria-label="Daily goal">${GOALS.map(([g, l]) => `<button data-act="goal" data-g="${g}" aria-pressed="${S.goal === g}">${l}<br><small>${g} XP</small></button>`).join("")}</div>
        <div style="margin-top:8px">
          ${sw("sound", "Sound effects")}
          ${sw("autoplay", "Read answers aloud", hasTTS ? "Uses your iPhone's Portuguese (Brasil) voice" : "Not supported in this browser")}
          ${sw("slow", "Slower speech")}
        </div>
        ${hasTTS ? `<div style="margin-top:12px">
          <h3 style="margin-bottom:4px">Voice</h3>
          <p class="muted" style="margin:0 0 8px;font-size:14px">
            ${ptVoices.length > 1
              ? "Pick the one that sounds best to you."
              : "Only one Brazilian voice is installed. For a much better one, open iOS Settings &rarr; Accessibility &rarr; Spoken Content &rarr; Voices &rarr; Portuguese (Brazil) and download the Enhanced or Premium voice, then reopen this app."}
          </p>
          ${ptVoices.length ? `<div class="seg" role="group" aria-label="Voice" style="flex-wrap:wrap">
            ${ptVoices.map(v => `<button data-act="voice" data-v="${esc(v.voiceURI)}" aria-pressed="${voice && voice.voiceURI === v.voiceURI}">${esc(v.name.replace(/\s*\(.*\)/, ""))}</button>`).join("")}
          </div>
          <button class="btn small ghost" style="margin-top:8px" data-act="say" data-t="Bom dia! Hoje eu vou estudar português.">Hear it</button>`
          : `<p class="muted" style="margin:0;font-size:14px">No Portuguese voice found on this device.</p>`}
        </div>` : ""}
      </div>
      <div class="card">
        <h3 style="margin-bottom:4px">Your data</h3>
        <p class="muted" style="margin:0 0 10px;font-size:14px">Progress is saved on this device only. Copy a backup before switching phones or clearing Safari data.</p>
        <div style="display:flex;gap:10px;flex-wrap:wrap">
          <button class="btn small ghost" data-act="backup">Copy backup</button>
          <button class="btn small ghost" data-act="restore">Restore backup</button>
          <button class="btn small ghost" data-act="reset" style="color:var(--bad)">Reset progress</button>
        </div>
      </div>
    </div>`;
  }

  /* ---------------- sheets & toast ---------------- */
  function sheet(html, onReady) {
    const ov = $("#overlay");
    const wrap = document.createElement("div");
    wrap.className = "scrim";
    wrap.innerHTML = `<div class="sheet" role="dialog" aria-modal="true">${html}</div>`;
    wrap.addEventListener("click", e => { if (e.target === wrap || e.target.closest("[data-close]")) wrap.remove(); });
    ov.appendChild(wrap);
    onReady && onReady(wrap);
    const f = wrap.querySelector("button.btn"); f && f.focus({ preventScroll: true });
    return wrap;
  }
  let toastT;
  function toast(msg) {
    document.querySelectorAll(".toast").forEach(t => t.remove());
    const t = document.createElement("div"); t.className = "toast"; t.textContent = msg; t.setAttribute("role", "status");
    document.body.appendChild(t); clearTimeout(toastT); toastT = setTimeout(() => t.remove(), 2200);
  }

  function lessonSheet(u, l) {
    const unit = UNITS.find(x => x.id === u);
    const kinds = [unit.drill ? "Conjugation typing" : null, "Multiple choice", unit.build.length ? "Sentence building" : null].filter(Boolean);
    const st = unitState(u);
    sheet(`<span class="eyebrow">Unit ${unit.n} · Lesson ${l + 1} of 4</span>
      <h2>${esc(unit.title)}</h2>
      <p class="muted">${LESSON_SIZE} exercises · about 4 minutes · ${kinds.join(", ")}</p>
      ${l > st.done ? `<p style="font-size:14px">You're jumping ahead. Earlier lessons in this unit will be marked done when you finish this one.</p>` : ""}
      <div class="actions"><button class="btn block" data-start>${l < st.done ? "Practice again" : "Start lesson"}</button><button class="btn ghost block" data-close>Not now</button></div>`,
      w => w.querySelector("[data-start]").addEventListener("click", () => { w.remove(); startLesson({ mode: "lesson", unit, level: l }); }));
  }

  /* ---------------- main click handling ---------------- */
  document.addEventListener("click", e => {
    const b = e.target.closest("[data-act]"); if (!b) return;
    const a = b.dataset.act;
    if (a === "lesson") lessonSheet(b.dataset.u, +b.dataset.l);
    else if (a === "tip") {
      const u = UNITS.find(x => x.id === b.dataset.u);
      sheet(`<span class="eyebrow">Unit ${u.n} tips</span><h2>${esc(u.title)}</h2><p>${esc(u.tip)}</p>
        ${u.drill && !u.drill.tenses.includes("part") ? `<p class="muted" style="font-size:14px">Tenses drilled: ${u.drill.tenses.map(t => TENSES[t].pt).join(", ")}.</p>` : ""}
        <div class="actions"><button class="btn ghost block" data-goguide>Open verb tables</button><button class="btn block" data-close>Got it</button></div>`,
        w => w.querySelector("[data-goguide]").addEventListener("click", () => { w.remove(); tab = "guide"; G.tab = "verbs"; render(); window.scrollTo(0, 0); }));
    }
    else if (a === "dismiss-install") { S.installDismissed = true; save(); render(); }
    else if (a === "review") { const r = buildReview(); startLesson({ mode: "review", ex: r.ex, label: r.label }); }
    else if (a === "gtab") { G.tab = b.dataset.k; render(); }
    else if (a === "verb") { G.verb = b.dataset.v; render(); const h = $(".vhead"); h && h.scrollIntoView({ behavior: "smooth", block: "start" }); }
    else if (a === "say") speak(b.dataset.t);
    else if (a === "goal") { S.goal = +b.dataset.g; save(); render(); }
    else if (a === "voice") {
      S.settings.voiceURI = b.dataset.v; save(); pickVoice(); render();
      speak("Bom dia! Hoje eu vou estudar português.");
    }
    else if (a === "toggle") { S.settings[b.dataset.k] = !S.settings[b.dataset.k]; save(); render(); if (b.dataset.k === "sound" && S.settings.sound) sOk(); }
    else if (a === "backup") {
      const data = JSON.stringify(S);
      const done = () => toast("Backup copied. Paste it somewhere safe, like Notes.");
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(data).then(done, () => showBackup(data));
      else showBackup(data);
    }
    else if (a === "restore") {
      sheet(`<h2>Restore backup</h2><p class="muted">Paste the backup text you copied earlier. This replaces the progress on this device.</p>
        <label class="sr" for="restoreBox">Backup text</label><textarea id="restoreBox" spellcheck="false" autocapitalize="off"></textarea>
        <div class="actions"><button class="btn block" data-restore>Restore</button><button class="btn ghost block" data-close>Cancel</button></div>`,
        w => w.querySelector("[data-restore]").addEventListener("click", () => {
          try {
            const o = JSON.parse(w.querySelector("#restoreBox").value);
            if (!o || typeof o !== "object" || !("srs" in o)) throw new Error("bad");
            S = Object.assign(clone(DEFAULT), o); S.settings = Object.assign({}, DEFAULT.settings, o.settings);
            save(); w.remove(); render(); toast("Progress restored.");
          } catch (err) { toast("That doesn't look like an Ipê backup. Copy the whole text and try again."); }
        }));
    }
    else if (a === "reset") {
      sheet(`<h2>Reset all progress?</h2><p class="muted">Your streak, XP, lesson progress and review schedule will be erased from this device. This can't be undone.</p>
        <div class="actions"><button class="btn bad block" data-reset>Reset progress</button><button class="btn ghost block" data-close>Keep my progress</button></div>`,
        w => w.querySelector("[data-reset]").addEventListener("click", () => { const keep = { onboarded: true, installDismissed: S.installDismissed }; S = Object.assign(clone(DEFAULT), keep); save(); w.remove(); render.scrolled = false; tab = "learn"; render(); toast("Progress reset."); }));
    }
  });
  function showBackup(data) {
    sheet(`<h2>Your backup</h2><p class="muted">Select all the text below and copy it.</p><textarea readonly id="bkp">${esc(data)}</textarea><div class="actions"><button class="btn block" data-close>Done</button></div>`,
      w => { const t = w.querySelector("#bkp"); t.focus(); t.select(); });
  }

  /* ---------------- lesson engine ---------------- */
  let L = null;
  const PRAISE = ["Isso aí!", "Muito bem!", "Mandou bem!", "Perfeito!", "Boa!", "Excelente!"];
  const OOPS = ["Quase!", "Não foi dessa vez.", "Opa!"];

  function startLesson(opts) {
    const ex = opts.mode === "lesson" ? buildLesson(opts.unit, opts.level) : opts.ex;
    L = Object.assign({}, opts, {
      queue: ex.map(x => Object.assign(x, { tries: 0 })),
      total: ex.length, finished: 0, firstOk: 0, attempted: new Set(), start: Date.now(), streakBefore: streakNow(), xpBefore: xpToday()
    });
    $("#overlay").innerHTML = `<div class="layer" id="layer">
      <div class="lhead"><button class="iconbtn" id="quit" aria-label="Quit">${I.close}</button><div class="lbar" role="progressbar" aria-label="Lesson progress"><i></i></div></div>
      <div class="lbody" id="lbody"></div>
      <div class="lfoot" id="lfoot"></div>
    </div>`;
    document.body.style.overflow = "hidden";
    $("#quit").addEventListener("click", confirmQuit);
    nextExercise();
  }
  function closeLesson() { L = null; $("#overlay").innerHTML = ""; document.body.style.overflow = ""; render(); }
  function confirmQuit() {
    if (!L || L.finished === 0) return closeLesson();
    sheet(`<h2>Quit this lesson?</h2><p class="muted">You'll lose the progress from this lesson.</p>
      <div class="actions"><button class="btn block" data-close>Keep learning</button><button class="btn ghost block" data-quit style="color:var(--bad)">Quit</button></div>`,
      w => w.querySelector("[data-quit]").addEventListener("click", () => { w.remove(); closeLesson(); }));
  }
  function setBar() { const i = $(".lbar i"); if (i) i.style.width = (L.finished / L.total) * 100 + "%"; }

  function sentenceHTML(q, fill) {
    if (!q.s.includes("___")) return esc(q.s);
    const [a, b] = q.s.split("___");
    return `${esc(a)}<span class="blank">${fill ? esc(fill) : "&nbsp;"}</span>${esc(b)}`;
  }

  function nextExercise() {
    setBar();
    if (!L.queue.length) return finishLesson();
    const x = (L.cur = L.queue.shift());
    L.sel = null; L.checked = false; L.picked = [];
    const retry = x.tries > 0 ? `<span class="retry">· Previous mistake</span>` : "";
    let body = "";
    if (x.kind === "mc") {
      const long = x.q.long || x.opts.some(o => o.length > 18);
      body = `<div class="kind">${esc(x.q.t)} ${retry}</div>
        <p class="prompt" id="prompt">${sentenceHTML(x.q)}</p>
        <div class="opts ${long ? "long" : ""}" role="group" aria-label="Options">${x.opts.map((o, i) => `<button class="opt" data-i="${i}" aria-pressed="false"><span class="k">${i + 1}</span><span>${esc(o)}</span></button>`).join("")}</div>`;
    } else if (x.kind === "type") {
      const T = TENSES[x.tense];
      body = `<div class="kind">Type the verb ${retry}</div>
        <p class="prompt" id="prompt">${esc(x.before)}<span class="blank">&nbsp;</span>${esc(x.after)}</p>
        <div class="chips"><span class="chip verb">${esc(x.verb)} <span class="m">· ${esc(meaning(x.verb))}</span></span><span class="chip">${esc(T.pt)}</span></div>
        <label class="sr" for="ans">Your answer</label>
        <input class="answer-input" id="ans" type="text" inputmode="text" lang="pt-BR" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" enterkeyhint="done" placeholder="Type in Portuguese">
        <div class="accents" aria-label="Accented letters">${"á à â ã é ê í ó ô õ ú ç".split(" ").map(c => `<button type="button" data-ch="${c}">${c}</button>`).join("")}</div>
        <button class="linkbtn" id="idk" type="button">I don't know this one</button>`;
    } else {
      body = `<div class="kind">Build the sentence ${retry}</div>
        <p class="prompt en" id="prompt">${esc(x.q.en)}</p>
        <div class="tiles-answer" id="tAns" aria-label="Your sentence"></div>
        <div class="tiles-bank" id="tBank">${x.tiles.map(t => `<button class="tile" data-ti="${t.i}">${esc(t.w)}</button>`).join("")}</div>`;
    }
    const lb = $("#lbody");
    lb.innerHTML = body; lb.scrollTop = 0;
    footIdle();
    wireExercise(x);
  }

  function footIdle() {
    const f = $("#lfoot"); f.className = "lfoot";
    f.innerHTML = `<div class="lfoot-in"><button class="btn block" id="checkBtn" disabled>Check</button></div>`;
    $("#checkBtn").addEventListener("click", () => check());
  }
  const enableCheck = on => { const b = $("#checkBtn"); if (b) b.disabled = !on; };

  function wireExercise(x) {
    if (x.kind === "mc") {
      $("#lbody").querySelectorAll(".opt").forEach(b => b.addEventListener("click", () => {
        if (L.checked) return;
        $("#lbody").querySelectorAll(".opt").forEach(o => o.setAttribute("aria-pressed", "false"));
        b.setAttribute("aria-pressed", "true"); L.sel = x.opts[+b.dataset.i]; enableCheck(true);
      }));
    } else if (x.kind === "type") {
      const inp = $("#ans");
      inp.addEventListener("input", () => enableCheck(inp.value.trim().length > 0));
      inp.addEventListener("keydown", e => { if (e.key === "Enter" && inp.value.trim()) { e.preventDefault(); check(); } });
      $("#lbody").querySelectorAll(".accents button").forEach(b => {
        b.addEventListener("pointerdown", e => e.preventDefault()); // keep the keyboard open
        b.addEventListener("click", () => {
          if (L.checked) return;
          const s = inp.selectionStart ?? inp.value.length, en = inp.selectionEnd ?? inp.value.length;
          inp.value = inp.value.slice(0, s) + b.dataset.ch + inp.value.slice(en);
          inp.setSelectionRange(s + 1, s + 1); inp.focus(); enableCheck(true);
        });
      });
      $("#idk").addEventListener("click", () => { if (!L.checked) { inp.value = ""; check(true); } });
      setTimeout(() => inp.focus({ preventScroll: true }), 60);
    } else {
      const ans = $("#tAns"), bank = $("#tBank");
      const draw = () => {
        ans.innerHTML = L.picked.map(i => `<button class="tile" data-ti="${i}">${esc(x.tiles.find(t => t.i === i).w)}</button>`).join("");
        bank.querySelectorAll(".tile").forEach(b => b.classList.toggle("used", L.picked.includes(+b.dataset.ti)));
        enableCheck(L.picked.length > 0);
      };
      bank.addEventListener("click", e => {
        const b = e.target.closest(".tile"); if (!b || L.checked || b.classList.contains("used")) return;
        L.picked.push(+b.dataset.ti); tone([[520, 0, 0.05, "sine", 0.05]]); draw();
      });
      ans.addEventListener("click", e => {
        const b = e.target.closest(".tile"); if (!b || L.checked) return;
        L.picked = L.picked.filter(i => i !== +b.dataset.ti); draw();
      });
    }
  }

  function spokenText(x) {
    if (x.kind === "mc") return x.q.s.includes("___") ? x.q.s.replace("___", x.q.o[0]) : x.q.long ? x.q.o[0] : "";
    if (x.kind === "type") return x.before + x.answer + x.after.replace("…", "");
    return x.q.a[0];
  }

  function check(gaveUp) {
    if (!L || L.checked) return;
    const x = L.cur;
    let ok = false, note = "", given = "";
    if (x.kind === "mc") {
      if (L.sel == null) return;
      ok = L.sel === x.q.o[0];
    } else if (x.kind === "type") {
      given = $("#ans").value;
      if (!gaveUp && !given.trim()) return;
      const g = norm(given), a = norm(x.answer);
      if (g === a) ok = true;
      else if (g && bare(g) === bare(a)) { ok = true; note = `Watch the accents: <b>${esc(x.answer)}</b>`; }
    } else {
      if (!L.picked.length) return;
      given = L.picked.map(i => x.tiles.find(t => t.i === i).w).join(" ");
      ok = x.q.a.some(s => norm(s) === norm(given));
    }
    L.checked = true;

    // scoring: only the first attempt at an item counts toward SRS and accuracy
    const firstAttempt = !L.attempted.has(x.key);
    if (firstAttempt) {
      L.attempted.add(x.key);
      recordSRS(x.key, ok);
      if (ok) L.firstOk++;
      const unitId = x.kind === "type" ? (L.unit ? L.unit.id : null) : (INDEX[x.key] && INDEX[x.key].u.id);
      if (unitId) { const s = unitState(unitId); s.n++; if (ok) s.c++; }
    }
    if (ok) { L.finished++; }
    else if (x.tries < 2) { L.queue.push(Object.assign({}, x, { tries: x.tries + 1 }, x.kind === "mc" ? { opts: shuffle(x.q.o) } : {}, x.kind === "build" ? { tiles: shuffle(x.tiles) } : {})); }
    else { L.finished++; }
    save();

    // paint the exercise
    if (x.kind === "mc") {
      $("#lbody").querySelectorAll(".opt").forEach(b => {
        b.disabled = true; const v = x.opts[+b.dataset.i];
        if (v === x.q.o[0]) b.classList.add("right"); else if (v === L.sel) b.classList.add("wrong");
      });
      if (x.q.s.includes("___")) $("#prompt").innerHTML = sentenceHTML(x.q, x.q.o[0]);
    } else if (x.kind === "type") {
      const inp = $("#ans"); inp.readOnly = true; inp.classList.add(ok ? "right" : "wrong"); inp.blur();
      $("#prompt").innerHTML = `${esc(x.before)}<span class="blank">${esc(x.answer)}</span>${esc(x.after)}`;
      $("#idk").hidden = true;
    } else {
      $("#lbody").querySelectorAll(".tile").forEach(b => (b.disabled = true));
    }
    setBar();

    // feedback footer
    let fb = "";
    if (x.kind === "mc") {
      fb = `${ok ? "" : `<p class="ans">Answer: ${esc(x.q.o[0])}</p>`}<p>${esc(x.q.e)}</p><p class="rule">${esc(x.q.r)}</p>`;
    } else if (x.kind === "type") {
      const T = TENSES[x.tense];
      fb = `${ok ? (note ? `<p>${note}</p>` : "") : `<p class="ans">Answer: ${esc(x.answer)}</p>${given.trim() ? `<p class="rule">You wrote “${esc(given.trim())}”.</p>` : ""}`}
        <p class="row">${esc(x.verb)} · ${esc(T.pt)}: ${x.row}</p>${ok ? "" : `<p class="rule">${esc(T.use)}</p>`}`;
    } else {
      const same = norm(given) === norm(x.q.a[0]);
      fb = ok ? (same ? "" : `<p class="rule">Also correct: ${esc(x.q.a[0])}</p>`) : `<p class="ans">Answer: ${esc(x.q.a[0])}</p>`;
    }
    const title = ok ? pick(PRAISE) : gaveUp ? "Here's the answer" : pick(OOPS);
    const text = spokenText(x);
    const f = $("#lfoot"); f.className = "lfoot " + (ok ? "ok" : "bad");
    f.innerHTML = `<div class="lfoot-in">
      <div class="verdict"><span class="mark">${ok ? I.check : I.x}</span><h3>${esc(title)}</h3>${text && hasTTS ? `<button class="speak" id="sayBtn" aria-label="Listen">${I.speaker}</button>` : ""}</div>
      ${fb.trim() ? `<div class="fb-text">${fb}</div>` : ""}
      <button class="btn block ${ok ? "ok" : "bad"}" id="contBtn">Continue</button>
    </div>`;
    $("#contBtn").addEventListener("click", nextExercise);
    const sb = $("#sayBtn"); sb && sb.addEventListener("click", () => speak(text));
    $("#contBtn").focus({ preventScroll: true });
    ok ? sOk() : sBad();
    if (S.settings.autoplay && text) setTimeout(() => speak(text), 250);
  }

  function finishLesson() {
    const t = today();
    const isLesson = L.mode === "lesson";
    const firstOk = Math.min(L.firstOk, L.total);
    const perfect = firstOk === L.total;
    const xp = isLesson ? 10 + firstOk + (perfect ? 5 : 0) : firstOk + 5;
    S.xp += xp; S.days[t] = (S.days[t] || 0) + xp; S.lessons++;
    Object.keys(S.days).forEach(d => { if (+d < t - 60) delete S.days[d]; });
    let streakUp = false;
    if (S.lastDay !== t) {
      S.streak = S.lastDay === t - 1 ? S.streak + 1 : 1;
      S.lastDay = t; streakUp = true;
    }
    S.bestStreak = Math.max(S.bestStreak, S.streak);
    if (isLesson) { const st = unitState(L.unit.id); st.done = Math.min(LESSONS_PER_UNIT, Math.max(st.done, L.level + 1)); }
    const unitDone = isLesson && unitState(L.unit.id).done === LESSONS_PER_UNIT && L.level === LESSONS_PER_UNIT - 1;
    const goalHit = L.xpBefore < S.goal && S.days[t] >= S.goal;
    save();
    const secs = Math.round((Date.now() - L.start) / 1000);
    const time = `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, "0")}`;
    const acc = Math.round((firstOk / Math.max(1, L.total)) * 100);
    const head = unitDone ? `Unit ${L.unit.n} complete!` : isLesson ? (perfect ? "Perfect lesson!" : "Lesson complete!") : `${L.label} done!`;
    const notes = [
      streakUp ? `<b>${S.streak}-day streak.</b> ${S.streak === 1 ? "Come back tomorrow to keep it going." : "Keep it going tomorrow."}` : "",
      goalHit ? "You hit today's goal." : ""
    ].filter(Boolean).join(" ");
    $("#lfoot").className = "lfoot";
    $("#lbody").innerHTML = `<div class="finish">
      <div class="seal">${streakUp ? I.flame : unitDone ? I.trophy : I.star}</div>
      <h1>${head}</h1>
      <div class="tiles3">
        <div class="tile3 g"><span>XP</span><b>+${xp}</b></div>
        <div class="tile3 o"><span>Accuracy</span><b>${acc}%</b></div>
        <div class="tile3 a"><span>Time</span><b>${time}</b></div>
      </div>
      ${notes ? `<p class="note">${notes}</p>` : ""}
    </div>`;
    $(".lbar i").style.width = "100%";
    $("#lfoot").innerHTML = `<div class="lfoot-in"><button class="btn block" id="doneBtn">Continue</button></div>`;
    $("#doneBtn").addEventListener("click", closeLesson);
    $("#doneBtn").focus({ preventScroll: true });
    sWin();
    L.over = true;
  }

  // keyboard shortcuts (handy on iPad / desktop)
  document.addEventListener("keydown", e => {
    if (!L || e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
    if (L.over) { if (e.key === "Enter") { e.preventDefault(); closeLesson(); } return; }
    if (e.key === "Enter") {
      e.preventDefault();
      if (L.checked) nextExercise(); else { const b = $("#checkBtn"); if (b && !b.disabled) check(); }
    }
    const n = +e.key;
    if (!L.checked && L.cur && L.cur.kind === "mc" && n >= 1 && n <= L.cur.opts.length) $(`.opt[data-i="${n - 1}"]`).click();
  });

  /* ---------------- onboarding ---------------- */
  function onboard() {
    sheet(`<span class="eyebrow">Bem-vindo</span><h2>Learn Brazilian Portuguese grammar a few minutes a day</h2>
      <p class="muted">Short lessons, typed conjugation drills and spaced review of your mistakes. Pick a daily goal; you can change it later.</p>
      <div class="seg" role="group" aria-label="Daily goal" id="obGoal">${GOALS.map(([g, l]) => `<button data-g="${g}" aria-pressed="${S.goal === g}">${l}<br><small>${g} XP</small></button>`).join("")}</div>
      <div class="actions"><button class="btn block" data-go>Start learning</button></div>`,
      w => {
        w.querySelector("#obGoal").addEventListener("click", e => {
          const b = e.target.closest("button"); if (!b) return;
          S.goal = +b.dataset.g; w.querySelectorAll("#obGoal button").forEach(x => x.setAttribute("aria-pressed", x === b));
        });
        const go = () => { S.onboarded = true; save(); w.remove(); render(); };
        w.querySelector("[data-go]").addEventListener("click", go);
        w.addEventListener("click", e => { if (e.target === w) go(); });
      });
  }

  /* ---------------- boot ---------------- */
  render();
  if (!S.onboarded) onboard();
  document.addEventListener("visibilitychange", () => { if (!document.hidden && !L) renderChrome(); });
  if ("serviceWorker" in navigator && /^https?:$/.test(location.protocol)) {
    window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js").catch(() => {}));
  }
})();
