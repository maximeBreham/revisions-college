/* Questions de « États de la matière, mélanges et dissolution » (physique-chimie).
 * D'après la feuille « Les mélanges / Exercices » et le « Bilan à retenir » du classeur.
 * Les propriétés des trois états ne sont pas sur ces feuilles : elles ont été complétées
 * d'après des cours en ligne recoupés (voir la page), au niveau 6e.
 * La page revisions/physique-etats-melanges-dissolution.html lit aussi vocabulaire.liste (les cartes),
 * etats.liste et melanges.liste (les tris) et salinite.mers (le tableau des mers). */
(function () {
const { esc, shuffle } = Moteur;
const one = a => a[Math.floor(Math.random() * a.length)];
const q = (cat, prompt, options, explain, extra) => Moteur.QCM({ cat, prompt, options: options.map(esc), correct: 0, explain: explain || "", ...extra });
const tirer = fs => one(fs)();
const net = s => String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[’']/g, " ").replace(/\s+/g, " ").trim();
const nombre = s => parseFloat(String(s).replace(",", ".").replace(/[^\d.]/g, ""));

/* ===== Vocabulaire : mot, définition (celle de la feuille), exemple ===== */
const VOCAB = [
  { m: "le soluté", d: "Le corps qui se dissout : la substance dissoute dans un liquide.", ex: "le sel dans l'eau salée", r: ["solute", "le solute"] },
  { m: "le solvant", d: "Le corps qui permet la dissolution : le liquide dans lequel on dissout une substance.", ex: "l'eau dans l'eau salée", r: ["solvant", "le solvant"] },
  { m: "une solution", d: "Le mélange entre un solvant et un soluté : l'ensemble formé du solvant et du soluté.", ex: "l'eau salée", r: ["solution", "une solution", "la solution"] },
  { m: "une solution aqueuse", d: "Une solution dans laquelle l'eau est le solvant.", ex: "l'eau sucrée", r: ["solution aqueuse", "une solution aqueuse"] },
  { m: "une solution saturée", d: "Une solution dans laquelle on ne peut pas dissoudre davantage de soluté.", ex: "le sel en trop reste au fond du verre", r: ["solution saturee", "une solution saturee", "saturee"] },
  { m: "la dissolution", d: "Ce que l'on réalise quand on dissout un solide dans un liquide.", ex: "le sucre qui se dissout dans le thé", r: ["dissolution", "la dissolution", "une dissolution"] },
  { m: "soluble", d: "Se dit d'un solide qui se dissout dans un liquide : il forme avec lui un mélange homogène.", ex: "le sel est soluble dans l'eau", r: ["soluble"] },
  { m: "insoluble", d: "Se dit d'un solide qui ne se dissout pas dans un liquide.", ex: "le sel est insoluble dans l'huile, le sable dans l'eau", r: ["insoluble"] },
  { m: "un mélange", d: "Ce qui est constitué de plusieurs espèces chimiques.", ex: "l'eau salée, l'huile + sel", r: ["melange", "un melange"] },
  { m: "un mélange homogène", d: "Un mélange dans lequel les constituants sont invisibles à l'œil nu.", ex: "l'eau salée", r: ["homogene", "melange homogene", "un melange homogene"] },
  { m: "un mélange hétérogène", d: "Un mélange dans lequel certains constituants sont visibles à l'œil nu.", ex: "l'huile + sel", r: ["heterogene", "melange heterogene", "un melange heterogene"] },
  { m: "la salinité", d: "La masse de sel dissous dans un litre d'eau, en grammes par litre (g/L).", ex: "32 g/L pour l'océan Atlantique", r: ["salinite", "la salinite"] },
  { m: "la solubilité", d: "La masse maximale d'un solide que l'on peut dissoudre dans un litre de liquide. Au-delà, la solution est saturée.", ex: "environ 360 g de sel dans 1 L d'eau", r: ["solubilite", "la solubilite"] },
  { m: "l'évaporation", d: "Le liquide passe à l'état de gaz : quand l'eau salée s'évapore, le sel reste au fond.", ex: "les marais salants", r: ["evaporation", "l evaporation", "une evaporation"] },
];

/* ===== Les trois états ===== */
const ETATS = [
  { nom: "Solide", d: "forme propre et volume propre", x: ["la glace", "un caillou", "le bois", "une gomme", "le sable", "le sel", "le sucre en poudre", "la farine", "une clé"] },
  { nom: "Liquide", d: "pas de forme propre, volume propre", x: ["l'eau", "l'huile", "le lait", "le vinaigre", "le jus d'orange", "le sirop"] },
  { nom: "Gaz", d: "ni forme ni volume propres", x: ["l'air", "la vapeur d'eau", "le dioxygène", "le dioxyde de carbone", "l'hélium d'un ballon"] },
];
const PROPRIETES = [
  // [question, bonne réponse, mauvaises, explication]
  ["Quel état de la matière a une forme propre ?", "L'état solide", ["L'état liquide", "L'état gazeux", "Aucun"], "Un solide garde sa forme : on peut le prendre entre les doigts."],
  ["Un liquide…", "prend la forme du récipient qui le contient", ["garde toujours la même forme", "occupe tout l'espace disponible", "se prend entre les doigts"], "Un liquide n'a pas de forme propre, mais il a un volume propre."],
  ["Un gaz…", "occupe tout l'espace disponible", ["a un volume propre", "a une forme propre", "a une surface plane et horizontale"], "Un gaz n'a ni forme ni volume propres : il remplit tout le récipient."],
  ["Au repos, la surface d'un liquide est…", "plane et horizontale", ["toujours penchée", "bombée", "en pointe"], "Même si on penche le verre, la surface libre de l'eau reste horizontale."],
  ["On verse 20 cL d'eau d'une bouteille dans un verre. Que se passe-t-il ?", "La forme change, le volume reste 20 cL", ["La forme et le volume changent", "Le volume change, pas la forme", "Rien ne change"], "Un liquide a un volume propre, mais pas de forme propre."],
  ["On bouche le bout d'une seringue pleine d'air et on pousse le piston. Que se passe-t-il ?", "Le piston s'enfonce : l'air se comprime", ["Le piston ne bouge pas du tout", "L'air sort par le piston", "L'air devient liquide"], "Un gaz est compressible : on peut réduire son volume."],
  ["On bouche le bout d'une seringue pleine d'eau et on pousse le piston. Que se passe-t-il ?", "Le piston ne s'enfonce presque pas", ["Le piston s'enfonce facilement", "L'eau devient un gaz", "L'eau se comprime de moitié"], "Un liquide ne se comprime (presque) pas, contrairement à un gaz."],
  ["Le sable prend la forme du seau. Pourtant, c'est un…", "solide, car chaque grain garde sa forme", ["liquide, car il coule", "gaz, car il remplit le seau", "mélange de liquide et de gaz"], "Le sable, le sel ou la farine sont des solides en grains (solides divisés) : chaque grain a sa forme propre."],
  ["Quel état n'a pas de volume propre ?", "L'état gazeux", ["L'état solide", "L'état liquide", "Les trois en ont un"], "Le solide et le liquide ont un volume propre ; le gaz occupe tout l'espace disponible."],
  ["Lequel peut-on saisir avec les doigts ?", "Un solide", ["Un liquide", "Un gaz", "Aucun des trois"], "Seul un solide (en un seul morceau) se prend entre les doigts."],
  ["Sous quels états trouve-t-on l'eau ?", "Glace (solide), eau (liquide), vapeur d'eau (gaz)", ["Seulement liquide", "Liquide et gaz seulement", "Glace et eau seulement"], "L'eau existe sous les trois états. La vapeur d'eau est un gaz invisible."],
  ["Un ballon de baudruche gonflé : l'air à l'intérieur…", "prend la forme du ballon et le remplit entièrement", ["reste en boule au milieu", "tombe au fond du ballon", "a une surface horizontale"], "Un gaz occupe tout l'espace qu'on lui donne."],
];

/* ===== Mélanges : homogène ou hétérogène (h = hétérogène) ===== */
const MELANGES = [
  { x: "l'eau salée", h: false, w: "Le sel dissous est invisible." },
  { x: "l'eau sucrée", h: false, w: "Le sucre dissous est invisible." },
  { x: "le sirop de menthe à l'eau", h: false, w: "On ne voit qu'un seul liquide vert." },
  { x: "l'eau de source", h: false, w: "Elle contient des minéraux dissous, invisibles." },
  { x: "le café sucré", h: false, w: "Le café et le sucre sont dissous." },
  { x: "le thé", h: false, w: "On ne distingue pas ses constituants." },
  { x: "le jus d'orange pressé avec pulpe", h: true, w: "On voit les morceaux de pulpe." },
  { x: "la vinaigrette (vinaigre + huile)", h: true, w: "On voit des gouttes d'huile et deux couches." },
  { x: "l'eau poivrée", h: true, w: "Le poivre ne se dissout pas : on voit les grains." },
  { x: "l'huile + sel", h: true, w: "Le sel ne se dissout pas dans l'huile : on voit les grains." },
  { x: "l'eau + sable", h: true, w: "Le sable est insoluble : il tombe au fond." },
  { x: "l'eau + huile", h: true, w: "On voit deux couches : l'huile flotte sur l'eau." },
  { x: "l'eau boueuse", h: true, w: "On voit des particules de terre." },
];

/* ===== Situations : solvant et soluté (feuille, exercice 2, puis nouvelles) ===== */
const SITUATIONS = [
  { t: "Anna prépare un café en versant une cuillère de café soluble et deux sucres dans une tasse d'eau chaude.", sv: "l'eau chaude", so: "le café soluble et le sucre", feuille: true },
  { t: "Olivia enlève son rouge à lèvres et son fard à paupières à l'aide d'un démaquillant.", sv: "le démaquillant", so: "le rouge à lèvres et le fard", feuille: true },
  { t: "Inès dissout un médicament anti-puces dans un bol de lait sucré pour que son chat accepte le traitement.", sv: "le lait", so: "le médicament (et le sucre)", feuille: true },
  { t: "Le sang amène aux muscles les sucres et l'oxygène dont ils ont besoin pour fonctionner.", sv: "le sang", so: "les sucres et l'oxygène", feuille: true, seulSolute: true },
  { t: "Un cuisinier verse une poignée de sel dans l'eau des pâtes.", sv: "l'eau", so: "le sel" },
  { t: "Tom met deux cuillères de chocolat en poudre dans son lait chaud et remue.", sv: "le lait", so: "le chocolat en poudre" },
  { t: "Papi laisse fondre un sucre dans son thé en remuant avec une cuillère.", sv: "le thé (l'eau)", so: "le sucre" },
  { t: "L'eau de mer contient du sel dissous.", sv: "l'eau", so: "le sel" },
];
const AUTRES_LIQUIDES = ["l'eau", "le lait", "l'huile", "le démaquillant", "le thé (l'eau)", "l'eau chaude", "le sang"];
const AUTRES_SOLIDES = ["le sel", "le sucre", "le café soluble et le sucre", "le chocolat en poudre", "le poivre", "le sable"];

/* ===== Salinité de quelques mers et océans (feuille, exercice 5) ===== */
const MERS = [
  { n: "la mer Rouge", s: 48 }, { n: "le Grand Lac Salé (États-Unis)", s: 150 }, { n: "l'océan Atlantique", s: 32 },
  { n: "la mer Méditerranée", s: 37 }, { n: "la mer Morte", s: 200 }, { n: "la mer Noire", s: 18 }, { n: "la mer Baltique", s: 8 },
];
const deN = n => n.startsWith("le ") ? "du " + n.slice(3) : "de " + n;
const Maj = s => s.charAt(0).toUpperCase() + s.slice(1);

/* ===== Générateurs ===== */
function etats() {
  return tirer([
    () => { const p = one(PROPRIETES); return q("Les 3 états", p[0], [p[1], ...p[2]], p[3]); },
    () => { const i = Math.floor(Math.random() * 3), x = one(ETATS[i].x);
      return Moteur.QCM({ cat: "Les 3 états", prompt: `Dans quel état est <b>${esc(x)}</b> (à température ordinaire) ?`, options: ETATS.map(e => e.nom), correct: i, keep: true, center: true,
        explain: `${esc(ETATS[i].nom)} : ${esc(ETATS[i].d)}.` }); },
    () => { const props = [["Forme propre", [true, false, false]], ["Volume propre", [true, true, false]], ["Prend la forme du récipient", [false, true, true]], ["Compressible", [false, false, true]]];
      const [p, v] = one(props); const bons = ETATS.filter((e, i) => v[i]).map(e => e.nom.toLowerCase());
      const opts = ["solide", "liquide", "gaz", "solide et liquide", "liquide et gaz", "solide, liquide et gaz"];
      const rep = bons.length === 1 ? bons[0] : bons.join(" et ");
      const mauvais = shuffle(opts.filter(o => o !== rep)).slice(0, 3);
      return q("Les 3 états", `« ${p} » : quel(s) état(s) ?`, [rep, ...mauvais], "Solide : forme et volume propres. Liquide : volume propre, prend la forme du récipient. Gaz : ni forme ni volume propres, compressible."); },
  ]);
}
etats.liste = ETATS;

function melanges() {
  return tirer([
    () => { const m = one(MELANGES);
      return Moteur.QCM({ cat: "Mélanges", prompt: `<b>${esc(Maj(m.x))}</b> : ce mélange est…`, options: ["homogène", "hétérogène"], correct: m.h ? 1 : 0, keep: true, center: true, grid: true,
        explain: esc(m.w) + (m.h ? " Certains constituants sont visibles à l'œil nu." : " Les constituants sont invisibles à l'œil nu.") }); },
    () => { const het = shuffle(MELANGES.filter(m => m.h)), hom = shuffle(MELANGES.filter(m => !m.h));
      const chercheHet = Math.random() < .5; const [bon, ...autres] = chercheHet ? [het[0], ...hom.slice(0, 3)] : [hom[0], ...het.slice(0, 3)];
      return q("Mélanges", `Lequel est un mélange <b>${chercheHet ? "hétérogène" : "homogène"}</b> ?`, [Maj(bon.x), ...autres.map(a => Maj(a.x))], esc(bon.w)); },
    () => q("Mélanges", "Un mélange hétérogène, c'est un mélange dans lequel…", ["certains constituants sont visibles à l'œil nu", "les constituants sont invisibles à l'œil nu", "il n'y a qu'une seule espèce chimique", "tout est liquide"], "Hétérogène : on voit plusieurs choses (huile + sel). Homogène : on ne voit qu'une seule chose (eau salée)."),
    () => q("Mélanges", "Un mélange homogène, c'est un mélange dans lequel…", ["les constituants sont invisibles à l'œil nu", "certains constituants sont visibles à l'œil nu", "il y a forcément de l'huile", "on voit deux couches"], "Homogène : on ne distingue pas les constituants (eau salée)."),
    () => q("Mélanges", "Un mélange est constitué…", ["de plusieurs espèces chimiques", "d'une seule espèce chimique", "seulement de liquides", "seulement d'eau"], "Bilan à retenir : un mélange est constitué de plusieurs espèces chimiques."),
  ]);
}
melanges.liste = MELANGES;

function vocabulaire() {
  return tirer([
    () => { const [v, ...a] = shuffle(VOCAB.filter(x => x.m !== "un mélange")); return q("Vocabulaire", `Quel mot correspond à cette définition ?<br><span style="font-weight:500">« ${esc(v.d)} »</span>`, [v.m, ...a.slice(0, 3).map(x => x.m)], `Exemple : ${esc(v.ex)}.`); },
    () => { const v = one(VOCAB.slice(0, 8)); const a = shuffle(VOCAB.slice(0, 8).filter(x => x !== v)).slice(0, 3);
      return q("Vocabulaire", `Que veut dire <b>${esc(v.m)}</b> ?`, [v.d, ...a.map(x => x.d)], `Exemple : ${esc(v.ex)}.`); },
    () => q("Vocabulaire", "Dans l'eau salée, quel est le solvant ?", ["L'eau", "Le sel", "L'eau salée", "Il n'y en a pas"], "Le solvant est le corps qui permet la dissolution : l'eau. Le sel est le soluté, l'eau salée est la solution."),
    () => q("Vocabulaire", "Dans l'eau salée, quel est le soluté ?", ["Le sel", "L'eau", "L'eau salée", "Le verre"], "Le soluté est le corps qui se dissout : le sel."),
    () => q("Vocabulaire", "Solution = …", ["solvant + soluté", "solvant − soluté", "soluté seul", "eau + huile"], "Une solution est le mélange d'un solvant et d'un soluté (eau + sel = eau salée)."),
    () => q("Vocabulaire", "Pourquoi l'eau sucrée est-elle une solution <b>aqueuse</b> ?", ["Parce que l'eau est le solvant", "Parce que le sucre est blanc", "Parce qu'elle est saturée", "Parce qu'elle est hétérogène"], "« Aqueuse » vient du latin aqua, l'eau : le solvant est l'eau."),
  ]);
}
vocabulaire.liste = VOCAB;

function solvantSolute() {
  const s = one(SITUATIONS); const solvant = !s.seulSolute && Math.random() < .5;
  const bon = solvant ? s.sv : s.so;
  const proche = (a, b) => a.includes(b) || b.includes(a);
  const pool = (solvant ? AUTRES_LIQUIDES : AUTRES_SOLIDES).filter(x => !proche(x, s.sv) && !proche(x, s.so));
  const opts = [bon, solvant ? s.so : s.sv, ...shuffle(pool).slice(0, 2)];
  return Moteur.QCM({ cat: "Solvant ou soluté", prompt: `${esc(s.t)}<br>Quel est le <b>${solvant ? "solvant" : "soluté"}</b> ?`, options: opts.map(o => esc(Maj(o))), correct: 0,
    explain: `Solvant : ${esc(s.sv)} (le liquide qui dissout). Soluté : ${esc(s.so)} (ce qui est dissous).${s.feuille ? " C'est une situation de la feuille d'exercices." : ""}` });
}
solvantSolute.situations = SITUATIONS;

function dissolution() {
  return tirer([
    () => q("Dissolution", "Pour dissoudre un solide dans l'eau, il faut…", ["agiter", "laisser reposer", "mettre au congélateur", "filtrer"], "On agite (on remue) pour que le solide se dissolve plus vite. Attention : sur la feuille, la bonne réponse était « agiter »."),
    () => q("Dissolution", "Lorsqu'on dissout un solide dans l'eau, on réalise une…", ["dissolution", "fusion", "évaporation", "solidification"], "Dissoudre → une dissolution. La fusion, c'est autre chose : un solide qui fond et devient liquide (la glace qui fond)."),
    () => q("Dissolution", "Lorsqu'un solide forme un mélange homogène avec l'eau, on dit qu'il est…", ["soluble dans l'eau", "insoluble dans l'eau", "saturé", "liquide"], "Il se dissout : il est soluble (comme le sel ou le sucre)."),
    () => q("Dissolution", "Le sable est…", ["insoluble dans l'eau", "soluble dans l'eau", "un liquide", "un gaz"], "Le sable ne se dissout pas : il reste visible au fond de l'eau."),
    () => q("Dissolution", "Le sel se dissout dans l'eau mais pas dans l'huile. Le sel est donc…", ["soluble dans l'eau et insoluble dans l'huile", "insoluble dans l'eau et soluble dans l'huile", "soluble dans les deux", "insoluble dans les deux"], "Un même solide peut être soluble dans un liquide et insoluble dans un autre."),
    () => q("Dissolution", "Quand le sel se dissout dans l'eau, il…", ["ne disparaît pas : il se disperse dans l'eau", "disparaît complètement", "se transforme en eau", "devient un gaz"], "Bilan à retenir : le sel ne disparaît pas, il se disperse. D'ailleurs, l'eau a un goût salé."),
    () => q("Dissolution", "Comment récupérer le sel dissous dans de l'eau salée ?", ["En faisant évaporer l'eau", "Avec une passoire", "Avec un filtre à café", "En agitant très fort"], "Quand l'eau s'évapore, le sel reste au fond : c'est ce qu'on fait dans les marais salants. Le sel dissous passe à travers une passoire et même à travers un filtre."),
    () => q("Dissolution", "On ajoute encore et encore du sel dans un verre d'eau. À la fin, le sel reste au fond même en agitant. La solution est…", ["saturée", "aqueuse et vide", "hétérogène dès le début", "évaporée"], "On ne peut plus dissoudre davantage de soluté : la solution est saturée."),
    () => q("Dissolution", "Quelle différence entre la salinité et la solubilité ?", ["Salinité : le sel qu'il y a dans 1 L d'eau. Solubilité : le maximum que l'on peut dissoudre dans 1 L.", "C'est la même chose", "Salinité : le maximum possible. Solubilité : ce qu'il y a vraiment.", "La salinité concerne le sucre, la solubilité le sel"], "La mer Morte a une salinité de 200 g/L ; la solubilité du sel est d'environ 360 g/L : on pourrait encore y dissoudre du sel."),
  ]);
}

function masse() {
  return tirer([
    () => { const e = one([100, 150, 200, 250, 300, 500]), s = one([5, 10, 12, 15, 20, 25, 30]);
      return Moteur.INPUT({ cat: "Masse", prompt: `On dissout <b>${s} g</b> de sel dans <b>${e} g</b> d'eau. Quelle est la masse de l'eau salée obtenue ?`, fields: [{ after: "g", w: "6em" }],
        answer: `${e + s} g`, check: v => nombre(v[0]) === e + s,
        explain: ` La masse se conserve lors d'une dissolution : masse de la solution = masse du solvant + masse du soluté = ${e} + ${s} = ${e + s} g.` }); },
    () => { const e = one([200, 250, 300, 400]), s = one([10, 20, 30, 40]);
      return Moteur.INPUT({ cat: "Masse", prompt: `On a ${e + s} g d'eau sucrée, faite avec ${e} g d'eau. Quelle masse de sucre a-t-on dissoute ?`, fields: [{ after: "g", w: "6em" }],
        answer: `${s} g`, check: v => nombre(v[0]) === s, explain: ` Masse du soluté = masse de la solution − masse du solvant = ${e + s} − ${e} = ${s} g.` }); },
    () => q("Masse", "On pèse un verre d'eau et un sucre : 210 g. On met le sucre dans l'eau et on attend qu'il se dissolve. La balance indique…", ["210 g", "moins de 210 g", "plus de 210 g", "0 g"], "Le sucre ne disparaît pas : la masse se conserve."),
  ]);
}

function salinite() {
  return tirer([
    () => { const moins = Math.random() < .5; const tri = [...MERS].sort((a, b) => a.s - b.s); const bon = moins ? tri[0] : tri[tri.length - 1];
      return q("Salinité", `D'après le tableau, quelle est l'étendue d'eau la ${moins ? "moins" : "plus"} salée ?`, [Maj(bon.n), ...shuffle(MERS.filter(m => m !== bon)).slice(0, 3).map(m => Maj(m.n))],
        `${esc(Maj(bon.n))} : ${bon.s} g de sel par litre.`, { fig: tableauMers() }); },
    () => { const m = one(MERS), L = one([2, 3, 5, 10]);
      return Moteur.INPUT({ cat: "Salinité", fig: tableauMers(), prompt: `Quelle masse de sel est dissoute dans <b>${L} L</b> d'eau ${esc(deN(m.n))} ?`, fields: [{ after: "g", w: "6em" }],
        answer: `${m.s * L} g`, check: v => nombre(v[0]) === m.s * L, explain: ` 1 L contient ${m.s} g de sel, donc ${L} L en contiennent ${L} × ${m.s} = ${m.s * L} g.` }); },
    () => { const m = one(MERS);
      return Moteur.INPUT({ cat: "Salinité", fig: tableauMers(), prompt: `Dans 1 L d'eau de l'océan Atlantique, il y a 32 g de sel. Quelle est la masse de sel dissous dans 1 L d'eau ${esc(deN(m.n))} ?`, fields: [{ after: "g", w: "6em" }],
        answer: `${m.s} g`, check: v => nombre(v[0]) === m.s, explain: ` La salinité se lit directement dans le tableau : ${m.s} g/L.` }); },
    () => q("Salinité", "Dans l'eau de mer, quel est le solvant et quel est le soluté ?", ["Solvant : l'eau. Soluté : le sel.", "Solvant : le sel. Soluté : l'eau.", "Solvant : l'eau de mer. Soluté : l'eau.", "Il n'y a ni solvant ni soluté."], "L'eau dissout le sel : l'eau est le solvant, le sel est le soluté."),
    () => q("Salinité", "La salinité, c'est…", ["la masse de sel dissous dans un litre d'eau", "la masse maximale de sel que l'on peut dissoudre", "la température de la mer", "la quantité d'eau dans la mer"], "Elle s'exprime en grammes par litre (g/L)."),
  ]);
}
function tableauMers() {
  const c = 'style="padding:5px 10px;border-bottom:1px solid var(--line);text-align:left"';
  return `<table style="width:100%;border-collapse:collapse;font-size:15px"><tr><th ${c}>Mers et océans</th><th ${c}>Salinité (g/L)</th></tr>${MERS.map(m => `<tr><td ${c}>${esc(Maj(m.n))}</td><td ${c}>${m.s}</td></tr>`).join("")}</table>`;
}
salinite.mers = MERS;
salinite.tableau = tableauMers;

function motJuste() {
  const x = one([
    ...VOCAB.filter(v => !["un mélange", "la salinité", "la solubilité"].includes(v.m)).map(v => ({ d: v.d, r: v.r, a: v.m })),
    { d: "Le sel se dissout dans l'eau. On dit qu'il est …", r: ["soluble"], a: "soluble" },
    { d: "Le sel ne se dissout pas dans l'huile. On dit qu'il est …", r: ["insoluble"], a: "insoluble" },
  ]);
  return Moteur.INPUT({ cat: "Mot juste", prompt: `Quel est le mot ?<br><span style="font-weight:500">${esc(x.d)}</span>`, fields: [{ mode: "text", w: "14em" }], answer: esc(x.a),
    check: v => x.r.includes(net(v[0])), explain: " Les majuscules et les accents ne comptent pas ici, mais soigne l'orthographe le jour de l'éval." });
}

Moteur.banque("physique-etats-melanges-dissolution", { etats, melanges, vocabulaire, solvantSolute, dissolution, masse, salinite, motJuste });
})();
