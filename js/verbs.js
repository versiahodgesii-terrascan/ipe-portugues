/* Conjugation engine for Brazilian Portuguese.
   Persons follow the Brazilian 4-form system:
   0 = eu · 1 = ele/ela/você/a gente · 2 = nós · 3 = eles/elas/vocês
   Regular forms are generated from the infinitive; irregular verbs override
   only the forms that differ (null = keep the generated form). */
(function (root) {
  const TENSES = {
    pres: { pt: "Presente", en: "Present", use: "Habits, facts, things happening now, and often the near future.", signals: "hoje, sempre, todo dia, agora", lead: "Hoje,", short: "Presente" },
    perf: { pt: "Pretérito perfeito", en: "Simple past", use: "Finished actions at a definite time. Also covers the English present perfect: já vi, nunca fui.", signals: "ontem, semana passada, em 2020, já, de repente", lead: "Ontem,", short: "Perfeito" },
    imp: { pt: "Pretérito imperfeito", en: "Imperfect", use: "Past habits (used to), descriptions, background actions, age and time in the past.", signals: "antigamente, quando eu era criança, todo verão, enquanto", lead: "Antigamente,", short: "Imperfeito" },
    fut: { pt: "Futuro do presente", en: "Future", use: "Formal or written future. In speech Brazilians usually say ir + infinitivo: vou fazer.", signals: "amanhã, no ano que vem, um dia", lead: "Amanhã,", short: "Futuro" },
    cond: { pt: "Futuro do pretérito", en: "Conditional", use: "What would happen, polite requests, and future-in-the-past (ele disse que viria).", signals: "se eu pudesse…, seria bom, você poderia…?", lead: "Se pudesse,", short: "Condicional" },
    psub: { pt: "Presente do subjuntivo", en: "Present subjunctive", use: "After wishes, doubts, emotions and necessity with que: espero que, talvez, é importante que.", signals: "espero que, quero que, tomara que, talvez, embora", lead: "Espero que", short: "Pres. subj." },
    isub: { pt: "Imperfeito do subjuntivo", en: "Past subjunctive", use: "Hypothetical se-clauses and past wishes: se eu tivesse, queria que você fosse, como se.", signals: "se (hipótese), como se, queria que, embora (passado)", lead: "Se", short: "Imp. subj." },
    fsub: { pt: "Futuro do subjuntivo", en: "Future subjunctive", use: "Future possibilities after quando, se, assim que, enquanto. Rare in other languages, very common in Brazil.", signals: "quando, se, assim que, enquanto, sempre que (futuro)", lead: "Quando", short: "Fut. subj." },
    part: { pt: "Particípio", en: "Past participle", use: "With ter for compound tenses (tenho feito, tinha visto) and with ser for the passive (foi escrito).", signals: "tenho…, tinha…, foi…", lead: "", short: "Particípio" }
  };
  const TENSE_ORDER = ["pres", "perf", "imp", "fut", "cond", "psub", "isub", "fsub"];
  const PERSONS = ["eu", "ele/ela/você", "nós", "eles/elas/vocês"];

  const IRR = {
    ser: { en: "to be (permanent)", pres: ["sou", "é", "somos", "são"], perf: ["fui", "foi", "fomos", "foram"], imp: ["era", "era", "éramos", "eram"], psub: ["seja", "seja", "sejamos", "sejam"] },
    estar: { en: "to be (temporary)", pres: ["estou", "está", "estamos", "estão"], perf: ["estive", "esteve", "estivemos", "estiveram"], psub: ["esteja", "esteja", "estejamos", "estejam"] },
    ter: { en: "to have", pres: ["tenho", "tem", "temos", "têm"], perf: ["tive", "teve", "tivemos", "tiveram"], imp: ["tinha", "tinha", "tínhamos", "tinham"] },
    ir: { en: "to go", pres: ["vou", "vai", "vamos", "vão"], perf: ["fui", "foi", "fomos", "foram"], psub: ["vá", "vá", "vamos", "vão"] },
    fazer: { en: "to do, to make", pres: ["faço", "faz", null, null], perf: ["fiz", "fez", "fizemos", "fizeram"], fut: ["farei", "fará", "faremos", "farão"], cond: ["faria", "faria", "faríamos", "fariam"], part: "feito" },
    poder: { en: "can, to be able to", pres: ["posso", null, null, null], perf: ["pude", "pôde", "pudemos", "puderam"] },
    querer: { en: "to want", pres: [null, "quer", null, null], perf: ["quis", "quis", "quisemos", "quiseram"], psub: ["queira", "queira", "queiramos", "queiram"] },
    dizer: { en: "to say", pres: ["digo", "diz", null, null], perf: ["disse", "disse", "dissemos", "disseram"], fut: ["direi", "dirá", "diremos", "dirão"], cond: ["diria", "diria", "diríamos", "diriam"], part: "dito" },
    trazer: { en: "to bring", pres: ["trago", "traz", null, null], perf: ["trouxe", "trouxe", "trouxemos", "trouxeram"], fut: ["trarei", "trará", "traremos", "trarão"], cond: ["traria", "traria", "traríamos", "trariam"] },
    ver: { en: "to see", pres: ["vejo", "vê", "vemos", "veem"], perf: ["vi", "viu", "vimos", "viram"], part: "visto" },
    vir: { en: "to come", pres: ["venho", "vem", "vimos", "vêm"], perf: ["vim", "veio", "viemos", "vieram"], imp: ["vinha", "vinha", "vínhamos", "vinham"], part: "vindo" },
    dar: { en: "to give", pres: ["dou", "dá", "damos", "dão"], perf: ["dei", "deu", "demos", "deram"], psub: ["dê", "dê", "demos", "deem"] },
    saber: { en: "to know (facts)", pres: ["sei", null, null, null], perf: ["soube", "soube", "soubemos", "souberam"], psub: ["saiba", "saiba", "saibamos", "saibam"] },
    "pôr": {
      en: "to put", full: true,
      pres: ["ponho", "põe", "pomos", "põem"], perf: ["pus", "pôs", "pusemos", "puseram"], imp: ["punha", "punha", "púnhamos", "punham"],
      fut: ["porei", "porá", "poremos", "porão"], cond: ["poria", "poria", "poríamos", "poriam"], psub: ["ponha", "ponha", "ponhamos", "ponham"],
      isub: ["pusesse", "pusesse", "puséssemos", "pusessem"], fsub: ["puser", "puser", "pusermos", "puserem"], part: "posto", ger: "pondo"
    },
    sair: { en: "to leave, to go out", pres: ["saio", "sai", "saímos", "saem"], perf: ["saí", "saiu", "saímos", "saíram"], imp: ["saía", "saía", "saíamos", "saíam"], fsub: ["sair", "sair", "sairmos", "saírem"], part: "saído", ger: "saindo" },
    ler: { en: "to read", pres: ["leio", "lê", "lemos", "leem"] },
    dormir: { en: "to sleep", pres: ["durmo", null, null, null] },
    pedir: { en: "to ask for, to order", pres: ["peço", null, null, null] },
    "começar": { en: "to start", pres: ["começo", null, null, null], perf: ["comecei", null, null, null], psub: ["comece", "comece", "comecemos", "comecem"] },
    chegar: { en: "to arrive", perf: ["cheguei", null, null, null], psub: ["chegue", "chegue", "cheguemos", "cheguem"] },
    ficar: { en: "to stay, to become, to be located", perf: ["fiquei", null, null, null], psub: ["fique", "fique", "fiquemos", "fiquem"] },
    pagar: { en: "to pay", part: "pago", perf: ["paguei", null, null, null], psub: ["pague", "pague", "paguemos", "paguem"] },
    abrir: { en: "to open", part: "aberto" },
    escrever: { en: "to write", part: "escrito" }
  };
  const REG_EN = {
    falar: "to speak", morar: "to live (reside)", trabalhar: "to work", estudar: "to study", gostar: "to like", comprar: "to buy",
    comer: "to eat", beber: "to drink", aprender: "to learn", vender: "to sell", partir: "to leave, to split", decidir: "to decide", assistir: "to watch"
  };

  const accentMap = { a: "á", e: "ê", i: "í", o: "ô" };
  function accentLast(base, strong) {
    const last = base.slice(-1);
    if (!accentMap[last]) return base; // already accented (saí) or consonant
    const acc = strong && last === "e" ? "é" : accentMap[last];
    return base.slice(0, -1) + acc;
  }
  function merge(gen, over) {
    if (!over) return gen;
    return gen.map((f, i) => (over[i] != null ? over[i] : f));
  }

  const cache = {};
  function conjugate(inf) {
    if (cache[inf]) return cache[inf];
    const irr = IRR[inf] || {};
    if (irr.full) {
      const out = {}; TENSE_ORDER.forEach(t => (out[t] = irr[t].slice())); out.part = irr.part; out.ger = irr.ger;
      return (cache[inf] = out);
    }
    const end = inf.slice(-2), st = inf.slice(0, -2);
    const ar = end === "ar", er = end === "er";
    const t = {};
    t.pres = merge([st + "o", st + (ar ? "a" : "e"), st + (ar ? "amos" : er ? "emos" : "imos"), st + (ar ? "am" : "em")], irr.pres);
    t.perf = merge(ar ? [st + "ei", st + "ou", st + "amos", st + "aram"]
      : er ? [st + "i", st + "eu", st + "emos", st + "eram"]
        : [st + "i", st + "iu", st + "imos", st + "iram"], irr.perf);
    t.imp = merge(ar ? [st + "ava", st + "ava", st + "ávamos", st + "avam"] : [st + "ia", st + "ia", st + "íamos", st + "iam"], irr.imp);
    t.fut = merge([inf + "ei", inf + "á", inf + "emos", inf + "ão"], irr.fut);
    t.cond = merge([inf + "ia", inf + "ia", inf + "íamos", inf + "iam"], irr.cond);
    const ps = t.pres[0].slice(0, -1);
    t.psub = merge(ar ? [ps + "e", ps + "e", ps + "emos", ps + "em"] : [ps + "a", ps + "a", ps + "amos", ps + "am"], irr.psub);
    const strong = !!(irr.perf && irr.perf[3]);
    const pb = t.perf[3].slice(0, -3); // drop -ram
    t.isub = merge([pb + "sse", pb + "sse", accentLast(pb, strong) + "ssemos", pb + "ssem"], irr.isub);
    t.fsub = merge([pb + "r", pb + "r", pb + "rmos", pb + "rem"], irr.fsub);
    t.part = irr.part || st + (ar ? "ado" : "ido");
    t.ger = irr.ger || st + (ar ? "ando" : er ? "endo" : "indo");
    return (cache[inf] = t);
  }

  const ALL_VERBS = [...Object.keys(REG_EN), ...Object.keys(IRR)].sort((a, b) => a.localeCompare(b, "pt"));
  function meaning(v) { return (IRR[v] && IRR[v].en) || REG_EN[v] || ""; }
  function isIrregular(v) { return !!IRR[v] && !["abrir", "escrever", "chegar", "ficar", "pagar", "começar"].includes(v); }

  root.PT_VERBS = { TENSES, TENSE_ORDER, PERSONS, conjugate, ALL_VERBS, meaning, isIrregular };
})(typeof window !== "undefined" ? window : globalThis);
