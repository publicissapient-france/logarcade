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
const Format = require('../format');

class SceneEnterNameOnePlayer extends Phaser.Scene {
    constructor() {
        super({key: 'sceneEnterNameOnePlayer'});
    }

    preload() {
        this.load.image('bg', 'assets/backgrounds/BG.png');

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

        this.bg = this.add.image(0, 0, 'bg').setOrigin(0);
        this.bg.setScale(Screen.ZOOM, Screen.ZOOM);
        this.bg.setZ(-1);

        const titleValue = '         ENTER YOUR NAME         ';
        this.title = this.add.text(0, 25, titleValue, {font: `${Screen.FONT_SIZE}px Impact`});
        this.title
            .setBackgroundColor('#ee4239')
            .setFontStyle('italic')
            .setDisplaySize(Screen.WIDTH, Screen.FONT_SIZE);

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
                let x = (i % 6) * (fontSize * 2) + 150;
                if (i > 26) {
                    x += fontSize * 2;
                }
                const y = 190 + (parseInt(i / 6) * fontSize * 1.5);
                return this.add.text(x, y, letter)
                    .setFontSize(Screen.FONT_SIZE)
                    .setFontFamily('Impact');
            })
            .value();

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
        const scores = JSON.parse(localStorage.getItem('1P_scores'));
        scores.push({player: this.nameValue, time: this.score});
        localStorage.setItem('1P_scores', JSON.stringify(scores));
        this.scene.start('sceneScoresOnePlayer');
        this.soundEnded.play();
    }
}

module.exports = SceneEnterNameOnePlayer;