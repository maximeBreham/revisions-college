# Révisions collège

Site de révisions pour une élève de 6e, publié avec GitHub Pages :
https://maximebreham.github.io/revisions-college/

Les révisions sont générées dans claude.ai à partir de la feuille du professeur, puis déposées ici.
Le README explique la marche à suivre et contient le modèle de demande pour claude.ai.

## Fonctionnement

- `index.html` : l'accueil. Il lit `catalogue.js` et range les révisions en « À réviser »
  (contrôles datés du plus proche au plus lointain, puis les révisions sans date) et « Déjà passés ».
- `catalogue.js` : la seule liste des révisions et des matières. Ajouter une révision = un bloc ici.
- `revisions/*.html` : une révision par fichier, autonome (CSS et JS dans le fichier).
- `defi.html` et `suivi.js` : le défi du jour (5 questions par jour, série de jours d'affilée,
  questions ratées qui reviennent). `suivi.js` est partagé avec l'accueil pour l'encart du défi.
- `exercices/` : un fichier de questions par révision, plus `moteur.js` et `moteur.css` (affichage
  commun des questions, repris de la page de maths). Un fichier de questions appelle
  `Moteur.banque("<nom du fichier sans .js>", { generateur() { return Moteur.QCM({...}) } })`
  et enferme tout son code dans une fonction `(function () { … })()` : sans ça, deux révisions qui
  déclarent la même variable cassent le défi.
- `manifest.webmanifest` et `icones/` : installation sur l'écran d'accueil du téléphone.
- `a-traiter/` : photos et scans des feuilles à transformer en révision. Exclu de git, car ils portent
  des noms. La commande `/nouvelle-revision` (`.claude/skills/nouvelle-revision/`) en fait une
  révision, avec ses pages de test dans `outils/` (non publiées : Pages ignore les dossiers en point).

## Règles

- **Le dépôt est public** : jamais le prénom de l'élève, le nom du collège ou du professeur.
- **Pas d'outil de build ni de dépendance** : de simples fichiers, modifiables directement sur
  github.com. Une page de révision ne charge rien d'externe sauf Google Fonts.
- **Téléphone d'abord** : vérifier à 390 px de large, en mode clair et en mode sombre.
  Chrome sans fenêtre (`--headless`) refuse les fenêtres de moins de 500 px : capturer la page
  dans une `<iframe>` de 390 px, sinon le rendu paraît coupé à droite.
- **Chaque révision** :
  - range sa progression dans `localStorage` sous un préfixe qui lui est propre
    (`rh6:` pour l'histoire, `m6:` pour les maths) et son meilleur score dans `<préfixe>:best` ;
    ce score est déclaré dans le champ `score` du catalogue pour s'afficher sur l'accueil ;
  - a sur son propre accueil un lien `<a href="../">← Toutes les révisions</a>` ;
  - porte dans son `<head>` les trois lignes manifest, apple-touch-icon et
    apple-mobile-web-app-title (voir les pages existantes).
- À partir de maintenant, une page de révision **réutilise** son fichier de questions au lieu de les
  recopier (voir `/nouvelle-revision`). Les fichiers de questions des deux premières révisions sont des **copies** du code de leurs pages,
  faites pour ne pas toucher aux pages juste avant les contrôles (les questions sur carte de
  l'histoire restent dans la page). Une correction dans une page n'est pas reportée dans le défi.
- Le défi utilise un hasard réglé sur la date : même série toute la journée. La liste des questions
  à revoir n'est mise à jour qu'à la fin du défi, sinon la série du jour changerait en cours de route.
- Les progrès restent sur l'appareil utilisé : il n'y a ni compte ni serveur, et c'est voulu.
- Annoncer les fichiers et le message avant chaque commit, et attendre l'accord.

## Prochaines étapes

- [x] Renseigner les dates des deux contrôles dans `catalogue.js`.
- [x] Défi du jour : 5 questions qui mélangent les matières, avec un compteur de jours d'affilée.
- [x] Première révision faite avec `/nouvelle-revision` : ajuster la commande d'après ce qu'on apprend.
- [ ] Après deux ou trois révisions de plus : voir ce qui revient tout le temps et en faire une page
  commune à laquelle on donne seulement le contenu (le sur-mesure reste possible).
