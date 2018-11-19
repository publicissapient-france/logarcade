const _ = require('lodash');
const Screen = require('../components/screen');
const Game = require('../domain/game');
const {CONTROLS_P1, JOYPADS} = require('../controls');
const Ranking = require('../domain/ranking');
const Background = require('../components/background');
const TitleBanner = require('../components/title-banner');

const LETTERS = [
    'A', 'B', 'C', 'D', 'E', 'F',
    'G', 'H', 'I', 'J', 'K', 'L',
    'M', 'N', 'O', 'P', 'Q', 'R',
    'S', 'T', 'U', 'V', 'W', 'X',
    'Y', 'Z', 'DEL', 'END',
];

class SceneEnterNameOnePlayer extends Phaser.Scene {
    constructor() {
        super({key: 'sceneEnterNameOnePlayer'});
        this.BUTTON_PRESS_STATES = {
            0: {},
            1: {},
        }
    }

    init() {
        this.components = {
            background: new Background(this),
            titleBanner: new TitleBanner(this),
        };
    }

    preload() {
        this.components.background.preload();

        this.load.audio('entername-theme', ['assets/audio/entername.mp3']);
        this.load.audio('selected', ['assets/audio/Rise02.aif.wav']);
        this.load.audio('deleted', ['assets/audio/Rise03.aif.wav']);
        this.load.audio('ended', ['assets/audio/Rise04.aif.wav']);
    }

