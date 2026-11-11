/* Questions de « Multiplication et calculs astucieux » (maths, 6e).
 * Pas de feuille du professeur pour cette révision : le contenu vient de ce que le parent a décrit
 * (vocabulaire du produit, calculs astucieux, multiplication de deux décimaux), recoupé en ligne.
 * La page revisions/maths-multiplication-calcul-astucieux.html lit aussi facteurs.outils
 * (le calcul exact sur les décimaux et les tirages de paires) pour ses jeux. */
(function () {
const { esc, shuffle } = Moteur;
const R = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const one = a => a[Math.floor(Math.random() * a.length)];

/* ===== Calcul exact sur les décimaux =====
 * Un nombre s'écrit "7.3" dans le code : on le transforme en [entier, chiffres après la virgule]
 * pour calculer sans les erreurs d'arrondi de JavaScript (0,1 × 3 = 0,30000000000000004). */
const lire = s => { const [i, d = ""] = String(s).split("."); return [Number(i + d), d.length] };
const ecrire = (n, k) => { const s = String(n).padStart(k + 1, "0"); const i = s.slice(0, s.length - k).replace(/^0+(?=\d)/, ""), d = s.slice(s.length - k).replace(/0+$/, ""); return d ? i + "." + d : i };
const aligne = (a, b) => { const [x, k] = lire(a), [y, l] = lire(b), m = Math.max(k, l); return [x * 10 ** (m - k), y * 10 ** (m - l), m] };
const mul = (a, b) => { const [x, k] = lire(a), [y, l] = lire(b); return ecrire(x * y, k + l) };
const add = (a, b) => { const [x, y, m] = aligne(a, b); return ecrire(x + y, m) };
const sub = (a, b) => { const [x, y, m] = aligne(a, b); return ecrire(x - y, m) };
const decale = (s, p) => { const [n, k] = lire(s); return k - p >= 0 ? ecrire(n, k - p) : ecrire(n * 10 ** (p - k), 0) }; // × 10^p
const nbDec = s => lire(s)[1];
const entier = s => !String(s).includes(".");
// Écriture française : virgule, et espace fine tous les 3 chiffres (1 035).
const grp = s => s.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
const F = s => { const [i, d] = String(s).split("."); return grp(i) + (d ? "," + d : "") };
const N = s => `<span class="num">${F(s)}</span>`;
// Ce que tape l'élève : virgule ou point, espaces ignorés, zéros inutiles enlevés.
function canon(s) { s = String(s).replace(/[\s  ]/g, "").replace(",", "."); if (!/^\d*(\.\d*)?$/.test(s) || s === "" || s === ".") return null; let [i, d = ""] = s.split("."); i = i.replace(/^0+/, "") || "0"; d = d.replace(/0+$/, ""); return d ? i + "." + d : i }
const egal = (v, rep) => canon(v) === canon(rep);
const saisie = (cat, prompt, rep, explain) => Moteur.INPUT({ cat, prompt, fields: [{ w: "8em" }], check: v => egal(v[0], rep), answer: F(rep), explain });
const qcm = (cat, prompt, options, explain, extra) => Moteur.QCM({ cat, prompt, options, correct: 0, explain, ...extra });
const tirer = fs => one(fs)();
// Un décimal au hasard : entre 1 et 2 chiffres après la virgule, le dernier jamais 0.
const unDecimal = (min, max, k) => { let n; do n = R(min * 10 ** k, max * 10 ** k); while (n % 10 === 0); return ecrire(n, k) };

/* ===== Les paires qui « tombent juste » ===== */
// Produits : deux facteurs qui donnent 1, 10, 100 ou 1 000.
const PAIRES_X = [["2", "5"], ["4", "25"], ["2", "50"], ["4", "2.5"], ["20", "5"], ["8", "125"], ["0.5", "2"], ["0.25", "4"], ["5", "0.2"], ["2.5", "40"], ["0.5", "20"], ["25", "0.4"]];
const rond = s => ["1", "10", "100", "1000"].includes(s);
// Sommes : deux parties décimales qui font 1 (0,3 + 0,7), en centièmes.
const COMPLEMENTS = [[10, 90], [20, 80], [30, 70], [40, 60], [25, 75], [35, 65], [15, 85], [45, 55]];
const intrus = (...t) => { let c; do c = unDecimal(1, 30, R(1, 2)); while (t.some(x => entier(add(x, c)))); return c };
function paireSomme() {
  const [p, q] = one(COMPLEMENTS);
  const a = ecrire(R(1, 29) * 100 + p, 2), b = ecrire(R(1, 29) * 100 + q, 2);
  return [a, b];
}

/* ===== 1. Vocabulaire ===== */
const OPS = [
  { s: "+", nom: "somme", la: "la somme", membres: "termes", f: add },
  { s: "−", nom: "différence", la: "la différence", membres: "termes", f: sub },
  { s: "×", nom: "produit", la: "le produit", membres: "facteurs", f: mul },
  { s: ":", nom: "quotient", la: "le quotient" },
];
const NATURES = ["un produit", "une somme", "une différence", "un quotient"];
const vocabulaire = () => tirer([
  () => { const a = R(3, 9), b = R(3, 9); return qcm("Vocabulaire", `Dans ${N(a)} × ${N(b)} = ${N(a * b)}, comment s'appelle ${N(a * b)} ?`, ["Le produit", "La somme", "Un facteur", "Le quotient"], "Le résultat d'une multiplication s'appelle le <b>produit</b>.", { grid: true }) },
  () => { const a = unDecimal(1, 9, 1), b = R(2, 9); return qcm("Vocabulaire", `Dans ${N(a)} × ${N(b)} = ${N(mul(a, b))}, comment s'appellent ${N(a)} et ${N(b)} ?`, ["Les facteurs", "Les termes", "Les produits", "Les sommes"], "Les nombres que l'on multiplie s'appellent les <b>facteurs</b>.", { grid: true }) },
  () => { const a = unDecimal(1, 20, 1), b = unDecimal(1, 20, 1); return qcm("Vocabulaire", `Dans ${N(a)} + ${N(b)} = ${N(add(a, b))}, comment s'appellent ${N(a)} et ${N(b)} ?`, ["Les termes", "Les facteurs", "Les produits", "Les quotients"], "Les nombres que l'on additionne s'appellent les <b>termes</b>. Les <b>facteurs</b>, c'est pour la multiplication.", { grid: true }) },
  () => { const b = R(2, 9), d = R(2, 9), a = b + d; return qcm("Vocabulaire", `Dans ${N(a)} − ${N(b)} = ${N(d)}, comment s'appelle ${N(d)} ?`, ["La différence", "Le produit", "La somme", "Le quotient"], "Le résultat d'une soustraction s'appelle la <b>différence</b>.", { grid: true }) },
  () => { const a = R(2, 9) * R(2, 5), b = R(2, 9); const ex = a * b; return qcm("Vocabulaire", `Dans ${N(ex)} : ${N(b)} = ${N(a)}, comment s'appelle ${N(a)} ?`, ["Le quotient", "Le produit", "La différence", "Un facteur"], "Le résultat d'une division s'appelle le <b>quotient</b>.", { grid: true }) },
  () => { const o = one(OPS.slice(0, 3)), b = R(2, 9), a = b + R(1, 9); const ecr = o2 => `${a} ${o2.s} ${b}`;
    return qcm("Vocabulaire", `Comment écrit-on « ${o.la} de ${a} et ${b} » ?`, [ecr(o), ...OPS.filter(x => x !== o).map(ecr)], `${o.la[0].toUpperCase() + o.la.slice(1)}, c'est le résultat ${o.s === "×" ? "d'une multiplication" : o.s === "+" ? "d'une addition" : "d'une soustraction"} : on écrit ${a} ${o.s} ${b}.`, { grid: true, center: true }) },
  () => { const i = R(0, 3), a = unDecimal(2, 15, 1), b = R(2, 9); const s = ["×", "+", "−", ":"][i];
    return qcm("Vocabulaire", `« ${N(a)} ${s} ${N(b)} » est…`, [NATURES[i], ...NATURES.filter((x, j) => j !== i)], `Le signe ${s} ${["indique une multiplication : c'est un produit", "indique une addition : c'est une somme", "indique une soustraction : c'est une différence", "indique une division : c'est un quotient"][i]}.`, { grid: true }) },
  () => { const o = one(OPS.slice(0, 3)); let a, b; if (o.s === "×") { a = unDecimal(1, 9, 1); b = String(R(2, 9)) } else { a = unDecimal(10, 30, 1); b = unDecimal(1, 9, 1) }
    const r = o.f(a, b); return saisie("Vocabulaire", `Calcule ${o.la} de ${N(a)} et ${N(b)}.`, r, `${o.la[0].toUpperCase() + o.la.slice(1)} : ${N(a)} ${o.s} ${N(b)} = ${N(r)}.`) },
]);

/* ===== 2. Calculs astucieux : les produits ===== */
// Une suite de multiplications avec une paire qui tombe juste, et un autre facteur.
function suiteX() {
  const [a, b] = shuffle(one(PAIRES_X)); let x;
  do x = unDecimal(1, 9, R(1, 2)); while (rond(mul(a, x)) || rond(mul(b, x)) || x === a || x === b); // une seule paire qui tombe juste
  const f = shuffle([a, x]); f.splice(R(1, 2), 0, b); // la paire n'est pas toujours côte à côte
  return { a, b, x, facteurs: f, paire: mul(a, b), r: mul(mul(a, b), x) };
}
const facteurs = () => tirer([
  () => { const s = suiteX(); return qcm("Produits astucieux", `Pour calculer ${s.facteurs.map(N).join(" × ")} de tête, quels facteurs vaut-il mieux regrouper ?`, [`${F(s.a)} × ${F(s.b)}`, `${F(s.a)} × ${F(s.x)}`, `${F(s.x)} × ${F(s.b)}`], `${N(s.a)} × ${N(s.b)} = ${N(s.paire)} : un nombre rond ! Ensuite ${N(s.paire)} × ${N(s.x)} = ${N(s.r)}.`) },
  () => { const s = suiteX(); return saisie("Produits astucieux", `Calcule astucieusement :<br>${s.facteurs.map(N).join(" × ")}`, s.r, `On regroupe ${N(s.a)} × ${N(s.b)} = ${N(s.paire)}, puis ${N(s.paire)} × ${N(s.x)} = ${N(s.r)}.`) },
  () => { const [a, b] = shuffle(one(PAIRES_X)); const r = mul(a, b); return saisie("Produits astucieux", `Les nombres ronds à connaître : ${N(a)} × ${N(b)} = ?`, r, `${N(a)} × ${N(b)} = ${N(r)}. Ces paires sont celles qu'on cherche dans un calcul astucieux.`) },
  () => { const [a, b] = shuffle(one(PAIRES_X)); const r = mul(a, b); const autres = shuffle(PAIRES_X.flat().filter(c => c !== b && !rond(mul(a, c)))).filter((c, i, t) => t.indexOf(c) === i).slice(0, 3);
    return qcm("Produits astucieux", `Par quel nombre multiplier ${N(a)} pour obtenir un nombre rond ?`, [b, ...autres].map(F), `${N(a)} × ${N(b)} = ${N(r)}.`, { grid: true, center: true }) },
  () => qcm("Produits astucieux", "Dans une multiplication, peut-on changer l'ordre des facteurs ?", ["Oui, le produit ne change pas", "Non, jamais", "Seulement s'il n'y a que des entiers", "Oui, mais le produit change"], "Exemple : 4 × 7,3 × 25 = 4 × 25 × 7,3 = 100 × 7,3 = 730. On peut changer l'ordre et regrouper les facteurs comme on veut."),
  () => { const s = suiteX(); const faux = [decale(s.r, 1), decale(s.r, -1), add(s.paire, s.x)].filter(v => v !== s.r);
    return qcm("Produits astucieux", `${s.facteurs.map(N).join(" × ")} = ?`, [s.r, ...faux].map(N), `On regroupe ${N(s.a)} × ${N(s.b)} = ${N(s.paire)}, puis ${N(s.paire)} × ${N(s.x)} = ${N(s.r)}.`, { grid: true, center: true }) },
]);

/* ===== 3. Calculs astucieux : sommes et différences ===== */
const termes = () => tirer([
  () => { const [a, b] = paireSomme(); const c = intrus(a, b); const t = [a, c, b]; return qcm("Sommes astucieuses", `Pour calculer ${t.map(N).join(" + ")}, quels termes vaut-il mieux regrouper ?`, [`${F(a)} + ${F(b)}`, `${F(a)} + ${F(c)}`, `${F(c)} + ${F(b)}`], `${N(a)} + ${N(b)} = ${N(add(a, b))} : les parties décimales font 1 ensemble, donc le résultat est entier.`) },
  () => { const [a, b] = paireSomme(); const c = intrus(a, b); const t = shuffle([a, b, c]); const r = add(add(a, b), c); return saisie("Sommes astucieuses", `Calcule astucieusement :<br>${t.map(N).join(" + ")}`, r, `On regroupe ${N(a)} + ${N(b)} = ${N(add(a, b))}, puis ${N(add(a, b))} + ${N(c)} = ${N(r)}.`) },
  () => { const [a, b] = paireSomme(), [c, d] = paireSomme(); const t = [a, c, b, d]; const r = add(add(a, b), add(c, d)); return saisie("Sommes astucieuses", `Calcule astucieusement :<br>${t.map(N).join(" + ")}`, r, `(${N(a)} + ${N(b)}) + (${N(c)} + ${N(d)}) = ${N(add(a, b))} + ${N(add(c, d))} = ${N(r)}.`) },
  // Une différence dont les deux nombres ont la même partie décimale : le résultat est entier.
  () => { const b = unDecimal(1, 20, R(1, 2)); const a = add(b, String(R(3, 40))); const r = sub(a, b); return saisie("Différences astucieuses", `Calcule : ${N(a)} − ${N(b)}`, r, `${N(a)} et ${N(b)} ont la même partie décimale : elle disparaît. ${N(a)} − ${N(b)} = ${N(r)}.`) },
  // a − b − c, où a et c ont la même partie décimale : on retire c en premier.
  () => { const c = unDecimal(1, 9, 1); const a = add(c, String(R(12, 40))); let b; do b = unDecimal(1, 9, 1); while (entier(sub(a, b))); const ac = sub(a, c), r = sub(ac, b);
    return qcm("Différences astucieuses", `Pour calculer ${N(a)} − ${N(b)} − ${N(c)}, que vaut-il mieux faire en premier ?`, [`${F(a)} − ${F(c)}`, `${F(a)} − ${F(b)}`, `${F(b)} − ${F(c)}`], `${N(a)} et ${N(c)} ont la même partie décimale : ${N(a)} − ${N(c)} = ${N(ac)}. Puis ${N(ac)} − ${N(b)} = ${N(r)}. On retire les deux nombres, l'ordre des retraits ne change rien.`) },
  () => { const c = unDecimal(1, 9, 1); const a = add(c, String(R(12, 40))); let b; do b = unDecimal(1, 9, 1); while (entier(sub(a, b))); const ac = sub(a, c), r = sub(ac, b);
    return saisie("Différences astucieuses", `Calcule astucieusement :<br>${N(a)} − ${N(b)} − ${N(c)}`, r, `On commence par ${N(a)} − ${N(c)} = ${N(ac)} (même partie décimale), puis ${N(ac)} − ${N(b)} = ${N(r)}.`) },
  () => { const a = R(6, 15), b = R(2, 5); return qcm("Différences astucieuses", `Est-ce que ${a} − ${b} et ${b} − ${a} donnent le même résultat ?`, ["Non : dans une différence, on ne change pas l'ordre des deux nombres", "Oui, comme pour une somme", "Oui, comme pour un produit", "Seulement avec des décimaux"], `${a} − ${b} = ${a - b}, mais on ne peut pas retirer ${a} à ${b} en 6e. Pour une somme ou un produit, l'ordre ne compte pas ; pour une différence, si.`) },
  () => { const [a, b] = paireSomme(); const t = [a, intrus(b), intrus(b), intrus(b)]; return qcm("Sommes astucieuses", `Lequel de ces nombres fait un nombre entier avec ${N(b)} ?`, t.map(N).filter((x, i, l) => l.indexOf(x) === i), `${N(b)} + ${N(a)} = ${N(add(a, b))}. On cherche la partie décimale qui complète celle de ${N(b)} jusqu'à 1.`, { grid: true, center: true }) },
]);

/* ===== 4. Multiplier deux décimaux : la virgule ===== */
// Deux décimaux non entiers dont le produit sans virgule ne finit pas par 0 (pas de zéro à enlever).
function deuxDecimaux({ min1 = 11, max1 = 99, max2 = 9, sansZeroDevant = false } = {}) {
  for (;;) {
    const n1 = R(min1, max1), n2 = R(2, max2); if (n1 % 10 === 0 || (n1 * n2) % 10 === 0) continue;
    const k1 = R(1, 2), k2 = R(1, 2); if (sansZeroDevant && String(n1 * n2).length <= k1 + k2) continue;
    const a = ecrire(n1, k1), b = ecrire(n2, k2); if (entier(a) || entier(b)) continue;
    return { a, b, n1, n2, k: k1 + k2, p: n1 * n2, r: ecrire(n1 * n2, k1 + k2) };
  }
}
const methode = d => `${N(d.n1)} × ${N(d.n2)} = ${N(d.p)}. Chiffres après la virgule : ${nbDec(d.a)} dans ${N(d.a)} et ${nbDec(d.b)} dans ${N(d.b)}, donc ${d.k} dans le produit : ${N(d.r)}.`;
const virgule = () => tirer([
  () => { const d = deuxDecimaux(); const opts = [d.k, d.k - 1, d.k + 1, d.k - 2].filter(k => k >= 0).map(k => ecrire(d.p, k)); return qcm("La virgule", `On sait que ${N(d.n1)} × ${N(d.n2)} = ${N(d.p)}.<br>Combien fait ${N(d.a)} × ${N(d.b)} ?`, opts.slice(0, 4).map(N), methode(d), { grid: true, center: true }) },
  () => { const d = deuxDecimaux(); return qcm("La virgule", `Combien de chiffres après la virgule aura le résultat de ${N(d.a)} × ${N(d.b)} ?`, [d.k, ...[1, 2, 3, 4, 5].filter(k => k !== d.k).slice(0, 3)].map(String), `${nbDec(d.a)} chiffre${nbDec(d.a) > 1 ? "s" : ""} après la virgule dans ${N(d.a)}, ${nbDec(d.b)} dans ${N(d.b)} : ${nbDec(d.a)} + ${nbDec(d.b)} = ${d.k}.`, { grid: true, center: true }) },
  () => { const d = deuxDecimaux({ min1: 2, max1: 9 }); const vrai = Math.random() < .35; const ecrit = vrai ? d.r : ecrire(d.p, one([d.k - 1, d.k + 1].filter(k => k >= 0)));
    const qui = one(["Léo", "Inès", "Noé", "Jade", "Sacha"]);
    return qcm("Détective", `${qui} a écrit : ${N(d.a)} × ${N(d.b)} = ${N(ecrit)}.<br>Qu'en penses-tu ?`, vrai ? ["C'est juste", `C'est faux, c'est ${F(ecrire(d.p, d.k + 1))}`, `C'est faux, c'est ${F(String(d.p))}`] : [`C'est faux, c'est ${F(d.r)}`, "C'est juste", `C'est faux, c'est ${F(String(d.p))}`], methode(d)) },
  // Les zéros à ajouter devant : 0,4 × 0,2 = 0,08.
  () => { let a, b; do { a = "0." + R(2, 9); b = "0." + R(2, 9) } while (nbDec(mul(a, b)) < 2); const n1 = lire(a)[0], n2 = lire(b)[0]; const r = mul(a, b); const faux = [ecrire(n1 * n2, 1), ecrire(n1 * n2, 3), add(a, b)].filter((x, i, t) => x !== r && t.indexOf(x) === i);
    return qcm("La virgule", `${N(a)} × ${N(b)} = ?`, [r, ...faux].map(N), `${n1} × ${n2} = ${n1 * n2}, et il faut 2 chiffres après la virgule${String(n1 * n2).length < 2 ? " : on ajoute un 0 devant" : ""}, donc ${N(r)}. Remarque : en multipliant par un nombre plus petit que 1, le résultat devient plus petit !`, { grid: true, center: true }) },
  () => qcm("La virgule", "Pour multiplier deux nombres décimaux, que fait-on d'abord ?", ["On multiplie sans s'occuper des virgules", "On aligne les virgules", "On additionne les parties entières", "On arrondit les deux nombres"], "On pose et on calcule comme avec des entiers. À la fin, on place la virgule : autant de chiffres après la virgule que dans les deux facteurs réunis. Attention : on n'aligne pas les virgules, ça c'est pour l'addition."),
]);

/* ===== 5. Calculer le produit ===== */
const produit = () => tirer([
  () => { const d = deuxDecimaux({ max1: 49 }); return saisie("Produit de décimaux", `Calcule : ${N(d.a)} × ${N(d.b)}`, d.r, methode(d)) },
  () => { const d = deuxDecimaux({ min1: 2, max1: 9 }); return saisie("Produit de décimaux", `Calcule : ${N(d.a)} × ${N(d.b)}`, d.r, methode(d)) },
  () => { let a, b; do { a = unDecimal(1, 9, 1); b = unDecimal(1, 9, 1) } while (nbDec(mul(a, b)) < 2); const r = mul(a, b); const n1 = lire(a)[0], n2 = lire(b)[0];
    return saisie("Produit de décimaux", `Un rectangle mesure ${N(a)} cm sur ${N(b)} cm. Quelle est son aire, en cm² ?`, r, `Aire = longueur × largeur = ${N(a)} × ${N(b)}. ${n1} × ${n2} = ${n1 * n2}, 2 chiffres après la virgule : ${N(r)} cm².`) },
  () => { const prix = unDecimal(1, 4, 1), kg = unDecimal(1, 3, 1); const r = mul(prix, kg); const [n1] = lire(prix), [n2] = lire(kg);
    return saisie("Produit de décimaux", `Les pommes coûtent ${N(prix)} € le kilo. Combien coûtent ${N(kg)} kg ?`, r, `${N(prix)} × ${N(kg)} : ${n1} × ${n2} = ${n1 * n2}, 2 chiffres après la virgule : ${N(r)} €.${nbDec(r) < 2 ? " Les zéros à la fin ne servent à rien, on les enlève." : ""}`) },
]);

/* ===== 6. Multiplier par 10, 100, 1 000, 0,1, 0,01 ===== */
const MULT = [["10", 1], ["100", 2], ["1000", 3], ["0.1", -1], ["0.01", -2]];
const dix = () => tirer([
  () => { const [m, p] = one(MULT); const x = unDecimal(1, 99, R(1, 2)); const r = decale(x, p);
    return saisie("× 10, 100, 0,1…", `Calcule : ${N(x)} × ${N(m)}`, r, p > 0 ? `Multiplier par ${N(m)}, c'est rendre ${N(m)} fois plus grand : chaque chiffre avance de ${p} rang${p > 1 ? "s" : ""} vers la gauche. ${N(x)} × ${N(m)} = ${N(r)}.` : `Multiplier par ${N(m)}, c'est diviser par ${N(decale("1", -p))} : chaque chiffre recule de ${-p} rang${-p > 1 ? "s" : ""} vers la droite. ${N(x)} × ${N(m)} = ${N(r)}.`) },
  () => { const [m, p] = one(MULT.slice(3)); return qcm("× 10, 100, 0,1…", `Multiplier par ${N(m)}, c'est…`, [`diviser par ${F(decale("1", -p))}`, `multiplier par ${F(decale("1", -p))}`, `ajouter ${F(m)}`, `enlever la virgule`], `Exemple : 35 × ${F(m)} = ${F(decale("35", p))}, c'est pareil que 35 : ${F(decale("1", -p))}. Le résultat est plus petit que 35.`) },
  () => { const [m, p] = one(MULT); const x = unDecimal(1, 99, R(1, 2)); const r = decale(x, p); const faux = [decale(x, -p), decale(x, p + (p > 0 ? 1 : -1)), decale(x, p > 0 ? p - 1 : p + 1)].filter((v, i, t) => v !== r && v !== x && t.indexOf(v) === i);
    return qcm("× 10, 100, 0,1…", `${N(x)} × ${N(m)} = ?`, [r, ...faux].map(N), `Avec ${N(m)}, chaque chiffre ${p > 0 ? "avance de " + p + " rang" + (p > 1 ? "s" : "") + " vers la gauche" : "recule de " + -p + " rang" + (-p > 1 ? "s" : "") + " vers la droite"}.`, { grid: true, center: true }) },
]);

/* ===== 7. Ordre de grandeur : vérifier la virgule ===== */
const grandeur = () => {
  let a, b, ra, rb; do { a = unDecimal(1, 19, 1); b = unDecimal(1, 9, 1); ra = Math.round(Number(a)); rb = Math.round(Number(b)) } while (ra < 1 || rb < 1);
  const r = mul(a, b); const opts = [r, decale(r, 1), decale(r, -1), decale(r, 2)];
  return qcm("Ordre de grandeur", `Sans poser l'opération, quel est le bon résultat de ${N(a)} × ${N(b)} ?`, opts.map(N), `${N(a)} ≈ ${ra} et ${N(b)} ≈ ${rb}, donc le résultat est proche de ${ra} × ${rb} = ${ra * rb}. Seul ${N(r)} est proche.`, { grid: true, center: true });
};

// Pour les jeux de la page.
facteurs.outils = { mul, add, sub, decale, ecrire, lire, F, N, canon, unDecimal, deuxDecimaux, suiteX, paireSomme, PAIRES_X, COMPLEMENTS, rond };

Moteur.banque("maths-multiplication-calcul-astucieux", { vocabulaire, facteurs, termes, virgule, produit, dix, grandeur });
})();
