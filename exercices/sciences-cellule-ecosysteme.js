/* Questions de « La cellule et l'écosystème du jardin » (SVT).
 * La page revisions/sciences-cellule-ecosysteme.html les réutilise : elle lit aussi
 * classeur.liste (les questions-réponses de la fiche « Testing »), composantes.liste (le tri du jardin),
 * outils.liste (outil, paramètre, unité) et cellule.figure (le schéma de la cellule). */
(function () {
const { esc, pick, shuffle } = Moteur;
const one = a => a[Math.floor(Math.random() * a.length)];

// La fiche « Testing 6e » du classeur, presque mot pour mot : [thème, question, réponse].
// Seule retouche : « "on/nous" au lieu du "nous" », mal tapé sur la feuille, devient « au lieu du "je" ».
const CLASSEUR = [
 ["demarche", "Quelle est la définition du mot hypothèse ?", "Une réponse provisoire (temporaire) à un problème posé."],
 ["demarche", "Quelles sont les deux étapes, dans l'ordre, du début d'une démarche scientifique ?", "D'abord formuler un problème, puis formuler une hypothèse."],
 ["demarche", "Quel est l'intérêt d'utiliser « notre » au lieu de « mon », ou « on / nous » au lieu de « je », en sciences ?", "Les sciences sont une démonstration où l'on tend vers un accord commun : tous les scientifiques s'accordent sur une démarche rigoureuse, pour être au plus près de l'objectivité scientifique commune."],
 ["demarche", "Comment nomme-t-on le 1er mot d'un titre ?", "La nature ou le type du document."],
 ["demarche", "Combien de natures de documents dois-je connaître ?", "Au moins 6."],
 ["demarche", "Cite les différentes natures de documents possibles.", "Photographie, texte, schéma, planisphère, tableau, dessin, graphique."],
 ["demarche", "Combien de catégories de tableau ai-je apprises avec le point méthode ?", "3."],
 ["demarche", "Cite les 3 types de tableau possibles.", "Un tableau à simple entrée en lignes, un tableau à simple entrée en colonnes, un tableau à double entrée."],
 ["demarche", "Que dois-je rédiger sous un schéma, un graphique, un tableau, un dessin, un planisphère, une photographie ?", "Un titre."],
 ["cellule", "Quel est le problème formulé quand nous avons observé une goutte de sang au microscope ?", "Comment définir les êtres vivants à l'échelle microscopique ? Quelle est l'unité du vivant ? Qu'est-ce qu'un être vivant ?"],
 ["cellule", "Quelle hypothèse avons-nous écrite pour ce problème ?", "Un être vivant respire."],
 ["cellule", "Quel est le titre du document de la goutte de sang ?", "Photographie de cellules d'un frottis sanguin humain au microscope optique."],
 ["cellule", "Comment se nomme l'outil qui permet d'observer à l'échelle microscopique ?", "Le microscope."],
 ["cellule", "Comment se nomme l'outil qui permet de voir loin ?", "Les jumelles, un télescope."],
 ["cellule", "Combien de parties composent en général une cellule ?", "3."],
 ["cellule", "Nomme les parties communes des cellules.", "La membrane plasmique, le cytoplasme, le noyau."],
 ["cellule", "Les cellules sont-elles exactement identiques ?", "Non, on constate une diversité cellulaire : à l'échelle microscopique, on a découvert 3 types de cellules différentes dans une goutte de sang."],
 ["cellule", "Comment prouver que les êtres vivants sont composés de cellules ?", "Il faut observer plusieurs espèces d'êtres vivants (par exemple des végétaux) pour prouver qu'ils sont tous composés de cellules à l'échelle microscopique."],
 ["ecosysteme", "Quel est le problème que l'on résout avec le jardin du collège ?", "Comment découvrir un écosystème comme le jardin du collège ?"],
 ["ecosysteme", "Quelle stratégie a-t-on employée pour résoudre ce problème et vérifier nos hypothèses ?", "On doit se déplacer, observer, utiliser des outils de mesure et d'observation, et noter une trace écrite."],
 ["ecosysteme", "Quel est le problème de l'activité avec le plan du collège, la 1re fois au jardin ?", "Comment s'organise un écosystème ?"],
 ["ecosysteme", "Cite deux hypothèses écrites dans le classeur pour ce problème.", "Un écosystème se compose d'insectes. Un écosystème se compose d'arbres."],
 ["ecosysteme", "Combien de composantes a-t-on définies dans un environnement ?", "3."],
 ["ecosysteme", "Cite rigoureusement les 3 composantes de l'environnement.", "La composante vivante (les êtres vivants et leurs restes) ; la composante minérale (objet naturel) ; la composante technique (les manifestations de l'activité humaine, objet technique)."],
 ["ecosysteme", "Cite au moins 4 éléments de la composante minérale.", "Air, eau, roche, soleil, lave, magma, cailloux, sable."],
 ["ecosysteme", "Dans quelle catégorie doit-on placer l'herbe, une plume ?", "Dans la composante « êtres vivants et leurs restes »."],
 ["ecosysteme", "Combien d'outils de mesure dois-je connaître ?", "8."],
 ["ecosysteme", "Nomme ces outils.", "Baromètre, sonde à dioxyde de carbone, oxymètre, thermomètre, pluviomètre, luxmètre, anémomètre, hygromètre."],
 ["ecosysteme", "Nomme les paramètres que mesurent ces outils.", "La pression atmosphérique, la teneur en dioxyde de carbone, le taux de dioxygène, la température, la pluviométrie, la luminosité, la vitesse du vent, la teneur en humidité."],
 ["ecosysteme", "Sais-je bien faire la différence entre paramètre, outil et unité ?", "Le nom de l'outil n'est pas ce qu'il mesure. L'unité de mesure n'est pas le nom de l'outil. Il faut être rigoureux sur le vocabulaire : on ne dit pas « ceci mesure les degrés Celsius »."],
 ["ecosysteme", "Qu'est-ce qu'une condition ?", "C'est un paramètre, une donnée à prendre en compte dans une situation, qui peut être mesurable ou variable, contrôlée."],
 ["ecosysteme", "Qu'est-ce qu'une unité ?", "C'est un petit mot qui permet de montrer la manière dont nous exprimons les mesures de quantités."],
 ["ecosysteme", "Combien de gaz composent l'air ?", "Au moins 4."],
 ["ecosysteme", "Cite les gaz qui composent l'air et leur proportion.", "Diazote N₂ : 78 % ; dioxygène O₂ : 20,9 % ; dioxyde de carbone CO₂ : 0,04 % ; eau H₂O : proportion variable."],
];

// Le tableau trié en classe avec les éléments observés au jardin.
const COMPOSANTES = [
 { nom: "Composante vivante", d: "les êtres vivants et leurs restes", x: ["pyrrhocore", "plume", "fourmi", "arbre", "herbe", "lichen"] },
 { nom: "Composante minérale", d: "objet naturel", x: ["eau", "roche", "air", "cailloux", "sable", "soleil", "lave", "magma"] },
 { nom: "Composante technique", d: "les manifestations de l'activité humaine", x: ["banc", "mur", "voiture"] },
];

// Le « Tableau explicatif de quelques outils de mesures ». n = noms acceptés à la saisie, g = groupe d'unités
// communes (l'oxymètre et la sonde à CO₂ partagent % et mg/L : on ne les oppose pas sur l'unité).
const OUTILS = [
 { o: "le thermomètre", p: "la température", u: "°C (degré Celsius)", n: ["thermometre"] },
 { o: "le luxmètre", p: "la quantité de lumière (luminosité)", u: "lux", n: ["luxmetre"] },
 { o: "l'hygromètre", p: "l'humidité (hygrométrie)", u: "% d'humidité", n: ["hygrometre"] },
 { o: "le pluviomètre", p: "la quantité de pluie (pluviométrie)", u: "mm par semaine, par mois ou par an", n: ["pluviometre"] },
 { o: "l'anémomètre", p: "la vitesse du vent (anémométrie)", u: "m/s ou km/h", n: ["anemometre"] },
 { o: "le baromètre", p: "la pression atmosphérique", u: "Pa (pascal), hPa, bar, mm de mercure", n: ["barometre"] },
 { o: "l'oxymètre", p: "la quantité de dioxygène", u: "% ou mg/L", n: ["oxymetre"], g: "gaz" },
 { o: "la sonde à dioxyde de carbone", p: "la quantité de dioxyde de carbone (CO₂)", u: "%, mg/L ou ppm", n: ["sonde a dioxyde de carbone", "sonde a co2", "sonde co2", "sonde a dioxyde carbone"], g: "gaz" },
];

const AIR = [
 { n: "le diazote", f: "N₂", p: "78 %" },
 { n: "le dioxygène", f: "O₂", p: "20,9 %" },
 { n: "le dioxyde de carbone", f: "CO₂", p: "0,04 %" },
 { n: "l'eau", f: "H₂O", p: "une proportion variable" },
];

// La cellule : membrane plasmique, cytoplasme, noyau. Les numéros changent de place à chaque question.
const PARTIES = ["la membrane plasmique", "le cytoplasme", "le noyau"];
function figure(numeros) {
  const cible = [[203, 60], [170, 80], [125, 112]], ys = [40, 100, 160];
  let s = `<ellipse cx="120" cy="100" rx="96" ry="76" fill="var(--ok-bg)" stroke="var(--green)" stroke-width="6"/>`
    + `<circle cx="104" cy="94" r="29" fill="var(--blue)" opacity=".85"/>`
    + [[60, 70], [80, 140], [150, 60], [160, 150], [190, 100], [55, 115]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3" fill="var(--green)" opacity=".5"/>`).join("");
  numeros.forEach((k, i) => {
    const [x, y] = cible[i], ly = ys[k - 1];
    s += `<line x1="${x}" y1="${y}" x2="262" y2="${ly}" stroke="var(--ink)" stroke-width="2"/><circle cx="${x}" cy="${y}" r="4" fill="var(--ink)"/>`
      + `<circle cx="282" cy="${ly}" r="17" fill="var(--card)" stroke="var(--ink)" stroke-width="2.5"/><text x="282" y="${ly + 6}" text-anchor="middle" font-family="Fredoka,sans-serif" font-weight="700" font-size="18" fill="var(--ink)">${k}</text>`;
  });
  return `<svg viewBox="0 0 310 200" role="img" aria-label="schéma d'une cellule avec des numéros">${s}</svg>`;
}

// Pour la saisie : sans majuscules, accents, articles ni espaces en trop.
const net = s => String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[’']/g, " ")
  .replace(/^\s*(le|la|les|l|un|une|des)\s+/, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
const Maj = s => s.replace(/^(le |la |l')/, "").replace(/^./, c => c.toUpperCase());

const q = (cat, prompt, options, explain, extra) => Moteur.QCM({ cat, prompt, options: options.map(esc), correct: 0, explain: explain || "", ...extra });
const tirer = fs => one(fs)();

const classeur = function () {
  const [, question, reponse] = one(CLASSEUR);
  const autres = pick([...new Set(CLASSEUR.map(c => c[2]))].filter(r => r !== reponse), 3);
  return q("Classeur", esc(question), [reponse, ...autres], "C'est la réponse de la fiche « Testing » du classeur.");
};
classeur.liste = CLASSEUR;

const composantes = function () {
  const c = one(COMPOSANTES), x = one(c.x);
  if (Math.random() < .75) return Moteur.QCM({ cat: "Composantes", prompt: `Au jardin du collège, on a observé : <b>${esc(x)}</b>.<br>Dans quelle composante le range-t-on ?`,
    options: COMPOSANTES.map(k => esc(k.nom)), correct: COMPOSANTES.indexOf(c), keep: true,
    explain: `${esc(Maj(x))} va dans la ${esc(c.nom.toLowerCase())} : ${esc(c.d)}.${c === COMPOSANTES[0] && ["plume", "herbe"].includes(x) ? " Une plume ou de l'herbe, ce sont des êtres vivants ou leurs restes." : ""}` });
  const intrus = one(COMPOSANTES.filter(k => k !== c).flatMap(k => k.x));
  return q("Composantes", `Lequel de ces éléments n'appartient <b>pas</b> à la ${esc(c.nom.toLowerCase())} ?`, [intrus, ...pick(c.x, 3)].map(Maj),
    `La ${c.nom.toLowerCase()} (${c.d}) : ${c.x.join(", ")}.`);
};
composantes.liste = COMPOSANTES;

const outils = function () {
  const r = Math.random(), x = one(OUTILS), autres = pick(OUTILS.filter(o => o !== x), 3);
  const resume = `${Maj(x.o)} mesure ${x.p}, en ${x.u}.`;
  if (r < .3) return q("Outils", `Que mesure ${esc(x.o)} ?`, [x.p, ...autres.map(o => o.p)].map(Maj), resume);
  if (r < .55) return q("Outils", `Quel outil mesure ${esc(x.p)} ?`, [x.o, ...autres.map(o => o.o)].map(Maj), resume);
  if (r < .75) {
    const y = one(OUTILS), faux = pick(OUTILS.filter(o => o !== y && !(o.g && o.g === y.g)), 3);
    return q("Outils", `Quelle est l'unité de ce que mesure ${esc(y.o)} ?`, [y.u, ...faux.map(o => o.u)], `${Maj(y.o)} mesure ${y.p}, en ${y.u}.`);
  }
  if (r < .88) return Moteur.INPUT({ cat: "Outils", prompt: `Quel outil de mesure utilise-t-on pour mesurer ${esc(x.p)} ?`, fields: [{ mode: "text", w: "14em" }], answer: esc(Maj(x.o)),
    check: v => x.n.includes(net(v[0])), explain: ` ${esc(resume)} Les majuscules et les accents ne comptent pas ici, mais soigne l'orthographe le jour du contrôle.` });
  return q("Outils", "Quelle phrase est juste ?", ["Le thermomètre mesure la température, en °C.", "Le thermomètre mesure les degrés Celsius.", "Le degré Celsius mesure la température.", "La température mesure le thermomètre."],
    "Attention au vocabulaire : l'outil (le thermomètre) mesure un paramètre (la température), exprimé dans une unité (le °C). On ne dit pas « il mesure les degrés Celsius ».");
};
outils.liste = OUTILS;

const cellule = function () {
  const r = Math.random(), num = shuffle([1, 2, 3]), i = Math.floor(Math.random() * 3);
  const bilan = "Cellule = membrane plasmique + cytoplasme + noyau.";
  if (r < .45) return Moteur.QCM({ cat: "Cellule", fig: figure(num), prompt: `Que montre le numéro ${num[i]} ?`, options: PARTIES.map(p => esc(Maj(p))), correct: i, keep: true,
    explain: "La membrane plasmique borde la cellule, le cytoplasme la remplit, et le noyau baigne dans le cytoplasme." });
  if (r < .7) return Moteur.QCM({ cat: "Cellule", fig: figure(num), prompt: `Quel numéro montre ${PARTIES[i]} ?`, options: ["1", "2", "3"], correct: num[i] - 1, keep: true, grid: true, center: true,
    explain: `C'est le numéro ${num[i]}. ${bilan}` });
  return tirer([
    () => q("Cellule", "Quelles sont les 3 parties communes des cellules ?", ["La membrane plasmique, le cytoplasme, le noyau", "La membrane, le sang, le noyau", "Le cytoplasme, le microscope, le noyau", "La peau, le cytoplasme, le cœur"], bilan),
    () => q("Cellule", "Les cellules sont-elles toutes exactement identiques ?", ["Non : il y a une diversité cellulaire", "Oui : elles ont toutes la même forme"], "Dans une goutte de sang, on a découvert 3 types de cellules différentes. Mais elles ont toutes une membrane plasmique et un cytoplasme, et la plupart du temps un noyau."),
    () => q("Cellule", "Combien de types de cellules différentes a-t-on vus dans une goutte de sang ?", ["3", "1", "2", "8"], "On a vu 3 types de cellules dans la goutte de sang : c'est la diversité cellulaire.", { grid: true, center: true }),
    () => q("Cellule", "Quel outil permet d'observer à l'échelle microscopique ?", ["Le microscope", "Le télescope", "Les jumelles", "Le luxmètre"], "Le microscope sert à voir tout petit. Les jumelles et le télescope servent à voir loin."),
    () => q("Cellule", "Comment prouver que <b>tous</b> les êtres vivants sont composés de cellules ?", ["Observer plusieurs espèces d'êtres vivants au microscope", "Observer une seule goutte de sang", "Le lire dans un dictionnaire", "Mesurer la température"], "Notre bilan n'est pas complet avec le sang humain : il faut observer d'autres êtres vivants, comme les végétaux."),
    () => q("Cellule", "Dans la goutte de sang, une sorte de cellule n'a pas de noyau. Est-ce que c'est quand même une cellule ?", ["Oui : elle a une membrane plasmique et un cytoplasme", "Non : sans noyau, ce n'est pas une cellule"], "Le bilan dit que le noyau baigne dans le cytoplasme « la plupart du temps » : certaines cellules n'en ont pas."),
    () => q("Cellule", "Quel est le titre du document de la goutte de sang ?", ["Photographie de cellules d'un frottis sanguin humain au microscope optique", "Tableau des composantes de notre environnement", "Schéma d'un microscope", "Dessin d'un être vivant"], "Le titre commence par la nature du document : ici, une photographie."),
  ]);
};
cellule.figure = figure;
cellule.parties = PARTIES;

Moteur.banque("sciences-cellule-ecosysteme", {
  classeur,
  cellule,
  composantes,
  outils,
  air() {
    const x = one(AIR), r = Math.random();
    const tout = "Diazote N₂ 78 %, dioxygène O₂ 20,9 %, dioxyde de carbone CO₂ 0,04 %, eau H₂O en proportion variable.";
    if (r < .35) return q("Air", `Quelle part de l'air représente ${esc(x.n)} (${x.f}) ?`, [x.p, ...AIR.filter(a => a !== x).map(a => a.p)], tout);
    if (r < .65) return q("Air", `Quel gaz de l'air a pour formule ${x.f} ?`, [Maj(x.n), ...AIR.filter(a => a !== x).map(a => Maj(a.n))], tout, { grid: true });
    return tirer([
      () => q("Air", "Quel est le gaz le plus abondant dans l'air ?", ["Le diazote", "Le dioxygène", "Le dioxyde de carbone", "L'eau"], tout),
      () => q("Air", "Combien de gaz composent l'air, au moins ?", ["4", "2", "3", "8"], tout, { grid: true, center: true }),
      () => q("Air", "De quoi se compose l'air ?", ["De gaz", "De roches", "D'êtres vivants", "D'eau seulement"], tout),
    ]);
  },
  demarche: () => tirer([
    () => q("Démarche", "Qu'est-ce qu'une hypothèse ?", ["Une réponse provisoire (temporaire) à un problème posé", "La réponse définitive à un problème", "Une question que l'on se pose", "Un outil de mesure"], "Une hypothèse est une réponse provisoire : on doit encore la vérifier."),
    () => q("Démarche", "Au début d'une démarche scientifique, que fait-on en premier ?", ["On formule un problème", "On formule une hypothèse", "On écrit la conclusion", "On range son classeur"], "D'abord formuler un problème, puis formuler une hypothèse."),
    () => q("Démarche", "Quelle est la 2e étape d'une démarche scientifique ?", ["Formuler une hypothèse", "Formuler un problème", "Écrire le titre", "Mesurer la température"], "1re étape : formuler un problème. 2e étape : formuler une ou des hypothèses."),
    () => q("Démarche", "Quel était le problème lié au jardin du collège ?", ["Comment découvrir un écosystème comme le jardin du collège ?", "Comment définir les êtres vivants à l'échelle microscopique ?", "Pourquoi le soleil brille-t-il ?", "Combien y a-t-il d'arbres au collège ?"], "Le problème du jardin : comment découvrir un écosystème comme le jardin du collège ?"),
    () => q("Démarche", "Quel problème a-t-on formulé en observant une goutte de sang au microscope ?", ["Comment définir les êtres vivants à l'échelle microscopique ?", "Comment découvrir un écosystème ?", "Comment s'organise un écosystème ?", "Que contient précisément l'air ?"], "Avec aussi : quelle est l'unité du vivant ? qu'est-ce qu'un être vivant ?"),
    () => q("Démarche", "Laquelle de ces hypothèses a été écrite dans le classeur pour « Comment s'organise un écosystème ? »", ["Un écosystème se compose d'arbres", "Un écosystème se compose de voitures", "Un écosystème n'a pas d'êtres vivants", "Un écosystème se compose de cellules de sang"], "Les deux hypothèses du classeur : un écosystème se compose d'insectes, un écosystème se compose d'arbres."),
    () => q("Démarche", "Pour découvrir l'écosystème du jardin, que n'a-t-on <b>pas</b> fait ?", ["Arracher les plantes pour les rapporter en classe", "Se déplacer sur le terrain et observer", "Utiliser des outils d'observation et de mesure", "Noter une trace écrite"], "On prélève et on échantillonne <b>sans dégrader l'environnement</b>."),
    () => q("Démarche", "Pourquoi écrit-on « notre » ou « on / nous » plutôt que « mon » ou « je » en sciences ?", ["Parce que les sciences cherchent un accord commun entre tous les scientifiques", "Parce que c'est plus joli", "Parce que le professeur écrit à notre place", "Parce qu'on n'a pas le droit de dire « je »"], "Les sciences sont une démonstration : tous les scientifiques s'accordent sur une démarche rigoureuse, pour être au plus près de l'objectivité scientifique commune."),
  ]),
  methode: () => tirer([
    () => q("Méthode", "Comment nomme-t-on le 1er mot d'un titre ?", ["La nature (ou le type) du document", "Le paramètre", "L'hypothèse", "L'unité"], "Le 1er mot dit ce qu'est le document : tableau, photographie, schéma…"),
    () => q("Méthode", "« Tableau des composantes de notre environnement » : quelle est la nature de ce document ?", ["Un tableau", "Une photographie", "Un texte", "Un schéma"], "Le 1er mot du titre donne la nature du document."),
    () => q("Méthode", "« Photographie de cellules d'un frottis sanguin humain au microscope optique » : quelle est la nature de ce document ?", ["Une photographie", "Un dessin", "Un tableau", "Un graphique"], "Le 1er mot du titre donne la nature du document."),
    () => q("Méthode", "Lequel n'est <b>pas</b> une nature de document ?", ["Un thermomètre", "Un planisphère", "Un graphique", "Un schéma"], "Natures de documents : photographie, texte, schéma, planisphère, tableau, dessin, graphique."),
    () => q("Méthode", "Quels sont les 3 types de tableau ?", ["À simple entrée en lignes, à simple entrée en colonnes, à double entrée", "Grand, moyen, petit", "En crayon, en stylo, en feutre", "À une case, deux cases, trois cases"], "Les 3 types du point méthode : simple entrée en lignes, simple entrée en colonnes, double entrée."),
    () => q("Méthode", "Que dois-je écrire sous un schéma, un tableau ou une photographie ?", ["Un titre", "Mon prénom", "Une hypothèse", "La date"], "Sous chaque document, on rédige un titre, qui commence par sa nature."),
    () => q("Méthode", "Pour un tableau à double entrée, que faut-il penser à ajouter ?", ["Une colonne et une ligne de plus, pour les titres", "Une couleur par case", "Une ligne de plus seulement", "Rien de plus"], "+1 colonne et +1 ligne : sinon il n'y a pas la place pour les titres des lignes et des colonnes."),
    () => q("Méthode", "Dans un tableau, où écrit-on les unités ?", ["Entre parenthèses", "En dessous du titre", "Dans la marge", "On ne les écrit pas"], "Exemple : Temps (j/mois/année)."),
    () => q("Méthode", "Par quel mot commence le titre d'un tableau ?", ["« Tableau… »", "« Titre… »", "« Voici… »", "« Mon… »"], "On formule le titre en commençant par le mot « Tableau… », puis on le souligne."),
    () => q("Méthode", "Dans les cases d'un tableau, on écrit…", ["Des mots-clés, pas de phrases", "Des phrases complètes", "Des dessins", "Le moins lisiblement possible"], "J'écris avec des mots-clés, lisiblement, dans de grandes cases."),
    () => q("Méthode", "On a trié les éléments du jardin dans quel type de tableau ?", ["Un tableau à simple entrée en colonnes", "Un tableau à double entrée", "Un tableau à simple entrée en lignes", "Un graphique"], "Un tableau à simple entrée à 3 colonnes : une par composante."),
  ]),
  motJuste() {
    const x = one([
      { d: "Une réponse provisoire (temporaire) à un problème posé.", r: ["hypothese"], a: "une hypothèse" },
      { d: "L'outil qui permet d'observer à l'échelle microscopique.", r: ["microscope", "microscope optique"], a: "le microscope" },
      { d: "La partie de la cellule qui la borde tout autour (deux mots).", r: ["membrane plasmique"], a: "la membrane plasmique" },
      { d: "La partie de la cellule qui la remplit, dans laquelle baigne le noyau.", r: ["cytoplasme"], a: "le cytoplasme" },
      { d: "La partie de la cellule qui baigne, la plupart du temps, dans le cytoplasme.", r: ["noyau"], a: "le noyau" },
      { d: "Le nom du 1er mot d'un titre : la … du document.", r: ["nature", "type"], a: "la nature (ou le type)" },
      { d: "Ce que l'on rédige sous un schéma, un tableau ou une photographie.", r: ["titre"], a: "un titre" },
      { d: "Le gaz qui représente 78 % de l'air.", r: ["diazote"], a: "le diazote" },
      { d: "Le gaz de l'air dont la formule est O₂.", r: ["dioxygene"], a: "le dioxygène" },
    ]);
    return Moteur.INPUT({ cat: "Mot juste", prompt: `Quel est le mot ?<br><span style="font-weight:500">${esc(x.d)}</span>`, fields: [{ mode: "text", w: "14em" }], answer: esc(x.a),
      check: v => x.r.includes(net(v[0])), explain: " Les majuscules et les accents ne comptent pas ici, mais soigne l'orthographe le jour du contrôle." });
  },
});
})();
