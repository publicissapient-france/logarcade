const Screen = require('../screen');
const StartGameAction = require('../actions/start-game');

class SceneDemo extends Phaser.Scene {
    constructor() {
        super({key: 'sceneDemo'});
    }

    init() {
        this.actions = {
            startGame: new StartGameAction(this),
        };
    }

    preload() {
        this.add.text(Screen.WIDTH / 2, Screen.HEIGHT / 2, 'DEMO');
        this.load.image('kol', 'assets/backgrounds/KOL.png');
    }

    create() {
        this.kol = this.add.image(0, 0, 'kol').setOrigin(0.5, 0.5).setScale(0.25, 0.25);
        this.kol.setAlpha(0.5);
        this.kol.setPosition(Screen.WIDTH / 2, Screen.HEIGHT / 2, 0, 0);

        this.tweens.add({
            targets: this.kol,
            alpha: 1,
            ease: 'Sine.easeInOut',
            yoyo: true,
            duration: 1500,
            loop: 10,
        });

        this.time.delayedCall(3000, () => {
            this.scene.start('sceneScoresOnePlayer')
        }, [], this);

        this.actions.startGame.create();
    }

    update() {
        this.actions.startGame.update();
    }
}

module.exports = SceneDemo;