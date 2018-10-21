const Screen = require('../screen');
const {CONTROLS_P1} = require('../controls');

class SceneDemo extends Phaser.Scene {
    constructor() {
        super({key: 'sceneDemo'});
    }

    preload() {
        this.add.text(Screen.WIDTH / 2, Screen.HEIGHT / 2, 'DEMO');
    }

    create() {
        this.time.delayedCall(3000, () => {
            this.scene.start('sceneScoresOnePlayer')
        }, [], this);

        this.p1start = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[CONTROLS_P1.START]);



    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.p1start)) {
            //this.scene.start('sceneGameOnePlayer');
            this.scene.start('sceneLoading');
        }
    }
}

module.exports = SceneDemo;