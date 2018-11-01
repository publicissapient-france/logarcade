const {CONTROLS_P1, CONTROLS_P2} = require('../controls');

class StartGameAction {

    constructor(game) {
        this.input = game.input;
        this.scene = game.scene;
    }

    create() {
        this.p1start = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[CONTROLS_P1.START]);
        this.p2start = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[CONTROLS_P2.START]);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.p1start)) {
            this.scene.start('sceneGameOnePlayer');
        }
        if (Phaser.Input.Keyboard.JustDown(this.p2start)) {
            this.scene.start('sceneGameTwoPlayers');
        }
    }

}

module.exports = StartGameAction;