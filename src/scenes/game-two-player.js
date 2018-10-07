const Screen = require('../screen');

class SceneGameTwoPlayers extends Phaser.Scene {
    constructor() {
        super({key: 'sceneGameTwoPlayers'});
    }

    preload() {
        this.add.text(Screen.WIDTH / 2, Screen.HEIGHT / 2, 'sceneGameTwoPlayers');
    }

    create() {
    }
}

module.exports = SceneGameTwoPlayers;