---
name: nouvelle-revision
description: Crée une nouvelle révision (page + questions du défi + ligne du catalogue) à partir des photos ou scans déposés dans a-traiter/, la teste et propose le commit. À utiliser quand on demande d'ajouter une révision, une leçon ou un contrôle.
---

# Nouvelle révision

Entrée : les photos ou scans dans `a-traiter/` (feuille du professeur, pages du cahier), et ce
que dit l'utilisateur (matière, date du contrôle). Lire aussi le `CLAUDE.md` du dépôt.

## 1. Lire et cadrer

- Lire **toutes** les images de `a-traiter/` (pas celles de `a-traiter/traite/`, déjà utilisées).
- Demander ce qui manque, en une seule question : la date du contrôle si elle n'est pas donnée
  (format `AAAA-MM-JJ` ; une date relative se calcule depuis aujourd'hui).
- Lister à l'utilisateur, en quelques lignes, les points relevés sur la feuille, et ce qui était
  illisible. **Ne rien inventer** : un point illisible se demande, il ne se devine pas. Le niveau,
  le vocabulaire et les exemples sont ceux de la feuille et du cahier, pas ceux d'un manuel.
- Attendre son accord sur cette liste avant d'écrire les fichiers.

## 2. Écrire les fichiers

Nom commun : `<matiere>-<sujet-court>` sans accents ni espaces (ex. `francais-conjugaison-present`).
Préfixe `localStorage` : court et absent du catalogue (ex. `fr6:`).

**Le dépôt est public** : aucun prénom, nom de collège ou de professeur, ni dans les fichiers, ni
dans les messages de commit. Les images de `a-traiter/` ne sont jamais commitées.

1. **`exercices/<nom>.js`** : les questions, écrites une seule fois. Modèle : les fichiers
   existants, et le format décrit en tête de `exercices/moteur.js`.
   - Tout le code dans `(function () { … })();`, puis `Moteur.banque("<nom>", { … })`.
   - 4 à 8 générateurs qui couvrent toute la feuille ; chacun tire au hasard une question d'un
     même type, avec une `cat` courte et une correction expliquée (`explain`).
   - Les options sont du HTML : passer les textes par `Moteur.esc`.
   - Saisie de texte : `fields: [{ mode: "text" }]`, et un `check` tolérant (casse, espaces,
     accents si la matière le permet).
2. **`revisions/<nom>.html`** : la page de révision, dans l'esprit des deux pages existantes
   (accueil avec menu d'activités, cours en fiches, exercices par thème, examen blanc de 20 questions).
   - Elle **réutilise** les questions au lieu de les recopier : elle charge
     `../exercices/moteur.css`, `../exercices/moteur.js` et `../exercices/<nom>.js`, et tire
     ses exercices et son examen blanc de `Moteur.banques["<nom>"]`. Les activités vraiment
     propres à la page (carte à cliquer, frise…) restent dans la page.
   - Meilleur score de l'examen blanc dans `<préfixe>:best`, lien `<a href="../">← Toutes les révisions</a>`
     sur l'accueil de la page, et les trois lignes manifest / apple-touch-icon /
     apple-mobile-web-app-title dans le `<head>` (copier celles d'une page existante).
   - Une couleur de matière cohérente avec `MATIERES` dans `catalogue.js`.
3. **`catalogue.js`** : un bloc dans `REVISIONS` (matière, titre, description, fichier, date,
   score, exercices). Nouvelle matière : une ligne dans `MATIERES` (couleur + couleur de nuit).

## 3. Tester

Depuis la racine du dépôt :

```sh
python3 -m http.server 8765 &   # si le port est pris, en choisir un autre
CH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
O=http://localhost:8765/.claude/skills/nouvelle-revision/outils
"$CH" --headless=new --disable-gpu --virtual-time-budget=5000 --dump-dom $O/test-questions.html 2>/dev/null | grep -o '<title>.*</title>'
"$CH" --headless=new --disable-gpu --window-size=500,900 --virtual-time-budget=60000 --dump-dom $O/test-defi.html 2>/dev/null | grep -o '<title>.*</title>'
```

- `test-questions.html` doit dire `"ok":true` : chaque générateur tourne 30 fois, sans variable globale.
- `test-defi.html` doit finir sur `TERMINÉ`. S'il dit `BLOQUÉ`, c'est souvent une question d'un
  type que le test ne sait pas jouer : compléter la fonction `joue` du test plutôt que la question.
- Captures en clair et en sombre (`--blink-settings=preferredColorScheme=1`, puis `=0`) :
  `"$CH" --headless=new --disable-gpu --hide-scrollbars --window-size=1222,780 --virtual-time-budget=5000 --screenshot=<scratchpad>/x.png "$O/captures.html?page=revisions/<nom>.html"`
  puis les regarder. Ouvrir aussi la page elle-même et faire un tour des activités.
- Arrêter le serveur à la fin.

## 4. Montrer et publier

- Donner à l'utilisateur la commande `! open <chemin des captures>` et l'adresse locale pour essayer.
  C'est lui qui valide le rendu : les captures aident, elles ne décident pas.
- Proposer le commit : la liste des fichiers et le message (`Révision de <matière> : <sujet>`),
  puis **attendre son accord**. Jamais `a-traiter/` (il est dans `.gitignore`, ne pas forcer).
- Après l'envoi, attendre que `https://maximebreham.github.io/revisions-college/revisions/<nom>.html`
  réponde 200, puis le dire.
- Déplacer les images utilisées dans `a-traiter/traite/`.
- Si la révision apprend quelque chose sur la façon de faire (format, piège, test), mettre à jour
  ce fichier ou le `CLAUDE.md`.
