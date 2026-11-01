/* Questions de « La leçon complète : le vivant et l'écosystème » (SVT, tout le classeur).
 * Les parties déjà vues dans la fiche « Testing » (cellule de sang, composantes, outils, air) restent dans
 * sciences-cellule-ecosysteme.js : ce fichier n'a que ce que la leçon ajoute, pour que le défi ne pose pas
 * deux fois la même chose. La page revisions/sciences-lecon-vivant-ecosysteme.html lit aussi
 * vivant.cartes (les questions-réponses), vivant.cellules, feuille.figure, feuille.rameau, cle.arbre et experience.axes. */
(function () {
const { esc, pick, shuffle } = Moteur;
const one = a => a[Math.floor(Math.random() * a.length)];

// Questions-réponses de la leçon, pour les cartes : [thème, question, réponse, ajout].
// ajout = true quand la réponse n'est pas écrite telle quelle dans le classeur (vérifiée en ligne).
const CARTES = [
 ["vivant", "Quel était le problème de l'activité 1 du thème 1 ?", "Comment définir les êtres vivants à l'échelle microscopique ?"],
 ["vivant", "Quelle hypothèse a-t-on écrite pour ce problème ?", "Un être vivant respire."],
 ["vivant", "Quels autres êtres vivants a-t-on observés au microscope, en plus du sang humain ?", "La peau (l'épiderme) de grenouille, la paramécie, l'euglène et l'épiderme d'oignon."],
 ["vivant", "Qu'est-ce qu'un organisme unicellulaire ?", "Un organisme composé d'une seule cellule. Exemples : la paramécie, l'euglène."],
 ["vivant", "Qu'est-ce qui donne sa couleur verte à l'euglène ?", "Ses chloroplastes."],
 ["vivant", "Quelle structure rigide entoure les cellules de l'épiderme d'oignon ?", "La paroi. On la dessine par un double trait."],
 ["vivant", "Pourquoi ne voit-on pas la membrane plasmique dans une cellule d'oignon ?", "Une cellule en bonne santé occupe tout l'espace délimité par la paroi : la membrane plasmique est collée à la paroi, on ne peut pas les distinguer."],
 ["vivant", "Pourquoi dit-on que l'épiderme d'oignon est un tissu ?", "Parce qu'il est composé de nombreuses cellules."],
 ["vivant", "Les cellules de peau de grenouille ont-elles une paroi ?", "Non : les cellules animales ne sont pas entourées d'une paroi. Seules les cellules végétales en ont une.", true],
 ["vivant", "Comment calcule-t-on le grossissement d'un microscope ?", "Grossissement = objectif × oculaire. Exemple : objectif ×40 et oculaire ×10, on voit ×400."],
 ["vivant", "Qu'a-t-on montré en observant tous ces êtres vivants ?", "Ils sont tous composés de cellules : la cellule est l'unité du vivant.", true],
 ["biodiv", "Quel était le problème de l'activité 2 du thème 1 ?", "Comment découvrir rigoureusement et scientifiquement la biodiversité ?"],
 ["biodiv", "Que veulent dire « bio » et « diversité » ?", "Bio = nature, naturel, êtres vivants. Diversité = plein, plusieurs, différents."],
 ["biodiv", "Quel outil a-t-on utilisé pour trouver le nom des arbres et arbustes du collège ?", "Une clé de détermination."],
 ["biodiv", "Nomme les 5 parties du schéma simplifié d'une feuille.", "Le limbe, la nervation, le bourgeon, le pétiole, le rameau."],
 ["biodiv", "Dans la clé des arbres du collège, quel est le 1er choix à faire ?", "Les feuilles sont-elles opposées ou alternes ?"],
 ["biodiv", "Que veut dire « duveteuse » ?", "Couverte de « poils »."],
 ["eco", "Pour découvrir l'écosystème du jardin du collège, qu'a-t-on fait ?", "Se déplacer sur le terrain, observer, recenser, utiliser des outils d'observation et de mesure, prélever sans dégrader l'environnement, s'orienter, garder une trace écrite."],
 ["eco", "En combien de grandes catégories s'organise un écosystème ? Lesquelles ?", "3 : la composante vivante (les êtres vivants et leurs restes), la composante minérale, la composante liée aux activités humaines (technique)."],
 ["eco", "Que nous apprennent les outils de mesure sur un écosystème ?", "Il y a des conditions physico-chimiques mesurables. Elles peuvent être stables, mais aussi varier selon le jour, le lieu, la saison, l'heure de la journée…"],
 ["eco", "Quelle nouvelle question la fin de la leçon pose-t-elle ?", "Comment les êtres vivants interagissent-ils entre eux ? Et avec la composante minérale ?"],
 ["methode", "Quel est le synonyme du mot problème ?", "Question."],
 ["methode", "Que doit-on mettre à la fin d'un problème ?", "Un point d'interrogation."],
 ["methode", "Qu'est-ce que l'axe des ordonnées sur un graphique ?", "L'axe vertical."],
 ["methode", "Qu'est-ce que l'axe des abscisses sur un graphique ?", "L'axe horizontal."],
 ["methode", "Combien d'expériences faut-il au moins pour tester une hypothèse ?", "Deux expériences."],
 ["methode", "Combien de différences faut-il entre les expériences pour tester une hypothèse ?", "Une SEULE différence entre les deux expériences."],
 ["methode", "Que fait-on une fois qu'on a les résultats d'une expérience ?", "La description : « On observe que… »."],
 ["methode", "Par quoi doit-on terminer une démarche scientifique ?", "La conclusion : « On conclut que… »."],
 ["methode", "De combien de parties est constitué un titre ? Lesquelles ?", "4 : le type (la nature) du document, quoi ?, avec quels outils ?, avec quel colorant ?"],
 ["methode", "Quels sont les types (natures) de documents ?", "Schéma, graphique, extrait d'un texte, photographie, dessin, tableau, carte, planisphère."],
 ["methode", "Comment commence le titre d'un tableau, et qu'en fait-on ?", "Par le mot « Tableau… », et on le souligne."],
];

// La clé de détermination des arbres et arbustes du collège, telle que sur la feuille.
const CLE = { q: "Comment les feuilles sont-elles disposées sur le rameau ?", c: [
  { t: "Feuilles opposées", s: { q: "Comment sont les feuilles ?", c: [
    { t: "Ovales, à nervures arquées", a: { n: "le cornouiller sanguin", l: "Cornus sanguinea" } },
    { t: "En forme de cœur, à nervures arquées", a: { n: "le lilas commun", l: "Syringa vulgaris" } },
  ] } },
  { t: "Feuilles alternes", s: { q: "Comment sont les bords des feuilles ?", c: [
    { t: "Bords lisses", s: { q: "Comment sont les feuilles ?", c: [
      { t: "Vertes, à duvet blanc sur la face inférieure", a: { n: "le cotoneaster", l: "Cotoneaster lacteus" } },
    ] } },
    { t: "Bords dentés", s: { q: "Comment sont les feuilles ?", c: [
      { t: "Légèrement duveteuses", a: { n: "le tilleul à grandes feuilles", l: "Tilia platyphyllos" } },
      { t: "Ovales, cirées et vert foncé sur la face supérieure", a: { n: "le laurier noble", l: "Laurus nobilis" } },
      { t: "À cinq lobes et à nervures palmées", a: { n: "le copalme d'Amérique", l: "Liquidambar styraciflua" } },
      { t: "Ovales, de couleur vert clair", a: { n: "le cerisier", l: "Prunus avium" } },
      { t: "Ovales, de couleur rouge / violet foncé", a: { n: "le prunier pourpre", l: "Prunus pissardi" } },
    ] } },
  ] } },
] };
// Chaque arbre avec le chemin suivi dans la clé.
const ARBRES = [];
(function parcours(noeud, chemin) { noeud.c.forEach(c => c.a ? ARBRES.push({ ...c.a, chemin: [...chemin, c.t] }) : parcours(c.s, [...chemin, c.t])) })(CLE, []);
const decrit = a => a.chemin.map((t, i) => i ? t.toLowerCase() : t).join(", ");

// Pour la saisie et l'affichage.
const Maj = s => s.replace(/^(le |la |l')/, "").replace(/^./, c => c.toUpperCase());
const q = (cat, prompt, options, explain, extra) => Moteur.QCM({ cat, prompt, options: options.map(esc), correct: 0, explain: explain || "", ...extra });
const tirer = fs => one(fs)();

/* ===== Figures ===== */
const txt = (x, y, s, size = 18) => `<text x="${x}" y="${y}" text-anchor="middle" font-family="Fredoka,sans-serif" font-weight="700" font-size="${size}" fill="var(--ink)">${s}</text>`;
const pastille = (x, y, k) => `<circle cx="${x}" cy="${y}" r="17" fill="var(--card)" stroke="var(--ink)" stroke-width="2.5"/>` + txt(x, y + 6, k);

// Une cellule animale (sans paroi) et une cellule végétale (paroi en double trait, chloroplastes), marquées A et B.
function cellules(vegetaleA) {
  const animale = x => `<path d="M${x + 20} 70 C${x + 14} 30 ${x + 60} 18 ${x + 92} 30 C${x + 128} 42 ${x + 136} 92 ${x + 112} 118 C${x + 86} 146 ${x + 30} 140 ${x + 20} 108 Z" fill="var(--bad-bg)" stroke="var(--red)" stroke-width="4"/><circle cx="${x + 70}" cy="76" r="19" fill="var(--blue)" opacity=".85"/>`;
  const vegetale = x => `<rect x="${x + 10}" y="22" width="130" height="118" rx="3" fill="none" stroke="var(--ink-soft)" stroke-width="3"/><rect x="${x + 17}" y="29" width="116" height="104" rx="2" fill="var(--ok-bg)" stroke="var(--ink-soft)" stroke-width="3"/>`
    + `<circle cx="${x + 96}" cy="62" r="16" fill="var(--blue)" opacity=".85"/>` + [[38, 50], [42, 108], [70, 120], [112, 112], [118, 40], [60, 80], [96, 96]].map(([cx, cy]) => `<ellipse cx="${x + cx}" cy="${cy}" rx="8" ry="5" fill="var(--green)"/>`).join("");
  const [g, d] = vegetaleA ? [vegetale(0), animale(160)] : [animale(0), vegetale(160)];
  return `<svg viewBox="0 0 310 180" role="img" aria-label="deux cellules, A et B">${g}${d}${txt(75, 172, "A", 20)}${txt(235, 172, "B", 20)}</svg>`;
}

// Le schéma simplifié d'une feuille, avec des numéros qui changent de place.
const PARTIES = ["le limbe", "la nervation", "le bourgeon", "le pétiole", "le rameau"];
function figure(numeros) {
  const cible = [[196, 86], [150, 88], [57, 141], [74, 134], [45, 192]], ys = [24, 66, 108, 150, 192];
  let s = `<rect x="38" y="8" width="12" height="206" rx="3" fill="var(--card)" stroke="var(--ink)" stroke-width="2.5"/>`
    + `<path d="M50 150 L95 120" stroke="var(--ink)" stroke-width="4" stroke-linecap="round"/>`
    + `<ellipse cx="57" cy="139" rx="5" ry="8" transform="rotate(30 57 139)" fill="var(--ink)"/>`
    + `<path d="M95 120 C110 60 190 30 240 35 C225 90 160 135 95 120 Z" fill="var(--ok-bg)" stroke="var(--green)" stroke-width="3.5"/>`
    + `<g stroke="var(--green)" stroke-width="2" fill="none"><path d="M95 120 Q170 80 238 37"/>` + [[125, 103, 128, 78], [125, 103, 150, 112], [158, 85, 165, 58], [158, 85, 185, 98], [192, 64, 204, 44], [192, 64, 214, 74]].map(([a, b, c, d]) => `<line x1="${a}" y1="${b}" x2="${c}" y2="${d}"/>`).join("") + `</g>`;
  numeros.forEach((k, i) => {
    const [x, y] = cible[i], ly = ys[k - 1];
    s += `<line x1="${x}" y1="${y}" x2="266" y2="${ly}" stroke="var(--ink)" stroke-width="1.8" opacity=".8"/><circle cx="${x}" cy="${y}" r="4" fill="var(--ink)"/>` + pastille(286, ly, k);
  });
  return `<svg viewBox="0 0 310 222" role="img" aria-label="schéma simplifié d'une feuille avec des numéros">${s}</svg>`;
}

// Un rameau avec deux feuilles : disposition (opposées / alternes), bord (lisse / denté / lobé), nervation (pennée / palmée).
function contour(rx, ry, bord) {
  const n = bord === "lisse" ? 48 : bord === "dente" ? 36 : 120, pts = [];
  for (let i = 0; i < n; i++) {
    const t = i / n * 2 * Math.PI;
    const k = bord === "dente" ? (i % 2 ? .86 : 1) : bord === "lobe" ? 1 + .16 * Math.cos(5 * t) : 1;
    pts.push(`${(rx * k * Math.cos(t)).toFixed(1)},${(ry * k * Math.sin(t)).toFixed(1)}`);
  }
  return `<polygon points="${pts.join(" ")}" fill="var(--ok-bg)" stroke="var(--green)" stroke-width="2.5" stroke-linejoin="round"/>`;
}
function feuilleSeule(bord, nerv) {
  const rx = 46, ry = nerv === "palmee" || bord === "lobe" ? 36 : 22;
  const v = nerv === "palmee"
    ? [-60, -30, 0, 30, 60].map(a => `<line x1="${-rx + 6}" y1="0" x2="${(-rx + 6 + 78 * Math.cos(a * Math.PI / 180)).toFixed(1)}" y2="${(78 * Math.sin(a * Math.PI / 180) * ry / rx).toFixed(1)}"/>`).join("")
    : `<line x1="${-rx}" y1="0" x2="${rx - 4}" y2="0"/>` + [-24, -2, 20].map(x => `<line x1="${x}" y1="0" x2="${x + 14}" y2="${-ry * .7}"/><line x1="${x}" y1="0" x2="${x + 14}" y2="${ry * .7}"/>`).join("");
  return `<g transform="translate(${rx + 16} 0)">${contour(rx, ry, bord)}<g stroke="var(--green)" stroke-width="1.6">${v}</g></g><line x1="0" y1="0" x2="18" y2="0" stroke="var(--ink)" stroke-width="3"/>`;
}
function rameau({ disp = "alternes", bord = "lisse", nerv = "pennee" } = {}) {
  const f = feuilleSeule(bord, nerv);
  const [yd, yg] = disp === "opposees" ? [92, 92] : [56, 128];
  return `<svg viewBox="0 0 260 184" role="img" aria-label="un rameau avec deux feuilles"><rect x="125" y="4" width="9" height="176" rx="3" fill="var(--card)" stroke="var(--ink)" stroke-width="2.5"/>`
    + `<g transform="translate(134 ${yd}) rotate(-18)">${f}</g><g transform="translate(125 ${yg}) rotate(198)">${f}</g></svg>`;
}

// Deux axes d'un graphique, l'un en couleur.
function axes(vertical) {
  const [cv, ch] = vertical ? ["var(--blue)", "var(--ink-soft)"] : ["var(--ink-soft)", "var(--blue)"];
  return `<svg viewBox="0 0 220 170" role="img" aria-label="les deux axes d'un graphique, l'un en couleur">`
    + `<line x1="40" y1="140" x2="40" y2="22" stroke="${cv}" stroke-width="${vertical ? 6 : 3}"/><polygon points="31,24 49,24 40,8" fill="${cv}"/>`
    + `<line x1="40" y1="140" x2="198" y2="140" stroke="${ch}" stroke-width="${vertical ? 3 : 6}"/><polygon points="196,131 196,149 212,140" fill="${ch}"/>`
    + `<polyline points="52,122 82,104 112,110 142,72 172,58" fill="none" stroke="var(--ink-soft)" stroke-width="2" stroke-dasharray="4 4"/></svg>`;
}

/* ===== Les générateurs ===== */
const vivant = () => tirer([
  () => q("Le vivant", "La paramécie est composée…", ["D'une seule cellule", "De deux cellules", "De milliers de cellules", "D'aucune cellule"], "La paramécie est un organisme unicellulaire : une seule cellule, qui vit en eau douce."),
  () => q("Le vivant", "Un organisme composé d'une seule cellule est…", ["Unicellulaire", "Pluricellulaire", "Un tissu", "Un chloroplaste"], "« Uni » veut dire un. Un organisme fait de nombreuses cellules, comme la grenouille ou nous, est pluricellulaire (« pluri » = plusieurs)."),
  () => q("Le vivant", "Lequel de ces êtres vivants est unicellulaire ?", [one(["La paramécie", "L'euglène"]), "La grenouille", "L'oignon", "L'être humain"], "La paramécie et l'euglène sont faites d'une seule cellule. La grenouille, l'oignon et l'être humain en ont énormément : ils sont pluricellulaires."),
  () => q("Le vivant", "Qu'est-ce qui donne sa couleur verte à l'euglène ?", ["Ses chloroplastes", "Son noyau", "Sa membrane", "Son cytoplasme"], "L'euglène contient des chloroplastes, qui lui donnent sa couleur verte."),
  () => q("Le vivant", "Quelle structure rigide entoure les cellules de l'épiderme d'oignon ?", ["La paroi", "La membrane plasmique", "Le noyau", "Le chloroplaste"], "La paroi est rigide. On la dessine par un double trait."),
  () => q("Le vivant", "Sur un dessin, comment représente-t-on la paroi d'une cellule d'oignon ?", ["Par un double trait", "En pointillés", "En rouge", "On ne la dessine pas"], "La paroi se dessine par un double trait."),
  () => q("Le vivant", "Pourquoi ne distingue-t-on pas la membrane plasmique de la paroi dans une cellule d'oignon ?", ["La cellule remplit tout l'espace : la membrane est collée à la paroi", "Les cellules d'oignon n'ont pas de membrane", "La paroi est invisible", "Le microscope est mal réglé"], "Quand une cellule est en bonne santé, elle occupe tout l'espace que délimite la paroi : la membrane plasmique y est collée."),
  () => q("Le vivant", "L'épiderme d'oignon est composé de nombreuses cellules. C'est donc…", ["Un tissu", "Une seule cellule", "Un organisme unicellulaire", "Un noyau"], "Un tissu, c'est un ensemble de nombreuses cellules, comme l'épiderme d'oignon."),
  () => q("Le vivant", "Les cellules de la peau de grenouille sont-elles entourées d'une paroi ?", ["Non : les cellules animales n'ont pas de paroi", "Oui, comme toutes les cellules"], "Le document de la grenouille le dit : les cellules animales ne sont pas entourées d'une paroi. La paroi, c'est pour les végétaux."),
  () => q("Le vivant", "Qu'a-t-on montré en observant la grenouille, la paramécie, l'euglène et l'oignon au microscope ?", ["Qu'ils sont tous composés de cellules", "Que seuls les humains ont des cellules", "Que toutes les cellules sont identiques", "Que les végétaux n'ont pas de cellules"], "Tous les êtres vivants sont composés de cellules : c'est pour ça qu'on dit que la cellule est l'unité du vivant."),
  () => q("Le vivant", "Quelles parties a-t-on retrouvées dans les cellules de tous ces êtres vivants ?", ["Membrane, cytoplasme, noyau", "Paroi, chloroplastes, noyau", "Sang, peau, noyau", "Limbe, pétiole, rameau"], "Membrane plasmique + cytoplasme + noyau : c'est le point commun. La paroi et les chloroplastes, on ne les trouve que chez certains."),
  () => q("Le vivant", "Pourquoi les cellules de l'épiderme d'oignon ne sont-elles pas vertes ?", ["Elles n'ont pas de chloroplastes : le bulbe pousse sous terre, sans lumière", "Elles n'ont pas de noyau", "Elles n'ont pas de paroi", "Parce qu'on les a colorées en bleu"], "L'oignon que l'on mange est un bulbe, une réserve qui pousse sous terre : ses cellules n'ont pas de chloroplastes. (En plus du cours.)"),
  () => { const a = Math.random() < .5; return Moteur.QCM({ cat: "Le vivant", fig: cellules(a), prompt: "Laquelle de ces deux cellules est une cellule végétale ?", options: ["A", "B"], correct: a ? 0 : 1, keep: true, grid: true, center: true,
    explain: "La cellule végétale a une paroi (le double trait) et souvent des chloroplastes verts. La cellule animale n'a qu'une membrane plasmique." }) },
]);

const microscope = function () {
  const r = Math.random();
  if (r < .4) {
    const o = one([4, 10, 40]), c = one([10, 15]);
    return Moteur.INPUT({ cat: "Microscope", prompt: `L'objectif grossit <b>×${o}</b> et l'oculaire <b>×${c}</b>.<br>Quel est le grossissement ?`, fields: [{ label: "×", mode: "numeric", w: "5em" }], answer: `×${o * c}`,
      check: v => Number(v[0].replace(/[^0-9]/g, "")) === o * c, explain: ` Grossissement = objectif × oculaire = ${o} × ${c} = ${o * c}. On multiplie, on n'additionne pas.` });
  }
  return tirer([
    () => q("Microscope", "Objectif ×40, oculaire ×10 : quel est le grossissement ?", ["×400", "×50", "×4", "×30"], "On multiplie : 40 × 10 = 400. Ce n'est pas 40 + 10."),
    () => q("Microscope", "Comment calcule-t-on le grossissement d'un microscope ?", ["Objectif × oculaire", "Objectif + oculaire", "Objectif − oculaire", "On ne peut pas le calculer"], "Grossissement = objectif × oculaire. Les deux nombres sont écrits sur les lentilles."),
    () => q("Microscope", "Sur le document, les paramécies sont grossies ×200. Ça veut dire…", ["On les voit 200 fois plus grandes qu'en vrai", "Elles mesurent 200 mm", "Il y a 200 paramécies", "Elles vivent 200 jours"], "×200 : l'image est 200 fois plus grande que la paramécie en vrai."),
    () => q("Microscope", "Pour observer les cellules d'un épiderme d'oignon, on utilise…", ["Un microscope optique", "Un télescope", "Des jumelles", "Un luxmètre"], "Le microscope sert à voir tout petit, à l'échelle microscopique. Le télescope et les jumelles servent à voir loin."),
  ]);
};

const feuille = function () {
  const r = Math.random();
  if (r < .45) {
    const num = shuffle([1, 2, 3, 4, 5]), i = Math.floor(Math.random() * 5);
    if (Math.random() < .5) return Moteur.QCM({ cat: "Feuille", fig: figure(num), prompt: `Que montre le numéro ${num[i]} ?`, options: PARTIES.map(p => esc(Maj(p))), correct: i, keep: true,
      explain: "Le limbe est la partie plate de la feuille, parcourue par la nervation. Le pétiole attache la feuille au rameau. Le bourgeon est à la base du pétiole." });
    return Moteur.QCM({ cat: "Feuille", fig: figure(num), prompt: `Quel numéro montre ${PARTIES[i]} ?`, options: ["1", "2", "3", "4", "5"], correct: num[i] - 1, keep: true, grid: true, center: true,
      explain: `C'est le numéro ${num[i]}.` });
  }
  if (r < .8) {
    const sorte = one(["disp", "bord", "nerv"]);
    if (sorte === "disp") { const d = one(["opposees", "alternes"]);
      return Moteur.QCM({ cat: "Feuille", fig: rameau({ disp: d }), prompt: "Comment sont disposées ces feuilles sur le rameau ?", options: ["Opposées", "Alternes"], correct: d === "opposees" ? 0 : 1, keep: true, grid: true, center: true,
        explain: "Opposées : deux feuilles face à face, à la même hauteur. Alternes : une feuille d'un côté, puis une de l'autre côté, plus haut." }) }
    if (sorte === "bord") { const b = one(["lisse", "dente", "lobe"]);
      return Moteur.QCM({ cat: "Feuille", fig: rameau({ bord: b, disp: one(["opposees", "alternes"]) }), prompt: "Comment est le bord de ces feuilles ?", options: ["Lisse", "Denté", "Lobé"], correct: ["lisse", "dente", "lobe"].indexOf(b), keep: true, grid: true, center: true,
        explain: "Lisse : sans dents. Denté : avec des petites pointes, comme une scie. Lobé : avec de grandes bosses arrondies." }) }
    const n = one(["pennee", "palmee"]);
    return Moteur.QCM({ cat: "Feuille", fig: rameau({ nerv: n, disp: one(["opposees", "alternes"]) }), prompt: "Comment est la nervation de ces feuilles ?", options: ["Pennée", "Palmée"], correct: n === "pennee" ? 0 : 1, keep: true, grid: true, center: true,
      explain: "Pennée : une grande nervure au milieu, et les autres de chaque côté, comme une plume. Palmée : toutes les nervures partent du même point, comme une palme." });
  }
  return tirer([
    () => q("Feuille", "Le limbe, c'est…", ["La partie plate et large de la feuille", "La petite tige qui attache la feuille", "La branche qui porte les feuilles", "Les lignes dessinées sur la feuille"], "Le limbe est la partie plate. Le pétiole l'attache au rameau. La nervation, ce sont les nervures."),
    () => q("Feuille", "Le pétiole, c'est…", ["La petite tige qui attache la feuille au rameau", "La partie plate de la feuille", "Le bord de la feuille", "Une sorte de fleur"], "Le pétiole relie le limbe au rameau."),
    () => q("Feuille", "Une feuille faite de plusieurs petites folioles, comme sur le schéma « feuille composée », est…", ["Composée", "Simple", "Opposée", "Lisse"], "Une feuille simple a un seul limbe. Une feuille composée en a plusieurs petits : elle peut être pennée ou digitée."),
    () => q("Feuille", "Une feuille composée dont les folioles partent toutes du même point, comme les doigts d'une main, est…", ["Composée digitée", "Composée pennée", "Simple", "À bord denté"], "Digitée, comme les doigts. Pennée, quand les folioles sont rangées de chaque côté, comme une plume."),
  ]);
};
feuille.figure = figure;
feuille.parties = PARTIES;
feuille.rameau = rameau;

const cle = function () {
  const r = Math.random(), a = one(ARBRES), autres = pick(ARBRES.filter(x => x !== a), 3);
  const resume = `D'après la clé : ${decrit(a)} → ${Maj(a.n)} (${a.l}).`;
  if (r < .35) return q("Clé", `Au jardin du collège, une feuille : <b>${esc(decrit(a).toLowerCase())}</b>.<br>D'après la clé de détermination, de quel arbre s'agit-il ?`, [Maj(a.n), ...autres.map(x => Maj(x.n))], resume);
  if (r < .6) return q("Clé", `D'après la clé, comment sont les feuilles ${esc(a.n.replace(/^le /, "du ").replace(/^l'/, "de l'"))} ?`, [decrit(a), ...autres.map(decrit)], resume);
  return tirer([
    () => q("Clé", "Une clé de détermination sert à…", ["Trouver le nom d'un être vivant, étape par étape", "Mesurer la taille d'un arbre", "Compter les arbres du jardin", "Ouvrir la porte du jardin"], "À chaque étape, on observe un caractère et on choisit une case, jusqu'au nom de l'être vivant."),
    () => q("Clé", "Dans la clé des arbres du collège, quel est le 1er caractère à observer ?", ["La disposition des feuilles : opposées ou alternes", "La couleur des fleurs", "La hauteur de l'arbre", "L'odeur des feuilles"], "On commence par regarder si les feuilles sont opposées ou alternes."),
    () => q("Clé", "Dans la clé, une feuille « duveteuse » est…", ["Couverte de « poils »", "Toute lisse", "Mouillée", "Dentée"], "C'est la définition écrite sous la clé : duveteuse = couverte de « poils »."),
    () => q("Clé", "Des nervures « palmées », ce sont des nervures…", ["Qui partent toutes du même point, comme une palme", "Courbées en arc", "Toutes parallèles", "Invisibles"], "Palmées, comme une palme. Arquées, quand elles sont courbées en arc."),
    () => q("Clé", "« Bio » veut dire…", ["Nature, naturel, êtres vivants", "Plein, plusieurs, différents", "Petit, microscopique", "Mesurer"], "Bio = nature, naturel, êtres vivants. Diversité = plein, plusieurs, différents."),
    () => q("Clé", "La biodiversité, c'est…", ["Plein d'êtres vivants différents", "Un seul arbre", "Les roches du jardin", "Les outils de mesure"], "Bio (êtres vivants) + diversité (plein, différents)."),
    () => q("Clé", "Après avoir identifié les arbres du collège, qu'a-t-on fait ?", ["Placé leur nom sur le plan du collège", "Coupé leurs branches", "Mesuré leur température", "Rien de plus"], "Les deux tâches : identifier les arbres avec la clé, puis placer leur nom sur le plan du collège."),
    () => q("Clé", "Quel était le problème de l'activité sur la biodiversité ?", ["Comment découvrir rigoureusement et scientifiquement la biodiversité ?", "Comment définir les êtres vivants à l'échelle microscopique ?", "Que contient l'air ?", "Pourquoi les feuilles tombent-elles ?"], "Activité 2 du thème 1."),
  ]);
};
cle.arbre = CLE;
cle.arbres = ARBRES;

const experience = () => tirer([
  () => q("Démarche", "Pour tester une hypothèse, combien d'expériences faut-il au moins ?", ["2", "1", "3", "10"], "Au moins deux expériences, qu'on compare.", { grid: true, center: true }),
  () => q("Démarche", "Combien de différences doit-il y avoir entre les deux expériences ?", ["Une seule", "Deux", "Aucune", "Autant qu'on veut"], "Une SEULE différence : comme ça, si les résultats changent, on sait que c'est à cause d'elle."),
  () => q("Démarche", "On teste l'hypothèse « les graines ont besoin d'eau pour germer ». Quelles expériences choisir ?", ["Deux pots pareils au même endroit : l'un arrosé, l'autre non", "Un pot arrosé au soleil, un pot sec dans le noir", "Un seul pot arrosé", "Deux pots arrosés"], "Il ne faut changer qu'une chose : l'eau. Si on change aussi la lumière, on ne sait plus ce qui a joué. (Exemple en plus du cours.)"),
  () => q("Démarche", "Une fois qu'on a les résultats d'une expérience, on écrit…", ["La description : « On observe que… »", "La conclusion : « On conclut que… »", "Le problème", "L'hypothèse"], "D'abord on décrit ce qu'on voit (« On observe que… »), ensuite on conclut."),
  () => q("Démarche", "Par quoi se termine une démarche scientifique ?", ["La conclusion : « On conclut que… »", "La description : « On observe que… »", "Le problème", "Le titre"], "La démarche se termine par la conclusion."),
  () => q("Démarche", "Dans quel ordre se fait une démarche scientifique ?", ["Problème → hypothèse → expériences → description → conclusion", "Hypothèse → problème → conclusion → expériences → description", "Expériences → conclusion → problème → hypothèse → description", "Conclusion → description → expériences → hypothèse → problème"], "On pose un problème, on propose une hypothèse, on la teste par des expériences, on décrit les résultats, puis on conclut."),
  () => q("Démarche", "Quel est le synonyme du mot « problème » en sciences ?", ["Question", "Réponse", "Hypothèse", "Conclusion"], "Un problème, c'est une question : il se termine par un point d'interrogation."),
  () => q("Démarche", "Que doit-on mettre à la fin d'un problème ?", ["Un point d'interrogation", "Un point", "Un point d'exclamation", "Rien"], "Un problème est une question, donc il finit par « ? »."),
  () => { const v = Math.random() < .5; return Moteur.QCM({ cat: "Démarche", fig: axes(v), prompt: "Sur ce graphique, comment s'appelle l'axe en couleur ?", options: ["L'axe des ordonnées", "L'axe des abscisses"], correct: v ? 0 : 1, keep: true,
    explain: "L'axe des ordonnées est vertical (il monte). L'axe des abscisses est horizontal." }) },
]);

const TITRES = [
  { t: "Photographie de cellules d'un frottis sanguin humain au microscope optique", n: "Photographie", quoi: "de cellules d'un frottis sanguin humain", outil: "au microscope optique" },
  { t: "Photographie au microscope optique de cellules d'épiderme d'oignon", n: "Photographie", quoi: "de cellules d'épiderme d'oignon", outil: "au microscope optique" },
  { t: "Tableau des composantes de notre environnement", n: "Tableau", quoi: "des composantes de notre environnement" },
  { t: "Schéma simplifié d'une feuille", n: "Schéma", quoi: "simplifié d'une feuille" },
  { t: "Tableau explicatif de quelques outils de mesures", n: "Tableau", quoi: "explicatif de quelques outils de mesures" },
];
const titre = function () {
  const x = one(TITRES);
  if (Math.random() < .35) {
    if (x.outil && Math.random() < .5) return q("Titre", `« ${esc(x.t)} »<br>Dans ce titre, que dit « ${esc(x.outil)} » ?`, ["Avec quel outil", "La nature du document", "Quoi", "Avec quel colorant"], "Les 4 parties d'un titre : la nature, quoi, avec quels outils, avec quel colorant.");
    return q("Titre", `« ${esc(x.t)} »<br>Quelle est la nature de ce document ?`, [x.n, ...pick(["Photographie", "Tableau", "Schéma", "Graphique", "Dessin", "Texte"].filter(n => n !== x.n), 3)], "Le 1er mot du titre donne la nature (le type) du document.");
  }
  return tirer([
    () => q("Titre", "De combien de parties est constitué un titre ?", ["4", "2", "3", "6"], "La nature du document, quoi ?, avec quels outils ?, avec quel colorant ?", { grid: true, center: true }),
    () => q("Titre", "Quelles sont les 4 parties d'un titre ?", ["La nature du document, quoi, avec quels outils, avec quel colorant", "Le prénom, la date, la classe, la matière", "Le problème, l'hypothèse, la description, la conclusion", "Le début, le milieu, la fin, la signature"], "a. type / nature du document ; b. quoi ? ; c. avec des outils ? ; d. avec un colorant ?"),
    () => q("Titre", "Lequel est une nature (un type) de document ?", [one(["Une carte", "Un extrait de texte", "Un planisphère", "Un graphique"]), "Un microscope", "Un pétiole", "Une hypothèse"], "Natures de documents : schéma, graphique, extrait d'un texte, photographie, dessin, tableau, carte, planisphère."),
    () => q("Titre", "Pour réussir mon tableau, avec quoi est-ce que je le trace ?", ["Un crayon de papier", "Un stylo rouge", "Un feutre noir", "Le doigt"], "Étape 1 du point méthode : j'utilise un crayon de papier."),
    () => q("Titre", "Avant de faire mon tableau au propre, je…", ["L'organise sur une feuille de brouillon", "Écris directement dedans", "Le colorie", "Le fais signer"], "Étape 2 : une feuille de brouillon pour organiser le tableau, avant de le faire au propre."),
    () => q("Titre", "Un tableau bien fait est…", ["Fermé de tous les côtés", "Ouvert en bas", "Sans titre", "Écrit tout petit"], "Je vérifie que mon tableau est bien fermé de tous les côtés, avec de grandes cases pour écrire lisiblement."),
    () => q("Titre", "Une fois le titre du tableau écrit, je…", ["Le souligne", "L'efface", "Le mets entre parenthèses", "Le recopie deux fois"], "Je formule un titre qui commence par « Tableau… », puis je le souligne."),
  ]);
};

const ecosysteme = () => tirer([
  () => q("Écosystème", "Que veut dire « recenser » les êtres vivants du jardin ?", ["Les repérer, les compter et les noter", "Les ramasser tous", "Les dessiner en couleur", "Les chasser du jardin"], "Recenser, c'est faire la liste de ce qu'on trouve et le compter."),
  () => q("Écosystème", "Au jardin, on prélève des échantillons…", ["Sans dégrader l'environnement", "En arrachant tout", "Seulement les roches", "On ne prélève jamais rien"], "On peut prélever et échantillonner, mais sans abîmer l'environnement."),
  () => q("Écosystème", "Lequel ne fait <b>pas</b> partie de ce qu'on fait pour découvrir l'écosystème du jardin ?", ["Rester en classe sans regarder dehors", "S'orienter", "Recenser", "Garder une trace écrite"], "On se déplace sur le terrain, on observe, on recense, on utilise des outils, on prélève sans dégrader, on s'oriente et on note."),
  () => q("Écosystème", "Les conditions physico-chimiques d'un écosystème (température, lumière…)…", ["Peuvent être stables ou varier selon le jour, le lieu, la saison, l'heure", "Sont toujours les mêmes", "Ne se mesurent pas", "Changent seulement quand il pleut"], "Grâce aux outils de mesure, on voit qu'elles peuvent varier selon le jour, le lieu de la mesure, la saison, l'heure de la journée…"),
  () => q("Écosystème", "Au jardin, il fait 8 °C le matin et 15 °C l'après-midi. Qu'est-ce que ça montre ?", ["Les conditions varient selon l'heure de la journée", "Le thermomètre est cassé", "La température ne se mesure pas", "Le jardin n'est pas un écosystème"], "La température est une condition physico-chimique : elle varie en fonction de l'heure."),
  () => q("Écosystème", "Que veut dire « mesurable » ?", ["Qu'on peut le mesurer avec un outil de mesure", "Que c'est très grand", "Que c'est vivant", "Qu'on peut le toucher"], "Les conditions physico-chimiques sont mesurables : on peut les mesurer avec des outils."),
  () => q("Écosystème", "En combien de grandes catégories s'organise un écosystème comme le jardin du collège ?", ["3", "2", "4", "8"], "La composante vivante, la composante minérale, la composante liée aux activités humaines (technique).", { grid: true, center: true }),
  () => q("Écosystème", "Quelle question la leçon ouvre-t-elle pour la suite ?", ["Comment les êtres vivants interagissent-ils entre eux et avec la composante minérale ?", "Combien pèse le jardin ?", "Pourquoi le soleil est-il jaune ?", "Qu'est-ce qu'une hypothèse ?"], "L'ouverture : les interactions au sein des composantes et entre elles."),
]);

experience.axes = axes;
vivant.cartes = CARTES;
vivant.cellules = cellules;

Moteur.banque("sciences-lecon-vivant-ecosysteme", { vivant, microscope, feuille, cle, experience, titre, ecosysteme });
})();
