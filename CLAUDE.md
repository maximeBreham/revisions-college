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
- `manifest.webmanifest` et `icones/` : installation sur l'écran d'accueil du téléphone.

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
- Les progrès restent sur l'appareil utilisé : il n'y a ni compte ni serveur, et c'est voulu.
- Annoncer les fichiers et le message avant chaque commit, et attendre l'accord.

## Prochaines étapes

- [ ] Renseigner les dates des deux contrôles dans `catalogue.js`.
- [ ] Défi du jour : 5 questions qui mélangent les matières, avec un compteur de jours d'affilée.
  Il faudra sortir les banques de questions des pages actuelles vers des fichiers communs.
