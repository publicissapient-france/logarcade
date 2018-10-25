const {CONTROLS_P1} = require('../controls');
const Screen = require('../screen');

let startBtn;

class SceneTitle extends Phaser.Scene {

    constructor() {
        super({key: 'sceneTitle'});
    }

    init() {
        var canvas = this.sys.game.canvas;
        var fullscreen = this.sys.game.device.fullscreen;

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
    }

    create() {
        const home = this.add.image(0, 0, 'home');
        home.setPosition(Screen.WIDTH / 2, Screen.HEIGHT / 2, 0, 0);
        home.setScale(2, 2);
        this.time.delayedCall(3000, () => {
            this.scene.start('sceneDemo')
        }, [], this);
        this.p1start = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[CONTROLS_P1.START]);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.p1start)) {
            this.scene.start('sceneGameOnePlayer');
        }
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