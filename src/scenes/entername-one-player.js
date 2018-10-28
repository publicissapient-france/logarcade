const LETTERS = [
    'A', 'B', 'C', 'D', 'E', 'F',
    'G', 'H', 'I', 'J', 'K', 'L',
    'M', 'N', 'O', 'P', 'Q', 'R',
    'S', 'T', 'U', 'V', 'W', 'X',
    'Y', 'Z', 'DEL', 'END',
];

const _ = require('lodash');
const Screen = require('../screen');
const {CONTROLS_P1} = require('../controls');
const fontSize = 36;
const MAX_NAME_LENGTH = 8;

class SceneEnterNameOnePlayer extends Phaser.Scene {
    constructor() {
        super({key: 'sceneEnterNameOnePlayer'});
        this.selected = 'A';
        this.buttons = {};
        this.selectedIndex = 0;
        this.nameValue = '';
    }

    preload() {
        this.load.audio('selected', ['assets/audio/Rise02.aif.wav']);
        this.load.audio('deleted', ['assets/audio/Rise03.aif.wav']);
        this.load.audio('ended', ['assets/audio/Rise04.aif.wav']);
    }

    create() {
        this.soundDeleted = this.sound.add('deleted');
        this.soundSelected = this.sound.add('selected');
        this.soundEnded = this.sound.add('ended');

        this.buttons.A = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[CONTROLS_P1.A]);
        this.buttons.B = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[CONTROLS_P1.B]);
        this.buttons.UP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[CONTROLS_P1.UP]);
        this.buttons.DOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[CONTROLS_P1.DOWN]);
        this.buttons.LEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[CONTROLS_P1.LEFT]);
        this.buttons.RIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[CONTROLS_P1.RIGHT]);

        const titleValue = 'ENTER NAME';
        this.title = this.add.text(0, 30, titleValue, {font: `${fontSize}px VT323`, boundsAlignH: "center"});
        this.title.x = Screen.WIDTH / 2 - this.title.width / 2;

        this.name = this.add.text(0, 300, '', {font: `${fontSize}px VT323`, boundsAlignH: "center"});

        this.letters = _(LETTERS)
            .map((letter, i) => {
                let x = (i % 6) * (fontSize * 2);
                if (i > 26) {
                    x += fontSize * 2;
                }
                const y = 90 + (parseInt(i / 6) * fontSize);
                const style = {font: `${fontSize}px VT323`};
                return this.add.text(x, y, letter, style);
            })
            .value();

        this.highlightSelected();
        this.updateName();
    }

    highlightSelected() {
        this.letters.forEach(letter => letter.setStroke('#f00', letter.text === this.selected ? 4 : 0));
    }

    selectLetter() {
        if (this.selectedIndex < 0) {
            this.selectedIndex = LETTERS.length - 1;
        }
        this.selected = LETTERS[this.selectedIndex % LETTERS.length];
    }

    updateName() {
        this.name.setText(_.padEnd(this.nameValue, 8, '•'));
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.buttons.RIGHT)) {
            this.selectedIndex++;
            this.selectLetter();
            this.highlightSelected();
        }
        if (Phaser.Input.Keyboard.JustDown(this.buttons.LEFT)) {
            this.selectedIndex--;
            this.selectLetter();
            this.highlightSelected();
        }
        if (Phaser.Input.Keyboard.JustDown(this.buttons.DOWN)) {
            this.selectedIndex += 6;
            this.selectLetter();
            this.highlightSelected();
        }
        if (Phaser.Input.Keyboard.JustDown(this.buttons.UP)) {
            this.selectedIndex -= 6;
            this.selectLetter();
            this.highlightSelected();
        }
        if (Phaser.Input.Keyboard.JustDown(this.buttons.A)) {
            switch ((this.selected)) {
                case 'DEL':
                    this.removeLastCharacter();
                    break;
                case 'END':
                    this.validateName();
                    break;
                default:
                    if (this.nameValue.length < MAX_NAME_LENGTH) {
                        this.nameValue += this.selected;
                        this.soundSelected.play();
                    }
            }
            this.updateName();
        }
        if (Phaser.Input.Keyboard.JustDown(this.buttons.B)) {
            this.removeLastCharacter();
            this.updateName();
        }
    }

    removeLastCharacter() {
        if (this.nameValue.length > 0) {
            this.nameValue = this.nameValue.substring(0, this.nameValue.length - 1);
            this.soundDeleted.play();
        }
    }

    validateName() {
        this.scene.start('sceneScoresOnePlayer');
        this.soundEnded.play();
    }
}

module.exports = SceneEnterNameOnePlayer;