# logarcade

C'est le jeu d'arcade de la Xebicon 2018.

# Installation

```
npm install
```

# Développement

```
npm run dev
```

## Fichiers

### Scenes
Le jeu est découpé en plus scènes :

* title.js : Ecran titre du jeu
* demo.js : Explication du gameplay
* hiscores-one-player.js : Liste des scores du mode 1 joueur
* hiscores-two-players.js : Liste des scores du mode 2 joueurs
* game-one-player.js : Mode 1 joueur
* game-two-players.js : Mode 2 joueurs

### Contrôles
Le jeu doit être jouable au clavier et à la borne d'arcade.
Pour cela, le mapping est géré dans le fichier ```controls.js```

### Logos

Les descriptions des logos (nom des technos et nom des fichiers) sont spécifiées dans le fichier *logos.js* 

### Ecran

Les paramètres de l'écran sont définis dans ```screen.js```

### Paramètres du jeu

Les paramètres du jeu sont définis dans ```game.js```

# Déploiement

Merge la branche master dans gh-pages.
Exécuter ```npm run build```
Commiter et pusher.

# Jouer 

https://xebia-france.github.io/logarcade/

# Credits
https://opengameart.org/content/level-up-power-up-coin-get-13-sounds

