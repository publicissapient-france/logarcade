const Screen = require('../screen');
const {CONTROLS_P1} = require('../controls');

class SceneDemo extends Phaser.Scene {
    constructor() {
        super({key: 'sceneDemo'});
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

        this.time.delayedCall(10000, () => {
            this.scene.start('sceneScoresOnePlayer')
        }, [], this);
        this.p1start = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[CONTROLS_P1.START]);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.p1start)) {
            this.scene.start('sceneGameOnePlayer');
        }
    }
}

module.exports = SceneDemo;