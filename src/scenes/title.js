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
        this.home = this.add.image(0, 0, 'home').setScale(0).setOrigin(0.5, 0.5);
        this.home.setPosition(Screen.WIDTH / 2, Screen.HEIGHT / 2, 0, 0);
        this.time.delayedCall(3000, () => {
            this.scene.start('sceneDemo')
        }, [], this);
        this.p1start = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[CONTROLS_P1.START]);

        this.tweens.add({
            targets: this.home,
            scaleX: 2,
            scaleY: 2,
            duration: 500,
        });
    }

    update(time, delta) {
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