    create(data) {
        this.selected = 'A';
        this.buttons = {};
        this.selectedIndex = 0;
        this.nameValue = '';

        this.score = data.score;

        this.components.background.create();
        this.components.titleBanner.create('      ENTER YOUR NAME      ');

        this.soundTheme = this.sound.add('entername-theme');
        this.soundDeleted = this.sound.add('deleted');
        this.soundSelected = this.sound.add('selected');
        this.soundEnded = this.sound.add('ended');

        this.buttons.A = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[CONTROLS_P1.A]);
        this.buttons.B = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[CONTROLS_P1.B]);
        this.buttons.UP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[CONTROLS_P1.UP]);
        this.buttons.DOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[CONTROLS_P1.DOWN]);
        this.buttons.LEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[CONTROLS_P1.LEFT]);
        this.buttons.RIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[CONTROLS_P1.RIGHT]);

        this.name = this.add.text(Screen.WIDTH / 2 - 75, 100, '')
            .setFontSize(Screen.FONT_SIZE)
            .setFontFamily('Impact')
            .setStroke('#2a366b', 4);

        this.letters = _(LETTERS)
            .map((letter, i) => {
                let x = (i % 6) * (Screen.FONT_SIZE * 2) + 75;
                if (i > 26) {
                    x += Screen.FONT_SIZE * 2;
                }
                const y = 190 + (parseInt(i / 6) * Screen.FONT_SIZE);
                return this.add.text(x, y, letter)
                    .setFontSize(Screen.FONT_SIZE)
                    .setFontFamily('Impact');
            })
            .value();

        this.soundTheme.play();

        this.highlightSelected();
        this.updateName();
    }

    highlightSelected() {
        this.letters.forEach(letter => letter.setStroke('#ee4239', letter.text === this.selected ? 12 : 0));
    }

    selectLetter() {
        if (this.selectedIndex < 0) {
            this.selectedIndex = LETTERS.length - 1;
        }
        this.selected = LETTERS[this.selectedIndex % LETTERS.length];
    }

    updateName() {
        this.name.setText(_.padEnd(this.nameValue, 8, '-'));
    }

    update() {
        this.updateKeyboard();
        this.updateGamepad();
    }

    updateKeyboard() {
        if (Phaser.Input.Keyboard.JustDown(this.buttons.RIGHT)) {
            this.onRight();
        }
        if (Phaser.Input.Keyboard.JustDown(this.buttons.LEFT)) {
            this.onLeft();
        }
        if (Phaser.Input.Keyboard.JustDown(this.buttons.DOWN)) {
            this.onDown();
        }
        if (Phaser.Input.Keyboard.JustDown(this.buttons.UP)) {
            this.onUp();
        }
        if (Phaser.Input.Keyboard.JustDown(this.buttons.A)) {
            this.onA();
        }
        if (Phaser.Input.Keyboard.JustDown(this.buttons.B)) {
            this.onB();
        }
    }

    updateGamepad() {
        if (!this.input.gamepad.gamepads[0])
            return;

        const horizontalAxis = this.input.gamepad.gamepads[0].axes[4];
        const verticalAxis = this.input.gamepad.gamepads[0].axes[5];
        const states = this.BUTTON_PRESS_STATES[0];
        if (!states.UP && verticalAxis.getValue() < 0) {
            states.UP = true;
            this.onUp();
        }
        if (!states.DOWN && verticalAxis.getValue() > 0) {
            states.DOWN = true;
            this.onDown();
        }
        if (!states.LEFT && horizontalAxis.getValue() < 0) {
            states.LEFT = true;
            this.onLeft();
        }
        if (!states.RIGHT && horizontalAxis.getValue() > 0) {
            states.RIGHT = true;
            this.onRight();
        }

        if (horizontalAxis.getValue() === 0 && verticalAxis.getValue() === 0) {
            states.UP = false;
            states.DOWN = false;
            states.LEFT = false;
            states.RIGHT = false;
        }

        this.input.gamepad.on('down', (pad, button) => {
            const padIndex = pad.index;
            const buttonIndex = button.index;
            const state = this.BUTTON_PRESS_STATES[padIndex][buttonIndex];
            if (!state && padIndex === 0) {
                const joypad = JOYPADS[padIndex];
                const pressedButton = joypad.reverse_mapping[buttonIndex];
                if (pressedButton) {
                    const letter = joypad.reverse_mapping[buttonIndex].letter;
                    switch (letter) {
                        case 'A':
                            this.onA();
                            break;
                        case 'B':
                            this.onB();
                            break;
                    }
                }
            }
            this.BUTTON_PRESS_STATES[padIndex][buttonIndex] = true;
        }, this);
        this.input.gamepad.on('up', (pad, button) => this.BUTTON_PRESS_STATES[pad.index][button.index] = false, this);
    }

    onB() {
        this.removeLastCharacter();
        this.updateName();
    }

    onA() {
        switch ((this.selected)) {
            case 'DEL':
                this.removeLastCharacter();
                break;
            case 'END':
                if (this.nameValue.length > 0) {
                    this.validateName();
                }
                break;
            default:
                if (this.nameValue.length < Game.MAX_NAME_LENGTH) {
                    this.nameValue += this.selected;
                    this.soundSelected.play();
                }
        }
        this.updateName();
    }

    onUp() {
        if (this.selectedIndex > 5) {
            this.selectedIndex -= 6;
            this.selectLetter();
            this.highlightSelected();
        }
    }

    onDown() {
        if (this.selectedIndex < 24) {
            this.selectedIndex += 6;
            this.selectLetter();
            this.highlightSelected();
        }
    }

    onLeft() {
        if (this.selectedIndex % 6 !== 0) {
            this.selectedIndex--;
            this.selectLetter();
            this.highlightSelected();
        }
    }

    onRight() {
        if ((this.selectedIndex + 1) % 6 !== 0 && this.selectedIndex < (LETTERS.length - 1)) {
            this.selectedIndex++;
            this.selectLetter();
            this.highlightSelected();
        }
    }

    removeLastCharacter() {
        if (this.nameValue.length > 0) {
            this.nameValue = this.nameValue.substring(0, this.nameValue.length - 1);
            this.soundDeleted.play();
        }
    }

    validateName() {
        Ranking.onePlayerScores().add({player: this.nameValue, time: this.score});
        this.scene.start('sceneScoresOnePlayer');
        this.soundTheme.pause();
        this.soundEnded.play();
    }
}

module.exports = SceneEnterNameOnePlayer;