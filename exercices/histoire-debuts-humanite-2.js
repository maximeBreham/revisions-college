/* Questions de « Les débuts de l'humanité », d'après une leçon recopiée à la main (autre classe que
 * revisions/histoire-debuts-humanite.html : les dates et les mots sont ceux de cette leçon).
 * La page revisions/histoire-debuts-humanite-2.html les réutilise : elle lit aussi definir.cartes,
 * frise.liste (la frise du Paléolithique) et peuplement.liste (l'ordre des continents). */
(function () {
const { esc, pick } = Moteur;
const one = a => a[Math.floor(Math.random() * a.length)];
const tirer = fs => one(fs)();

// [mot, définition], d'après la leçon.
const CARTES = [
 ["La Préhistoire", "La période qui démarre avec l'apparition du genre humain et qui s'achève avec celle de l'écriture."],
 ["Comment connaît-on la Préhistoire ?", "Grâce aux fouilles et aux découvertes archéologiques."],
 ["Les hominidés", "Le groupe de grands singes dont les représentants sont les bonobos, les gorilles, les chimpanzés, les orangs-outans et les humains."],
 ["Toumaï", "Notre plus vieil ancêtre connu (7 millions d'années). Il appartient au groupe des hominidés."],
 ["Lucy", "Une australopithèque (3,2 millions d'années) : elle est aussi l'une de nos lointaines ancêtres."],
 ["Homo habilis", "« L'homme habile » (2,8 millions d'années) : il démarre le genre humain."],
 ["Homo sapiens", "L'espèce humaine apparue il y a 300 000 ans. Les Homo sapiens pratiquent l'art et enterrent leurs morts."],
 ["Le Paléolithique", "« Âge ancien de la pierre » en grec : l'âge de la pierre taillée. Il s'étend des premiers humains jusqu'à l'apparition de l'agriculture."],
 ["Nomade", "Qui n'a pas d'habitat fixe. Les premiers humains sont nomades."],
 ["Bipède", "Qui marche sur deux pieds. Les premiers humains sont totalement bipèdes."],
 ["Où sont apparus nos plus anciens ancêtres ?", "En Afrique, plus précisément au Tchad et en Éthiopie."],
];

// La frise de la leçon, du plus ancien au plus récent. Le feu et l'agriculture n'y ont pas de date.
const FRISE = [
 { k: "Toumaï", d: "−7 millions d'années" },
 { k: "Lucy", d: "−3,2 millions d'années" },
 { k: "Homo habilis", d: "−2,8 millions d'années" },
 { k: "Homo erectus", d: "−1,9 million d'années" },
 { k: "L'apparition du feu", d: null },
 { k: "Homo sapiens", d: "−300 000 ans" },
 { k: "L'apparition de l'agriculture", d: null },
];
const DATEES = FRISE.filter(f => f.d);

// Le peuplement de la Terre, dans l'ordre de la leçon.
const PEUPLEMENT = [
 { k: "Afrique", d: "Les premiers humains y apparaissent, puis la quittent il y a environ 2 millions d'années." },
 { k: "Asie", d: "Atteinte en passant par le nord-est de l'Afrique." },
 { k: "Europe", d: "Les humains peuplent peu à peu l'Afrique et l'Europe." },
 { k: "Océanie", d: "Atteinte par les Homo sapiens." },
 { k: "Amérique", d: "Atteinte par les Homo sapiens, après l'Océanie." },
];

const net = s => String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[’']/g, " ")
  .replace(/^\s*(le|la|les|l|un|une|des)\s+/, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
const q = (cat, prompt, options, explain, extra) => Moteur.QCM({ cat, prompt, options: options.map(esc), correct: 0, explain: explain || "", ...extra });

const definir = function () {
  const [w, d] = one(CARTES.filter(c => !c[0].endsWith("?")));
  const autres = pick(CARTES.filter(x => x[0] !== w && !x[0].endsWith("?")), 3);
  return Math.random() < .5
    ? q("Définir", `Que veut dire « ${esc(w)} » ?`, [d, ...autres.map(x => x[1])])
    : q("Définir", `De quoi parle-t-on ? « ${esc(d)} »`, [w, ...autres.map(x => x[0])]);
};
definir.cartes = CARTES;

const frise = function () {
  const r = Math.random(), recap = DATEES.map(f => `${f.k} ${f.d}`).join(", ") + ".";
  if (r < .4) { const x = one(DATEES); return q("Frise", `D'après la frise, quand date ${esc(x.k)} ?`, [x.d, ...pick(DATEES.filter(f => f !== x), 3).map(f => f.d)], recap); }
  if (r < .7) {
    const [a, b] = pick(FRISE, 2), ia = FRISE.indexOf(a), ib = FRISE.indexOf(b), avant = ia < ib ? a : b;
    return q("Frise", `Sur la frise, qui est le plus ancien ?`, [avant.k, (avant === a ? b : a).k], "Sur la frise, dans l'ordre : " + FRISE.map(f => f.k).join(" → ") + ".", { grid: true });
  }
  return tirer([
    () => q("Frise", "Qui est notre plus vieil ancêtre connu ?", ["Toumaï", "Lucy", "Homo habilis", "Homo sapiens"], "Toumaï, 7 millions d'années, est notre plus vieil ancêtre connu."),
    () => q("Frise", "Quelle espèce démarre le genre humain ?", ["Homo habilis", "Homo sapiens", "Toumaï", "Lucy"], "Homo habilis (« l'homme habile », −2,8 millions d'années) démarre le genre humain."),
    () => q("Frise", "Que veut dire « Homo habilis » ?", ["L'homme habile", "L'homme debout", "L'homme sage", "Le premier homme"], "Homo habilis = l'homme habile."),
    () => q("Frise", "Quel événement marque la fin du Paléolithique sur la frise ?", ["L'apparition de l'agriculture", "L'apparition du feu", "L'apparition d'Homo sapiens", "L'apparition de Toumaï"], "Le Paléolithique s'étend des premiers humains jusqu'à l'apparition de l'agriculture."),
    () => q("Frise", "Sur la frise, qu'est-ce qui vient juste avant Homo sapiens ?", ["L'apparition du feu", "Lucy", "L'apparition de l'agriculture", "Toumaï"], "Ordre de la frise : " + FRISE.map(f => f.k).join(" → ") + "."),
  ]);
};
frise.liste = FRISE;

const peuplement = function () {
  const r = Math.random();
  const ordre = "Afrique → Asie (par le nord-est de l'Afrique) → Europe → Océanie → Amérique.";
  if (r < .35) { const i = 1 + Math.floor(Math.random() * 3), x = PEUPLEMENT[i], y = PEUPLEMENT[i + 1];
    return q("Peuplement", `D'après la leçon, quel continent les humains atteignent-ils après ${x.k === "Asie" ? "l'Asie" : x.k === "Europe" ? "l'Europe" : "l'Océanie"} ?`, [y.k, ...PEUPLEMENT.filter(p => p !== y && p !== x).map(p => p.k).slice(0, 3)], ordre, { grid: true }); }
  return tirer([
    () => q("Peuplement", "Sur quel continent les premiers humains sont-ils apparus ?", ["En Afrique", "En Europe", "En Asie", "En Amérique"], "Nos plus anciens ancêtres sont apparus en Afrique, au Tchad et en Éthiopie."),
    () => q("Peuplement", "Dans quels pays d'Afrique sont apparus nos plus anciens ancêtres ?", ["Au Tchad et en Éthiopie", "En Égypte et au Maroc", "Au Sénégal et au Mali", "En Afrique du Sud et à Madagascar"], "Plus précisément au Tchad et en Éthiopie."),
    () => q("Peuplement", "Il y a combien de temps les premiers humains ont-ils quitté l'Afrique, d'après les archéologues ?", ["Environ 2 millions d'années", "Environ 7 millions d'années", "Environ 300 000 ans", "Environ 10 000 ans"], "Les archéologues pensent que les premiers humains ont quitté l'Afrique il y a environ 2 millions d'années."),
    () => q("Peuplement", "Par où les humains sont-ils passés pour atteindre l'Asie ?", ["Par le nord-est de l'Afrique", "Par le sud de l'Afrique", "Par l'Amérique", "Par l'Océanie"], "Ils ont atteint l'Asie en passant par le nord-est de l'Afrique."),
    () => q("Peuplement", "Qui a atteint l'Océanie puis l'Amérique ?", ["Les Homo sapiens", "Homo habilis", "Toumaï", "Lucy"], "Ce sont les Homo sapiens qui vont atteindre l'Océanie, puis l'Amérique."),
    () => q("Peuplement", "Quels sont les deux derniers continents atteints, dans l'ordre ?", ["L'Océanie, puis l'Amérique", "L'Amérique, puis l'Océanie", "L'Europe, puis l'Asie", "L'Asie, puis l'Afrique"], ordre),
  ]);
};
peuplement.liste = PEUPLEMENT;

Moteur.banque("histoire-debuts-humanite-2", {
  definir,
  frise,
  peuplement,
  vie: () => tirer([
    () => q("La vie", "Au Paléolithique, de quoi vivent les humains ?", ["De la chasse, de la pêche et de la cueillette", "De l'agriculture et de l'élevage", "Du commerce", "Seulement de la cueillette"], "Durant le Paléolithique, les humains vivent de la chasse, de la pêche et de la cueillette."),
    () => q("La vie", "Les premiers humains sont nomades. Qu'est-ce que ça veut dire ?", ["Ils n'ont pas d'habitat fixe", "Ils vivent dans des villages", "Ils ne savent pas marcher", "Ils vivent seuls"], "Nomade : qui n'a pas d'habitat fixe."),
    () => q("La vie", "Où s'abritent les premiers humains ?", ["Dans des huttes, des tentes de peaux ou à l'entrée des grottes", "Dans des maisons en briques", "Dans des châteaux", "Ils ne s'abritent jamais"], "Ils s'abritent dans des huttes, des tentes de peaux ou à l'entrée des grottes."),
    () => q("La vie", "Avec quoi fabriquent-ils leurs armes ?", ["Des silex taillés, des os, du bois", "Du fer et du bronze", "Du plastique", "De l'or"], "Ils fabriquent leurs armes avec des silex taillés, des os, du bois."),
    () => q("La vie", "Comment mangent-ils la viande avant l'invention du feu ?", ["Crue", "Cuite", "Fumée", "Ils ne mangent pas de viande"], "Leur alimentation se compose surtout de viande, consommée crue jusqu'à l'invention du feu."),
    () => q("La vie", "Que font les Homo sapiens, d'après la leçon ?", ["Ils pratiquent l'art et enterrent leurs morts", "Ils inventent l'écriture", "Ils construisent des villes", "Ils marchent à quatre pattes"], "Les Homo sapiens pratiquent l'art et enterrent leurs morts."),
    () => q("La vie", "Plus on avance vers les Homo sapiens, plus les outils sont…", ["Perfectionnés", "Simples", "Gros", "Rares"], "Plus l'humanité avance vers les Homo sapiens, plus les outils fabriqués sont perfectionnés."),
    () => q("La vie", "Qu'est-ce qui va remettre en question la vie nomade ?", ["Le développement de l'agriculture et de l'élevage", "L'invention du feu", "L'arrivée en Asie", "La chasse"], "Conclusion de la leçon : le mode de vie nomade va être remis en question par l'agriculture et l'élevage."),
    () => q("La vie", "Comment sont les premiers humains pour marcher ?", ["Totalement bipèdes", "À quatre pattes", "Ils grimpent aux arbres", "Ils rampent"], "Les premiers humains sont totalement bipèdes : ils marchent sur deux pieds."),
  ]),
  connaitre: () => tirer([
    () => q("À savoir", "Quand commence la Préhistoire ?", ["Avec l'apparition du genre humain", "Avec l'invention de l'écriture", "Avec l'agriculture", "Avec l'apparition du feu"], "La Préhistoire démarre avec l'apparition du genre humain et s'achève avec celle de l'écriture."),
    () => q("À savoir", "Quand se termine la Préhistoire ?", ["Avec l'apparition de l'écriture", "Avec l'apparition du feu", "Avec Homo sapiens", "Avec Lucy"], "La Préhistoire s'achève avec l'apparition de l'écriture."),
    () => q("À savoir", "Grâce à quoi connaît-on la Préhistoire ?", ["Aux fouilles et aux découvertes archéologiques", "Aux livres écrits à l'époque", "Aux films", "Aux journaux"], "Il n'y a pas d'écriture : on la connaît grâce aux fouilles et aux découvertes archéologiques."),
    () => q("À savoir", "Lequel ne fait <b>pas</b> partie des hominidés ?", ["Le loup", "Le gorille", "Le chimpanzé", "L'humain"], "Les hominidés : bonobos, gorilles, chimpanzés, orangs-outans et humains."),
    () => q("À savoir", "Lucy est…", ["Une australopithèque", "Une Homo sapiens", "Un grand singe d'aujourd'hui", "Une archéologue"], "Lucy (australopithèque) est aussi l'une de nos lointaines ancêtres."),
    () => q("À savoir", "Que veut dire « Paléolithique » en grec ?", ["Âge ancien de la pierre", "Âge nouveau de la pierre", "Âge du fer", "Âge de l'écriture"], "Paléolithique : « âge ancien de la pierre », l'âge de la pierre taillée."),
    () => q("À savoir", "Jusqu'à quand va le Paléolithique ?", ["Jusqu'à l'apparition de l'agriculture", "Jusqu'à l'apparition du feu", "Jusqu'à aujourd'hui", "Jusqu'à Homo habilis"], "Le Paléolithique s'étend des premiers humains jusqu'à l'apparition de l'agriculture."),
    () => q("À savoir", "Quelles sont les deux questions de la leçon ?", ["Où et quand les premiers humains sont-ils apparus ? Comment ont-ils peuplé la Terre ?", "Qui a inventé l'écriture ? Où sont les pyramides ?", "Comment vivaient les rois ? Qui a construit les châteaux ?", "Pourquoi le feu brûle-t-il ? Qui a découvert l'Amérique ?"], "C'est la problématique écrite en rouge au début de la leçon."),
  ]),
  motJuste() {
    const x = one([
      { d: "Le groupe de grands singes auquel appartiennent les humains.", r: ["hominides", "hominide"], a: "les hominidés" },
      { d: "Notre plus vieil ancêtre connu (7 millions d'années).", r: ["toumai"], a: "Toumaï" },
      { d: "L'australopithèque qui est l'une de nos lointaines ancêtres.", r: ["lucy"], a: "Lucy" },
      { d: "L'âge de la pierre taillée, jusqu'à l'apparition de l'agriculture.", r: ["paleolithique"], a: "le Paléolithique" },
      { d: "Qui n'a pas d'habitat fixe.", r: ["nomade", "nomades"], a: "nomade" },
      { d: "Qui marche sur deux pieds.", r: ["bipede", "bipedes"], a: "bipède" },
      { d: "Le continent où sont apparus les premiers humains.", r: ["afrique"], a: "l'Afrique" },
      { d: "« L'homme habile », qui démarre le genre humain.", r: ["homo habilis", "habilis"], a: "Homo habilis" },
    ]);
    return Moteur.INPUT({ cat: "Mot juste", prompt: `Quel est le mot ?<br><span style="font-weight:500">${esc(x.d)}</span>`, fields: [{ mode: "text", w: "12em" }], answer: esc(x.a),
      check: v => x.r.includes(net(v[0])), explain: " Les majuscules et les accents ne comptent pas ici, mais soigne l'orthographe le jour du contrôle." });
  },
});
})();
