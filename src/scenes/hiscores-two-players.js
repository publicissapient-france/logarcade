const Screen = require('../screen');

class SceneScoresTwoPlayers extends Phaser.Scene {

    constructor() {
        super({key: 'sceneScoresTwoPlayers'});
    }

    preload() {
        this.add.text(Screen.WIDTH / 2, Screen.HEIGHT / 2, 'TWO PLAYERS SCORES');
    }

    create() {
        this.time.delayedCall(3000, () => {
            this.scene.start('sceneTitle')
        }, [], this);
    }
}

module.exports = SceneScoresTwoPlayers;