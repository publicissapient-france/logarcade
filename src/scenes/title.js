const Screen = require('../screen');
const StartGameAction = require('../actions/start-game');

let startBtn;

class SceneTitle extends Phaser.Scene {

    constructor() {
        super({key: 'sceneTitle'});
    }

    init() {
        this.actions = {
            startGame: new StartGameAction(this),
        };

        const canvas = this.sys.game.canvas;
        const fullscreen = this.sys.game.device.fullscreen;
        if (!fullscreen.available) {
            return;
        }
        startBtn = document.createElement('button');
        startBtn.textContent = 'Start Fullscreen';
        canvas.parentNode.appendChild(startBtn);

        startBtn.addEventListener('click', function () {
            if (document.fullscreenElement) {
                return;
            }
            canvas[fullscreen.request]();
        });

        this.events.on('shutdown', this.shutdown, this);
    }

    preload() {
        this.load.image('home', 'assets/backgrounds/HOME.png');
        this.load.audio('jingle', ['assets/audio/Rise06.aif.wav']);
    }

    create() {
        this.sound.add('jingle').play();

        this.home = this.add.image(0, 0, 'home').setScale(0).setOrigin(0.5, 0.5);
        this.home.setPosition(Screen.WIDTH / 2, Screen.HEIGHT / 2, 0, 0);
        this.time.delayedCall(3000, () => this.scene.start('sceneDemo'), [], this);

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

    shutdown() {
        try {
            var canvas = this.sys.game.canvas;
            canvas.parentNode.removeChild(startBtn);
        } catch (e) {
        }
    }

}

module.exports = SceneTitle;