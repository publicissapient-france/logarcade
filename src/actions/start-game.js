const {CONTROLS_P1, CONTROLS_P2, JOYPADS} = require('../controls');

class StartGameAction {

    constructor(game) {
        Object.assign(this, game);
        this.BUTTON_STATES = {
            0: {},
            1: {},
        }
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

        // TODO remove this shit
        var scene = this.scene;
        this.input.gamepad.on('down', (pad, button) => {
            const padIndex = pad.index;
            const joypad = JOYPADS[padIndex];
            const buttonIndex = button.index;
            const state = this.BUTTON_STATES[padIndex][buttonIndex];
            if (!state && joypad.mapping[buttonIndex] === 'START') {
                if (padIndex === 0) {
                    scene.start('sceneGameOnePlayer');
                }
                if (padIndex === 1) {
                    scene.start('sceneGameTwoPlayers');
                }
            }
            this.BUTTON_STATES[padIndex][buttonIndex] = true;
        }, this);

        this.input.gamepad.on('up', (pad, button) => this.BUTTON_STATES[pad.index][button.index] = false, this);
    }

}

module.exports = StartGameAction;