/* Questions de « Les bilans du thème 1 » (SVT) : les textes à trous du classeur du 3 novembre.
 * Le reste du classeur (cellule, clé, écosystème, fiche Testing) est déjà dans sciences-cellule-ecosysteme.js
 * et sciences-lecon-vivant-ecosysteme.js : ce fichier n'a que ce qui est nouveau.
 * La page revisions/sciences-bilans-unite-biodiversite.html lit aussi unite.textes (les trois textes),
 * unite.cellules (le tableau comparatif) et biodiv.cartes (les nouvelles questions du mémo). */
(function () {
const { esc, shuffle } = Moteur;
const one = a => a[Math.floor(Math.random() * a.length)];
const q = (cat, prompt, options, explain, extra) => Moteur.QCM({ cat, prompt, options: options.map(esc), correct: 0, explain: explain || "", ...extra });
const tirer = fs => one(fs)();

/* ===== Les trois textes à trous =====
 * [mot] = un trou. [mot|autre] : les deux réponses sont acceptées, la première est affichée.
 * [mot@g] : les trous du même groupe g peuvent être remplis dans n'importe quel ordre.
 * sur = true quand le trou est écrit tel quel sur la feuille ou dans la liste de mots ;
 * les trous sans liste de mots (bilan 1, Muséum) ont été complétés d'après le cours et vérifiés en ligne. */
const TEXTES = [
  { id: "unite", titre: "Bilan · l'unité du vivant",
    probleme: "Quelle est l'unité des êtres vivants ? C'est quoi un être vivant ?",
    source: "Feuille « Bilan thème 1 activité 2 » (c'est en fait le bilan de l'activité 1 : l'unité du vivant). Pas de liste de mots sur la feuille : la liste ci-dessous est faite par la révision.",
    paras: [
      "On remarque que tous les êtres vivants ont des [points] [communs] à l'échelle [microscopique]. En effet, ils sont tous composés d'au moins une [cellule]. Chaque cellule se compose d'une [membrane plasmique], d'un [cytoplasme] et du [matériel génétique] contenu ou non dans un noyau.",
      "Ces points communs reflètent [l'unité] des êtres vivants et c'est un argument en faveur d'une [origine commune|parenté] de tous les êtres vivants.",
      "Toutefois, on remarque une [diversité] cellulaire, les êtres vivants ont aussi beaucoup de [différences] : certains ont une paroi (ex : levure, oignon), d'autres ont des chloroplastes (euglènes) ou une vacuole (oignon) ou pas de noyau (hématie).",
      "Certains êtres vivants sont composés d'une cellule : on dit que ce sont des êtres vivants [unicellulaires]. D'autres sont composés de plusieurs cellules : on dit que ce sont des êtres vivants [pluricellulaires].",
      "Les différences à l'échelle cellulaire témoignent d'une diversité des êtres vivants. Cette diversité actuelle des êtres vivants sur la Terre s'appelle la [biodiversité]. Cette biodiversité est le résultat des [transformations|évolutions] des êtres vivants mis en place depuis au moins les premières traces identifiées d'êtres vivants sur Terre, il y a [3,8] Ga. Le 1er être vivant hypothétique sur Terre à l'origine de tous les êtres vivants actuels et passés est nommé [LUCA] (Last Universal Common Ancestor).",
      "Ga = [milliard d'années], Ma = [million d'années], attention aux unités, aux majuscules et aux minuscules !",
      "Âge de la Terre : [4,6] Ga.",
    ] },
  { id: "biodiv", titre: "Bilan · découvrir la biodiversité",
    probleme: "Comment découvrir rigoureusement / scientifiquement la biodiversité sur Terre ?",
    source: "Feuille « Activité 2 thème 1 », avec sa liste de 18 mots à placer.",
    liste: ["vivant", "l'abondance", "particularité", "biodiversité", "agir", "la présence", "caractériser", "la variabilité", "protégeant", "clé de détermination", "nom", "écosystème", "leur évolution", "identifier", "plusieurs", "caractères", "inventorier", "faire la liste précise"],
    paras: [
      "On peut [identifier] le nom des êtres vivants d'un écosystème grâce à [la clé de détermination|une clé de détermination|clé de détermination], outil qui s'appuie sur un ensemble précis de [caractères] observables / visibles d'un être vivant en comparaison à d'autres jusqu'à déterminer son [nom] d'espèce.",
      "Quel est le lien entre identifier les êtres vivants et la biodiversité ?",
      "Tout ce qui est inconnu, est ignoré donc n'est pas ou mal protégé.",
      "[Inventorier] - identifier tous les êtres vivants d'un milieu, c'est s'intéresser à la [biodiversité] de celui-ci.",
      "Connaître - [caractériser] l'ensemble des êtres vivants d'un [écosystème], c'est mettre en évidence [la présence@p], [l'abondance@p], [la variabilité@p] des êtres vivants ainsi que [leur évolution] au cours du temps.",
      "Ainsi, on (nous, êtres humains) peut comprendre puis [agir] en préservant notre système Terre, en conséquence en nous [protégeant].",
      "Inventorier = [faire la liste précise].",
      "Caractère = [particularité] visible d'un être vivant.",
      "Biodiversité : Bio = [vivant] - Diversité = [plusieurs].",
    ] },
  { id: "museum", titre: "Les 3 niveaux de la biodiversité",
    probleme: "Texte à compléter à la maison avec le site du Muséum national d'histoire naturelle (mnhn.fr, « Qu'est-ce que la biodiversité ? »).",
    source: "Feuille « Consigne : à la maison ». Réponses vérifiées sur la page du Muséum. Pas de liste de mots sur la feuille.",
    paras: [
      "La biodiversité se distingue selon [3|trois] niveaux d'organisation :",
      "- La diversité [écologique|écosystémique] (à l'échelle des [écosystèmes], exemple : le jardin du collège),",
      "- La diversité [spécifique] (ensemble - [nombre|inventaire] des différentes [espèces]),",
      "- La diversité [génétique] (mesure des [variations|différences] entre les individus d'une même [espèce], mesure de la diversité des gènes au sein d'une espèce).",
      "Gène = information contenue dans le matériel génétique des cellules qui fabrique les caractères (contenu dans le noyau pour une grande partie des êtres vivants).",
    ] },
];
// Découpe un paragraphe en morceaux : du texte, ou un trou { r: [réponses], g: groupe }.
function decoupe(p) { const out = []; let m, last = 0; const re = /\[([^\]]+)\]/g;
  while ((m = re.exec(p))) { if (m.index > last) out.push(p.slice(last, m.index)); const [txt, g] = m[1].split("@"); out.push({ r: txt.split("|"), g: g || null }); last = re.lastIndex }
  if (last < p.length) out.push(p.slice(last)); return out }
TEXTES.forEach(t => { t.morceaux = t.paras.map(decoupe); t.trous = t.morceaux.flat().filter(x => typeof x === "object");
  if (!t.liste) t.liste = [...new Set(t.trous.map(x => x.r[0]))] });
// Le texte avec ses réponses, en phrases.
const phrase = (morceaux, rendu) => morceaux.map(x => typeof x === "string" ? esc(x) : rendu(x)).join("");

// Une question à partir d'un trou : la phrase autour, le trou en pointillés, 4 mots de la même liste.
function questionTrou(t) {
  const k = Math.floor(Math.random() * t.morceaux.length), mor = t.morceaux[k]; const trous = mor.filter(x => typeof x === "object");
  if (!trous.length) return questionTrou(t);
  const cible = one(trous); const bons = cible.g ? trous.filter(x => x.g === cible.g).map(x => x.r[0]) : cible.r;
  // La phrase : les autres trous du même paragraphe sont remplis, le trou demandé est en pointillés.
  const texte = phrase(mor, x => x === cible ? "<b>……………</b>" : `<b>${esc(cible.g && x.g === cible.g ? "……" : x.r[0])}</b>`);
  const autres = shuffle(t.liste.filter(w => !bons.includes(w) && !cible.r.includes(w))).slice(0, 3);
  return Moteur.QCM({ cat: t.titre, prompt: `Quel mot va dans le trou ?<br><span style="font-family:var(--body);font-weight:400;font-size:18px">${texte}</span>`, options: [cible.r[0], ...autres].map(esc), correct: 0,
    explain: cible.r.length > 1 ? `On accepte aussi : ${cible.r.slice(1).map(esc).join(", ")}.` : "" });
}

/* ===== Le tableau comparatif des cellules (feuille de l'activité 1) ===== */
// m membrane plasmique, c chloroplaste, p paroi, n noyau, y cytoplasme, u unicellulaire, P pluricellulaire
const CELLULES = [
  { nom: "Hématie (cellule humaine)", m: 1, n: "+ puis perte au cours de leur maturation", y: 1, P: 1 },
  { nom: "Macrophage (cellule humaine)", m: 1, n: 1, y: 1, P: 1 },
  { nom: "Leucocyte (cellule humaine)", m: 1, n: 1, y: 1, P: 1 },
  { nom: "Cellule buccale humaine", m: 1, n: 1, y: 1, P: 1 },
  { nom: "Cellule d'élodée", m: 1, c: 1, n: 1, y: 1, P: 1 },
  { nom: "Cellule d'euglène", m: 1, c: 1, n: 1, y: 1, u: 1 },
  { nom: "Cellule d'épiderme d'oignon", m: 1, p: 1, n: 1, y: 1, P: 1 },
  { nom: "Cellule d'épiderme de grenouille", m: 1, n: 1, y: 1, P: 1 },
  { nom: "Paramécie", m: 1, n: 1, y: 1, u: 1 },
];

/* ===== Générateurs ===== */
const unite = () => tirer([() => questionTrou(TEXTES[0]), () => questionTrou(TEXTES[0]), () => tirer([
  () => q("L'unité du vivant", "Quelle est l'unité du vivant ?", ["La cellule", "Le noyau", "L'organe", "Le microscope"], "Dans le tableau comparatif, toutes les cellules ont une membrane plasmique, un cytoplasme et un noyau : CELLULE = UNITÉ DU VIVANT."),
  () => q("L'unité du vivant", "Quelles parties ont toutes les cellules du tableau comparatif ?", ["Membrane plasmique, cytoplasme, noyau", "Paroi, chloroplaste, noyau", "Membrane plasmique, paroi, vacuole", "Chloroplaste, cytoplasme, paroi"], "Ce sont les 3 colonnes entourées en rouge sur la feuille : la structure commune à tous les êtres vivants."),
  () => q("L'unité du vivant", "Les points communs entre toutes les cellules sont un argument en faveur…", ["D'une origine commune (parenté) de tous les êtres vivants", "D'une origine différente pour chaque être vivant", "D'une absence de cellules chez les plantes", "D'un âge de la Terre de 10 ans"], "Ces points communs reflètent l'unité des êtres vivants : ils ont sans doute tous un ancêtre commun."),
])]);
const cellules = () => tirer([
  () => { const c = one(CELLULES); return q("Le tableau des cellules", `${esc(c.nom)} : être vivant unicellulaire ou pluricellulaire ?`, [c.u ? "Unicellulaire" : "Pluricellulaire", c.u ? "Pluricellulaire" : "Unicellulaire"], c.u ? "Cette cellule est à elle seule un être vivant entier : une seule cellule." : "Cette cellule fait partie d'un être vivant composé de nombreuses cellules.", { grid: true }) },
  () => q("Le tableau des cellules", "Quelle cellule perd son noyau au cours de sa maturation ?", ["L'hématie (globule rouge)", "Le leucocyte", "La paramécie", "La cellule d'oignon"], "Dans le tableau : « + puis perte au cours de leur maturation ». C'est la cellule de la goutte de sang qui n'a pas de noyau."),
  () => q("Le tableau des cellules", "Lesquelles ont des chloroplastes, d'après le tableau ?", ["L'euglène et l'élodée", "L'hématie et le macrophage", "La paramécie et la grenouille", "L'oignon et la cellule buccale"], "Les chloroplastes donnent la couleur verte : l'euglène et l'élodée (une plante d'eau)."),
  () => q("Le tableau des cellules", "Quels êtres vivants du tableau sont unicellulaires ?", ["L'euglène et la paramécie", "L'oignon et la grenouille", "L'élodée et l'euglène", "L'être humain et la paramécie"], "Une seule cellule = un être vivant entier : l'euglène et la paramécie."),
  () => q("Le tableau des cellules", "D'après le bilan, quels êtres vivants ont une paroi ?", ["La levure et l'oignon", "L'euglène et la paramécie", "L'hématie et le leucocyte", "La grenouille et l'être humain"], "« Certains ont une paroi (ex : levure, oignon) »."),
  () => q("Le tableau des cellules", "Quel est le titre de ce tableau dans le classeur ?", ["Tableau comparatif des cellules entre êtres vivants", "Photographie de cellules de sang", "Schéma d'une feuille", "Tableau des outils de mesure"], "Un titre de tableau commence par le mot « Tableau… », et on le souligne."),
]);
const temps = () => tirer([
  () => q("Ga, Ma, LUCA", "Que veut dire « Ga » ?", ["Un milliard d'années", "Un million d'années", "Mille ans", "Un gramme"], "Ga = milliard d'années (G comme « giga », qui veut dire milliard). Ma = million d'années.", { grid: true }),
  () => q("Ga, Ma, LUCA", "Que veut dire « Ma » ?", ["Un million d'années", "Un milliard d'années", "Mille ans", "Un mois"], "Ma = million d'années. Ga = milliard d'années.", { grid: true }),
  () => q("Ga, Ma, LUCA", "Comment s'appelle le 1er être vivant hypothétique, ancêtre de tous les êtres vivants ?", ["LUCA", "Lucy", "Toumaï", "L'euglène"], "LUCA : Last Universal Common Ancestor, le dernier ancêtre commun universel. Lucy et Toumaï sont des fossiles de la lignée humaine, bien plus récents.", { grid: true, center: true }),
  () => q("Ga, Ma, LUCA", "Quel est l'âge de la Terre ?", ["4,6 Ga", "4,6 Ma", "3,8 Ga", "2026 ans"], "La Terre a environ 4,6 milliards d'années (4,55 Ga pour être précis).", { grid: true, center: true }),
  () => q("Ga, Ma, LUCA", "Les premières traces identifiées d'êtres vivants datent d'il y a environ…", ["3,8 Ga", "4,6 Ga", "3,8 Ma", "10 000 ans"], "Environ 3,8 milliards d'années (certains livres disent 3,5 Ga) : la vie est apparue après la formation de la Terre (4,6 Ga).", { grid: true, center: true }),
  () => q("Ga, Ma, LUCA", "Attention aux majuscules ! Lequel est bien écrit pour « milliard d'années » ?", ["Ga", "ga", "GA", "gA"], "Un G majuscule et un a minuscule : Ga. Pareil pour Ma.", { grid: true, center: true }),
]);
const bilan2 = () => questionTrou(TEXTES[1]);
const niveaux = () => tirer([() => questionTrou(TEXTES[2]), () => tirer([
  () => q("Les 3 niveaux", "Selon combien de niveaux se distingue la biodiversité ?", ["3", "2", "4", "8"], "La diversité écologique (des écosystèmes), spécifique (des espèces) et génétique (des individus d'une même espèce).", { grid: true, center: true }),
  () => q("Les 3 niveaux", "Des êtres humains ont des yeux de couleurs différentes. C'est la diversité…", ["Génétique", "Spécifique", "Écologique", "Minérale"], "Des différences entre les individus d'une même espèce : la diversité génétique (exemple pris sur le site du Muséum).", { grid: true }),
  () => q("Les 3 niveaux", "On compte toutes les espèces d'arbres du jardin du collège. C'est la diversité…", ["Spécifique", "Génétique", "Écologique", "Cellulaire"], "Le nombre des différentes espèces : la diversité spécifique (« espèce » se dit species en latin).", { grid: true }),
  () => q("Les 3 niveaux", "Le jardin du collège, une forêt, un récif de corail : ce sont des exemples de diversité…", ["Écologique", "Génétique", "Spécifique", "Cellulaire"], "À l'échelle des écosystèmes : la diversité écologique.", { grid: true }),
  () => q("Les 3 niveaux", "Qu'est-ce qu'un gène ?", ["Une information du matériel génétique qui fabrique les caractères", "Un outil de mesure", "Une espèce d'arbre", "Une partie de la feuille"], "Gène = information contenue dans le matériel génétique des cellules, qui fabrique les caractères (dans le noyau pour une grande partie des êtres vivants)."),
])]);

// Les nouvelles questions du mémo « Testing » (biodiversité et clé de détermination), mot pour mot.
const CARTES = [
  ["biodiv", "Comment prendre la mesure de la richesse du vivant sur Terre / dans un écosystème ?", "On prend la mesure de la richesse du vivant en l'observant. On appelle cela la biodiversité et on inventorie (inventorier, inventaire, une liste exhaustive / précise) l'ensemble des êtres vivants d'un lieu."],
  ["biodiv", "Comment identifier le nom des êtres vivants ?", "On s'appuie sur un outil appelé clé de détermination ou clé d'identification."],
  ["biodiv", "Comment fonctionne une clé de détermination ?", "On peut lire une succession de caractères observables que l'on voit sur l'être vivant jusqu'à son nom d'espèce."],
  ["biodiv", "Quel est le synonyme de caractère ?", "Particularité."],
  ["biodiv", "Que signifie le mot biodiversité ?", "C'est s'intéresser à la richesse des êtres vivants sur Terre à des échelles choisies."],
];
const biodiv = () => tirer([() => {
  const [, question, reponse] = one(CARTES); const autres = shuffle(CARTES.filter(c => c[1] !== question)).slice(0, 3).map(c => c[2]);
  return q("Le mémo", esc(question), [reponse, ...autres], "C'est la réponse du mémo « Testing ».");
}, () => tirer([
  () => q("Le mémo", "Pourquoi est-il important d'identifier les êtres vivants ?", ["Tout ce qui est inconnu est ignoré, donc pas ou mal protégé", "Pour pouvoir les manger", "Pour remplir son classeur", "Ça ne sert à rien"], "Connaître la biodiversité permet de comprendre, puis d'agir pour la protéger, et donc de nous protéger."),
  () => q("Le mémo", "Inventorier, c'est…", ["Faire la liste précise", "Inventer un être vivant", "Mesurer la température", "Dessiner une cellule"], "Inventorier = faire la liste précise (un inventaire)."),
])]);
biodiv.cartes = CARTES;
unite.textes = TEXTES;
unite.cellules = CELLULES;

Moteur.banque("sciences-bilans-unite-biodiversite", { unite, cellules, temps, bilan2, niveaux, biodiv });
})();
