const Screen = require('../components/screen');
const StartGameAction = require('../actions/start-game');

class SceneTitle extends Phaser.Scene {

    constructor() {
        super({key: 'sceneTitle'});
    }

    init() {
        this.actions = {
            startGame: new StartGameAction(this),
        };
    }

    preload() {
        this.load.image('home', 'assets/backgrounds/HOME.png');
    }

    create() {
        this.home = this.add.image(0, 0, 'home').setScale(0).setOrigin(0.5, 0.5);
        this.home.setPosition(Screen.WIDTH / 2, Screen.HEIGHT / 2, 0, 0);
        this.time.delayedCall(5000, () => this.scene.start('sceneDemo'), [], this);

        this.actions.startGame.create();

        this.tweens.add({
            targets: this.home,
            scaleX: 2,
            scaleY: 2,
            duration: 500,
        });
    }

    update() {
        this.actions.startGame.update();
    }

}

module.exports = SceneTitle;