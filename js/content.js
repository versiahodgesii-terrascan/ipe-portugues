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
      ],
      build: [
        { en: "Call me later!", a: ["Me liga mais tarde", "Me liga depois"], x: ["Liga-me", "de"] },
        { en: "We're going to the beach.", a: ["A gente vai pra praia", "A gente vai à praia"], x: ["vamos", "nós"] },
        { en: "Take care!", a: ["Se cuida"], x: ["Cuida-se", "te"] }
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
