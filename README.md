# Mes révisions

Petit site de révisions pour le collège, publié avec GitHub Pages :
**https://maximebreham.github.io/revisions-college/**

Sur téléphone, ouvrir l'adresse puis :
- iPhone (Safari) : bouton Partager → « Sur l'écran d'accueil »
- Android (Chrome) : menu ⋮ → « Ajouter à l'écran d'accueil »

Le site s'ouvre alors comme une appli. Les scores et les progrès sont gardés sur l'appareil utilisé
(ils ne passent pas d'un téléphone à un ordinateur).

## Ajouter une révision

**Le plus simple, avec Claude Code sur le Mac** : scanner la feuille (app Notes de l'iPhone :
« + » → « Scanner des documents »), l'envoyer par AirDrop dans le dossier `a-traiter/` du projet,
puis demander `/nouvelle-revision` en donnant la matière et la date du contrôle. Claude écrit la
page, les questions et la ligne du catalogue, teste le tout et propose l'envoi. Le dossier
`a-traiter/` n'est jamais envoyé sur GitHub.

**Sans le Mac**, avec claude.ai :

1. Générer la révision avec claude.ai (voir le modèle de demande plus bas) et récupérer les deux fichiers :
   la page HTML et le fichier de questions `.js`.
2. Déposer la page dans `revisions/` et le fichier de questions dans `exercices/`, avec un nom simple
   sans espaces ni accents, le même pour les deux : `francais-conjugaison-present.html` et
   `francais-conjugaison-present.js`.
3. Dans `catalogue.js`, copier un bloc de la liste `REVISIONS` et l'adapter
   (matière, titre, description, nom des fichiers, date du contrôle).
4. Enregistrer : le site est à jour une minute plus tard.

Tout peut se faire directement sur github.com : bouton « Add file → Upload files » dans les dossiers
`revisions/` et `exercices/`, puis le crayon ✏️ sur `catalogue.js`.

Une fois la date du contrôle passée, la révision descend toute seule dans « Déjà passés ».
Ses questions continuent de revenir de temps en temps dans le défi du jour.
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
> Crée aussi un second fichier, `[nom].js`, qui reprend les mêmes questions pour le défi du jour
> du site. Il suit exactement ce modèle (le moteur `Moteur` est fourni par le site) :
>
> ```js
> (function () {
>   const { QCM, INPUT, pick, shuffle, esc } = Moteur;
>   // ici les données : listes de mots, de dates, de questions…
>   Moteur.banque("[nom]", {
>     // chaque générateur tire au hasard une question d'un même type
>     unTypeDeQuestion() {
>       return QCM({ cat: "Catégorie", prompt: "La question ?", options: ["Bonne réponse", "Faux", "Faux"],
>                    correct: 0, explain: "L'explication de la correction." });
>     },
>     unAutreType() {
>       return INPUT({ cat: "Catégorie", prompt: "La question ?", fields: [{ w: "10em", mode: "text" }],
>                      check: v => v[0].trim().toLowerCase() === "réponse", answer: "réponse",
>                      explain: "L'explication." });
>     },
>   });
> })();
> ```
>
> Les options et les textes sont en HTML (passer par `esc()` les textes qui contiennent `<` ou `&`).
> Prévois 4 à 8 générateurs qui couvrent toute la feuille.
>
> Donne-moi ensuite les deux fichiers complets à télécharger.

Remplacer `[nom]` par le nom choisi pour les fichiers. Choisir un préfixe différent pour chaque
révision, et le reporter dans le champ `score` du catalogue
(`score: { cle: "fr6:best", sur: 20 }`) pour que le meilleur score s'affiche sur l'accueil,
et indiquer le fichier de questions (`exercices: "[nom].js"`) pour qu'il entre dans le défi du jour.

## Le défi du jour

Chaque jour, 5 questions tirées des fichiers de `exercices/` :
- la série est la même toute la journée, et on reprend là où on s'est arrêté ;
- les matières dont le contrôle approche (14 jours ou moins) reviennent deux fois plus souvent,
  les contrôles passés deux fois moins ;
- jusqu'à 2 questions ratées les jours précédents reviennent, jusqu'à ce qu'elles soient réussies ;
- le compteur de jours d'affilée tient tant que le défi de la veille a été fait.

Une fois le défi fini, « 5 autres questions pour le plaisir » ne compte pas dans la série.

## Voir le site sur son ordinateur avant de publier

```sh
python3 -m http.server 8000
```

puis ouvrir http://localhost:8000.
