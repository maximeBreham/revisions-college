/*
 * Le catalogue des révisions : c'est le seul fichier à modifier pour en ajouter une.
 *
 * 1. Déposer le fichier HTML dans le dossier revisions/
 * 2. Ajouter un bloc dans la liste REVISIONS ci-dessous (copier un bloc existant)
 *
 * Champs d'une révision :
 *   matiere     une des clés de MATIERES (histoire, maths, francais…)
 *   titre       ce qui s'affiche en gros
 *   description une ligne pour dire ce qu'on y travaille
 *   fichier     le nom du fichier dans revisions/
 *   date        jour du contrôle, au format "AAAA-MM-JJ" (laisser "" si inconnu)
 *               après cette date, la révision passe dans « Déjà passés »
 *   score       facultatif : où la page range son meilleur score, et sur combien
 */

window.MATIERES = {
  histoire: { nom: "Histoire-géo", couleur: "#A63D22", couleurNuit: "#E0754F" },
  maths:    { nom: "Maths",        couleur: "#2457C5", couleurNuit: "#7FA6F5" },
  francais: { nom: "Français",     couleur: "#7A3FA0", couleurNuit: "#C39AE6" },
  anglais:  { nom: "Anglais",      couleur: "#B0225A", couleurNuit: "#F07AA6" },
  sciences: { nom: "Sciences",     couleur: "#1E7A4C", couleurNuit: "#6BCB97" },
  emc:      { nom: "EMC",          couleur: "#8A6A12", couleurNuit: "#E2C25E" },
};

window.REVISIONS = [
  {
    matiere: "histoire",
    titre: "Les débuts de l'humanité",
    description: "Dates, définitions, carte, frise, Lascaux",
    fichier: "histoire-debuts-humanite.html",
    date: "2026-10-08",
    score: { cle: "rh6:best", sur: 20 },
  },
  {
    matiere: "maths",
    titre: "Premier DS de maths",
    description: "Nombres décimaux et géométrie",
    fichier: "maths-ds1-decimaux-geometrie.html",
    date: "2026-10-12",
    score: { cle: "m6:best", sur: 20 },
  },
];
