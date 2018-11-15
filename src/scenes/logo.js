const Screen = require('../components/screen');
const StartGameAction = require('../actions/start-game');

const _ = require('lodash');

let startBtn;

class SceneLogo extends Phaser.Scene {

    constructor() {
        super({key: 'sceneLogo'});
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
        this.load.audio('hello', ['assets/audio/hello.mp3']);
        for (let i = 0; i < 25; i++) {
            this.load.image(`logo${i}`, `assets/elements/Xebia/Composition 1_000${_.padStart(i, 2, '0')}.png`);
        }
    }

    create() {
        this.actions.startGame.create();
        if (!this.anim) {
            this.anim = this.anims.create({
                key: 'snooze',
                frames: _.range(25).map(i => ({key: `logo${i}`})),
                frameRate: 25,
                repeat: 0,
            });
        }
        this.sound.add('hello').play();
        this.logo = this.add.sprite(Screen.WIDTH / 2, Screen.HEIGHT / 2, 'logo0')
            .setScale(Screen.ZOOM)
            .play('snooze');

        this.time.delayedCall(2000, () => this.scene.start('sceneTitle'), [], this);
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

module.exports = SceneLogo;
