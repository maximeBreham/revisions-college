/* Questions de « Middle school is cool » (anglais) : séquence middle school / school.
 * Le vocabulaire (matières, fournitures, lieux, routine, Project 1) vient du cahier.
 * La grammaire (présent simple, ordre des mots) n'est pas dans le cahier : elle a été
 * écrite au niveau 6e d'après des cours en ligne recoupés (voir la page).
 * La page revisions/anglais-middle-school.html lit aussi ecrire.themes (listes et cartes)
 * et ordre.phrases (les mots à remettre dans l'ordre). */
(function () {
const { esc, shuffle } = Moteur;
const one = a => a[Math.floor(Math.random() * a.length)];
const tirer = fs => one(fs)();
const q = (cat, prompt, options, explain, extra) => Moteur.QCM({ cat, prompt, options: options.map(esc), correct: 0, explain: explain || "", ...extra });
/* saisie en anglais : sans majuscules, sans article, tirets et points ignorés */
const net = s => String(s).toLowerCase().replace(/[’']/g, "'").replace(/[.\-!?,]/g, " ").replace(/\s+/g, " ").trim()
  .replace(/^(a|an|the|some|my) /, "");

/* ===== Le vocabulaire du cahier =====
 * en : le mot anglais affiché ; fr : la traduction ; ok : autres façons justes de l'écrire */
const THEMES = {
  matieres: { nom: "Les matières", en: "School subjects", mots: [
    { en: "English", fr: "anglais" },
    { en: "French", fr: "français" },
    { en: "Science", fr: "sciences" },
    { en: "Maths", fr: "mathématiques", ok: ["math", "mathematics"], note: "Maths en anglais britannique, Math en américain." },
    { en: "Biology", fr: "SVT", note: "Biology = la biologie, c'est le plus proche des SVT." },
    { en: "Chemistry", fr: "physique-chimie", note: "Chemistry = la chimie. La physique se dit physics." },
    { en: "Art", fr: "arts plastiques" },
    { en: "Music", fr: "musique" },
    { en: "P.E.", fr: "EPS", ok: ["pe", "physical education", "p e"], note: "P.E. = Physical Education." },
    { en: "History", fr: "histoire" },
    { en: "Geography", fr: "géographie" },
    { en: "Social Studies", fr: "histoire-géo", note: "Social Studies regroupe history et geography." },
  ] },
  fournitures: { nom: "Les fournitures", en: "School supplies", mots: [
    { en: "tape", fr: "du scotch", ok: ["sticky tape"] },
    { en: "a backpack", fr: "un sac à dos", ok: ["back pack"] },
    { en: "a book", fr: "un livre" },
    { en: "a notebook", fr: "un cahier", ok: ["note book"] },
    { en: "a pen", fr: "un stylo" },
    { en: "a pencil", fr: "un crayon de papier" },
    { en: "a coloured pencil", fr: "un crayon de couleur", ok: ["colored pencil", "colour pencil", "color pencil"] },
    { en: "a pencil case", fr: "une trousse", ok: ["pencilcase"] },
    { en: "a pencil sharpener", fr: "un taille-crayon", ok: ["sharpener"] },
    { en: "a rubber", fr: "une gomme", ok: ["eraser"], note: "rubber en anglais britannique (UK), eraser en américain (US)." },
    { en: "a glue stick", fr: "un tube de colle", ok: ["gluestick"] },
    { en: "a highlighter", fr: "un surligneur" },
    { en: "scissors", fr: "des ciseaux", note: "Toujours au pluriel : the scissors are…" },
    { en: "a ruler", fr: "une règle" },
    { en: "a diary", fr: "un agenda", note: "Attention : diary veut aussi dire « journal intime »." },
  ] },
  lieux: { nom: "Les lieux", en: "Places in the school", mots: [
    { en: "the library", fr: "la bibliothèque", note: "Piège : library n'est pas une librairie (une librairie = a bookshop)." },
    { en: "the playground", fr: "la cour de récréation", ok: ["play ground"] },
    { en: "the staffroom", fr: "la salle des professeurs", ok: ["staff room"] },
    { en: "the toilets", fr: "les toilettes", ok: ["toilet"] },
    { en: "the classroom", fr: "la salle de classe", ok: ["class room"] },
    { en: "the computer lab", fr: "la salle informatique", ok: ["computer room"] },
    { en: "the gym", fr: "le gymnase", ok: ["gymnasium"] },
    { en: "the hall", fr: "le couloir", ok: ["hallway"] },
    { en: "the cafeteria", fr: "la cantine", ok: ["canteen"] },
  ] },
  college: { nom: "Project 1", en: "Middle school is cool", mots: [
    { en: "middle school", fr: "le collège" },
    { en: "a pupil", fr: "un(e) élève", ok: ["student"] },
    { en: "lockers", fr: "des casiers", ok: ["locker"] },
    { en: "trousers", fr: "un pantalon", note: "Toujours au pluriel : my trousers are blue." },
    { en: "a T-shirt", fr: "un tee-shirt", ok: ["tshirt", "t shirt", "tee shirt", "t shirts"] },
    { en: "trainers", fr: "des baskets", ok: ["trainer"] },
    { en: "flip-flops", fr: "des tongs", ok: ["flip flops", "flipflops"] },
  ] },
  routine: { nom: "La routine", en: "Daily routine", mots: [
    { en: "wake up", fr: "se réveiller" },
    { en: "get up", fr: "se lever" },
    { en: "have breakfast", fr: "prendre le petit déjeuner" },
    { en: "brush my teeth", fr: "me brosser les dents" },
    { en: "take a shower", fr: "prendre une douche" },
    { en: "comb my hair", fr: "me peigner les cheveux" },
    { en: "get dressed", fr: "s'habiller" },
    { en: "go to school", fr: "aller à l'école" },
  ] },
};
const TOUS = Object.values(THEMES).flatMap(t => t.mots);
const sans = s => s.replace(/^(a|an|the) /, "");

/* QCM de vocabulaire dans un thème : français → anglais ou anglais → français */
function vocabQ(cle) {
  const t = THEMES[cle], m = one(t.mots), autres = shuffle(t.mots.filter(x => x !== m)).slice(0, 3);
  const note = m.note ? " " + esc(m.note) : "";
  return Math.random() < .5
    ? Moteur.QCM({ cat: t.nom, prompt: `Comment dit-on <b>${esc(m.fr)}</b> en anglais ?`, options: [m, ...autres].map(x => esc(x.en)), correct: 0, explain: `${esc(m.fr)} = <b>${esc(m.en)}</b>.${note}` })
    : Moteur.QCM({ cat: t.nom, prompt: `Que veut dire <b>${esc(m.en)}</b> ?`, options: [m, ...autres].map(x => esc(x.fr)), correct: 0, explain: `${esc(m.en)} = <b>${esc(m.fr)}</b>.${note}` });
}

function matieres() {
  return tirer([
    () => vocabQ("matieres"),
    () => vocabQ("matieres"),
    () => q("Les matières", "Quelle phrase est bien écrite ?", ["I like English and French.", "I like english and french.", "i like English and French.", "I like English and french."], "En anglais, les langues prennent toujours une majuscule (English, French), et I aussi."),
    () => q("Les matières", "Comment dit-on « EPS » en anglais ?", ["P.E. (Physical Education)", "Sport", "Gym", "E.P.S."], "P.E. = Physical Education. Attention : the gym, c'est le gymnase, le lieu."),
  ]);
}
function fournitures() {
  return tirer([
    () => vocabQ("fournitures"),
    () => vocabQ("fournitures"),
    () => q("Les fournitures", "Une gomme se dit…", ["a rubber (UK) ou an eraser (US)", "a gum", "a glue", "a rubber (US) ou an eraser (UK)"], "rubber en anglais britannique, eraser en américain. On dit <b>an</b> eraser, car eraser commence par une voyelle."),
    () => q("Les fournitures", "Dans quoi range-t-on ses stylos et ses crayons ?", ["a pencil case", "a pencil sharpener", "a diary", "a glue stick"], "a pencil case = une trousse."),
    () => q("Les fournitures", "Avec quoi trace-t-on un trait droit ?", ["a ruler", "a rubber", "a highlighter", "scissors"], "a ruler = une règle."),
  ]);
}
function lieux() {
  return tirer([
    () => vocabQ("lieux"),
    () => vocabQ("lieux"),
    () => vocabQ("college"),
    () => q("Les lieux", "Où emprunte-t-on des livres ?", ["in the library", "in the staffroom", "in the cafeteria", "in the gym"], "the library = la bibliothèque. Piège : ce n'est pas une librairie !"),
    () => q("Les lieux", "Où mange-t-on le midi ?", ["in the cafeteria", "in the playground", "in the library", "in the hall"], "the cafeteria = la cantine."),
    () => q("Les lieux", "Où joue-t-on à la récréation ?", ["in the playground", "in the classroom", "in the staffroom", "in the computer lab"], "the playground = la cour de récréation."),
    () => q("Les lieux", "Où les professeurs se retrouvent-ils ?", ["in the staffroom", "in the classroom", "in the gym", "in the toilets"], "the staffroom = la salle des professeurs."),
    () => q("Les lieux", "Où range-t-on ses affaires au collège ?", ["in a locker", "in a library", "in a hall", "in a pupil"], "a locker = un casier."),
  ]);
}

/* Ordre de la routine du cahier (l'ordre du texte « My daily routine ») */
const ORDRE_ROUTINE = ["wake up", "get up", "get dressed", "have breakfast", "brush my teeth", "comb my hair", "go to school"];
function routine() {
  return tirer([
    () => vocabQ("routine"),
    () => vocabQ("routine"),
    () => q("La routine", "Le matin, on se réveille d'abord, puis on se lève. Quel est le bon ordre ?", ["wake up → get up", "get up → wake up", "get dressed → wake up", "go to school → wake up"], "wake up = se réveiller (on ouvre les yeux), get up = se lever (on sort du lit)."),
    () => { const i = Math.floor(Math.random() * 3), bon = ORDRE_ROUTINE.slice(i, i + 4); const f1 = [bon[1], bon[0], bon[2], bon[3]], f2 = [bon[3], bon[1], bon[2], bon[0]], f3 = [bon[0], bon[2], bon[3], bon[1]];
      return q("La routine", "Quel ordre est le plus logique pour une matinée ?", [bon, f1, f2, f3].map(x => x.join(" → ")), "On se réveille, on se lève, on s'habille, on prend le petit déjeuner, on se brosse les dents et on se peigne, puis on va à l'école."); },
    () => q("La routine", "Que fait-on en dernier le matin ?", ["go to school", "wake up", "get up", "have breakfast"], "go to school = aller à l'école."),
    () => q("La routine", "« Je me brosse les dents » se dit…", ["I brush my teeth.", "I comb my teeth.", "I brush my hair.", "I take my teeth."], "brush = brosser, teeth = les dents. comb my hair = me peigner les cheveux."),
    () => q("La routine", "« Je m'habille » se dit…", ["I get dressed.", "I get up.", "I take a dress.", "I dress up."], "get dressed = s'habiller. get up = se lever."),
  ]);
}

/* Écrire le mot anglais (tous les thèmes) */
ecrire.themes = THEMES;
function ecrire() {
  const m = one(TOUS);
  const bons = [m.en, ...(m.ok || [])].map(net);
  return Moteur.INPUT({ cat: "Écrire le mot", prompt: `Écris en anglais :<br><span style="font-weight:500">${esc(m.fr)}</span>`,
    fields: [{ mode: "text", w: "14em" }], answer: esc(m.en),
    check: v => bons.includes(net(v[0])),
    explain: " Les majuscules et les petits mots (a, an, the) ne comptent pas ici, mais l'orthographe oui." + (m.note ? " " + esc(m.note) : "") });
}

/* ===== Présent simple ===== */
const SUJETS = [
  { s: "I", p: "my", t: false }, { s: "You", p: "your", t: false }, { s: "We", p: "our", t: false }, { s: "They", p: "their", t: false },
  { s: "The pupils", p: "their", t: false },
  { s: "He", p: "his", t: true }, { s: "She", p: "her", t: true }, { s: "Tom", p: "his", t: true }, { s: "My sister", p: "her", t: true }, { s: "My brother", p: "his", t: true },
];
const VERBES = [
  { b: "wake up", s: "wakes up", r: "on ajoute -s", fin: () => "at 7 o'clock" },
  { b: "get up", s: "gets up", r: "on ajoute -s", fin: () => "at 7:05" },
  { b: "have", s: "has", r: "have devient has (verbe irrégulier)", fin: () => "breakfast at 7:15" },
  { b: "brush", s: "brushes", r: "verbe en -sh : on ajoute -es", fin: p => `${p} teeth` },
  { b: "take", s: "takes", r: "on ajoute -s", fin: () => "a shower" },
  { b: "comb", s: "combs", r: "on ajoute -s", fin: p => `${p} hair` },
  { b: "get", s: "gets", r: "on ajoute -s", fin: () => "dressed" },
  { b: "go", s: "goes", r: "verbe en -o : on ajoute -es", fin: () => "to school at 7:40" },
  { b: "watch", s: "watches", r: "verbe en -ch : on ajoute -es", fin: () => "TV after school" },
  { b: "do", s: "does", r: "verbe en -o : on ajoute -es", fin: p => `${p} homework` },
  { b: "like", s: "likes", r: "on ajoute -s", fin: () => "English" },
  { b: "play", s: "plays", r: "on ajoute -s", fin: () => "in the playground" },
];
const min = s => (s === "I" || s === "Tom") ? s : s.charAt(0).toLowerCase() + s.slice(1);
const tete = v => v.split(" ")[0];               // « wake up » → « wake »
const reste = v => v.split(" ").slice(1).join(" ");
const fautes = v => { const b = tete(v.b); return [...new Set([b + "s", b + "ing", tete(v.s), b])]; };

function present() {
  return tirer([
    // affirmatif : choisir la bonne forme
    () => { const su = one(SUJETS), v = one(VERBES); const bon = su.t ? tete(v.s) : tete(v.b);
      const opts = [bon, ...fautes(v).filter(x => x !== bon)].slice(0, 4);
      const phrase = `${su.s} ___ ${reste(v.b) ? reste(v.b) + " " : ""}${v.fin(su.p)}.`;
      return Moteur.QCM({ cat: "Présent simple", prompt: `Complète : <b>${esc(phrase)}</b><br><span class="muted small">verbe : ${esc(v.b)}</span>`, options: opts.map(esc), correct: 0, center: true, grid: true,
        explain: su.t ? `Avec ${esc(min(su.s))} (he / she / it), ${esc(v.r)} : <b>${esc(v.s)}</b>.` : `Avec ${esc(min(su.s))}, le verbe ne change pas : <b>${esc(v.b)}</b>. Le -s, c'est seulement pour he, she, it.` }); },
    // affirmatif : écrire la forme
    () => { const su = one(SUJETS.filter(x => x.t)), v = one(VERBES);
      const phrase = `${su.s} ___ ${reste(v.b) ? reste(v.b) + " " : ""}${v.fin(su.p)}.`;
      return Moteur.INPUT({ cat: "Présent simple", prompt: `Écris le verbe <b>${esc(tete(v.b))}</b> au présent simple :<br><span style="font-weight:500">${esc(phrase)}</span>`,
        fields: [{ mode: "text", w: "9em" }], answer: esc(tete(v.s)), check: x => net(x[0]) === tete(v.s), explain: ` Avec ${esc(min(su.s))}, ${esc(v.r)}.` }); },
    // négatif
    () => { const su = one(SUJETS), v = one(VERBES.filter(x => x.b !== "do")); const bon = su.t ? "doesn't" : "don't";
      const phrase = `${su.s} ___ ${v.b} ${v.fin(su.p)}.`;
      return Moteur.QCM({ cat: "Forme négative", prompt: `Complète à la forme négative :<br><b>${esc(phrase)}</b>`, options: [bon, su.t ? "don't" : "doesn't", "not", su.t ? "isn't" : "aren't"].map(esc), correct: 0, center: true, grid: true,
        explain: `Négatif : ${su.t ? "he / she / it + <b>doesn't</b>" : "I / you / we / they + <b>don't</b>"} + verbe sans -s.` }); },
    // négatif : le verbe reste sans -s
    () => { const su = one(SUJETS.filter(x => x.t)), v = one(VERBES);
      return Moteur.QCM({ cat: "Forme négative", prompt: `Complète : <b>${esc(`${su.s} doesn't ___ ${reste(v.b) ? reste(v.b) + " " : ""}${v.fin(su.p)}.`)}</b>`, options: [tete(v.b), tete(v.s), tete(v.b) + "ing", "to " + tete(v.b)].map(esc), correct: 0, center: true, grid: true,
        explain: `Après doesn't, le verbe <b>perd son -s</b> : le -s est déjà dans does. ${esc(su.s)} doesn't ${esc(v.b)}…` }); },
    // question
    () => { const su = one(SUJETS.filter(x => x.s !== "I")), v = one(VERBES.filter(x => x.b !== "do")); const bon = su.t ? "Does" : "Do";
      const phrase = `___ ${min(su.s)} ${v.b} ${v.fin(su.p)}?`;
      return Moteur.QCM({ cat: "Question", prompt: `Complète la question :<br><b>${esc(phrase)}</b>`, options: [bon, su.t ? "Do" : "Does", su.t ? "Is" : "Are", "Have"].map(esc), correct: 0, center: true, grid: true,
        explain: `Question : <b>${bon}</b> + sujet + verbe sans -s. ${su.t ? "Does avec he / she / it." : "Do avec I / you / we / they."}` }); },
    // question : verbe sans -s
    () => { const su = one(SUJETS.filter(x => x.t)), v = one(VERBES.filter(x => x.b !== "do"));
      return Moteur.QCM({ cat: "Question", prompt: `Quelle question est juste ?`, options: [
        `Does ${min(su.s)} ${v.b} ${v.fin(su.p)}?`, `Does ${min(su.s)} ${v.s} ${v.fin(su.p)}?`, `Do ${min(su.s)} ${v.b} ${v.fin(su.p)}?`, `${su.s} ${v.s} ${v.fin(su.p)}?`].map(esc), correct: 0,
        explain: "Avec he / she / it : <b>Does</b> + sujet + verbe <b>sans -s</b>." }); },
    // passer de I à she
    () => { const v = one(VERBES.filter(x => ["wake up", "brush", "comb", "have", "go", "take", "get"].includes(x.b))), su = one(SUJETS.filter(x => x.t));
      const je = `I ${v.b} ${v.fin("my")}.`, bon = `${su.s} ${v.s} ${v.fin(su.p)}.`;
      const f1 = `${su.s} ${v.b} ${v.fin(su.p)}.`, f2 = `${su.s} ${v.s} ${v.fin("my")}.`, f3 = `${su.s} ${tete(v.b)}s ${reste(v.b) ? reste(v.b) + " " : ""}${v.fin(su.p)}.`;
      const opts = [...new Set([bon, f1, f2, f3, `${su.s} is ${tete(v.b)}ing ${v.fin(su.p)}.`])].slice(0, 4);
      return Moteur.QCM({ cat: "Présent simple", prompt: `Récris avec <b>${esc(su.s)}</b> :<br><span style="font-weight:500">${esc(je)}</span>`, options: opts.map(esc), correct: 0,
        explain: `${esc(v.r)} : ${esc(v.s)}.${v.fin("my") !== v.fin("x") ? ` Et my devient ${esc(su.p)}.` : ""}` }); },
  ]);
}
present.verbes = VERBES;

/* ===== Ordre des mots ===== */
const PHRASES = [
  { ok: "I wake up at 7 am.", alt: ["At 7 am I wake up."], faux: ["I at 7 am wake up.", "Wake up I at 7 am."], why: "Sujet + verbe, puis le moment." },
  { ok: "I have a red pencil case.", faux: ["I have a pencil case red.", "I a red pencil case have."], why: "L'adjectif (red) se place avant le nom (pencil case)." },
  { ok: "We have P.E. in the gym on Tuesday.", alt: ["On Tuesday we have P.E. in the gym."], faux: ["We have P.E. on Tuesday in the gym.", "We in the gym have P.E. on Tuesday."], why: "Le lieu (in the gym) vient avant le temps (on Tuesday)." },
  { ok: "She brushes her teeth at 7:30.", alt: ["At 7:30 she brushes her teeth."], faux: ["She her teeth brushes at 7:30.", "Brushes she her teeth at 7:30."], why: "Sujet + verbe + complément, puis le moment." },
  { ok: "Tom reads a book in the library.", faux: ["Tom reads in the library a book.", "Tom a book reads in the library."], why: "Sujet + verbe + complément (a book), puis le lieu." },
  { ok: "There are lockers in the hall.", alt: ["In the hall there are lockers."], faux: ["There lockers are in the hall.", "Are there lockers in the hall."], why: "There are + le nom, puis le lieu." },
  { ok: "Do you like English?", faux: ["Like you English?", "Do like you English?"], why: "Question : Do + sujet + verbe." },
  { ok: "Does she take a shower in the morning?", faux: ["Takes she a shower in the morning?", "Does take she a shower in the morning?"], why: "Question : Does + sujet + verbe sans -s." },
  { ok: "My sister doesn't like maths.", faux: ["My sister likes not maths.", "My sister not likes maths."], why: "Négatif : sujet + doesn't + verbe sans -s." },
  { ok: "The pupils play in the big playground.", faux: ["The pupils play in the playground big.", "Play the pupils in the big playground."], why: "L'adjectif (big) se place avant le nom (playground)." },
  { ok: "I put my new ruler in my pencil case.", faux: ["I put my ruler new in my pencil case.", "I put in my pencil case my new ruler."], why: "Adjectif avant le nom, et le complément (my new ruler) avant le lieu." },
  { ok: "He goes to school at 7:40.", alt: ["At 7:40 he goes to school."], faux: ["He goes at 7:40 to school.", "He to school goes at 7:40."], why: "Le lieu (to school) vient avant le temps (at 7:40)." },
  { ok: "I can see a blue backpack.", faux: ["I can see a backpack blue.", "I see can a blue backpack."], why: "L'adjectif (blue) se place avant le nom (backpack)." },
  { ok: "I don't have a black pen.", faux: ["I have not a black pen.", "I don't have a pen black."], why: "Négatif : sujet + don't + verbe ; l'adjectif avant le nom." },
];
function ordre() {
  return tirer([
    () => { const p = one(PHRASES); return q("Ordre des mots", "Quelle phrase a les mots dans le bon ordre ?", [p.ok, ...p.faux], p.why); },
    () => q("Ordre des mots", "« un stylo noir » se dit…", ["a black pen", "a pen black", "a pens black", "black a pen"], "En anglais, l'adjectif se place <b>avant</b> le nom, et il ne prend jamais de -s."),
    () => q("Ordre des mots", "« deux grands casiers » se dit…", ["two big lockers", "two bigs lockers", "two lockers big", "two lockers bigs"], "L'adjectif se place avant le nom et reste <b>invariable</b> : big, jamais bigs."),
    () => q("Ordre des mots", "Dans une phrase, le lieu et le temps se rangent comment ?", ["Le lieu d'abord, puis le temps : in the gym on Tuesday", "Le temps d'abord, puis le lieu : on Tuesday in the gym", "N'importe comment", "Le lieu tout au début de la phrase"], "Sujet + verbe + complément + <b>lieu</b> + <b>temps</b>. On peut aussi mettre le temps tout au début : On Tuesday, we…"),
  ]);
}
ordre.phrases = PHRASES;

/* ===== Pièges : a / an, there is / are, dates, heures, pluriels ===== */
const ordinal = n => n + ((n % 100 >= 11 && n % 100 <= 13) ? "th" : ({ 1: "st", 2: "nd", 3: "rd" }[n % 10] || "th"));
const MOIS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const JOURS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
function pieges() {
  return tirer([
    () => { const n = one([1, 2, 3, 4, 10, 11, 12, 13, 14, 21, 22, 23, 30, 31]), bon = ordinal(n);
      const o = [bon, ...shuffle([n + "st", n + "nd", n + "rd", n + "th"].filter(x => x !== bon)).slice(0, 3)];
      return Moteur.QCM({ cat: "Les dates", prompt: `Complète la date : <b>${one(JOURS)}, ${one(MOIS)} ${n}___</b>`, options: o.map(esc), correct: 0, center: true, grid: true,
        explain: `1st, 2nd, 3rd, puis th : 4th, 10th… Mais 11th, 12th, 13th (jamais 11st). Et 21st, 22nd, 23rd. Ici : <b>${bon}</b>.` }); },
    () => q("Les dates", "Quelle date est bien écrite ?", ["Wednesday, October 14th", "wednesday, october 14th", "Wednesday, october 14th", "wednesday, October 14th"], "En anglais, les jours et les mois prennent toujours une majuscule."),
    () => { const x = one([["eraser", "an"], ["English book", "an"], ["apple", "an"], ["orange pencil case", "an"], ["ruler", "a"], ["highlighter", "a"], ["pencil", "a"], ["T-shirt", "a"], ["backpack", "a"], ["pupil", "a"], ["locker", "a"]]);
      return Moteur.QCM({ cat: "a ou an", prompt: `Complète : <b>I can see ___ ${esc(x[0])}.</b>`, options: [x[1], x[1] === "an" ? "a" : "an", "the", "rien"].map(esc), correct: 0, center: true, grid: true,
        explain: "<b>an</b> devant un son de voyelle (an eraser, an English book), <b>a</b> devant une consonne (a ruler, a highlighter). Dans le cahier, « I can see backpack » oublie le a." }); },
    () => { const x = one([["lockers in the hall", "are"], ["a library", "is"], ["two gyms", "are"], ["a computer lab", "is"], ["pupils in the playground", "are"], ["a big playground", "is"], ["trainers in my locker", "are"]]);
      return Moteur.QCM({ cat: "There is / are", prompt: `Complète : <b>There ___ ${esc(x[0])}.</b>`, options: [x[1], x[1] === "is" ? "are" : "is", "have", "has"].map(esc), correct: 0, center: true, grid: true,
        explain: "<b>There is</b> + un seul (a library), <b>there are</b> + plusieurs (lockers). Avec there are, le nom prend un -s : There are also <b>lockers</b>." }); },
    () => q("Les heures", "Comment écrire « 7 h 30 » dans une phrase en anglais ?", ["at 7:30", "at 7h30", "at 7.30h", "7h30 o'clock"], "En anglais, on n'écrit pas « h » : 7:30 (ou 7.30). Et on met <b>at</b> devant l'heure : I get up at 7:05."),
    () => q("Les heures", "« I wake up at 7 am » : que veut dire am ?", ["le matin", "l'après-midi", "le soir", "à peu près"], "<b>am</b> = le matin (avant midi), <b>pm</b> = l'après-midi et le soir. On écrit 7 am, pas 7h00 am."),
    () => q("Les pluriels", "Complète : My trousers ___ blue.", ["are", "is", "am", "be"], "trousers (un pantalon) est toujours au pluriel en anglais : my trousers <b>are</b>…"),
    () => q("Les pluriels", "Complète : The scissors ___ in my pencil case.", ["are", "is", "am", "has"], "scissors (des ciseaux) est toujours au pluriel : the scissors <b>are</b>…"),
    () => q("Les pluriels", "Quelle phrase est juste ?", ["There are also lockers.", "There are also locker.", "There is also lockers.", "There are also a locker."], "Avec there are, plusieurs casiers : lockers avec un -s."),
  ]);
}

Moteur.banque("anglais-middle-school", { matieres, fournitures, lieux, routine, ecrire, present, ordre, pieges });
})();
