const Screen = require('../screen');

class SceneScoresOnePlayer extends Phaser.Scene {

    constructor() {
        super({key: 'sceneScoresOnePlayer'});
    }

    preload() {
        this.add.text(Screen.WIDTH / 2, Screen.HEIGHT / 2, 'ONE PLAYER SCORES');
    }

    create() {
        this.time.delayedCall(3000, () => {
            this.scene.start('sceneScoresTwoPlayers')
        }, [], this);
    }
}

module.exports = SceneScoresOnePlayer;