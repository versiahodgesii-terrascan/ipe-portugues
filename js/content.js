/* Course content. Each unit has:
   - drill: typed conjugation practice (tenses + verbs), or null
   - mc: multiple choice. o[0] is always the correct answer (options are shuffled on screen).
         s = sentence ("___" marks the blank), t = tag, e = explanation, r = rule of thumb
   - build: word tiles. en = English prompt, a = accepted answers (first is shown),
            x = extra distractor tiles. Punctuation and capitals are ignored when checking. */
(function (root) {
  const U = [
    {
      id: "u1", title: "Presente", en: "The present tense", icon: "☀",
      tip: "Brazilians use four verb forms: eu, ele/ela/você/a gente, nós, eles/elas/vocês. Você and a gente conjugate like ele.",
      drill: { tenses: ["pres"], verbs: ["falar", "morar", "trabalhar", "comer", "beber", "aprender", "partir", "decidir", "ser", "estar", "ter", "ir", "fazer", "poder", "querer", "dizer", "ver", "vir", "dar", "saber", "sair", "dormir", "pedir", "ler", "começar"] },
      mc: [
        { t: "Concordância", s: "Toda segunda-feira, nós ___ futebol.", o: ["jogamos", "jogam", "joga", "jogo"], e: "Nós takes the -amos ending in the present.", r: "Nós → -amos / -emos / -imos." },
        { t: "Verbo irregular", s: "Eu não ___ fazer isso agora.", o: ["posso", "pode", "podo", "possa"], e: "Poder is irregular only in the eu form: posso, pode, podemos, podem.", r: "Possa is the subjuntivo." },
        { t: "Você = 3ª pessoa", s: "O que você ___ no fim de semana?", o: ["faz", "fazes", "fazem", "faço"], e: "Você conjugates like ele/ela. Fazes is the tu form, used only in some regions.", r: "Você faz, a gente faz, ele faz." },
        { t: "Plural", s: "Eles ___ inglês muito bem.", o: ["falam", "fala", "falamos", "falão"], e: "The eles/vocês ending in the present is -am (or -em). Falão is never correct.", r: "-ão endings belong to the future (falarão) and a few irregulars (são, vão, estão)." },
        { t: "Verbo irregular", s: "Eu ___ à academia três vezes por semana.", o: ["vou", "vai", "vá", "ido"], e: "Ir: vou, vai, vamos, vão.", r: "Vou also starts the spoken future: vou viajar." },
        { t: "Acento", s: "Vocês ___ tempo agora?", o: ["têm", "tem", "tens", "tenham"], e: "Ter in the plural takes a circumflex: eles têm. It sounds the same as tem.", r: "Ele tem / eles têm. Ele vem / eles vêm." },
        { t: "Estar + gerúndio", s: "Agora eu ___ trabalhando de casa.", o: ["estou", "sou", "está", "esteja"], e: "Something in progress right now: estar + -ndo.", r: "Brazilians say estou trabalhando; Portugal says estou a trabalhar." },
        { t: "Verbo irregular", s: "Eu não ___ onde ela mora.", o: ["sei", "sabo", "sabe", "saiba"], e: "Saber is irregular in the eu form: sei, sabe, sabemos, sabem.", r: "Saber = facts. Conhecer = people and places." },
        { t: "Verbo irregular", s: "Eu sempre ___ a verdade.", o: ["digo", "dizo", "diz", "diga"], e: "Dizer: digo, diz, dizemos, dizem.", r: "Fazer, dizer and trazer share the pattern: faço, digo, trago." },
        { t: "Verbo irregular", s: "Nós ___ de Minas Gerais.", o: ["somos", "estamos", "são", "sejamos"], e: "Origin is permanent, so ser. Ser: sou, é, somos, são.", r: "Ser de = to be from." }
        ,{ t: "Verbo irregular", s: "Eu ___ do trabalho às seis.", o: ["saio", "salho", "sai", "saia"], e: "Sair: saio, sai, saímos, saem.", r: "sair, cair, trair all take -aio in the eu form." },
        { t: "Verbo irregular", s: "Ela ___ muito bem o português.", o: ["lê", "lei", "leia", "lê-se"], e: "Ler: leio, lê, lemos, leem.", r: "ler→leio/lê, ver→vejo/vê, crer→creio/crê." },
        { t: "Mudança de radical", s: "Eu ___ oito horas por noite.", o: ["durmo", "dormo", "dorme", "durma"], e: "Dormir changes o to u in the eu form only: durmo, dorme, dormimos, dormem.", r: "dormir→durmo, cobrir→cubro, tossir→tusso." },
        { t: "Mudança de radical", s: "Eu sempre ___ a conta antes de sair.", o: ["peço", "pido", "pede", "peça"], e: "Pedir: peço, pede, pedimos, pedem.", r: "pedir→peço, medir→meço, ouvir→ouço." },
        { t: "Presente para o futuro", s: "Amanhã eu ___ para o Rio.", o: ["viajo", "viajarei de", "viajando", "viajasse"], e: "Brazilians use the present for scheduled near-future events, as English does with I fly tomorrow.", r: "Amanhã eu trabalho. Semana que vem a gente conversa." },
        { t: "Negativa", s: "Eu ___ gosto de acordar cedo.", o: ["não", "nem não", "não não", "no"], e: "Negation is simply não before the verb — there is no auxiliary like English do.", r: "Não gosto, não sei, não quero." }
      ],
      build: [
        { en: "I live in Brazil.", a: ["Eu moro no Brasil"], x: ["na", "mora"] },
        { en: "We speak Portuguese at home.", a: ["Nós falamos português em casa", "A gente fala português em casa"], x: ["falam", "na"] },
        { en: "Do you like coffee?", a: ["Você gosta de café"], x: ["gostas", "do"] },
        { en: "She works a lot.", a: ["Ela trabalha muito"], x: ["trabalho", "muita"] }
      ]
    },
    {
      id: "u2", title: "Pretérito perfeito", en: "The simple past", icon: "✓",
      tip: "Use it for completed actions. It also translates the English present perfect: já comi (I have eaten), nunca fui (I have never been).",
      drill: { tenses: ["perf"], verbs: ["falar", "comprar", "comer", "beber", "partir", "decidir", "chegar", "ficar", "começar", "pagar", "ser", "estar", "ter", "ir", "fazer", "poder", "querer", "dizer", "trazer", "ver", "vir", "dar", "saber", "pôr", "sair"] },
      mc: [
        { t: "Pretérito perfeito", s: "Ontem eu ___ ao cinema com meus amigos.", o: ["fui", "ia", "vou", "iria"], e: "A finished action at a definite time (ontem) takes the perfeito. Ir → fui, foi, fomos, foram.", r: "Ser and ir share the same past forms." },
        { t: "Experiência", s: "Eu já ___ esse filme três vezes.", o: ["vi", "via", "tenho visto", "vejo"], e: "English \"I have seen\" is the simple perfeito in Portuguese: já vi, nunca fui, já comi.", r: "Tenho visto means \"I have been seeing lately\"." },
        { t: "Verbo irregular", s: "Eu ___ a chave em cima da mesa ontem.", o: ["pus", "pôs", "punha", "pois"], e: "Pôr: pus, pôs, pusemos, puseram.", r: "Pois is a conjunction, not a verb." },
        { t: "Verbo irregular", s: "Nós ___ a prova na semana passada.", o: ["fizemos", "fazemos", "fazíamos", "fezemos"], e: "Fazer in the past: fiz, fez, fizemos, fizeram.", r: "For -ar verbs, nós is the same in present and past (falamos). Not for fazer." },
        { t: "Verbo irregular", s: "Eles ___ presentes para todo mundo.", o: ["trouxeram", "trazeram", "traziram", "trouxerem"], e: "Trazer has the past stem trouxe-. The x sounds like ss.", r: "Trouxerem is the futuro do subjuntivo." },
        { t: "Verbo irregular", s: "Você ___ o jogo ontem?", o: ["viu", "via", "vê", "visse"], e: "Ver: vi, viu, vimos, viram.", r: "Viram = they saw. Vieram = they came." },
        { t: "Verbo irregular", s: "Ontem à noite ela me ___ a verdade.", o: ["disse", "dizeu", "disso", "diz"], e: "Dizer: disse, disse, dissemos, disseram. Eu and ele share the same form.", r: "Dizeu is a classic learner mistake." },
        { t: "Verbo irregular", s: "Ontem nós ___ uma reunião longa.", o: ["tivemos", "tevemos", "temos", "teve"], e: "Ter: tive, teve, tivemos, tiveram.", r: "Estar follows the same pattern: estive, esteve, estivemos." },
        { t: "Vir × ver", s: "Vocês ___ de carro ou de ônibus?", o: ["vieram", "viram", "vinham", "veio"], e: "Vir (to come) in the past: vim, veio, viemos, vieram.", r: "Viram belongs to ver: they saw." },
        { t: "Ortografia", s: "Eu ___ a conta do restaurante.", o: ["paguei", "pagei", "pagou", "paguou"], e: "Verbs in -gar add u before e to keep the hard g: paguei, cheguei.", r: "-car → -quei (fiquei), -çar → -cei (comecei)." }
        ,{ t: "Verbo irregular", s: "Nós ___ ao cinema ontem.", o: ["fomos", "fomos ir", "íamos", "formos"], e: "Ir and ser share the same perfeito: fui, foi, fomos, foram.", r: "Context decides: fui ao cinema (ir) / fui professor (ser)." },
        { t: "Verbo irregular", s: "Eles ___ a casa no ano passado.", o: ["puseram", "ponharam", "puserem", "punham"], e: "Pôr: pus, pôs, pusemos, puseram.", r: "Compostos seguem: compus, propus, supus." },
        { t: "Verbo irregular", s: "Eu ___ muito trabalho ontem.", o: ["tive", "teve", "tinha", "tivesse"], e: "Ter: tive, teve, tivemos, tiveram.", r: "Strong preterites stress the stem: tive, fiz, pus, quis." },
        { t: "Ortografia", s: "Eu ___ o trabalho na semana passada.", o: ["comecei", "começei", "comecí", "comencei"], e: "Começar takes c before e: comecei.", r: "-çar→cei, -gar→guei, -car→quei." },
        { t: "Perfeito × presente", s: "Eu ___ nessa empresa desde 2020.", o: ["trabalho", "trabalhei", "trabalhava", "trabalharei"], e: "An action still going on takes the present, not the perfeito — unlike English have worked.", r: "Moro aqui há dez anos. Not morei." },
        { t: "Verbo irregular", s: "Ela não ___ vir à reunião.", o: ["pôde", "podeu", "podia", "pudesse"], e: "Poder: pude, pôde, pudemos, puderam. The circumflex separates pôde (past) from pode (present).", r: "Ele pode hoje / Ele pôde ontem." }
      ],
      build: [
        { en: "I went to the beach yesterday.", a: ["Ontem eu fui à praia", "Eu fui à praia ontem"], x: ["a", "ia"] },
        { en: "She ate the whole cake.", a: ["Ela comeu o bolo todo", "Ela comeu todo o bolo"], x: ["comia", "tudo"] },
        { en: "We arrived late.", a: ["Nós chegamos tarde", "A gente chegou tarde"], x: ["chegou", "atrasado"] },
        { en: "Have you ever been to Salvador?", a: ["Você já foi a Salvador", "Você já foi para Salvador"], x: ["ido", "tem"] }
      ]
    },
    {
      id: "u3", title: "Pretérito imperfeito", en: "Past habits and descriptions", icon: "↻",
      tip: "Use the imperfeito for what used to happen, for setting the scene (weather, time, age, feelings), and for actions in progress in the past.",
      drill: { tenses: ["imp"], verbs: ["falar", "morar", "trabalhar", "estudar", "comer", "beber", "partir", "assistir", "ser", "ter", "vir", "pôr", "ir", "fazer", "ler", "estar", "querer"] },
      mc: [
        { t: "Hábito", s: "Quando eu era criança, ___ futebol todo dia.", o: ["jogava", "joguei", "jogo", "jogarei"], e: "Past habits (used to) take the imperfeito. Todo dia marks repetition.", r: "Quando eu era criança… → imperfeito." },
        { t: "Hábito", s: "Antigamente as pessoas ___ mais cartas.", o: ["escreviam", "escrevem", "escrevam", "escreviram"], e: "Antigamente sets up a past habit.", r: "-er/-ir verbs: -ia, -ia, -íamos, -iam." },
        { t: "Descrição", s: "Eram dez horas e ___ muito.", o: ["chovia", "choveu", "chove", "chova"], e: "Weather as a background description takes the imperfeito.", r: "Time, weather, age, feelings in the past → imperfeito." },
        { t: "Ser no passado", s: "Quando eu ___ pequeno, morava no interior.", o: ["era", "fui", "sou", "estive"], e: "Ser has an irregular imperfeito: era, era, éramos, eram.", r: "Only four verbs are irregular here: ser, ter, vir, pôr." },
        { t: "Acento", s: "Nós ___ à praia todo verão.", o: ["íamos", "iamos", "vamos", "irmos"], e: "Ir in the imperfeito: ia, ia, íamos, iam. The nós form takes an accent.", r: "Every nós form in the imperfeito has an accent: falávamos, comíamos." },
        { t: "Ter no passado", s: "Ela ___ cabelo comprido quando era jovem.", o: ["tinha", "teve", "tem", "tenha"], e: "Ter: tinha, tinha, tínhamos, tinham. Describing how someone was.", r: "Ter in the past also gives age: eu tinha dez anos." },
        { t: "Vir no passado", s: "Quando morava aqui, ele ___ todo sábado.", o: ["vinha", "veio", "viria", "venha"], e: "Vir: vinha, vinha, vínhamos, vinham.", r: "Pôr: punha, punha, púnhamos, punham." },
        { t: "Idade", s: "Eu ___ dezoito anos quando me mudei.", o: ["tinha", "tive", "era", "estava"], e: "Age in the past: ter in the imperfeito. Portuguese has years, it doesn't \"be\" them.", r: "Quantos anos você tem? → Tenho 30 anos." }
        ,{ t: "Ação interrompida", s: "Eu ___ quando você ligou.", o: ["dormia", "dormi", "dormirei", "dormisse"], e: "The ongoing background action takes the imperfeito.", r: "Imperfeito is the scenery; perfeito is the event." },
        { t: "Hora no passado", s: "___ três horas quando ele chegou.", o: ["Eram", "Foram", "Era", "Foi"], e: "Clock time in the past is always imperfeito, and it agrees: eram três horas.", r: "Era uma hora. Eram duas horas." },
        { t: "Descrição física", s: "A casa ___ grande e ___ um jardim enorme.", o: ["era … tinha", "foi … teve", "era … teve", "foi … tinha"], e: "Descriptions of how things were take the imperfeito throughout.", r: "Ela era alta, tinha cabelo curto, usava óculos." },
        { t: "Imperfeito de cortesia", s: "___ falar com o gerente, por favor.", o: ["Queria", "Quis", "Quero que", "Quisesse"], e: "The imperfeito softens a request, much like English I wanted to.", r: "Queria um café. Podia me ajudar?" },
        { t: "Costumava", s: "Antigamente a gente ___ todo domingo.", o: ["se reunia", "se reuniu", "se reunirá", "se reúna"], e: "Antigamente signals a past habit → imperfeito.", r: "Costumava + infinitivo says the same thing: costumava se reunir." },
        { t: "Verbo irregular", s: "Quando eu era criança, eu ___ muito sorvete.", o: ["comia", "comi", "comerei", "comesse"], e: "Comer is regular in the imperfeito: comia, comia, comíamos, comiam.", r: "-er and -ir verbs both take -ia." },
        { t: "Dois imperfeitos", s: "Enquanto ela ___, eu ___ o jantar.", o: ["estudava … preparava", "estudou … preparei", "estudava … preparei", "estudou … preparava"], e: "Two simultaneous ongoing actions both take the imperfeito.", r: "Enquanto is the clearest signal for a double imperfeito." },
        { t: "Imperfeito irregular", s: "Nós ___ ao clube todo sábado.", o: ["íamos", "fomos", "iamos", "iríamos"], e: "Ir is one of only three irregular imperfeitos: ia, ia, íamos, iam.", r: "Only ser, ter... no: only ser, vir and pôr are irregular here. Ir takes ia regularly-shaped but note the accent on íamos." }
      ],
      build: [
        { en: "When I was a child, I lived in Bahia.", a: ["Quando eu era criança eu morava na Bahia", "Quando eu era criança morava na Bahia"], x: ["fui", "morei"] },
        { en: "We used to go to the beach every summer.", a: ["Nós íamos à praia todo verão", "A gente ia à praia todo verão"], x: ["fomos", "vamos"] },
        { en: "It was raining a lot.", a: ["Estava chovendo muito", "Chovia muito"], x: ["Choveu", "Era"] }
      ]
    },
    {
      id: "u4", title: "Perfeito × imperfeito", en: "Choosing the right past", icon: "⇄",
      tip: "The perfeito moves the story forward (what happened). The imperfeito paints the background (what was going on). Quando ele chegou (perfeito), eu estava dormindo (imperfeito).",
      drill: { tenses: ["perf", "imp"], verbs: ["falar", "morar", "comer", "partir", "ser", "estar", "ter", "ir", "fazer", "poder", "querer", "dizer", "ver", "vir", "saber"] },
      mc: [
        { t: "Fundo × ação", s: "Quando ele chegou, eu ___ no sofá.", o: ["estava dormindo", "dormi", "durmo", "dormirei"], e: "The ongoing background action takes estava + -ndo. The interrupting event (chegou) is perfeito.", r: "Background → imperfeito. Interruption → perfeito." },
        { t: "Fundo × ação", s: "Eu ___ no banho quando o telefone tocou.", o: ["estava", "estive", "estou", "esteja"], e: "Being in the shower is the background state when the phone rang.", r: "Estive = I was (and it's over), e.g. estive no Rio em maio." },
        { t: "Um momento", s: "Nós ___ a Ana numa festa em 2020.", o: ["conhecemos", "conhecíamos", "conhecermos", "conheçamos"], e: "Meeting someone for the first time is a single event: perfeito.", r: "Conhecer in the perfeito = to meet. In the imperfeito = to know." },
        { t: "Estado", s: "Eu já ___ a Ana havia anos quando ela se mudou.", o: ["conhecia", "conheci", "conheço", "conhecesse"], e: "Knowing someone over a period is a state: imperfeito.", r: "States that lasted → imperfeito." },
        { t: "De repente", s: "De repente, a luz ___.", o: ["acabou", "acabava", "acaba", "acabe"], e: "De repente signals a sudden, completed event: perfeito.", r: "Acabar a luz = the power went out (very Brazilian)." },
        { t: "Contável", s: "Ele ___ três vezes para você ontem.", o: ["ligou", "ligava", "liga", "ligue"], e: "A counted number of times in a closed period is perfeito.", r: "Três vezes, duas horas, o dia todo → perfeito." },
        { t: "Cena", s: "Era domingo, o sol ___ e todo mundo estava na praia.", o: ["brilhava", "brilhou", "brilha", "brilhe"], e: "Setting the scene: imperfeito.", r: "Era, estava, havia, brilhava: scene-setting verbs." }
        ,{ t: "Ação × cenário", s: "Eu ___ TV quando o telefone ___.", o: ["assistia … tocou", "assisti … tocava", "assistia … tocava", "assisti … tocou"], e: "The background action in progress takes the imperfeito; the single event that interrupts it takes the perfeito.", r: "Imperfeito sets the scene, perfeito breaks it." },
        { t: "Repetido × uma vez", s: "Todo sábado a gente ___ na praia, mas naquele dia ___ em casa.", o: ["ia … ficou", "foi … ficava", "ia … ficava", "foi … ficou"], e: "Todo sábado marks a habit (imperfeito); naquele dia marks one occasion (perfeito).", r: "Todo / sempre / antigamente → imperfeito. Ontem / naquele dia → perfeito." },
        { t: "Idade e hora", s: "Quando eu ___ dez anos, nós ___ para o Rio.", o: ["tinha … mudamos", "tive … mudávamos", "tinha … mudávamos", "tive … mudamos"], e: "Age in the past is always imperfeito. The move happened once, so perfeito.", r: "Eu tinha dez anos. Eram três horas. Both always imperfeito." }
      ],
      build: [
        { en: "I was sleeping when you called.", a: ["Eu estava dormindo quando você ligou"], x: ["dormi", "ligava"] },
        { en: "It was late and I was tired.", a: ["Era tarde e eu estava cansado", "Era tarde e eu estava cansada"], x: ["Foi", "fiquei"] }
      ]
    },
    {
      id: "u5", title: "Ser, estar e ficar", en: "Three ways to be", icon: "◐",
      tip: "Ser: identity, origin, profession, time, where events happen. Estar: states and conditions right now. Ficar: location of places and things, and becoming (fiquei feliz).",
      drill: { tenses: ["pres", "perf", "imp"], verbs: ["ser", "estar", "ficar"] },
      mc: [
        { t: "Estar", s: "A sopa ___ fria. Você esquenta de novo?", o: ["está", "é", "fica", "tem"], e: "A temporary condition right now takes estar.", r: "A sopa é fria = it's a cold soup by nature." },
        { t: "Ser", s: "Minha irmã ___ médica.", o: ["é", "está", "fica", "tem"], e: "Professions take ser, and no article: é médica.", r: "Ser = what someone or something is." },
        { t: "Ser · eventos", s: "A festa ___ na casa da Ana.", o: ["é", "está", "tem", "fica"], e: "Where an event takes place uses ser: o show é no Maracanã.", r: "Events → ser. Buildings and places → ficar." },
        { t: "Ficar", s: "O museu ___ perto da praça.", o: ["fica", "está", "é", "tem"], e: "Fixed locations of places: ficar is the most natural choice.", r: "Onde fica…? is how you ask for directions." },
        { t: "Estar", s: "Você ___ muito bonita hoje!", o: ["está", "é", "fica", "tem"], e: "Hoje signals how she looks today, so estar.", r: "Você é bonita = you are beautiful in general." },
        { t: "Ser · horas", s: "Que horas ___?", o: ["são", "é", "estão", "ficam"], e: "Time uses ser, in the plural for hours: são três horas. Singular only for one o'clock, noon and midnight: é uma hora.", r: "É meio-dia. São duas e meia." },
        { t: "Ser · eventos", s: "A reunião ___ às duas horas.", o: ["é", "está", "fica", "tem"], e: "When an event happens: ser.", r: "A aula é às 9h." },
        { t: "Ficar = tornar-se", s: "Ela ___ muito feliz com a notícia.", o: ["ficou", "foi", "estava", "era"], e: "Ficar means to become, to get: a change of state caused by something.", r: "Fiquei com fome, ficou tarde, ficamos nervosos." },
        { t: "Ser", s: "Ela ___ muito simpática; todo mundo gosta dela.", o: ["é", "está", "fica", "tem"], e: "Personality is a characteristic: ser.", r: "Está simpática hoje = she's being unusually nice." },
        { t: "Estar", s: "O café ___ pronto!", o: ["está", "é", "fica", "tem"], e: "Pronto describes a state: estar.", r: "Estar pronto, estar cansado, estar com fome." }
        ,{ t: "Ser × estar", s: "Ela ___ muito simpática hoje, não sei o que houve.", o: ["está", "é", "fica", "era"], e: "A departure from someone's usual self takes estar.", r: "Ela é simpática (always) / está simpática (today)." },
        { t: "Estar com", s: "Eu ___ fome.", o: ["estou com", "sou com", "tenho de", "estou de"], e: "Physical states use estar com: estar com fome, sede, sono, medo, pressa.", r: "English is hungry, Portuguese is with hunger." },
        { t: "Ficar = localização", s: "A padaria ___ na esquina.", o: ["fica", "está", "é de", "ficou"], e: "For a fixed location Brazilians prefer ficar.", r: "Onde fica o banheiro? — the standard way to ask." },
        { t: "Ser de = material", s: "A mesa ___ madeira.", o: ["é de", "está de", "fica de", "é da"], e: "Material, origin and ownership all take ser de.", r: "É de madeira, é de São Paulo, é do João." },
        { t: "Estar + particípio", s: "A loja ___ fechada no feriado.", o: ["estava", "era", "foi", "ficava"], e: "A temporary state takes estar; ser would describe the action of closing.", r: "Estava fechada (state) / foi fechada (someone closed it)." },
        { t: "Ficar = reação", s: "Ela ___ brava quando soube.", o: ["ficou", "foi", "esteve", "era"], e: "Ficar marks a change of state — became angry.", r: "Fiquei feliz, fiquei triste, fiquei sem palavras." }
      ],
      build: [
        { en: "Where is the bathroom?", a: ["Onde fica o banheiro", "Onde é o banheiro", "Onde está o banheiro"], x: ["tem", "a"] },
        { en: "I am tired today.", a: ["Eu estou cansado hoje", "Eu estou cansada hoje", "Hoje eu estou cansado", "Hoje eu estou cansada"], x: ["sou", "fico"] },
        { en: "My father is a teacher.", a: ["Meu pai é professor"], x: ["está", "um"] }
      ]
    },
    {
      id: "u6", title: "Futuro e condicional", en: "Will and would", icon: "→",
      tip: "In speech, the future is almost always ir + infinitivo: vou viajar. The simple future (viajarei) is for writing and formal speech. Fazer, dizer and trazer shorten in both tenses: farei, direi, trarei.",
      drill: { tenses: ["fut", "cond"], verbs: ["falar", "comprar", "comer", "vender", "partir", "decidir", "fazer", "dizer", "trazer", "ser", "estar", "ir", "ter", "poder", "sair", "vir"] },
      mc: [
        { t: "Futuro falado", s: "How do Brazilians usually say \"I'll travel next month\"?", o: ["Vou viajar mês que vem.", "Vou a viajar mês que vem.", "Vou de viajar mês que vem.", "Vou viajando mês que vem."], e: "Ir (presente) + infinitivo, with no preposition in between.", r: "Vou fazer, vamos ver, vai chover.", long: true },
        { t: "Condicional", s: "Se eu fosse você, eu ___ mais cedo.", o: ["sairia", "sairei", "saio", "saísse"], e: "The result of a hypothesis takes the futuro do pretérito.", r: "Se + imperfeito do subjuntivo → -ria." },
        { t: "Pedido educado", s: "Você ___ me ajudar com isso?", o: ["poderia", "pôde", "pudesse", "possa"], e: "The conditional softens requests: poderia, gostaria.", r: "Eu gostaria de um café = I'd like a coffee." },
        { t: "Futuro irregular", s: "No ano que vem, nós ___ dez anos de casados.", o: ["faremos", "fazeremos", "fizemos", "façamos"], e: "Fazer drops -ze- in the future: farei, fará, faremos, farão.", r: "Same for dizer (direi) and trazer (trarei)." },
        { t: "Futuro irregular", s: "Eles ___ a verdade amanhã.", o: ["dirão", "dizerão", "diriam", "disseram"], e: "Dizer in the future: direi, dirá, diremos, dirão.", r: "Fazer, dizer, trazer: drop the ze." },
        { t: "Discurso indireto", s: "Ele disse que ___ amanhã.", o: ["viria", "venha", "vier", "vem"], e: "Reported future from a past viewpoint uses the conditional.", r: "In casual speech: disse que vinha / disse que ia vir." },
        { t: "Condicional", s: "Eu ___ isso pra você, mas não tenho tempo.", o: ["faria", "farei", "fiz", "faço"], e: "What you would do under other conditions: futuro do pretérito.", r: "Faria, diria, traria." },
        { t: "Gostar", s: "Eu ___ de pedir a conta, por favor.", o: ["gostaria", "gostarei", "gosto", "gostava"], e: "Gostaria de… is the polite way to ask for something.", r: "Gostava de is also heard in casual speech." }
        ,{ t: "Futuro do presente", s: "Um dia nós ___ a verdade.", o: ["saberemos", "saberá", "saberíamos", "soubermos"], e: "Saber is regular in the future: saberei, saberá, saberemos, saberão.", r: "Only fazer, dizer and trazer are irregular: farei, direi, trarei." },
        { t: "Futuro irregular", s: "Eles ___ o relatório amanhã.", o: ["trarão", "trazerão", "trariam", "trouxeram"], e: "Trazer: trarei, trará, traremos, trarão.", r: "fazer→farei, dizer→direi, trazer→trarei." },
        { t: "Futuro falado", s: "Which is most natural in speech?", o: ["Vou ligar pra ela depois.", "Ligarei para ela depois.", "Vou ligarei pra ela.", "Irei ligar para ela depois."], e: "Brazilians use ir + infinitive for almost all spoken future. The synthetic future sounds written or formal.", r: "Vou fazer, vou ver, vou falar." },
        { t: "Condicional de probabilidade", s: "Ele ___ uns trinta anos na época.", o: ["teria", "terá", "tinha de", "tivesse"], e: "The conditional can express a guess about the past.", r: "Seriam umas dez horas. Ele teria uns trinta anos." },
        { t: "Futuro do pretérito", s: "Ela disse que ___ mais tarde.", o: ["ligaria", "ligará", "ligaria de", "ligasse"], e: "Reported speech shifts a future into the conditional: future-in-the-past.", r: "Disse que viria, disse que faria." },
        { t: "Se + condicional", s: "Se eu pudesse, ___ com você.", o: ["iria", "irei", "fosse", "vou"], e: "Imperfect subjunctive in the se-clause, conditional in the result.", r: "Se eu tivesse, compraria. Se eu fosse, falaria." },
        { t: "Futuro composto", s: "Até dezembro eu já ___ o curso.", o: ["terei terminado", "terminarei de", "tinha terminado", "terminaria"], e: "Ter in the future + particípio for something finished by a future point.", r: "Terei feito, terá chegado." },
        { t: "Ir no futuro", s: "Avoid the double ir: which is correct?", o: ["Vou ao Rio amanhã.", "Vou ir ao Rio amanhã.", "Irei ir ao Rio.", "Vou indo ao Rio amanhã."], e: "Never stack vou ir. Ir alone already carries the future.", r: "Vou ao Rio. Not vou ir." }
      ],
      build: [
        { en: "I would buy a house by the beach.", a: ["Eu compraria uma casa na praia"], x: ["comprarei", "em"] },
        { en: "It's going to rain tomorrow.", a: ["Vai chover amanhã", "Amanhã vai chover"], x: ["Está", "chove"] },
        { en: "Could you repeat that, please?", a: ["Você poderia repetir por favor", "Você pode repetir por favor"], x: ["pode", "repete"] }
      ]
    },
    {
      id: "u7", title: "Particípios e tempos compostos", en: "Have been, had done", icon: "◇",
      tip: "Ter + particípio. Tenho feito = I've been doing (lately, repeatedly). Tinha feito = I had done. Irregular participles: feito, dito, visto, vindo, posto, aberto, escrito.",
      drill: { tenses: ["part"], verbs: ["falar", "comprar", "comer", "beber", "vender", "partir", "decidir", "fazer", "dizer", "ver", "vir", "pôr", "abrir", "escrever", "ser", "estar", "ter", "ler", "dormir"] },
      mc: [
        { t: "Perfeito composto", s: "Ultimamente eu ___ muito.", o: ["tenho trabalhado", "trabalhei", "trabalharia", "trabalhara"], e: "Ter (presente) + particípio = something repeated or ongoing up to now.", r: "Ultimamente, nos últimos tempos → tenho + particípio." },
        { t: "Particípio irregular", s: "Eu já tinha ___ o jantar quando eles chegaram.", o: ["feito", "fazido", "fato", "fez"], e: "Fazer → feito.", r: "Tinha + particípio = had done." },
        { t: "Particípio irregular", s: "Ele tinha ___ tudo para a polícia.", o: ["dito", "dizido", "disse", "dita"], e: "Dizer → dito. With ter, the participle never changes.", r: "Tinha dito, tinha feito, tinha visto." },
        { t: "Voz passiva", s: "A porta foi ___ pelo vento.", o: ["aberta", "abrida", "aberto", "abriu"], e: "With ser (passive), the participle agrees with the subject: a porta → aberta.", r: "Ter + particípio: no agreement. Ser + particípio: agreement." },
        { t: "Voz passiva", s: "As cartas foram ___ à mão.", o: ["escritas", "escrevidas", "escrito", "escreveram"], e: "Escrever → escrito; feminine plural for as cartas.", r: "O livro foi escrito / as cartas foram escritas." },
        { t: "Particípio × gerúndio", s: "Eu tenho ___ mal ultimamente.", o: ["dormido", "dormindo", "dormi", "durmido"], e: "After ter, use the particípio (-ido), not the gerúndio (-indo).", r: "Estou dormindo = I'm sleeping. Tenho dormido = I've been sleeping." },
        { t: "Particípio irregular", s: "Você já tinha ___ esse filme?", o: ["visto", "vido", "vindo", "vista"], e: "Ver → visto. Vir → vindo. Easy to mix up.", r: "Visto (seen) × vindo (come)." },
        { t: "Particípio irregular", s: "Quem tinha ___ o livro na mesa?", o: ["posto", "pondo", "pusto", "pôs"], e: "Pôr → posto. Pondo is the gerúndio.", r: "Compounds follow it too: composto, proposto." }
        ,{ t: "Tenho feito", s: "Ultimamente eu ___ muito.", o: ["tenho trabalhado", "trabalhei", "tinha trabalhado", "trabalharia"], e: "Ter + particípio in Portuguese means a repeated recent action, not a single finished one.", r: "Tenho estudado = I have been studying lately. Not I studied." },
        { t: "Falso amigo", s: "English \"I have already eaten\" is normally:", o: ["Eu já comi.", "Eu tenho comido.", "Eu tinha comido.", "Eu terei comido."], e: "The simple perfeito covers the English present perfect. Tenho comido would mean I have been eating repeatedly.", r: "Já vi esse filme. Nunca fui ao Japão." },
        { t: "Mais-que-perfeito", s: "Quando cheguei, ela já ___.", o: ["tinha saído", "saiu", "tem saído", "sairia"], e: "Something finished before another past event: tinha + particípio.", r: "Tinha feito, tinha visto, já tinha ido." },
        { t: "Particípio irregular", s: "A carta foi ___ à mão.", o: ["escrita", "escrevida", "escrevido", "escrito"], e: "Escrever→escrito, agreeing with carta: escrita.", r: "feito, dito, visto, posto, aberto, escrito." },
        { t: "Gerúndio", s: "Ela ficou ___ a tarde toda.", o: ["estudando", "estudado", "a estudar", "estuda"], e: "Ficar + gerúndio describes a continuing action. Estudado is the participle.", r: "Brazil: estou fazendo. Portugal: estou a fazer." },
        { t: "Mais-que-perfeito simples", s: "Which is the literary form of tinha falado?", o: ["falara", "falaria", "falava", "falasse"], e: "The simple pluperfect (falara, fizera, vira) appears in literature; speech uses tinha + particípio.", r: "Rare but worth recognising when reading." },
        { t: "Particípio irregular", s: "A porta já estava ___ quando cheguei.", o: ["aberta", "abrida", "abrido", "aberto"], e: "Abrir→aberto, agreeing with porta: aberta.", r: "The participle agrees after ser and estar, never after ter." },
        { t: "Com ter não concorda", s: "Elas tinham ___ o trabalho.", o: ["terminado", "terminadas", "terminada", "terminados"], e: "After ter the participle never agrees — it stays in the -ado/-ido form.", r: "Tinham terminado. But: o trabalho foi terminado." }
      ],
      build: [
        { en: "We have been studying a lot.", a: ["Nós temos estudado muito", "A gente tem estudado muito"], x: ["estudamos", "tenho"] },
        { en: "I had already eaten.", a: ["Eu já tinha comido"], x: ["comi", "tenho"] }
      ]
    },
    {
      id: "u8", title: "Presente do subjuntivo", en: "Wishes, doubts, necessity", icon: "✦",
      tip: "Take the eu form of the present, drop the -o, and swap the vowel: falo → fale, como → coma, faço → faça. Seven verbs don't follow this: ser, estar, ir, dar, saber, querer, haver.",
      drill: { tenses: ["psub"], verbs: ["falar", "comprar", "comer", "beber", "partir", "decidir", "chegar", "ficar", "começar", "pagar", "ser", "estar", "ter", "ir", "fazer", "poder", "querer", "dizer", "trazer", "ver", "vir", "dar", "saber", "pôr", "sair", "dormir", "pedir", "ler"] },
      mc: [
        { t: "Esperança", s: "Espero que vocês ___ bem.", o: ["estejam", "estão", "estavam", "estarão"], e: "Espero que, quero que, tomara que trigger the presente do subjuntivo.", r: "Estar → esteja." },
        { t: "Talvez", s: "Talvez ela ___ hoje à noite.", o: ["venha", "vem", "vinha", "virá"], e: "Talvez before the verb takes the subjuntivo. Vir → venha.", r: "\"Ela vem, talvez\" uses the indicativo." },
        { t: "Necessidade", s: "É importante que todos ___ na hora.", o: ["cheguem", "chegam", "chegarão", "chegaram"], e: "É importante que, é bom que, é preciso que take the subjuntivo.", r: "Chegar → chegue: the u keeps the hard g." },
        { t: "Desejo", s: "Quero que você ___ feliz.", o: ["seja", "é", "fosse", "esteja"], e: "Quero que + subjuntivo. Ser → seja.", r: "Feliz in general → ser. Happy right now → estar." },
        { t: "Tomara que", s: "Tomara que não ___ amanhã!", o: ["chova", "chove", "choveu", "chover"], e: "Tomara que (let's hope) always takes the subjuntivo.", r: "Tomara! = I hope so!" },
        { t: "Dúvida", s: "Duvido que ele ___ a resposta.", o: ["saiba", "sabe", "sabia", "saber"], e: "Doubt triggers the subjuntivo. Saber → saiba.", r: "Duvido que, não acredito que, é possível que." },
        { t: "Pedido", s: "Peça que ele ___ cedo.", o: ["venha", "vem", "vir", "vinha"], e: "Pedir que + subjuntivo.", r: "With para, Brazilians use the infinitive: peça para ele vir cedo." },
        { t: "Ir", s: "É melhor que vocês ___ de táxi.", o: ["vão", "vá", "vamos", "irem"], e: "Ir in the subjuntivo: vá, vá, vamos, vão. The plural looks like the indicativo.", r: "Vá is singular only." },
        { t: "Opinião negativa", s: "Não acho que ela ___ razão.", o: ["tenha", "tem", "tinha", "tiver"], e: "Não acho que expresses doubt, so the subjuntivo.", r: "Acho que + indicativo. Não acho que + subjuntivo." },
        { t: "Opinião positiva", s: "Acho que ela ___ razão.", o: ["tem", "tenha", "tivesse", "tiver"], e: "Acho que states a belief, so the indicativo.", r: "Same with acredito que, penso que." },
        { t: "Embora", s: "Embora ___ caro, vale a pena.", o: ["seja", "é", "fosse", "for"], e: "Embora always takes the subjuntivo, in the present for present situations.", r: "Embora, mesmo que, ainda que → subjuntivo." }
      ],
      build: [
        { en: "I hope you like it.", a: ["Espero que você goste"], x: ["gosta", "gostar"] },
        { en: "Maybe it will rain.", a: ["Talvez chova"], x: ["chove", "vai"] },
        { en: "I want you to come.", a: ["Quero que você venha"], x: ["vem", "vir"] }
      ]
    },
    {
      id: "u9", title: "Imperfeito e futuro do subjuntivo", en: "If, when, as if", icon: "?",
      tip: "Both come from the eles form of the perfeito minus -ram: fizeram → fize- → fizesse / fizer. Se + imperfeito = unlikely (se eu tivesse). Se + futuro = real possibility (se eu tiver).",
      drill: { tenses: ["isub", "fsub"], verbs: ["falar", "comprar", "comer", "beber", "partir", "decidir", "ser", "estar", "ter", "ir", "fazer", "poder", "querer", "dizer", "trazer", "ver", "vir", "dar", "saber", "pôr"] },
      mc: [
        { t: "Hipótese", s: "Se eu ___ dinheiro, viajaria para o Nordeste.", o: ["tivesse", "tenho", "tiver", "tive"], e: "Hypothetical se pairs the imperfeito do subjuntivo with the conditional.", r: "Se + tivesse/fosse/pudesse → -ria." },
        { t: "Quando + futuro", s: "Quando você ___ em São Paulo, me liga!", o: ["chegar", "chega", "chegasse", "chegou"], e: "Quando about the future takes the futuro do subjuntivo. Regular verbs look like the infinitive.", r: "Quando eu puder, se você quiser, assim que ele souber." },
        { t: "Embora · passado", s: "Embora ___ cansado, ele foi à festa.", o: ["estivesse", "estava", "esteve", "estará"], e: "Embora + subjuntivo; with a past main verb, use the imperfeito.", r: "Embora esteja (present) / embora estivesse (past)." },
        { t: "Se + futuro", s: "Se você ___ tempo amanhã, a gente se encontra.", o: ["tiver", "tivesse", "teria", "tenha"], e: "A real possibility in the future: se + futuro do subjuntivo.", r: "Se tivesse = unlikely. Se tiver = a real option." },
        { t: "Hipótese", s: "Se eu ___, viajaria o mundo todo.", o: ["pudesse", "posso", "puder", "pude"], e: "Poder → puderam → pudesse.", r: "Pudesse, quisesse, soubesse, fizesse." },
        { t: "Ver × vir", s: "Quando vocês ___ a Maria, deem um abraço nela.", o: ["virem", "verem", "vissem", "veem"], e: "Ver → viram → virem. Verem is a very common mistake.", r: "Vir → vieram → vierem." },
        { t: "Fazer", s: "Se você ___ isso amanhã, me avisa.", o: ["fizer", "fazer", "fizesse", "faça"], e: "Fazer → fizeram → fizer.", r: "Se você fazer is heard but considered wrong." },
        { t: "Como se", s: "Ele falava como se ___ o dono da casa.", o: ["fosse", "era", "for", "seja"], e: "Como se always takes the imperfeito do subjuntivo.", r: "Como se nada tivesse acontecido." },
        { t: "Assim que", s: "Assim que eu ___, te conto.", o: ["souber", "saber", "soubesse", "saiba"], e: "Assim que about the future: futuro do subjuntivo. Saber → souberam → souber.", r: "Assim que = as soon as." },
        { t: "Desejo no passado", s: "Ela queria que eu ___ com ela.", o: ["fosse", "ir", "vá", "for"], e: "A wish in the past (queria que) takes the imperfeito do subjuntivo.", r: "Quero que você vá / Queria que você fosse." }
      ],
      build: [
        { en: "If I had time, I would go.", a: ["Se eu tivesse tempo eu iria", "Se eu tivesse tempo iria"], x: ["tiver", "vou"] },
        { en: "When I can, I'll call you.", a: ["Quando eu puder eu te ligo", "Quando eu puder te ligo"], x: ["posso", "pude"] },
        { en: "If you want, we can go.", a: ["Se você quiser a gente pode ir", "Se você quiser nós podemos ir"], x: ["quer", "quisesse"] }
      ]
    },
    {
      id: "u10", title: "Preposições e crase", en: "Little words, big rules", icon: "⌁",
      tip: "Prepositions merge with articles: em + o = no, de + a = da, por + o = pelo, a + a = à. Crase test: swap the noun for a masculine one. If you'd say ao, use à.",
      drill: null,
      mc: [
        { t: "Por", s: "Obrigado ___ ajuda!", o: ["pela", "para a", "na", "com a"], e: "Obrigado por is fixed. Por + a → pela.", r: "Pelo, pela, pelos, pelas." },
        { t: "Para", s: "Esse presente é ___ você.", o: ["para", "por", "de", "em"], e: "Para marks the recipient or destination.", r: "In speech: pra, pro, pros." },
        { t: "Por", s: "Na viagem, passamos ___ Salvador.", o: ["por", "para", "em", "a"], e: "Passar por = to go through or past.", r: "Fomos para Salvador = Salvador was the destination." },
        { t: "Em + o", s: "Eu moro ___ Rio de Janeiro.", o: ["no", "em o", "na", "ao"], e: "Em + o always contracts. O Rio is masculine.", r: "No Rio, na Bahia, em São Paulo." },
        { t: "Gostar de", s: "Eu gosto muito ___ praia.", o: ["da", "a", "na", "pela"], e: "Gostar always takes de. De + a → da.", r: "Gosto de você, gosto do Brasil." },
        { t: "Crase", s: "Vou ___ farmácia comprar remédio.", o: ["à", "a", "há", "á"], e: "Ir a + a farmácia → à.", r: "Test: vou ao mercado → vou à farmácia." },
        { t: "Há", s: "Moro aqui ___ dez anos.", o: ["há", "a", "à", "de"], e: "Elapsed time uses há (from haver). Faz works too: faz dez anos.", r: "Daqui a dez anos (future) uses a." },
        { t: "Transporte", s: "Vou para o trabalho ___ ônibus.", o: ["de", "no", "em", "com"], e: "Means of transport: de carro, de ônibus, de metrô, de bicicleta.", r: "Exception: a pé (on foot)." },
        { t: "Sem crase", s: "Ano que vem vou ___ São Paulo.", o: ["a", "à", "ao", "na"], e: "São Paulo takes no article (venho de São Paulo), so there's no crase.", r: "Venho da Bahia → vou à Bahia. Venho de Recife → vou a Recife." },
        { t: "Crase", s: "Estou ___ sua disposição.", o: ["à", "a", "há", "na"], e: "Estar à disposição: a + a disposição.", r: "Fixed expressions: às vezes, à noite, à vontade." },
        { t: "Crase · horas", s: "A aula começa ___ oito horas.", o: ["às", "as", "há", "nas"], e: "Specific times take crase: a + as oito horas → às oito.", r: "À uma hora, às duas, ao meio-dia." }
        ,{ t: "Crase", s: "Entreguei o relatório ___ diretora.", o: ["à", "a", "há", "as"], e: "Entregar a + a diretora. Preposition a meets feminine article a, so crase.", r: "Masculine? No crase: entreguei ao diretor." },
        { t: "Sem crase", s: "Vou ___ Portugal em maio.", o: ["a", "à", "na", "há"], e: "Portugal takes no article, so there is nothing for a to merge with.", r: "Vou a Portugal, but vou à França. Test: voltei DA França → à. Voltei DE Portugal → a." },
        { t: "Crase antes de pronome", s: "Falei sobre isso ___ ela ontem.", o: ["a", "à", "há", "pra"], e: "Crase never happens before a personal pronoun.", r: "No crase before ela, você, mim, Vossa Senhoria." },
        { t: "Por × para", s: "Fiz isso ___ você, não por obrigação.", o: ["por", "para", "pelo", "pra o"], e: "Por here means on your behalf / for your sake. Para would mark a destination or purpose.", r: "Fiz por você (for your sake). Comprei para você (to give you)." },
        { t: "Em + demonstrativo", s: "Moro ___ prédio ali.", o: ["naquele", "em aquele", "no aquele", "àquele"], e: "Em contracts with demonstratives: em + aquele = naquele.", r: "neste, nesse, naquele, nisso." },
        { t: "A + aquele", s: "Vou ___ restaurante que você indicou.", o: ["àquele", "aquele", "naquele", "a aquele"], e: "Ir a + aquele contracts and takes the grave accent: àquele.", r: "àquele, àquela, àquilo — crase survives on demonstratives." }
      ],
      build: [
        { en: "I'm going to the market by bus.", a: ["Vou ao mercado de ônibus"], x: ["no", "à"] },
        { en: "Thanks for the coffee!", a: ["Obrigado pelo café", "Obrigada pelo café"], x: ["para", "do"] },
        { en: "Sometimes I walk.", a: ["Às vezes eu vou a pé", "Às vezes vou a pé"], x: ["de", "As"] }
      ]
    },
    {
      id: "u11", title: "Gênero, plural e ortografia", en: "Forms and spelling", icon: "Aa",
      tip: "Most -a nouns are feminine, but words of Greek origin in -ma are masculine (o problema, o sistema). Plurals of -ão vary: mãos, pães, aviões. Learn them with the word.",
      drill: null,
      mc: [
        { t: "Gênero", s: "___ mapa do metrô está desatualizado.", o: ["O", "A", "Os", "As"], e: "Mapa is masculine despite the -a. So are problema, sistema, tema, dia, clima.", r: "Greek -ma words → masculine." },
        { t: "Gênero", s: "___ foto do casamento ficou linda.", o: ["A", "O", "Os", "As"], e: "Foto is short for fotografia, so it stays feminine.", r: "A foto, a moto, a tribo." },
        { t: "Gênero", s: "___ dia está lindo!", o: ["O", "A", "Os", "As"], e: "Dia is masculine: bom dia, o dia todo.", r: "Bom dia, not boa dia." },
        { t: "Plural -ão", s: "Comprei dois ___ na padaria.", o: ["pães", "pãos", "pãis", "pans"], e: "Pão → pães, like cão → cães, alemão → alemães.", r: "Mão → mãos. Avião → aviões." },
        { t: "Plural -ão", s: "Ele tem dois ___ mais velhos.", o: ["irmãos", "irmães", "irmões", "irmans"], e: "Irmão → irmãos.", r: "-ãos: irmãos, mãos, cidadãos." },
        { t: "Plural -el", s: "Os ___ da orla estavam lotados.", o: ["hotéis", "hoteis", "hotels", "hotéies"], e: "Stressed -el → -éis: hotel → hotéis, papel → papéis.", r: "-al → -ais: animal → animais." },
        { t: "Plural -l", s: "Os ___ da cidade são famosos.", o: ["museus", "museos", "museums", "museues"], e: "Museu ends in -u, so just add -s.", r: "Chapéu → chapéus. Céu → céus." },
        { t: "Mais × mas", s: "Quero ___ café, por favor.", o: ["mais", "mas", "más", "mau"], e: "Mais = more. Mas = but.", r: "Mais ↔ menos. Mas ↔ porém." },
        { t: "Mal × mau", s: "Ele dormiu ___ ontem à noite.", o: ["mal", "mau", "maus", "mals"], e: "Mal is the adverb (opposite of bem). Mau is the adjective (opposite of bom).", r: "Dormiu bem → dormiu mal." },
        { t: "Por que", s: "___ você não veio à aula?", o: ["Por que", "Porque", "Por quê", "Porquê"], e: "Questions start with por que (two words, no accent).", r: "Porque = because. Por quê = at the end. O porquê = the reason." },
        { t: "Há × a", s: "Ele saiu ___ cinco minutos.", o: ["há", "a", "à", "de"], e: "Time that has passed: há.", r: "Daqui a cinco minutos = five minutes from now." },
        { t: "Acordo ortográfico", s: "Eles ___ TV todo dia.", o: ["veem", "vêem", "vem", "vêm"], e: "Since the 2009 spelling reform, veem, leem and creem lost their circumflex.", r: "Vêm (they come) keeps it." }
        ,{ t: "Plural -ãe", s: "As ___ chegaram cedo.", o: ["mães", "mãos", "mães-", "mãs"], e: "Mãe pluralises to mães. Mão becomes mãos.", r: "Three -ão plurals: -ões (ações), -ães (pães), -ãos (mãos)." },
        { t: "Gênero traiçoeiro", s: "Preciso resolver ___ problema.", o: ["esse", "essa", "esta", "aquela"], e: "Problema is masculine despite the -a, like tema, sistema, poema.", r: "Greek -ema / -ama words are masculine: o problema, o cinema, o telefonema." },
        { t: "Plural composto", s: "Comprei duas ___.", o: ["couves-flores", "couve-flores", "couves-flor", "couve-flor"], e: "In a noun + noun compound, both parts pluralise.", r: "Segundas-feiras, guarda-chuvas (verb + noun: only the noun)." },
        { t: "Acentuação", s: "Which is spelled correctly?", o: ["Ele tem três irmãos.", "Ele tem tres irmãos.", "Ele têm três irmãos.", "Ele tem tres irmaos."], e: "Três carries an accent; tem is singular here, têm would be plural.", r: "Ele tem / eles têm. Três always accented." }
      ],
      build: [
        { en: "The problem is serious.", a: ["O problema é sério"], x: ["A", "sérios"] },
        { en: "I bought two breads.", a: ["Comprei dois pães", "Eu comprei dois pães"], x: ["pãos", "duas"] }
      ]
    },
    {
      id: "u12", title: "Português falado", en: "How Brazilians really talk", icon: "”",
      tip: "Spoken Brazilian Portuguese puts pronouns before the verb (me liga), uses a gente for we, ele/ela as objects (vi ele), and shortens words: tá, tô, pra, pro, cê.",
      drill: null,
      mc: [
        { t: "Pronome objeto", s: "Which sounds most natural in everyday Brazilian speech?", o: ["Eu vi ele ontem.", "Eu vi-o ontem.", "Eu ele vi ontem.", "Eu vi lhe ontem."], e: "Brazilians use ele/ela as objects in speech. Vi-o is European. Formal Brazilian writing uses eu o vi.", r: "Say \"vi ele\", write \"eu o vi\".", long: true },
        { t: "Colocação", s: "Which sounds natural at a Brazilian dinner table?", o: ["Me passa o sal?", "Passa-me o sal?", "Passa o sal-me?", "Passa o me sal?"], e: "Brazilians put object pronouns before the verb, even at the start of a sentence.", r: "Me liga, te amo, se cuida.", long: true },
        { t: "A gente", s: "A gente ___ muito na festa ontem.", o: ["se divertiu", "nos divertimos", "se divertimos", "nos divertiu"], e: "A gente means we but conjugates like ele, with se.", r: "Nós nos divertimos = same meaning, more formal." },
        { t: "Imperativo", s: "In standard Portuguese, with você: \"___ a porta, por favor.\"", o: ["Feche", "Fecha", "Fechou", "Fechar"], e: "The standard imperative for você uses the subjuntivo form: feche, abra, fale.", r: "In speech much of Brazil says fecha (the tu form). Both are heard." },
        { t: "Vocês", s: "How do Brazilians say \"you guys\"?", o: ["vocês", "vós", "tu", "a gente"], e: "Vocês is the only everyday plural you. Vós survives only in prayers and old texts.", r: "Vocês conjugates like eles: vocês falam." },
        { t: "Abreviação", s: "\"Tô cansado\" is spoken for…", o: ["Estou cansado", "Sou cansado", "Tenho cansado", "Fico cansado"], e: "Tô = estou, tá = está, tava = estava, tamo = estamos.", r: "Tá bom? = OK?" },
        { t: "Pra / pro", s: "\"Vou pro trabalho\" means…", o: ["Vou para o trabalho", "Vou por o trabalho", "Vou pelo trabalho", "Vou pra trabalhar"], e: "Pro = para + o. Pra = para (+ a).", r: "Pra mim, pro Rio, pras crianças." },
        { t: "Gíria", s: "A friend says \"Valeu!\" after you help. They mean…", o: ["Thanks!", "That was expensive!", "Hurry up!", "I'm sorry."], e: "Valeu is an informal thank-you, also used as goodbye.", r: "Valeu! — De nada! / Imagina!" },
        { t: "Despedida", s: "\"A gente se vê!\" means…", o: ["See you!", "We see people.", "People see us.", "Look at us!"], e: "A gente se vê = we'll see each other: see you around.", r: "Também: até mais, até logo, falou!" },
        { t: "Você → cê", s: "\"Cê vai?\" is spoken for…", o: ["Você vai?", "Se vai?", "Quem vai?", "Ele vai?"], e: "Cê is a spoken shortening of você, very common in São Paulo and Minas.", r: "Cê tá bem? = Você está bem?" }
        ,{ t: "Tá", s: "What does \"Tá bom\" come from?", o: ["Está bom", "Tudo bom", "Tá-se bem", "Está-bom"], e: "Está reduces to tá constantly in speech: tá bom, tá certo, tá ligado.", r: "estou→tô, está→tá, estamos→tamo." },
        { t: "Né", s: "Você vem amanhã, ___?", o: ["né", "não é verdade", "nao", "né que"], e: "Né is não é squeezed together, used as a tag question.", r: "Legal, né? Tá frio, né?" },
        { t: "Oxe / uai", s: "What do oxe and uai express?", o: ["Surprise", "Agreement", "Farewell", "Thanks"], e: "Regional interjections of surprise — oxe in the Northeast, uai in Minas.", r: "Both roughly mean huh? or well I never." },
        { t: "Pois não", s: "A waiter says \"Pois não?\" — what does it mean?", o: ["How can I help you?", "No, we don't have it.", "Please don't.", "Of course not."], e: "Despite the não, pois não is an offer of help in Brazil.", r: "Pois não? = Yes? Pois sim = yeah, right (sarcastic)." },
        { t: "Mano / cara", s: "Which is closest to \"dude\"?", o: ["cara", "carro", "coroa", "cara-de-pau"], e: "Cara and mano both work as dude or mate.", r: "E aí, cara? Fala, mano." },
        { t: "Dar um jeito", s: "\"A gente dá um jeito\" means:", o: ["We'll figure something out", "We'll give directions", "We'll behave", "We'll give up"], e: "Dar um jeito is to find a workaround — one of the most Brazilian phrases there is.", r: "Dá um jeitinho aí." }
      ],
      build: [
        { en: "Call me later!", a: ["Me liga mais tarde", "Me liga depois"], x: ["Liga-me", "de"] },
        { en: "We're going to the beach.", a: ["A gente vai pra praia", "A gente vai à praia"], x: ["vamos", "nós"] },
        { en: "Take care!", a: ["Se cuida"], x: ["Cuida-se", "te"] }
      ]
    }
    ,
    {
      id: "u13", title: "Imperativo", en: "Giving orders and asking for things", icon: "!",
      tip: "Brazilians almost always use the você form for commands, and in speech they often just use the present tense: fala aí, vem cá, me liga. The negative, though, always takes the subjunctive: não fale, não venha.",
      drill: { tenses: ["psub"], verbs: ["falar", "fazer", "ir", "vir", "ser", "ter", "dizer", "pôr", "sair", "dormir"] },
      mc: [
        { t: "Imperativo afirmativo", s: "___ aqui, por favor. (você)", o: ["Vem", "Vens", "Venha você", "Vir"], e: "In everyday Brazilian speech the affirmative command is just the present-tense ele/você form: vem, fala, faz.", r: "Spoken: vem cá. Written or formal: venha cá." },
        { t: "Imperativo negativo", s: "Não ___ isso agora.", o: ["faça", "faz", "fazes", "fazer"], e: "Negative commands always use the present subjunctive, never the present indicative.", r: "Faz isso → Não faça isso. The negative flips to the subjunctive every time." },
        { t: "Afirmativo × negativo", s: "___ com ela, mas não ___ sobre o preço.", o: ["Fala … fale", "Fale … fala", "Fala … fala", "Fale … fale"], e: "Spoken affirmative uses the indicative (fala); the negative must use the subjunctive (não fale).", r: "This split is the single most common imperative mistake." },
        { t: "Pedido educado", s: "___ me ajudar com isso?", o: ["Você poderia", "Você poderá", "Você pudesse", "Você pode de"], e: "Poderia (conditional) is the normal polite request. Pode is fine but blunter.", r: "Conditional = politeness: poderia, gostaria, seria." },
        { t: "Verbo irregular", s: "Não ___ embora ainda!", o: ["vá", "vai", "vais", "ir"], e: "Ir in the negative command takes the subjunctive: não vá.", r: "Vai embora → Não vá embora." },
        { t: "Nós = vamos", s: "___ almoçar agora?", o: ["Vamos", "Vão", "Vá", "Íamos"], e: "A suggestion including yourself uses vamos + infinitive.", r: "Vamos ver, vamos lá, vamos comer." },
        { t: "Pronome no imperativo", s: "___ o livro na mesa, por favor.", o: ["Põe", "Ponhe", "Pões", "Pondo"], e: "Pôr is irregular: the spoken command is põe; the formal one is ponha.", r: "Põe aqui. Não ponha aí." },
        { t: "Imperativo negativo", s: "Não ___ preocupado, vai dar tudo certo.", o: ["fique", "fica", "ficas", "ficar"], e: "Negative command → subjunctive: não fique.", r: "Fica calmo → Não fique nervoso." },
        { t: "Verbo irregular", s: "___ a verdade, por favor.", o: ["Diz", "Dize", "Dizes", "Dizer"], e: "The spoken command for dizer is diz; fala is even more common in Brazil.", r: "Formal written: diga a verdade." },
        { t: "Imperativo negativo", s: "Não ___ tarde, a gente começa às oito.", o: ["chegue", "chega", "chegas", "chegar"], e: "Negative → subjunctive, and chegar needs the u: chegue.", r: "-car/-gar/-çar change spelling in the subjunctive: fique, chegue, comece." }
      ],
      build: [
        { en: "Call me later.", a: ["Me liga mais tarde", "Liga para mim mais tarde"], x: ["ligue", "mim"] },
        { en: "Don't forget the keys.", a: ["Não esqueça as chaves"], x: ["esquece", "os"] },
        { en: "Let's go to the beach.", a: ["Vamos à praia", "Vamos para a praia"], x: ["vá", "na"] },
        { en: "Please wait here.", a: ["Espera aqui por favor", "Espere aqui por favor"], x: ["esperar", "ali"] }
      ]
    },
    {
      id: "u14", title: "Pronomes oblíquos", en: "Me, te, o, lhe — and where they go", icon: "↔",
      tip: "Brazil puts the pronoun before the verb, even at the start of a sentence: me liga, te vejo amanhã. The textbook rule that forbids this is Portuguese from Portugal, and almost nobody follows it in speech.",
      drill: null,
      mc: [
        { t: "Colocação", s: "___ vejo amanhã então!", o: ["Te", "Vejo-te", "Tu", "Lhe"], e: "Brazilians start sentences with the pronoun. Vejo-te is correct in Portugal, not in Brazilian speech.", r: "Te vejo, me liga, se cuida." },
        { t: "Objeto direto", s: "Comprei o livro e ___ li num dia.", o: ["o", "lhe", "ele", "se"], e: "A direct object (read WHAT) takes o/a/os/as.", r: "Direto: o, a. Indireto (to whom): lhe." },
        { t: "Objeto indireto", s: "Eu ___ disse a verdade ontem.", o: ["lhe", "o", "se", "a"], e: "Dizer something TO someone — the person is the indirect object, so lhe.", r: "Dizer a alguém → lhe. But Brazilians often just say: eu disse pra ele." },
        { t: "Falado × escrito", s: "Which is normal Brazilian speech?", o: ["Eu vi ele ontem.", "Eu vi-o ontem.", "Vi-lhe ontem.", "Eu o vi-lhe ontem."], e: "In speech Brazilians use the subject pronoun as an object: vi ele, vi ela. Vi-o is formal written Portuguese.", r: "Correct in writing: eu o vi. Normal in speech: eu vi ele." },
        { t: "Reflexivo", s: "A gente ___ divertiu muito na festa.", o: ["se", "nos", "lhe", "o"], e: "A gente takes third-person agreement, so the reflexive is se, not nos.", r: "A gente se diverte. Nós nos divertimos." },
        { t: "Com preposição", s: "Esse presente é para ___.", o: ["mim", "eu", "me", "migo"], e: "After a preposition Portuguese uses mim, ti, ele — never eu.", r: "Para mim, de mim, sem mim. But: para eu fazer (before a verb)." },
        { t: "Com preposição", s: "Você quer ir ___?", o: ["comigo", "com mim", "com eu", "me com"], e: "Com + mim contracts to comigo. Likewise contigo, conosco.", r: "Comigo, contigo, com ele, conosco, com vocês." },
        { t: "Para eu × para mim", s: "Ela trouxe o contrato para ___ assinar.", o: ["eu", "mim", "me", "comigo"], e: "When a verb follows, the pronoun is the subject of that verb: para eu assinar.", r: "Para mim + noun. Para eu + verb." },
        { t: "Posição", s: "Não ___ preocupe com isso.", o: ["se", "te", "lhe", "o"], e: "The reflexive matches você → se, and it sits between não and the verb.", r: "Não se preocupe. Não me diga!" },
        { t: "Reflexivo recíproco", s: "Nós ___ conhecemos na faculdade.", o: ["nos", "se", "nós", "lhe"], e: "Nós takes nos. Each one knew the other — a reciprocal action.", r: "Nós nos vimos, eles se falaram." }
        ,{ t: "Objeto direto na 3ª", s: "Pedi o arquivo e ela já ___ enviou.", o: ["o", "lhe", "ele", "se"], e: "Enviar WHAT — direct object, so o.", r: "In speech Brazilians would just say: ela já enviou." },
        { t: "Contração", s: "Entregaram o prêmio e ___ no mesmo dia.", o: ["deram-no", "deram-o", "deram-lhe", "deram ele"], e: "After a verb ending in -m, o becomes -no. Formal written Portuguese only.", r: "deram-no, fizeram-na, põem-nos." },
        { t: "Com infinitivo", s: "Ela veio ___ ontem à noite.", o: ["me ver", "ver-me", "me vendo", "ver eu"], e: "Brazilians put the pronoun before the infinitive.", r: "Veio me ver, quero te falar, vou me arrumar." },
        { t: "Se impessoal", s: "___ muito bem naquele restaurante.", o: ["Come-se", "Se come", "Comem-se", "Come-se o"], e: "Se with no stated subject means one eats / people eat.", r: "Vive-se bem aqui. Fala-se português." },
        { t: "Te × lhe", s: "Which is normal Brazilian speech?", o: ["Eu te falei isso ontem.", "Eu lhe falei isso ontem.", "Eu falei-te isso ontem.", "Eu te falei-lhe ontem."], e: "Brazilians mix você with te freely. Lhe sounds formal or regional.", r: "Te amo, te ligo, te vejo — standard spoken Brazilian." },
        { t: "Consigo", s: "Ele levou o documento ___.", o: ["consigo", "com si", "com se", "consigo mesmo o"], e: "Com + si contracts to consigo, used reflexively.", r: "comigo, contigo, consigo, conosco." }
      ],
      build: [
        { en: "I'll see you tomorrow.", a: ["Te vejo amanhã", "Eu te vejo amanhã"], x: ["vejo-te", "ontem"] },
        { en: "Can you call me tonight?", a: ["Você pode me ligar hoje à noite"], x: ["ligar-me", "ontem"] },
        { en: "This gift is for me.", a: ["Esse presente é para mim"], x: ["eu", "comigo"] },
        { en: "We met at university.", a: ["Nós nos conhecemos na faculdade", "A gente se conheceu na faculdade"], x: ["conhecemos", "no"] }
      ]
    },
    {
      id: "u15", title: "Regência", en: "Which preposition each verb takes", icon: "⇥",
      tip: "Some verbs demand a preposition that English does not, and getting it wrong is one of the clearest learner tells. Assistir a um filme, gostar de, precisar de, ir a. Brazilians relax several of these in speech, and this unit says which.",
      drill: null,
      mc: [
        { t: "Assistir", s: "Ontem eu assisti ___ um filme ótimo.", o: ["a", "—", "em", "para"], e: "Assistir meaning to watch takes a. Brazilians often drop it in speech, but it is the written standard.", r: "Assistir a um filme. Without a, assistir means to assist." },
        { t: "Gostar", s: "Ela gosta muito ___ música brasileira.", o: ["de", "a", "—", "com"], e: "Gostar always takes de. There is no version without it.", r: "Gosto de você. Gostei do filme (de + o)." },
        { t: "Precisar", s: "Eu preciso ___ sua ajuda.", o: ["da", "a", "em", "para"], e: "Precisar de + noun. De + a contracts to da.", r: "Preciso de tempo. Preciso de ajuda." },
        { t: "Ir a × ir para", s: "Vou ___ Bahia nas férias.", o: ["para a", "na", "em", "a na"], e: "Ir para suggests staying a while; ir a suggests a short trip. Brazilians say vou na praia in casual speech, but para or a is standard.", r: "Vou ao mercado (quick). Vou para a Bahia (a stay)." },
        { t: "Chegar", s: "O voo chegou ___ São Paulo às seis.", o: ["em", "a", "para", "na a"], e: "Brazilians say chegar em a city. Portugal says chegar a. Both appear in writing; em is the Brazilian norm.", r: "Cheguei em casa. Cheguei no trabalho." },
        { t: "Preferir", s: "Prefiro café ___ chá.", o: ["a", "que", "do que", "de"], e: "Formal regência is preferir algo a algo. Do que is extremely common in speech but non-standard.", r: "Prefiro X a Y." },
        { t: "Lembrar", s: "Você lembrou ___ trazer o documento?", o: ["de", "a", "—", "em"], e: "Lembrar de = to remember to. Lembrar alguém (no preposition) means to remind someone.", r: "Lembrei de você. Me lembra de ligar." },
        { t: "Casar", s: "Ela casou ___ um amigo meu.", o: ["com", "a", "de", "para"], e: "Casar com, like English marry... to? No: Portuguese uses com.", r: "Casei com ela. Namorar, though, takes no preposition." },
        { t: "Depender", s: "Tudo depende ___ tempo que a gente tiver.", o: ["do", "no", "ao", "pelo"], e: "Depender de. De + o contracts to do.", r: "Depende de você. Depende do clima." },
        { t: "Pagar", s: "Já paguei ___ conta.", o: ["a", "na", "pela a", "da"], e: "Pagar a conta — the thing paid takes no preposition. Pagar por means to pay in exchange for.", r: "Paguei a conta. Paguei pelo erro." }
        ,{ t: "Obedecer", s: "As crianças obedecem ___ pais.", o: ["aos", "os", "nos", "com os"], e: "Obedecer takes a — a + os contracts to aos.", r: "Obedecer a, desobedecer a." },
        { t: "Responder", s: "Ainda não respondi ___ e-mail dela.", o: ["ao", "o", "no", "pelo"], e: "Responder a alguma coisa. Responder o e-mail is common in speech but non-standard.", r: "Responder a uma pergunta, a uma carta." },
        { t: "Namorar", s: "Ele namora ___ há dois anos.", o: ["ela", "com ela", "de ela", "a ela"], e: "Namorar takes a direct object — no preposition, unlike English date with.", r: "Namorar alguém. But casar COM alguém." },
        { t: "Simpatizar", s: "Não simpatizei ___ ele desde o começo.", o: ["com", "a", "de", "em"], e: "Simpatizar com, antipatizar com. Never reflexive: not me simpatizei.", r: "Simpatizo com ela." },
        { t: "Implicar", s: "A mudança implica ___ novos custos.", o: ["—", "em", "a", "com"], e: "Implicar meaning to entail takes a direct object. Implicar com means to pick on someone.", r: "Implica mudanças. But: ele implica comigo." },
        { t: "Visar", s: "A medida visa ___ reduzir o trânsito.", o: ["a", "—", "em", "para"], e: "Visar meaning to aim at takes a. Visar with no preposition means to stamp or sign.", r: "Visa ao lucro. Visou o passaporte." }
      ],
      build: [
        { en: "I watched a movie yesterday.", a: ["Eu assisti a um filme ontem", "Assisti a um filme ontem"], x: ["em", "de"] },
        { en: "She likes Brazilian music.", a: ["Ela gosta de música brasileira"], x: ["a", "com"] },
        { en: "I need your help.", a: ["Eu preciso da sua ajuda", "Preciso da sua ajuda"], x: ["a", "para"] },
        { en: "It depends on the weather.", a: ["Depende do tempo"], x: ["no", "pelo"] }
      ]
    },
    {
      id: "u16", title: "Infinitivo pessoal", en: "The infinitive that conjugates", icon: "∞",
      tip: "Portuguese has something almost no other language does: an infinitive with endings. It appears when the infinitive has its own subject, different from the main verb's. É melhor vocês saírem cedo — vocês is doing the leaving, so the infinitive takes -em.",
      drill: { tenses: ["fsub"], verbs: ["falar", "comer", "partir", "fazer", "ser", "ter", "ir", "ver", "sair", "estar"] },
      mc: [
        { t: "Infinitivo pessoal", s: "É melhor vocês ___ cedo amanhã.", o: ["saírem", "sair", "saem", "saiam"], e: "The infinitive has its own subject (vocês), so it takes the personal ending -em.", r: "Endings: — / — / -mos / -em." },
        { t: "Sem sujeito próprio", s: "Eu preciso ___ mais cedo amanhã.", o: ["sair", "sairmos", "saírem", "saio"], e: "Here the subject of sair is the same eu that precisa, so the plain infinitive is correct.", r: "Same subject → plain infinitive. Different subject → personal." },
        { t: "Nós", s: "Antes de ___, vamos revisar tudo.", o: ["sairmos", "sair", "saímos", "saiamos"], e: "Antes de + personal infinitive with nós takes -mos.", r: "Antes de sairmos, depois de chegarmos." },
        { t: "Depois de", s: "Depois de vocês ___, a sala ficou vazia.", o: ["saírem", "sair", "saíram", "saiam"], e: "Vocês is the subject of the infinitive, so -em.", r: "Depois de eles chegarem." },
        { t: "Para", s: "Trouxe o contrato para vocês ___.", o: ["assinarem", "assinar", "assinam", "assinem"], e: "Para + a stated subject → personal infinitive.", r: "Para eu ver, para nós vermos, para eles verem." },
        { t: "É + adjetivo", s: "É importante nós ___ a verdade.", o: ["sabermos", "saber", "sabemos", "saibamos"], e: "É importante + nós as the subject of the infinitive → sabermos. (É importante que nós saibamos is also correct, with que.)", r: "Two ways: É importante nós sabermos / É importante que nós saibamos." },
        { t: "Confusão com o futuro do subjuntivo", s: "Quando vocês ___ o prédio, me avisem.", o: ["virem", "ver", "verem", "vejam"], e: "After quando this is the future subjunctive of ver: virem. It looks like the personal infinitive of vir, which is why it trips people.", r: "Ver → quando virem. Vir → quando vierem." },
        { t: "Regular -ar", s: "É bom vocês ___ com ela antes.", o: ["falarem", "falar", "falam", "falem"], e: "Vocês is the infinitive's subject → falarem.", r: "falar / falares / falar / falarmos / falarem." },
        { t: "Sem sujeito próprio", s: "Ela saiu sem ___ nada.", o: ["dizer", "dizerem", "dizermos", "disse"], e: "Ela is the subject of both verbs, so the plain infinitive stays.", r: "Only switch when the subjects differ." },
        { t: "Nós", s: "No caso de ___ atrasados, liga pra ela.", o: ["chegarmos", "chegar", "chegamos", "cheguemos"], e: "Nós is understood as the subject, so -mos.", r: "No caso de chegarmos, em vez de chegarmos." }
      ],
      build: [
        { en: "It's better for you all to leave early.", a: ["É melhor vocês saírem cedo"], x: ["sair", "saiam"] },
        { en: "Before we leave, let's check everything.", a: ["Antes de sairmos vamos conferir tudo"], x: ["sair", "saímos"] },
        { en: "I brought the contract for you to sign.", a: ["Trouxe o contrato para vocês assinarem"], x: ["assinar", "assinem"] },
        { en: "She left without saying anything.", a: ["Ela saiu sem dizer nada"], x: ["dizerem", "disse"] }
      ]
    }
    ,
    {
      id: "u17", title: "Pronomes relativos", en: "Que, quem, cujo, onde", icon: "⌘",
      tip: "Que does most of the work and covers people and things alike. Quem only appears after a preposition. Cujo means whose and agrees with the thing owned, never with the owner — and Brazilians avoid it in speech by rephrasing.",
      drill: null,
      mc: [
        { t: "Que", s: "O filme ___ eu vi ontem é brasileiro.", o: ["que", "quem", "cujo", "onde"], e: "Que is the default relative for both people and things, as subject or object.", r: "Que covers almost everything. Reach for the others only when que cannot work." },
        { t: "Preposição + quem", s: "A pessoa com ___ eu falei já saiu.", o: ["quem", "que", "qual", "cuja"], e: "After a preposition, use quem for people: com quem, para quem, de quem.", r: "Com quem, a quem, por quem — always people." },
        { t: "Cujo", s: "É o escritor ___ livros eu adoro.", o: ["cujos", "cujo", "que os", "de quem os"], e: "Cujo agrees with the thing owned (livros), not the owner. Plural masculine → cujos.", r: "Cujo = whose. It never takes an article after it." },
        { t: "Onde", s: "A cidade ___ eu nasci fica no interior.", o: ["onde", "que", "aonde", "cuja"], e: "Onde refers to a place where something is or happens.", r: "Onde = where (static). Aonde = to where, with verbs of motion." },
        { t: "Aonde", s: "Não sei ___ ela foi.", o: ["aonde", "onde", "que", "donde"], e: "Ir implies motion toward, so aonde (a + onde).", r: "Aonde você vai? Onde você está?" },
        { t: "Que × quem", s: "O menino ___ está ali é meu sobrinho.", o: ["que", "quem", "qual", "cujo"], e: "No preposition, so que — even though it refers to a person. Quem here would be wrong.", r: "Quem needs a preposition in front of it." },
        { t: "O que", s: "Não entendi ___ você disse.", o: ["o que", "que", "o qual", "cujo"], e: "When there is no noun to attach to, use o que (the thing that).", r: "O que = that which. Faça o que quiser." },
        { t: "Preposição + que", s: "Esse é o assunto ___ eu falei.", o: ["sobre o qual", "que", "cujo", "quem"], e: "With a preposition and a thing, use preposition + o qual (or simply sobre que in casual speech).", r: "Formal: o qual, a qual, os quais. Brazilians often rephrase instead." },
        { t: "Cujo concordância", s: "A empresa ___ sede fica em Recife cresceu muito.", o: ["cuja", "cujo", "cujas", "de quem a"], e: "Sede is feminine singular, so cuja — the owner (empresa) does not decide it.", r: "Cujo agrees with what comes AFTER it." },
        { t: "Falado", s: "Which is most natural in Brazilian speech?", o: ["O cara que eu falei com ele ontem.", "O cara com quem eu falei ontem.", "O cara cujo eu falei.", "O cara o qual falei."], e: "Both the first two are heard; the first is the very common spoken form that textbooks reject. The second is the standard one.", r: "Standard: com quem. Spoken shortcut: que ... com ele." }
        ,{ t: "Quantos", s: "Tenho três amigos, dois ___ moram fora.", o: ["dos quais", "que", "dos que", "cujos"], e: "After a quantity you need de + o qual: dois dos quais.", r: "Muitos dos quais, alguns dos quais." },
        { t: "Em que", s: "O dia ___ a gente se conheceu foi chuvoso.", o: ["em que", "que", "onde", "cujo"], e: "Time expressions take em que, not onde.", r: "O ano em que, o momento em que." },
        { t: "Quanto", s: "Leve ___ você quiser.", o: ["quanto", "que", "o qual", "cujo"], e: "Quanto works as a relative after tudo or on its own, meaning as much as.", r: "Tudo quanto você precisar." },
        { t: "O qual depois de preposição longa", s: "Esse é o motivo ___ ela saiu.", o: ["pelo qual", "que", "pelo que", "cujo"], e: "With a two-syllable preposition, standard Portuguese prefers o qual.", r: "pelo qual, para o qual, sem o qual." },
        { t: "Cujo com preposição", s: "O autor ___ obra eu falei chega amanhã.", o: ["de cuja", "cuja", "da cuja", "de que a"], e: "Falar DE, so the preposition sits before cuja: de cuja obra.", r: "The preposition belongs to the main verb, not to cujo." },
        { t: "Erro comum", s: "Which is standard?", o: ["A casa onde eu moro é azul.", "A casa aonde eu moro é azul.", "A casa que eu moro é azul.", "A casa cuja eu moro é azul."], e: "Morar is static, so onde. Aonde needs motion, and que without em is non-standard here.", r: "Onde = em que." }
      ],
      build: [
        { en: "The book that I bought is great.", a: ["O livro que eu comprei é ótimo"], x: ["quem", "cujo"] },
        { en: "The city where I was born is small.", a: ["A cidade onde eu nasci é pequena"], x: ["aonde", "que"] },
        { en: "The friend with whom I travelled lives here.", a: ["O amigo com quem eu viajei mora aqui"], x: ["que", "cujo"] },
        { en: "I didn't understand what she said.", a: ["Eu não entendi o que ela disse"], x: ["que", "qual"] }
      ]
    },
    {
      id: "u18", title: "Conjunções e conectivos", en: "Joining ideas together", icon: "&",
      tip: "These are what turn short sentences into real speech. A few take the subjunctive and that is the part worth memorising: embora, para que, a menos que, caso. Apesar de takes an infinitive instead.",
      drill: null,
      mc: [
        { t: "Concessiva", s: "___ esteja cansado, vou sair.", o: ["Embora eu", "Embora eu estou", "Apesar de eu", "Mesmo eu"], e: "Embora always takes the subjunctive: embora eu esteja.", r: "Embora, ainda que, mesmo que → subjuntivo." },
        { t: "Apesar de", s: "___ cansado, ele terminou o trabalho.", o: ["Apesar de estar", "Apesar de esteja", "Embora estar", "Apesar que está"], e: "Apesar de takes an infinitive or a noun, never a conjugated verb.", r: "Apesar de + infinitivo. Embora + subjuntivo. Same meaning, different grammar." },
        { t: "Porque × por que", s: "Não sei ___ ela não veio.", o: ["por que", "porque", "porquê", "por quê"], e: "Two words for the question (why), one word for the answer (because).", r: "Por que (pergunta) / porque (resposta) / por quê (fim de frase) / o porquê (substantivo)." },
        { t: "Final", s: "Falei devagar ___ todos entendessem.", o: ["para que", "para", "porque", "por que"], e: "Para que expresses purpose with a different subject, and takes the subjunctive.", r: "Para que + subjuntivo. Para + infinitivo when the subject is the same." },
        { t: "Adversativa", s: "Queria ir, ___ estou sem tempo.", o: ["mas", "porque", "portanto", "embora"], e: "Mas marks contrast. Porém and contudo are the formal equivalents.", r: "Mas = but. Mais = more. One letter, completely different word." },
        { t: "Conclusiva", s: "Choveu muito; ___, o jogo foi cancelado.", o: ["portanto", "porque", "embora", "apesar"], e: "Portanto introduces a consequence. Por isso and logo work too.", r: "Causa → porque. Consequência → portanto, por isso." },
        { t: "Condicional", s: "___ chover, a gente fica em casa.", o: ["Se", "Caso de", "Embora", "Apesar de"], e: "Se + future subjunctive for a real possibility: se chover.", r: "Se chover (futuro do subjuntivo). Se chovesse (hipótese)." },
        { t: "Caso", s: "___ você precise de ajuda, me avisa.", o: ["Caso", "Caso de", "Se precisar de", "Apesar de"], e: "Caso means if and takes the subjunctive directly, with no de.", r: "Caso + subjuntivo = se + subjuntivo, slightly more formal." },
        { t: "Temporal", s: "___ eu chegar, te ligo.", o: ["Assim que", "Assim que eu chego", "Logo que eu chego", "Enquanto eu chego"], e: "Assim que + future subjunctive for something still to happen.", r: "Quando, assim que, logo que, enquanto → futuro do subjuntivo for future events." },
        { t: "Explicativa", s: "Leva o guarda-chuva, ___ vai chover.", o: ["que", "para que", "embora", "apesar de"], e: "In speech que alone often carries because: leva, que vai chover.", r: "Vai com calma, que a estrada tá ruim." }
        ,{ t: "Proporcional", s: "___ o tempo passava, ficava mais fácil.", o: ["À medida que", "Na medida em que", "A medida que", "Na medida que"], e: "À medida que marks two things changing together. Na medida em que means because.", r: "À medida que = as. Na medida em que = insofar as." },
        { t: "Alternativa", s: "___ você vem, ___ me avisa.", o: ["Ou … ou", "Nem … nem", "Seja … ou", "Ou … nem"], e: "Ou ... ou presents two alternatives.", r: "Nem ... nem is the negative pair: nem veio nem avisou." },
        { t: "Comparativa", s: "Ele fala ___ se soubesse tudo.", o: ["como", "que", "assim", "conforme"], e: "Como se + imperfect subjunctive for a hypothetical comparison.", r: "Como se fosse, como se tivesse — always the past subjunctive." },
        { t: "Enquanto", s: "___ você cozinha, eu arrumo a mesa.", o: ["Enquanto", "Assim que", "Até que", "Desde que"], e: "Enquanto marks two things happening at once, with the indicative here.", r: "Enquanto + indicativo for simultaneity." },
        { t: "Desde que", s: "Eu vou, ___ você me dê carona.", o: ["desde que", "desde", "já que", "porque"], e: "Desde que meaning provided that takes the subjunctive.", r: "Desde que + subjuntivo = condition. Desde que + indicativo = since (time)." },
        { t: "Já que", s: "___ você já está aqui, me ajuda?", o: ["Já que", "Mesmo que", "Caso", "A não ser que"], e: "Já que gives a known reason and takes the indicative.", r: "Já que, uma vez que, visto que → indicativo." }
      ],
      build: [
        { en: "Although it's expensive, I'm going to buy it.", a: ["Embora seja caro eu vou comprar"], x: ["é", "apesar"] },
        { en: "I want to go, but I have no time.", a: ["Eu quero ir mas não tenho tempo"], x: ["mais", "porque"] },
        { en: "It rained, so we stayed home.", a: ["Choveu portanto a gente ficou em casa"], x: ["porque", "embora"] },
        { en: "Call me as soon as you arrive.", a: ["Me liga assim que você chegar"], x: ["chega", "quando"] }
      ]
    },
    {
      id: "u19", title: "Comparativo e superlativo", en: "More, less, best and worst", icon: "▲",
      tip: "Mais ... (do) que for comparisons, tão ... quanto for equality. Four adjectives refuse mais entirely: bom, mau, grande, pequeno become melhor, pior, maior, menor. Saying mais bom marks you instantly.",
      drill: null,
      mc: [
        { t: "Irregular", s: "Esse restaurante é ___ que o outro.", o: ["melhor", "mais bom", "mais melhor", "o melhor"], e: "Bom becomes melhor. Mais bom does not exist.", r: "bom→melhor, mau→pior, grande→maior, pequeno→menor." },
        { t: "Irregular", s: "O trânsito hoje está ___ do que ontem.", o: ["pior", "mais mau", "mais pior", "péssimo que"], e: "Mau and the adverb mal both become pior.", r: "Pior serves as both worse and worst." },
        { t: "Superioridade", s: "São Paulo é ___ Curitiba.", o: ["maior do que", "mais grande que", "maior que o", "a maior de"], e: "Grande → maior, and the comparison takes do que (or just que).", r: "Do que and que are both correct; do que is a little more formal." },
        { t: "Igualdade", s: "Ela fala inglês ___ eu.", o: ["tão bem quanto", "tão bem que", "mais bem que", "tanto bem como"], e: "Tão + adverb/adjective + quanto expresses equality.", r: "Tão + adjetivo. Tanto + substantivo ou verbo." },
        { t: "Tanto quanto", s: "Ele trabalha ___ você.", o: ["tanto quanto", "tão quanto", "tanto que", "mais tanto que"], e: "Modifying a verb takes tanto, not tão.", r: "Tão alto, mas trabalha tanto." },
        { t: "Superlativo relativo", s: "É ___ cidade do país.", o: ["a maior", "a mais grande", "a maior de", "mais maior"], e: "The superlative is just the article plus the comparative.", r: "O melhor, a maior, o pior, a menor." },
        { t: "Superlativo absoluto", s: "A prova foi ___.", o: ["dificílima", "mais difícil", "muito dificílima", "a dificílima"], e: "-íssimo (here dificílima) means extremely, with no comparison.", r: "Caríssimo, facílimo, ótimo, péssimo." },
        { t: "Formas próprias", s: "O filme não foi ruim, foi ___.", o: ["péssimo", "mais péssimo", "o pior de", "muito pior"], e: "Péssimo is the absolute superlative of mau/ruim; ótimo is bom's.", r: "bom→ótimo, mau→péssimo, grande→máximo, pequeno→mínimo." },
        { t: "Advérbio", s: "Ele cozinha ___ que o irmão.", o: ["melhor", "mais bem", "mais melhor", "tão bem"], e: "The adverb bem also becomes melhor in comparison.", r: "Faz bem → faz melhor. Faz mal → faz pior." },
        { t: "Do que × de", s: "Ela tem mais ___ trinta livros.", o: ["de", "do que", "que de", "than"], e: "Before a number use de, not do que.", r: "Mais de dez anos. Mais do que eu esperava." }
        ,{ t: "Superlativo irregular", s: "O resultado foi ___ do que a gente esperava.", o: ["melhor", "mais bom", "o melhor", "boníssimo"], e: "Bom → melhor in any comparison, with or without do que.", r: "Never mais bom, in any context." },
        { t: "-íssimo com mudança", s: "A viagem foi ___.", o: ["facílima", "facilíssima", "fácilíssima", "mais fácil"], e: "Fácil has an irregular absolute superlative: facílimo/facílima.", r: "fácil→facílimo, difícil→dificílimo, simples→simplíssimo." },
        { t: "Superlativo erudito", s: "Um amigo ___ me ajudou.", o: ["fidelíssimo", "fielíssimo", "mais fiel", "fielzíssimo"], e: "Fiel takes the learned form fidelíssimo, from the Latin stem.", r: "amigo→amicíssimo, nobre→nobilíssimo." },
        { t: "Tão × tanto", s: "Não sabia que era ___ longe.", o: ["tão", "tanto", "tamanho", "tanta"], e: "Tão modifies an adjective or adverb; tanto modifies a verb or noun.", r: "Tão longe. Anda tanto. Tanta gente." },
        { t: "Quanto × do que", s: "Ela é tão alta ___ o irmão.", o: ["quanto", "do que", "que", "como que"], e: "Equality takes quanto or como — never do que.", r: "Tão … quanto. Mais … do que." },
        { t: "Superlativo com de", s: "É o melhor restaurante ___ bairro.", o: ["do", "no", "pelo", "ao"], e: "A relative superlative takes de: o melhor do bairro.", r: "A maior do mundo, o pior da turma." }
      ],
      build: [
        { en: "This restaurant is better than that one.", a: ["Esse restaurante é melhor do que aquele", "Esse restaurante é melhor que aquele"], x: ["bom", "mais"] },
        { en: "She speaks English as well as I do.", a: ["Ela fala inglês tão bem quanto eu"], x: ["tanto", "que"] },
        { en: "It is the biggest city in the country.", a: ["É a maior cidade do país"], x: ["grande", "mais"] },
        { en: "The test was extremely difficult.", a: ["A prova foi dificílima"], x: ["muito", "difícil"] }
      ]
    },
    {
      id: "u20", title: "Concordância", en: "Agreement, and the verbs that refuse it", icon: "=",
      tip: "Most agreement is predictable. The traps are the impersonal verbs: há and faz meaning time or existence never go plural, however many things follow them. Há dois anos, faz dez minutos, havia muitas pessoas.",
      drill: null,
      mc: [
        { t: "Haver impessoal", s: "___ muitas pessoas na festa ontem.", o: ["Havia", "Haviam", "Tinham", "Houveram"], e: "Haver meaning to exist has no subject, so it stays singular no matter what follows.", r: "Havia muitas pessoas. Never haviam, in this sense." },
        { t: "Fazer impessoal", s: "___ dez anos que eu moro aqui.", o: ["Faz", "Fazem", "Fazia-se", "Fazendo"], e: "Fazer for elapsed time is also impersonal: faz dez anos.", r: "Faz dois dias, faz muito tempo. Always singular." },
        { t: "Ter × haver", s: "Which is normal Brazilian speech?", o: ["Tem muita gente aqui.", "Hão muita gente aqui.", "Têm muita gente aqui.", "Havem muita gente aqui."], e: "In speech Brazilians use ter for existence: tem gente. In writing, há.", r: "Tem = speech. Há = writing. Both stay singular." },
        { t: "A gente", s: "A gente ___ cedo amanhã.", o: ["sai", "saímos", "saem", "saia"], e: "A gente means we but conjugates as ele/ela.", r: "A gente vai, a gente foi, a gente é." },
        { t: "Coletivo", s: "A maioria dos alunos ___ a prova.", o: ["passou", "passaram-se", "passamos", "passem"], e: "With a maioria de + plural, singular agreement is the safer standard; plural is also accepted.", r: "A maioria passou. A maioria dos alunos passaram is tolerated." },
        { t: "Países no plural", s: "Os Estados Unidos ___ uma proposta.", o: ["fizeram", "fez", "faz", "fazem-se"], e: "A plural place name with an article takes a plural verb.", r: "Os Estados Unidos são. But: Minas Gerais é." },
        { t: "Concordância nominal", s: "Comprei uma camisa e uma calça ___.", o: ["brancas", "branca", "branco", "brancos"], e: "An adjective after two feminine nouns takes the feminine plural.", r: "Mixed genders → masculine plural: camisa e short brancos." },
        { t: "É proibido", s: "___ entrada de animais.", o: ["É proibida a", "É proibido a", "São proibidas", "É proibido"], e: "With the article present, the adjective agrees: é proibida a entrada. Without it, the fixed form stays: é proibido entrada.", r: "Same with é bom, é necessário: é bom a água / é boa a água." },
        { t: "Mais de um", s: "Mais de um candidato ___ a proposta.", o: ["aceitou", "aceitaram", "aceitou-se", "aceitam"], e: "Mais de um takes a singular verb, despite the meaning.", r: "Mais de um aluno faltou." },
        { t: "Porcentagem", s: "Cerca de 30% dos entrevistados ___ a ideia.", o: ["apoiaram", "apoiou", "apoia", "apoiaria-se"], e: "With a percentage the verb usually follows the noun after de — entrevistados, plural.", r: "30% dos alunos faltaram. 30% da turma faltou." }
        ,{ t: "Verbo antes do sujeito", s: "___ dois carros na garagem.", o: ["Existem", "Existe", "Há dois dos", "Tem dois dos"], e: "Existir is a normal verb with a real subject, so it agrees: existem carros. Haver would stay singular.", r: "Há dois carros / Existem dois carros. Both correct, different rules." },
        { t: "Um dos que", s: "Ele é um dos que ___ mais trabalham.", o: ["—", "o que", "mais que", "aquele que"], e: "Um dos que takes a plural verb: dos que trabalham, because the group does the working.", r: "Um dos que chegaram, uma das que falaram." },
        { t: "Sujeito composto", s: "O gerente e a equipe ___ o relatório.", o: ["aprovaram", "aprovou", "aprovaram-se", "aprova"], e: "Two subjects joined by e take a plural verb.", r: "João e Maria foram." },
        { t: "Anexo", s: "Seguem ___ as planilhas.", o: ["anexas", "anexo", "em anexo as", "anexados"], e: "Anexo is an adjective and agrees: planilhas anexas.", r: "Segue anexo o arquivo. Seguem anexas as fotos." },
        { t: "Meio", s: "Ela ficou ___ preocupada com isso.", o: ["meio", "meia", "meios", "a meia"], e: "Meio meaning somewhat is an adverb and never changes.", r: "Meio cansada, meio triste. But: meia hora." },
        { t: "Bastante", s: "Tinha ___ pessoas esperando.", o: ["bastantes", "bastante", "bastantemente", "bem bastante"], e: "Before a noun, bastante is an adjective and agrees: bastantes pessoas.", r: "Bastantes livros (many). Ela é bastante alta (adverb, invariable)." }
      ],
      build: [
        { en: "There were many people at the party.", a: ["Havia muitas pessoas na festa", "Tinha muita gente na festa"], x: ["haviam", "tinham"] },
        { en: "I have lived here for ten years.", a: ["Faz dez anos que eu moro aqui"], x: ["fazem", "fazia"] },
        { en: "We are leaving early tomorrow.", a: ["A gente sai cedo amanhã", "Nós saímos cedo amanhã"], x: ["saem", "saiam"] },
        { en: "Most of the students passed.", a: ["A maioria dos alunos passou"], x: ["passaram", "passamos"] }
      ]
    },
    {
      id: "u21", title: "Diminutivos e aumentativos", en: "Cafezinho, jeitinho, carrão", icon: "◦",
      tip: "The -inho ending is rarely about size. It softens, warms or hurries a sentence: um cafezinho is an invitation, rapidinho means right away, and jeitinho is an entire cultural concept. Learning this is learning to sound Brazilian.",
      drill: null,
      mc: [
        { t: "-zinho", s: "Vamos tomar um ___?", o: ["cafezinho", "cafeinho", "cafézinho", "cafinho"], e: "Words ending in a stressed vowel take -zinho: café → cafezinho.", r: "Stressed ending or -r/-s/-m/-nasal → -zinho. Otherwise -inho." },
        { t: "-inho", s: "Que ___ bonita!", o: ["casinha", "casazinha", "casinho", "caszinha"], e: "Casa ends in an unstressed vowel, which drops before -inha.", r: "casa→casinha, carro→carrinho, livro→livrinho." },
        { t: "Nasal", s: "Comprei um ___ na padaria.", o: ["pãozinho", "pãoinho", "panzinho", "pãzinho"], e: "Pão is nasal and stressed, so -zinho, keeping the tilde.", r: "pão→pãozinho, mão→mãozinha, irmão→irmãozinho." },
        { t: "Não é tamanho", s: "Espera só um ___, já vou.", o: ["pouquinho", "poucinho", "poucozinho", "pouquíssimo"], e: "Here the diminutive softens the wait rather than shrinking anything.", r: "Um pouquinho, rapidinho, agorinha — tone, not size." },
        { t: "Advérbio", s: "Faço isso ___, pode deixar.", o: ["rapidinho", "rapidozinho", "rapidamentinho", "rapidinhamente"], e: "Even adverbs take the diminutive in Brazil: rapidinho, cedinho, devagarinho.", r: "Cedinho = nice and early. Devagarinho = nice and slow." },
        { t: "Aumentativo", s: "Ele comprou um ___ novo.", o: ["carrão", "carraço", "carrinhão", "carrãozinho"], e: "-ão is the augmentative: carro → carrão, meaning big and impressive.", r: "mulherão, festão, problemão." },
        { t: "Aumentativo irregular", s: "Levei um ___ do meu chefe.", o: ["esporro", "esporrinho", "esporrão", "esporrozinho"], e: "Some augmentatives are their own words. Not every noun takes -ão predictably.", r: "Check the word exists before inventing one." },
        { t: "Plural", s: "As crianças ganharam dois ___.", o: ["bolinhos", "bolinhoses", "bolinzinhos", "bolosinhos"], e: "Form the diminutive, then pluralise it normally: bolinho → bolinhos.", r: "But pãozinho → pãezinhos: the base word pluralises inside." },
        { t: "Plural irregular", s: "Comprei dois ___ na padaria.", o: ["pãezinhos", "pãozinhos", "pãesinhos", "pãozinhoes"], e: "Pão → pães, so the diminutive plural is pãezinhos.", r: "The root pluralises first, then -zinhos." },
        { t: "Sentido", s: "What does jeitinho usually suggest?", o: ["An informal workaround", "A small direction", "A tiny road", "A polite greeting"], e: "Jeitinho names the Brazilian habit of finding an informal way around a rule.", r: "Dar um jeitinho — one of the most Brazilian phrases there is." }
        ,{ t: "-zinho com -r", s: "Ela me deu uma ___.", o: ["florzinha", "florinha", "flozinha", "flórzinha"], e: "Words ending in -r take -zinho: flor → florzinha.", r: "amor→amorzinho, mulher→mulherzinha." },
        { t: "-inho com perda de vogal", s: "Que ___ lindo!", o: ["livrinho", "livrozinho", "livrinhho", "livrinhos"], e: "Livro drops the final o before -inho.", r: "carro→carrinho, gato→gatinho, bolo→bolinho." },
        { t: "Nome próprio", s: "A gente chama ele de ___.", o: ["Joãozinho", "Joãoinho", "Joãzinho", "Joãosinho"], e: "Names take diminutives constantly in Brazil: Joãozinho, Mariazinha, Zezinho.", r: "Affection, not size." },
        { t: "Pejorativo", s: "Chamar alguém de \"advogadozinho\" é:", o: ["Depreciativo", "Carinhoso", "Formal", "Neutro"], e: "With a profession, the diminutive usually belittles.", r: "Tone decides: amorzinho is warm, advogadozinho is a dig." },
        { t: "-ão não aumentativo", s: "\"Ele é um gatão\" quer dizer:", o: ["Ele é muito atraente", "Ele tem um gato grande", "Ele é um gato velho", "Ele gosta de gatos"], e: "Gatão means good-looking, not a large cat.", r: "Gata/gatão = attractive. Common slang." },
        { t: "Dupla diminutivo", s: "Which exists in normal speech?", o: ["Pertinho", "Pertinhinho", "Pertozinho", "Pertinhozinho"], e: "Perto → pertinho. Portuguese does not stack diminutives.", r: "Pertinho daqui, cedinho, devagarinho." }
      ],
      build: [
        { en: "Let's have a little coffee.", a: ["Vamos tomar um cafezinho"], x: ["café", "cafeinho"] },
        { en: "Wait just a little bit.", a: ["Espera só um pouquinho"], x: ["pouco", "poucinho"] },
        { en: "He bought a huge car.", a: ["Ele comprou um carrão"], x: ["carrinho", "carro"] },
        { en: "I'll do it right away.", a: ["Eu faço isso rapidinho", "Faço isso rapidinho"], x: ["rápido", "devagar"] }
      ]
    }
    ,
    {
      id: "u22", title: "Voz passiva", en: "Was written, is sold, got stolen", icon: "⊂",
      tip: "Ser + particípio is the textbook passive and the participle agrees with the subject. But Brazilians dodge it constantly: roubaram meu celular is far more natural than meu celular foi roubado. Both belong in your head, for different registers.",
      drill: { tenses: ["part"], verbs: ["fazer", "dizer", "ver", "escrever", "abrir", "pagar", "falar", "vender", "partir"] },
      mc: [
        { t: "Ser + particípio", s: "A casa ___ no ano passado.", o: ["foi vendida", "foi vendido", "era vendida", "vendeu-se a"], e: "Ser + particípio, and the participle agrees with casa: vendida.", r: "O livro foi escrito. A carta foi escrita." },
        { t: "Concordância", s: "As propostas ___ pela diretoria.", o: ["foram aprovadas", "foi aprovada", "foram aprovado", "aprovaram-se as"], e: "Plural feminine subject → foram + aprovadas.", r: "The participle behaves like an adjective here." },
        { t: "Passiva sintética", s: "___ casas nesta rua.", o: ["Vendem-se", "Vende-se", "Se vende", "Vendem-se as"], e: "In the -se passive the verb agrees with the thing sold: casas is plural, so vendem-se.", r: "Vende-se carro. Vendem-se carros. The classic sign-painter mistake." },
        { t: "Passiva sintética", s: "___ um apartamento para alugar.", o: ["Procura-se", "Procuram-se", "Se procuram", "Procura-se um dos"], e: "Singular thing → singular verb: procura-se um apartamento.", r: "Agreement follows the noun, not the -se." },
        { t: "Ser × estar", s: "A porta ___ às oito, e agora ___ fechada.", o: ["foi fechada … está", "estava fechada … foi", "foi fechada … foi", "está fechada … está"], e: "Ser + particípio is the action; estar + particípio is the resulting state.", r: "Foi fechada = someone closed it. Está fechada = it is shut." },
        { t: "Agente da passiva", s: "O relatório foi escrito ___ equipe toda.", o: ["pela", "para a", "da", "a"], e: "The agent takes por: por + a contracts to pela.", r: "Escrito por mim, pelo João, pelas crianças." },
        { t: "Particípio duplo", s: "Eu já tinha ___ a conta quando ela chegou.", o: ["pagado", "pago", "pagou", "pagando"], e: "With ter the regular participle is the conservative choice; with ser or estar use the short one: a conta foi paga.", r: "Tinha pagado / foi pago. In speech Brazilians say tinha pago too." },
        { t: "Particípio duplo", s: "O prêmio foi ___ por ela.", o: ["ganho", "ganhado", "ganhou", "ganhando"], e: "With ser, use the short participle: ganho.", r: "ganhar→ganho, gastar→gasto, pagar→pago with ser/estar." },
        { t: "Falado", s: "Which is most natural in Brazilian speech?", o: ["Roubaram meu celular.", "Meu celular foi roubado por alguém.", "Foi roubado meu celular.", "Meu celular roubou-se."], e: "Brazilians prefer an active verb with an unstated subject over the passive.", r: "Me roubaram. Quebraram a janela. Falaram que..." },
        { t: "Tempo da passiva", s: "O resultado ___ amanhã.", o: ["será divulgado", "foi divulgado", "é divulgando", "seria divulgado"], e: "Keep the tense in ser: future → será divulgado.", r: "é feito / foi feito / será feito / seria feito." }
      ],
      build: [
        { en: "The house was sold last year.", a: ["A casa foi vendida no ano passado"], x: ["vendido", "era"] },
        { en: "Houses for sale on this street.", a: ["Vendem-se casas nesta rua"], x: ["vende-se", "casa"] },
        { en: "The door is closed.", a: ["A porta está fechada"], x: ["foi", "fechado"] },
        { en: "They stole my phone.", a: ["Roubaram meu celular"], x: ["foi", "roubado"] }
      ]
    },
    {
      id: "u23", title: "Pontuação", en: "Where the comma goes, and where it must not", icon: "،",
      tip: "One rule outranks the rest: never put a comma between a subject and its verb. After that, the comma that changes meaning is the one around a relative clause — os alunos que estudaram passaram says only some passed; os alunos, que estudaram, passaram says all of them did.",
      drill: null,
      mc: [
        { t: "Sujeito e verbo", s: "Which is correct?", o: ["Os alunos chegaram cedo.", "Os alunos, chegaram cedo.", "Os alunos chegaram, cedo.", "Os, alunos chegaram cedo."], e: "Never separate the subject from its verb with a comma, however long the subject is.", r: "The single most common comma error in Portuguese." },
        { t: "Adjunto deslocado", s: "___ eu fui ao mercado.", o: ["Ontem de manhã,", "Ontem de manhã", "Ontem, de manhã", "Ontem de, manhã"], e: "A time or place phrase moved to the front is marked off with a comma.", r: "Ontem, fui. But: Fui ontem." },
        { t: "Vocativo", s: "___ você pode me ajudar?", o: ["João,", "João", "João:", "João;"], e: "Addressing someone by name always takes a comma.", r: "Oi, Maria. Obrigado, gente." },
        { t: "Aposto", s: "São Paulo, ___, tem mais de onze milhões de habitantes.", o: ["a maior cidade do país,", "a maior cidade do país", "que a maior cidade,", "a maior cidade do país;"], e: "An explanatory apposition sits between two commas.", r: "Both commas, or neither. Never just one." },
        { t: "Oração restritiva", s: "Meaning: only the students who studied passed.", o: ["Os alunos que estudaram passaram.", "Os alunos, que estudaram, passaram.", "Os alunos que, estudaram passaram.", "Os alunos; que estudaram; passaram."], e: "No commas restricts the meaning to that subset.", r: "No commas = only those ones." },
        { t: "Oração explicativa", s: "Meaning: all the students studied, and all passed.", o: ["Os alunos, que estudaram, passaram.", "Os alunos que estudaram passaram.", "Os alunos que estudaram, passaram.", "Os alunos: que estudaram passaram."], e: "Commas turn the clause into extra information about all of them.", r: "Commas = an aside you could delete." },
        { t: "Antes de mas", s: "Eu queria ir ___ não deu tempo.", o: [", mas", "mas", "; mas", ": mas"], e: "Adversative conjunctions take a comma before them.", r: "Comma before mas, porém, contudo, todavia." },
        { t: "Enumeração", s: "Comprei pão ___ queijo e café.", o: [",", ";", ":", "e"], e: "Items in a list are separated by commas, with e before the last one.", r: "Portuguese normally omits the comma before the final e." },
        { t: "Dois-pontos", s: "Só falta uma coisa ___ sua assinatura.", o: [":", ",", ";", "—,"], e: "A colon introduces an explanation, a list or a quotation.", r: "Dois-pontos announce what follows." },
        { t: "Ponto e vírgula", s: "Uns preferem o mar ___ outros, a montanha.", o: [";", ",", ":", "."], e: "The semicolon separates balanced clauses, especially when commas already appear inside them.", r: "Longer than a comma, shorter than a full stop." }
        ,{ t: "Entre verbo e objeto", s: "Which is correct?", o: ["Comprei um carro novo.", "Comprei, um carro novo.", "Comprei um, carro novo.", "Comprei um carro, novo."], e: "No comma between a verb and its object either.", r: "Subject–verb–object: no commas inside that core." },
        { t: "Data e local", s: "___ 12 de maio de 2026.", o: ["São Paulo,", "São Paulo", "São Paulo:", "São Paulo;"], e: "A place before a date takes a comma.", r: "Recife, 3 de março de 2026." },
        { t: "Conjunção deslocada", s: "Ele estudou muito; ___, não passou.", o: ["no entanto", "no entanto que", "porém que", "mas que"], e: "A conjunctive adverb between clauses is fenced by punctuation on both sides.", r: "; no entanto, / ; portanto, / ; contudo," },
        { t: "Oração adverbial antes", s: "___ eu chegar, me liga.", o: ["Quando", "Quando,", ", quando", "Quando;"], e: "No comma after the conjunction itself. The comma comes after the whole clause: Quando eu chegar, me liga.", r: "The comma marks the end of the fronted clause, not the start." },
        { t: "E com sujeitos diferentes", s: "Ela saiu ___ ele ficou.", o: [", e", "e", "; e", ": e"], e: "When e joins clauses with different subjects, a comma is usual.", r: "Normally no comma before e — this is the exception." },
        { t: "Ponto final e abreviação", s: "Which is correct?", o: ["Chegou às 10h. Saiu às 12h.", "Chegou às 10hs. Saiu às 12hs.", "Chegou às 10 h.. Saiu", "Chegou às 10h; Saiu às 12h."], e: "Portuguese writes 10h with no plural s and no extra stop.", r: "10h, 30min, 5km — symbols never take an s." }
      ],
      build: [
        { en: "Yesterday, I went to the market.", a: ["Ontem eu fui ao mercado"], x: ["amanhã", "no"] },
        { en: "I wanted to go, but there was no time.", a: ["Eu queria ir mas não deu tempo"], x: ["porque", "mais"] },
        { en: "Maria, can you help me?", a: ["Maria você pode me ajudar"], x: ["ela", "ajudo"] },
        { en: "Only one thing is missing: your signature.", a: ["Só falta uma coisa a sua assinatura"], x: ["as", "assinaturas"] }
      ]
    },
    {
      id: "u24", title: "Palavras que confundem", en: "Há or a, senão or se não", icon: "⚠",
      tip: "These pairs sound identical and mean different things. The one that matters most day to day is há for time already passed and daqui a for time still to come: há dois anos versus daqui a dois anos.",
      drill: null,
      mc: [
        { t: "Há × a", s: "Eu moro aqui ___ três anos.", o: ["há", "a", "à", "ah"], e: "Há marks elapsed time — three years ago until now.", r: "Há = past. Daqui a = future." },
        { t: "Há × a", s: "A reunião é daqui ___ duas horas.", o: ["a", "há", "à", "as"], e: "Time still to come takes a, never há.", r: "Daqui a pouco. Daqui a uma semana." },
        { t: "Senão × se não", s: "Corre, ___ você perde o ônibus.", o: ["senão", "se não", "se nao", "sem não"], e: "Senão as one word means otherwise.", r: "Senão = otherwise. Se não = if not." },
        { t: "Senão × se não", s: "___ chover, a gente vai à praia.", o: ["Se não", "Senão", "Se-não", "Senão que"], e: "Here se and não are separate words: if it does not rain.", r: "Try replacing with otherwise — if it fails, use two words." },
        { t: "A fim de × afim", s: "Estudei muito ___ passar na prova.", o: ["a fim de", "afim de", "afim", "a fim"], e: "A fim de means in order to. Afim is an adjective meaning related.", r: "Tá a fim de sair? = Do you feel like going out?" },
        { t: "Em vez de", s: "___ reclamar, ele resolveu o problema.", o: ["Em vez de", "Ao em vez de", "Em vez que", "Invés de"], e: "Em vez de works for any substitution; ao invés de strictly means the opposite of.", r: "Em vez de is safe everywhere." },
        { t: "Demais × de mais", s: "Ela falou ___ na reunião.", o: ["demais", "de mais", "demais de", "a mais"], e: "Demais means too much. De mais is the opposite of de menos.", r: "Comeu demais. Não vejo nada de mais nisso." },
        { t: "Mal × mau", s: "Ele dormiu ___ essa noite.", o: ["mal", "mau", "mail", "mao"], e: "Mal is the adverb (opposite of bem); mau is the adjective (opposite of bom).", r: "Mal↔bem, mau↔bom. Swap in bem or bom to check." },
        { t: "Onde × aonde", s: "___ você vai com essa pressa?", o: ["Aonde", "Onde", "Donde", "Em onde"], e: "Verbs of motion take aonde.", r: "Aonde vai? Onde está?" },
        { t: "Tampouco × tão pouco", s: "Ele não veio, ___ avisou.", o: ["tampouco", "tão pouco", "tao pouco", "tampouco que"], e: "Tampouco means neither / nor did he.", r: "Tão pouco = so little. Dormi tão pouco." }
        ,{ t: "Acerca de × há cerca de", s: "Ele saiu ___ duas horas.", o: ["há cerca de", "acerca de", "a cerca de", "cerca de"], e: "Há cerca de = approximately that long ago. Acerca de = about (a topic).", r: "Falamos acerca do projeto. Saiu há cerca de duas horas." },
        { t: "Ao encontro × de encontro", s: "A proposta veio ___ nossos interesses.", o: ["ao encontro dos", "de encontro aos", "ao encontro aos", "de encontro dos"], e: "Ao encontro de = in line with. De encontro a = against.", r: "O carro foi de encontro ao muro (crashed into)." },
        { t: "Sessão × seção × cessão", s: "A ___ de cinema começa às oito.", o: ["sessão", "seção", "cessão", "secção"], e: "Sessão = a session or showing. Seção = a department. Cessão = a transfer.", r: "Sessão de cinema, seção de eletrônicos, cessão de direitos." },
        { t: "Ao invés × em vez", s: "Ele subiu ___ descer.", o: ["ao invés de", "em vez que", "invés de", "ao invés que"], e: "Ao invés de is for true opposites, which up and down are.", r: "Em vez de works anywhere; ao invés de only for opposites." },
        { t: "Haja × aja", s: "Espero que não ___ problemas.", o: ["haja", "aja", "haje", "haija"], e: "Haja is from haver (to exist); aja is from agir (to act).", r: "Haja paciência! Aja com calma." },
        { t: "Mas × mais", s: "Queria ficar ___ tempo, ___ preciso ir.", o: ["mais … mas", "mas … mais", "mais … mais", "mas … mas"], e: "Mais = more (quantity). Mas = but (contrast).", r: "One letter apart, opposite jobs." }
      ],
      build: [
        { en: "I have lived here for three years.", a: ["Eu moro aqui há três anos"], x: ["a", "à"] },
        { en: "The meeting is in two hours.", a: ["A reunião é daqui a duas horas"], x: ["há", "às"] },
        { en: "Run, otherwise you'll miss the bus.", a: ["Corre senão você perde o ônibus"], x: ["se", "não"] },
        { en: "He slept badly last night.", a: ["Ele dormiu mal essa noite"], x: ["mau", "bem"] }
      ]
    },
    {
      id: "u25", title: "Números, horas e datas", en: "Counting, telling time, writing dates", icon: "7",
      tip: "Two numbers agree with what they count: um/uma, dois/duas, and every hundred from duzentos up. Telling the time agrees too — é uma hora but são duas horas. And only the first of the month is an ordinal.",
      drill: null,
      mc: [
        { t: "Concordância", s: "Comprei ___ passagens.", o: ["duas", "dois", "duos", "duases"], e: "Dois has a feminine form: duas passagens.", r: "Um/uma and dois/duas agree. Three onwards do not." },
        { t: "Centenas", s: "Havia ___ pessoas no evento.", o: ["duzentas", "duzentos", "dois centos", "duzenta"], e: "From duzentos up, hundreds agree in gender: duzentas pessoas.", r: "Trezentas casas, quinhentas pessoas." },
        { t: "Cem × cento", s: "O ingresso custa ___ e vinte reais.", o: ["cento", "cem", "cens", "centos"], e: "Cem stands alone; cento appears before another number.", r: "Cem reais. Cento e dez reais." },
        { t: "Horas", s: "Agora ___ uma hora da tarde.", o: ["é", "são", "está", "tem"], e: "One o'clock is singular: é uma hora. Everything else is são.", r: "É uma. São duas. É meio-dia. É meia-noite." },
        { t: "Horas", s: "A aula começa ___ oito.", o: ["às", "as", "à", "a"], e: "Times take à/às — à uma, às oito.", r: "À uma hora, às duas horas." },
        { t: "Meia", s: "Vamos sair às seis e ___.", o: ["meia", "meio", "trinta minutos de", "metade"], e: "Half past is meia, agreeing with the feminine hora.", r: "Seis e meia. Also meia = 6 when reading phone numbers." },
        { t: "Data", s: "A festa é ___ de maio.", o: ["dia primeiro", "dia um", "dia primeira", "no um"], e: "Only the first of the month takes an ordinal: dia primeiro.", r: "Primeiro de maio, but dois de maio, quinze de maio." },
        { t: "Data", s: "Ela nasceu ___ de setembro de 1998.", o: ["em doze", "no doze", "ao doze", "em décimo segundo"], e: "Ordinary dates use cardinal numbers: doze de setembro.", r: "Say the number plainly, except for the first." },
        { t: "Ano", s: "Estamos em ___.", o: ["dois mil e vinte e seis", "dois mil vinte e seis", "vinte e vinte seis", "dois mil e vinte seis"], e: "Portuguese says the year in full, with e before the final part.", r: "Mil novecentos e noventa e oito." },
        { t: "Ordinais", s: "Ele ficou em ___ lugar.", o: ["terceiro", "três", "terceira", "tercero"], e: "Rankings take ordinals, agreeing with lugar (masculine).", r: "primeiro, segundo, terceiro, quarto, quinto, sexto." }
        ,{ t: "Milhão", s: "A cidade tem dois ___ de habitantes.", o: ["milhões", "milhão", "milhõs", "milhares"], e: "Milhão pluralises to milhões and keeps de before the noun.", r: "Um milhão de reais, dois milhões de pessoas." },
        { t: "Mil", s: "O carro custou ___ reais.", o: ["trinta mil", "trinta mis", "trinta milhares", "trinta mil de"], e: "Mil never pluralises and takes no de.", r: "Dois mil reais. But: dois milhões DE reais." },
        { t: "Meio-dia e meia", s: "A gente se encontra ao ___.", o: ["meio-dia e meia", "meio-dia e meio", "meia-dia e meia", "meio-dia e trinta de"], e: "Meia agrees with the understood hora, even after meio-dia.", r: "Meio-dia e meia. Meia-noite e meia." },
        { t: "Percentagem", s: "Houve um aumento de ___.", o: ["dez por cento", "dez porcento", "dez percento", "dez por centos"], e: "Por cento is two words and never pluralises.", r: "10%, lido dez por cento." },
        { t: "Numeral e substantivo", s: "Ele mora no ___ andar.", o: ["primeiro", "um", "primeira", "uno"], e: "Floors, centuries and kings take ordinals up to ten.", r: "Século XX = século vinte. Dom Pedro II = segundo." },
        { t: "Telefone", s: "Reading 3 6 6 2 aloud, Brazilians often say:", o: ["três meia meia dois", "três seis seis dois", "três sexta sexta dois", "três seis e seis dois"], e: "Meia is short for meia dúzia and avoids confusing seis with três on the phone.", r: "Meia = 6 when reading digits aloud." }
      ],
      build: [
        { en: "I bought two tickets.", a: ["Eu comprei duas passagens", "Comprei duas passagens"], x: ["dois", "passagem"] },
        { en: "It is one o'clock.", a: ["É uma hora"], x: ["são", "horas"] },
        { en: "The class starts at eight.", a: ["A aula começa às oito"], x: ["as", "à"] },
        { en: "The party is on the first of May.", a: ["A festa é dia primeiro de maio"], x: ["um", "primeira"] }
      ]
    }
  ];

  U.forEach((u, i) => {
    u.n = i + 1;
    u.mc.forEach((q, j) => (q.id = `${u.id}-m${j}`));
    u.build.forEach((q, j) => (q.id = `${u.id}-b${j}`));
  });
  root.PT_UNITS = U;
})(typeof window !== "undefined" ? window : globalThis);
