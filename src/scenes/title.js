const {CONTROLS_P1} = require('../controls');
const Screen = require('../screen');

class SceneTitle extends Phaser.Scene {

    constructor() {
        super({key: 'sceneTitle'});
    }

    preload() {
        this.add.text(Screen.WIDTH / 2, Screen.HEIGHT / 2, 'TITLE');
    }

    create() {
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

}

module.exports = SceneTitle;