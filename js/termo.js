/* Termo — a five-letter Brazilian Portuguese word game.

   Original implementation. The guessing mechanic is the familiar one; the word
   list, scoring and accent handling are written for this app.

   Accents: you type without them (saude, aviao) and the board accepts it. The
   accented spelling is what appears on the tiles, which is the point — you
   learn where the accent sits by watching it land. */
(function (root) {
  "use strict";

  /* Everyday Brazilian vocabulary, not dictionary rarities. Accented spellings
     are stored accented on purpose: saúde, avião, praça. Every entry is checked
     for length at load, because miscounting an accented word is the easiest
     mistake to make here and it would quietly poison the game. */
  const WORDS = [
    "banho","carro","festa","livro","porta","verde","tempo","mundo","campo","vento",
    "noite","praia","cheio","claro","forte","jovem","leite","limpo","massa","mesmo",
    "morar","nunca","ontem","perto","pobre","queda","rapaz","risco","sabor","sonho",
    "tarde","terra","troca","vazio","viver","dente","chuva","calor","banco","bolsa",
    "braço","cabra","caixa","calma","canto","carta","chave","cinco","circo","cobra",
    "conta","corpo","costa","couro","dedos","dever","dizer","dobro","doido","donos",
    "dupla","duplo","entre","erros","falar","falta","fazer","febre","ferro","filho",
    "final","fogão","folha","fonte","fruta","fugir","fundo","ganso","gelar","gente",
    "gesto","globo","grama","grupo","guiar","hotel","igual","ilhas","jogar","junto",
    "justo","lados","lagoa","largo","lenta","letra","linha","lista","local","longe",
    "louco","lugar","macio","magro","maior","manhã","marca","medir","meias","menor",
    "mesas","metal","metro","minha","modos","molho","monte","morte","motor","mudar",
    "nariz","nervo","nobre","noiva","nomes","norte","notar","nuvem","obras","olhar",
    "ombro","ordem","ouvir","pacto","padre","parar","parte","passo","pasta","pedra",
    "peixe","perda","pesar","pilha","pinta","pista","plano","pleno","ponte","ponto",
    "praça","prato","prazo","preço","preso","prova","pulso","punho","quase","raiva",
    "ramos","reais","reino","relva","risos","ritmo","roupa","rumor","saber","saída",
    "salto","santo","saúde","selva","senha","sinal","solto","sorte","sucos","sujar",
    "surdo","tecla","telha","tenso","terço","teste","texto","tigre","tinta","tocar",
    "tomar","torre","trama","trens","trigo","tropa","turma","unhas","usado","valor",
    "vapor","vasto","velho","venda","verso","vidro","vinho","vista","vital","vivos",
    "volta","zebra","acaso","achar","ácido","adeus","agora","álbum","aluno","amigo",
    "andar","anjos","antes","areia","armas","arroz","assim","atual","avião","baixo",
    "balde","banda","barco","barro","beijo","belas","bicho","bolos","bomba","bonde",
    "breve","brisa","bruto","busca","cacau","irmão","sótão","órgão","herói","ímpar",
    "túnel","hífen","vírus","lápis","fácil","móvel","nível","razão","visão","união",
    "vagão","médio","sério","ideia","moeda","chefe","navio","porco"
  ].filter(w => w.length === 5 || w.normalize("NFC").length === 5);

  const plain = s => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

  /* Keep only genuine five-letter entries, de-duplicated by plain form. */
  const seen = new Set();
  const LIST = WORDS.filter(w => {
    const p = plain(w);
    if (p.length !== 5 || !/^[a-zç]+$/.test(plain(w)) || seen.has(p)) return false;
    seen.add(p);
    return true;
  });

  /* Deterministic per day, so every device shows the same word and reopening
     the app cannot reroll it. */
  function wordForDay(dayIndex) {
    return LIST[((dayIndex % LIST.length) + LIST.length) % LIST.length];
  }

  const isWord = guess => seen.has(plain(guess));

  /**
   * Score a guess against the answer.
   *
   * Two passes, which is the part naive versions get wrong: exact matches are
   * found and CONSUMED first, so a repeated letter is only marked present when
   * a copy of it is still unaccounted for. Guessing "casas" against "massa"
   * must not light both s's when only one remains unmatched.
   */
  function score(guess, answer) {
    const g = plain(guess).split(""), a = plain(answer).split("");
    const out = new Array(5).fill("absent");
    const pool = {};
    for (let i = 0; i < 5; i++) {
      if (g[i] === a[i]) out[i] = "correct";
      else pool[a[i]] = (pool[a[i]] || 0) + 1;
    }
    for (let i = 0; i < 5; i++) {
      if (out[i] === "correct") continue;
      if (pool[g[i]] > 0) { out[i] = "present"; pool[g[i]]--; }
    }
    return out;
  }

  /** Best-known state per letter across every guess so far, for the keyboard. */
  function keyStates(guesses, answer) {
    const rank = { absent: 0, present: 1, correct: 2 };
    const st = {};
    for (const g of guesses) {
      const sc = score(g, answer), p = plain(g);
      for (let i = 0; i < 5; i++) {
        const k = p[i];
        if (!(k in st) || rank[sc[i]] > rank[st[k]]) st[k] = sc[i];
      }
    }
    return st;
  }

  root.PT_TERMO = { LIST, wordForDay, isWord, score, plain, keyStates };
})(typeof window !== "undefined" ? window : globalThis);
