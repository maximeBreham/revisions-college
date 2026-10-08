/* Questions de « Pulsation, tempo et mesure » (éducation musicale).
 * La page revisions/musique-pulsation-tempo-mesure.html les réutilise : elle lit aussi
 * definir.cartes (le cours en cartes), extraits.liste (les extraits écoutés) et mesure.figure (le geste du chef). */
(function () {
const { esc, pick } = Moteur;
const one = a => a[Math.floor(Math.random() * a.length)];

// [mot, définition]. Les définitions de pulsation, temps, tempo, mesure, BPM et métronome ne sont pas
// sur la feuille du professeur : elles ont été recoupées sur des fiches d'enseignants et simplifiées.
const CARTES = [
 ["La pulsation", "Un battement régulier dans la musique, comme le battement du cœur. On peut la frapper dans les mains ou la taper du pied."],
 ["Un temps", "La durée entre deux pulsations. Chaque pulsation marque le début d'un temps."],
 ["Le tempo", "La vitesse de la pulsation : lent, modéré ou rapide. Il peut aussi changer pendant le morceau (accélérer, ralentir)."],
 ["Le BPM", "« Battements par minute » : le nombre de pulsations en une minute. C'est comme ça qu'on mesure le tempo. 60 BPM = une pulsation par seconde."],
 ["Le métronome", "Un appareil qui fait « tic, tic, tic… » de façon régulière, à la vitesse qu'on choisit (en BPM). Il aide les musiciens à garder le même tempo."],
 ["La mesure", "Un groupe de temps qui revient toujours pareil. On compte « 1, 2 » ou « 1, 2, 3 » ou « 1, 2, 3, 4 » : c'est une mesure à 2, à 3 ou à 4 temps."],
 ["Le premier temps", "Le temps le plus fort de la mesure, celui qu'on sent le mieux. On le compte « 1 »."],
 ["Une musique non pulsée", "Une musique où l'on ne sent pas de pulsation régulière : on ne peut pas la frapper, donc il n'y a pas de tempo. Exemple : l'extrait de Pink Floyd."],
 ["Une marche", "Un morceau qui accentue bien les temps, pour que l'on puisse marcher en cadence, tous au même pas."],
 ["Un concerto", "Une œuvre musicale écrite pour un instrument soliste accompagné d'un orchestre."],
 ["L'orchestre à cordes", "Plusieurs violons, altos, violoncelles et contrebasses, avec une harpe et un clavecin."],
 ["Max Richter", "Le compositeur qui a recomposé Les Quatre Saisons de Vivaldi (en 2012)."],
 ["Décrire une musique", "On dit son tempo (lent, modéré, rapide), sa mesure (à 2, 3 ou 4 temps) et ses instruments."],
];

// Les extraits corrigés en classe : tempo et mesure (null = pas sur la feuille).
const EXTRAITS = [
 { nom: "Danse slave", tempo: "rapide", mesure: 2 },
 { nom: "Pink Floyd", tempo: "pas de tempo (musique non pulsée)", mesure: null },
 { nom: "The Wonder of Life", tempo: "lent", mesure: 4 },
 { nom: "Kalinka", tempo: "il accélère", mesure: 2 },
 { nom: "le Concerto de Rachmaninov", tempo: "modéré", mesure: 4 },
 { nom: "Madagascar", tempo: "modéré puis rapide", mesure: 4 },
 { nom: "le chant « J'envoie valser »", tempo: null, mesure: 3 },
];
const TEMPOS = ["lent", "modéré", "rapide", "il accélère", "modéré puis rapide", "pas de tempo (musique non pulsée)"];

// Le geste du chef d'orchestre : où tombe chaque temps (haut, bas, gauche, droite).
const P = { H: [110, 28], B: [110, 168], G: [38, 112], D: [182, 112] };
const GESTES = { 2: ["B", "H"], 3: ["B", "D", "H"], 4: ["B", "G", "D", "H"] };
const SENS = { 2: "en bas, puis en haut", 3: "en bas, à droite, puis en haut", 4: "en bas, à gauche, à droite, puis en haut" };
// Courbe du temps k (de la position du temps précédent à celle du temps k) : [départ, contrôle, arrivée].
function courbe(n, k) {
  const g = GESTES[n], a = P[g[(k + g.length - 1) % g.length]], b = P[g[k]];
  const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1, c = n === 2 ? 26 : 16;
  return [a, [(a[0] + b[0]) / 2 - dy / l * c, (a[1] + b[1]) / 2 + dx / l * c], b];
}
function figure(n, numeros = true) {
  let s = "";
  GESTES[n].forEach((pos, k) => {
    const [a, c, b] = courbe(n, k), tx = b[0] - c[0], ty = b[1] - c[1], l = Math.hypot(tx, ty), ux = tx / l, uy = ty / l;
    const fin = [b[0] - ux * 17, b[1] - uy * 17], p1 = [fin[0] - ux * 11 - uy * 6, fin[1] - uy * 11 + ux * 6], p2 = [fin[0] - ux * 11 + uy * 6, fin[1] - uy * 11 - ux * 6];
    s += `<path d="M${a} Q${c} ${fin}" fill="none" stroke="var(--ink)" stroke-width="3" stroke-linecap="round"/><path d="M${p1} L${fin} L${p2}" fill="none" stroke="var(--ink)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`;
  });
  GESTES[n].forEach((pos, k) => {
    const [x, y] = P[pos], fort = k === 0;
    s += `<circle class="t${k}" cx="${x}" cy="${y}" r="${fort ? 15 : 12}" fill="${fort ? "var(--red)" : "var(--card)"}" stroke="${fort ? "var(--red)" : "var(--blue)"}" stroke-width="3"/>`;
    if (numeros) s += `<text x="${x}" y="${y + 6}" text-anchor="middle" font-family="Fredoka,sans-serif" font-weight="700" font-size="17" fill="${fort ? "var(--card)" : "var(--blue)"}">${k + 1}</text>`;
  });
  return `<svg viewBox="0 0 220 196" role="img" aria-label="geste du chef d'orchestre">${s}</svg>`;
}

// Pour la saisie : sans majuscules, accents, articles ni espaces en trop.
const net = s => String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[’']/g, " ")
  .replace(/^\s*(le|la|les|l|un|une)\s+/, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();

const q = (cat, prompt, options, explain, extra) => Moteur.QCM({ cat, prompt, options: options.map(esc), correct: 0, explain: explain || "", ...extra });

const definir = function () {
  const [w, d] = one(CARTES);
  const autres = pick(CARTES.filter(x => x[0] !== w), 3);
  return Math.random() < .5
    ? q("Définir", `Que veut dire « ${w} » ?`, [d, ...autres.map(x => x[1])])
    : q("Définir", `De quoi parle cette définition ? « ${d} »`, [w, ...autres.map(x => x[0])]);
};
definir.cartes = CARTES;

const extraits = function () {
  if (Math.random() < .55) {
    const x = one(EXTRAITS.filter(e => e.tempo));
    const faux = pick(TEMPOS.filter(t => t !== x.tempo), 3);
    return q("Extraits", `Dans ${x.nom}, comment est le tempo ?`, [x.tempo, ...faux], `Correction de la classe : ${x.nom}, ${x.tempo}${x.mesure ? `, mesure à ${x.mesure} temps` : ""}.`);
  }
  const x = one(EXTRAITS.filter(e => e.mesure));
  return Moteur.QCM({ cat: "Extraits", prompt: `Dans ${esc(x.nom)}, la mesure est à combien de temps ?`, options: ["2 temps", "3 temps", "4 temps"], correct: x.mesure - 2, keep: true,
    explain: `Correction de la classe : ${esc(x.nom)}, mesure à ${x.mesure} temps.${x.mesure === 3 ? " On compte « 1, 2, 3 » et le 1 est le plus fort." : ""}` });
};
extraits.liste = EXTRAITS;

const mesure = function () {
  const r = Math.random(), n = one([2, 3, 4]);
  if (r < .4) return Moteur.QCM({ cat: "Mesure", fig: figure(n), prompt: "Le chef d'orchestre fait ce geste. Quelle mesure bat-il ?", options: ["À 2 temps", "À 3 temps", "À 4 temps"], correct: n - 2, keep: true,
    explain: `Il compte ${n} temps : ${SENS[n]}. Le premier temps (en rouge) se bat toujours vers le bas : c'est le plus fort.` });
  if (r < .75) {
    const suite = Array.from({ length: 3 * n }, (_, i) => i % n ? `${i % n + 1}` : "<b style=\"font-size:1.3em;color:var(--red)\">1</b>").join(" ");
    return Moteur.QCM({ cat: "Mesure", prompt: `On compte en frappant plus fort sur le 1 :<br><span style="letter-spacing:.12em">${suite}</span><br>C'est une mesure…`, options: ["à 2 temps", "à 3 temps", "à 4 temps"], correct: n - 2, keep: true,
      explain: `Le temps fort (le 1) revient tous les ${n} temps : la mesure est à ${n} temps.` });
  }
  return q("Mesure", "Dans une mesure, quel est le temps le plus fort ?", ["Le premier temps", "Le deuxième temps", "Le dernier temps", "Ils sont tous aussi forts"], "Le premier temps est le plus fort : c'est lui qu'on sent le mieux, et le chef d'orchestre le bat vers le bas.");
};
mesure.figure = figure;
mesure.courbe = courbe;
mesure.gestes = GESTES;

Moteur.banque("musique-pulsation-tempo-mesure", {
  definir,
  motJuste() {
    const x = one([
      { d: "La vitesse de la pulsation (lent, modéré ou rapide).", r: ["tempo"], a: "le tempo" },
      { d: "Un battement régulier dans la musique, comme le battement du cœur.", r: ["pulsation"], a: "la pulsation" },
      { d: "Un groupe de temps qui revient toujours pareil (à 2, 3 ou 4 temps).", r: ["mesure"], a: "la mesure" },
      { d: "L'appareil qui fait « tic, tic, tic… » à la vitesse choisie.", r: ["metronome"], a: "le métronome" },
      { d: "Une œuvre pour un instrument soliste accompagné d'un orchestre.", r: ["concerto"], a: "un concerto" },
      { d: "Un morceau qui accentue les temps pour marcher en cadence.", r: ["marche"], a: "une marche" },
      { d: "Les trois lettres qui veulent dire « battements par minute ».", r: ["bpm", "b p m"], a: "BPM" },
      { d: "Le compositeur qui a recomposé Les Quatre Saisons de Vivaldi.", r: ["max richter", "richter"], a: "Max Richter" },
    ]);
    return Moteur.INPUT({ cat: "Mot juste", prompt: `Quel est le mot ?<br><span style="font-weight:500">${esc(x.d)}</span>`, fields: [{ mode: "text", w: "12em" }], answer: esc(x.a),
      check: v => x.r.includes(net(v[0])), explain: " Les majuscules et les accents ne comptent pas ici, mais soigne l'orthographe le jour de l'évaluation." });
  },
  extraits,
  mesure,
  bpm() {
    const r = Math.random();
    if (r < .3) return q("BPM", "Que veut dire BPM ?", ["Battements par minute", "Bruits par mesure", "Battements par morceau", "Bonne pulsation musicale"], "BPM vient de l'anglais <i>beats per minute</i> : le nombre de pulsations en une minute.");
    if (r < .6) {
      const n = one([60, 72, 80, 100, 120]);
      return Moteur.INPUT({ cat: "BPM", prompt: `Un métronome est réglé sur ${n} BPM. Combien de « tic » fait-il en une minute ?`, fields: [{ w: "6em", after: "tic" }], answer: String(n),
        check: v => v[0].replace(/\s/g, "") === String(n), explain: ` ${n} BPM = ${n} battements par minute.` });
    }
    const [a, b] = pick([50, 66, 80, 96, 110, 132, 150, 176], 2).sort((x, y) => y - x);
    return q("BPM", "Lequel de ces deux tempos est le plus rapide ?", [`${a} BPM`, `${b} BPM`], `Plus il y a de battements par minute, plus le tempo est rapide : ${a} > ${b}.`, { grid: true, center: true });
  },
  orchestre() {
    const DEDANS = ["Violon", "Alto", "Violoncelle", "Contrebasse", "Harpe", "Clavecin"], DEHORS = ["Trompette", "Flûte", "Batterie", "Saxophone", "Guitare électrique", "Trombone"];
    if (Math.random() < .5) return q("Orchestre", "Lequel de ces instruments fait partie de l'orchestre à cordes étudié en classe ?", [one(DEDANS), ...pick(DEHORS, 3)], "L'orchestre à cordes : plusieurs violons, altos, violoncelles et contrebasses, avec une harpe et un clavecin.");
    return q("Orchestre", "Lequel de ces instruments ne fait <b>pas</b> partie de l'orchestre à cordes étudié en classe ?", [one(DEHORS), ...pick(DEDANS, 3)], "L'orchestre à cordes : plusieurs violons, altos, violoncelles et contrebasses, avec une harpe et un clavecin.");
  },
  connaitre() {
    const x = one([
      { q: "Qu'est-ce qu'un concerto ?", o: ["Une œuvre pour un instrument soliste accompagné d'un orchestre", "Un orchestre sans chef", "Un morceau pour marcher en cadence", "Un chant à plusieurs voix sans instruments"], e: "Dans un concerto, un instrument soliste est mis en avant, et l'orchestre l'accompagne." },
      { q: "Qui a recomposé Les Quatre Saisons de Vivaldi ?", o: ["Max Richter", "Brahms", "Rachmaninov", "Pink Floyd"], e: "Max Richter a recomposé Les Quatre Saisons de Vivaldi en 2012." },
      { q: "À quoi sert une marche ?", o: ["À marcher en cadence, tous au même pas", "À s'endormir", "À danser une valse", "À accorder les instruments"], e: "Une marche accentue bien les temps pour que l'on puisse marcher en cadence." },
      { q: "À quoi sert un métronome ?", o: ["À faire entendre une pulsation régulière, à la vitesse choisie", "À jouer plus fort", "À accorder un violon", "À enregistrer la musique"], e: "Le métronome fait « tic, tic, tic… » au tempo choisi (en BPM) : il aide à garder le même tempo." },
      { q: "Pour décrire une musique, on dit…", o: ["Son tempo, sa mesure et ses instruments", "Seulement si on l'aime ou pas", "Seulement le nom du compositeur", "Seulement combien de temps elle dure"], e: "Décrire une musique : son tempo (lent, modéré, rapide), sa mesure (2, 3 ou 4 temps) et ses instruments." },
      { q: "Le tempo d'un morceau peut-il changer pendant le morceau ?", o: ["Oui, il peut accélérer ou ralentir", "Non, jamais"], e: "Exemples de la classe : Kalinka accélère, Madagascar est modéré puis rapide." },
      { q: "Pourquoi dit-on que l'extrait de Pink Floyd n'a pas de tempo ?", o: ["Parce qu'il est non pulsé : on ne sent pas de pulsation régulière", "Parce qu'il est trop rapide", "Parce qu'il n'y a pas d'instruments", "Parce qu'il est en anglais"], e: "Le tempo, c'est la vitesse de la pulsation. Sans pulsation, il n'y a pas de tempo." },
      { q: "Quels sont les trois tempos à connaître ?", o: ["Lent, modéré, rapide", "Fort, doux, moyen", "Grave, aigu, médium", "Court, long, moyen"], e: "Le tempo, c'est la vitesse de la pulsation : lent, modéré ou rapide." },
    ]);
    return q("Connaître", x.q, x.o, x.e);
  },
});
})();
