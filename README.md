# Mes révisions

Petit site de révisions pour le collège, publié avec GitHub Pages :
**https://maximebreham.github.io/revisions-college/**

Sur téléphone, ouvrir l'adresse puis :
- iPhone (Safari) : bouton Partager → « Sur l'écran d'accueil »
- Android (Chrome) : menu ⋮ → « Ajouter à l'écran d'accueil »

Le site s'ouvre alors comme une appli. Les scores et les progrès sont gardés sur l'appareil utilisé
(ils ne passent pas d'un téléphone à un ordinateur).

## Ajouter une révision

1. Générer la révision avec claude.ai (voir le modèle de demande plus bas) et récupérer le fichier HTML.
2. Le déposer dans le dossier `revisions/`, avec un nom simple sans espaces ni accents,
   par exemple `francais-conjugaison-present.html`.
3. Dans `catalogue.js`, copier un bloc de la liste `REVISIONS` et l'adapter
   (matière, titre, description, nom du fichier, date du contrôle).
4. Enregistrer : le site est à jour une minute plus tard.

Tout peut se faire directement sur github.com : bouton « Add file → Upload files » dans le dossier
`revisions/`, puis le crayon ✏️ sur `catalogue.js`.

Une fois la date du contrôle passée, la révision descend toute seule dans « Déjà passés ».
Pour une nouvelle matière, ajouter une ligne dans `MATIERES` en haut de `catalogue.js`.

## Modèle de demande pour claude.ai

Joindre la photo ou le PDF de la feuille du professeur, puis :

> Voici la feuille de mon enfant en 6e pour son prochain contrôle de [matière].
> Crée une page de révision interactive qui couvre tous les points de cette feuille :
> un rappel de cours court, des exercices variés avec correction expliquée, et un
> « examen blanc » de 20 questions mélangées.
>
> Contraintes techniques :
> - un seul fichier HTML autonome (CSS et JavaScript dans le fichier, pas de bibliothèque externe
>   sauf Google Fonts) ;
> - pensé d'abord pour un téléphone, lisible en mode sombre ;
> - mémorise la progression dans `localStorage`, avec des clés préfixées par `[prefixe]:`
>   (par exemple `fr6:`), et le meilleur score de l'examen blanc dans `[prefixe]:best` ;
> - sur l'écran d'accueil de la page, un lien `<a href="../">← Toutes les révisions</a>` ;
> - dans le `<head>`, ajoute ces trois lignes :
>   `<link rel="manifest" href="../manifest.webmanifest">`
>   `<link rel="apple-touch-icon" href="../icones/icone-180.png">`
>   `<meta name="apple-mobile-web-app-title" content="Révisions">`
>
> Donne-moi ensuite le fichier HTML complet à télécharger.

Choisir un préfixe différent pour chaque révision, et le reporter dans le champ `score` du catalogue
(`score: { cle: "fr6:best", sur: 20 }`) pour que le meilleur score s'affiche sur l'accueil.

## Voir le site sur son ordinateur avant de publier

```sh
python3 -m http.server 8000
```

puis ouvrir http://localhost:8000.
