const _ = require('lodash');
const Screen = require('../components/screen');
const Game = require('../domain/game');
const {CONTROLS_P1, CONTROLS_P2, JOYPADS} = require('../controls');
const Ranking = require('../domain/ranking');
const Background = require('../components/background');
const TitleBanner = require('../components/title-banner');

const colorP1 = '#FBB03B';
const colorP2 = '#6C1D5F';

const LETTERS = [
    'A', 'B', 'C', 'D', 'E', 'F',
    'G', 'H', 'I', 'J', 'K', 'L',
    'M', 'N', 'O', 'P', 'Q', 'R',
    'S', 'T', 'U', 'V', 'W', 'X',
    'Y', 'Z', 'DEL', 'END',
];

class SceneEnterNameTwoPlayers extends Phaser.Scene {
    constructor() {
        super({key: 'sceneEnterNameTwoPlayers'});
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

        this.load.audio('selected', ['assets/audio/Rise02.aif.wav']);
        this.load.audio('deleted', ['assets/audio/Rise03.aif.wav']);
        this.load.audio('ended', ['assets/audio/Rise04.aif.wav']);
    }

    create(data) {
        this.players = {
            1: {
                color: colorP1,
                selected: 'A',
                selectedIndex: 0,
                nameValue: '',
                buttons: {
                    A: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[CONTROLS_P1.A]),
                    B: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[CONTROLS_P1.B]),
                    UP: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[CONTROLS_P1.UP]),
                    DOWN: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[CONTROLS_P1.DOWN]),
                    LEFT: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[CONTROLS_P1.LEFT]),
                    RIGHT: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[CONTROLS_P1.RIGHT]),
                },
            },
            2: {
                color: colorP2,
                selected: 'A',
                selectedIndex: 0,
                nameValue: '',
                buttons: {
                    A: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[CONTROLS_P2.A]),
                    B: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[CONTROLS_P2.B]),
                    UP: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[CONTROLS_P2.UP]),
                    DOWN: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[CONTROLS_P2.DOWN]),
                    LEFT: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[CONTROLS_P2.LEFT]),
                    RIGHT: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[CONTROLS_P2.RIGHT]),
                },
            }
        };

        this.winner = data.winner;
        this.loser = data.loser;

        this.components.background.create();
        this.components.titleBanner.create('      ENTER YOUR NAMES      ');

        this.soundDeleted = this.sound.add('deleted');
        this.soundSelected = this.sound.add('selected');
        this.soundEnded = this.sound.add('ended');

        ['1', '2']
            .forEach((player, index) => {
                this.createNameSpace(player, index);
                this.createLetters(player, index);
                this.highlightSelected(player);
                this.updateName(player);
            });
    }

    createLetters(player, index) {
        this.players[player].letters = _(LETTERS)
            .map((letter, i) => {
                let x = (20 * (index + 1)) + (i % 6) * (Screen.FONT_SIZE) + (Screen.WIDTH / 2 * index);
                if (i > 26) {
                    x += Screen.FONT_SIZE;
                }
                const y = 190 + (parseInt(i / 6) * (Screen.FONT_SIZE * 1.1));
                return this.add.text(x, y, letter)
                    .setFontSize(Screen.FONT_SIZE)
                    .setFontFamily('Impact');
            })
            .value();
    }

    createNameSpace(player, index) {
        const x = (50 * (index + 1)) + ((Screen.WIDTH / 2) * index * 0.9);
        const y = 100;
        this.players[player].name = this.add.text(x, y, '')
            .setFontSize(Screen.FONT_SIZE)
            .setFontFamily('Impact')
            .setStroke(this.players[player].color, 2);
    }

    highlightSelected(player) {
        this.players[player].letters.forEach(letter => letter.setStroke(this.players[player].color, letter.text === this.players[player].selected ? 6 : 0));
    }

    selectLetter(player) {
        if (this.players[player].selectedIndex < 0) {
            this.players[player].selectedIndex = LETTERS.length - 1;
        }
        this.players[player].selected = LETTERS[this.players[player].selectedIndex % LETTERS.length];
    }

    updateName(player) {
        const name = this.players[player].validated ? this.players[player].nameValue : _.padEnd(this.players[player].nameValue, 8, '_');
        this.players[player].name.setText(name);
    }

    update() {
        ['1', '2'].forEach(player => {
            if (!this.players[player].validated) {
                this.updateKeyboard(player);
            }
        });
        this.updateGamepad();
    }

    updateGamepad() {
        ['1', '2'].forEach(player => {
            const gamepadIndex = player - 1;
            const gamepad = this.input.gamepad.gamepads[gamepadIndex];
            if (!gamepad) {
                return;
            }
            const horizontalAxis = gamepad.axes[4];
            const verticalAxis = gamepad.axes[5];
            const states = this.BUTTON_PRESS_STATES[player - 1];
            if (!states.UP && verticalAxis.getValue() < 0) {
                states.UP = true;
                this.onUp(player);
            }
            if (!states.DOWN && verticalAxis.getValue() > 0) {
                states.DOWN = true;
                this.onDown(player);
            }
            if (!states.LEFT && horizontalAxis.getValue() < 0) {
                states.LEFT = true;
                this.onLeft(player);
            }
            if (!states.RIGHT && horizontalAxis.getValue() > 0) {
                states.RIGHT = true;
                this.onRight(player);
            }

            if (horizontalAxis.getValue() === 0 && verticalAxis.getValue() === 0) {
                states.UP = false;
                states.DOWN = false;
                states.LEFT = false;
                states.RIGHT = false;
            }
        });
        this.input.gamepad.on('down', (pad, button) => {
            const padIndex = pad.index;
            const buttonIndex = button.index;
            const state = this.BUTTON_PRESS_STATES[padIndex][buttonIndex];
            if (!state) {
                const joypad = JOYPADS[padIndex];
                const pressedButton = joypad.reverse_mapping[buttonIndex];
                if (pressedButton) {
                    const letter = joypad.reverse_mapping[buttonIndex].letter;
                    switch (letter) {
                        case 'A':
                            this.onA(padIndex + 1);
                            break;
                        case 'B':
                            this.onB(padIndex + 1);
                            break;
                    }
                }
            }
            this.BUTTON_PRESS_STATES[padIndex][buttonIndex] = true;
        }, this);
        this.input.gamepad.on('up', (pad, button) => this.BUTTON_PRESS_STATES[pad.index][button.index] = false, this);
    }

    updateKeyboard(player) {
        if (Phaser.Input.Keyboard.JustDown(this.players[player].buttons.RIGHT)) {
            this.onRight(player);
        }
        if (Phaser.Input.Keyboard.JustDown(this.players[player].buttons.LEFT)) {
            this.onLeft(player);
        }
        if (Phaser.Input.Keyboard.JustDown(this.players[player].buttons.DOWN)) {
            this.onDown(player);
        }
        if (Phaser.Input.Keyboard.JustDown(this.players[player].buttons.UP)) {
            this.onUp(player);
        }
        if (Phaser.Input.Keyboard.JustDown(this.players[player].buttons.A)) {
            this.onA(player);
        }
        if (Phaser.Input.Keyboard.JustDown(this.players[player].buttons.B)) {
            this.onB(player);
        }
    }

    onB(player) {
        this.removeLastCharacter(player);
        this.updateName(player);
    }

    onA(player) {
        switch ((this.players[player].selected)) {
            case 'DEL':
                this.removeLastCharacter(player);
                break;
            case 'END':
                this.validateName(player);
                break;
            default:
                if (this.players[player].nameValue.length < Game.MAX_NAME_LENGTH) {
                    this.players[player].nameValue += this.players[player].selected;
                    this.soundSelected.play();
                }
        }
        this.updateName(player);
    }

    onUp(player) {
        if (this.players[player].selectedIndex > 5) {
            this.players[player].selectedIndex -= 6;
            this.selectLetter(player);
            this.highlightSelected(player);
        }
    }

    onDown(player) {
        if (this.players[player].selectedIndex < 24) {
            this.players[player].selectedIndex += 6;
            this.selectLetter(player);
            this.highlightSelected(player);
        }
    }

    onLeft(player) {
        if (this.players[player].selectedIndex % 6 !== 0) {
            this.players[player].selectedIndex--;
            this.selectLetter(player);
            this.highlightSelected(player);
        }
    }

    onRight(player) {
        if ((this.players[player].selectedIndex + 1) % 6 !== 0 && this.players[player].selectedIndex < (LETTERS.length - 1)) {
            this.players[player].selectedIndex++;
            this.selectLetter(player);
            this.highlightSelected(player);
        }
    }

    removeLastCharacter(player) {
        if (this.players[player].nameValue.length > 0) {
            this.players[player].nameValue = this.players[player].nameValue.substring(0, this.players[player].nameValue.length - 1);
            this.soundDeleted.play();
        }
    }

    validateName(player) {
        this.players[player].validated = true;
        this.players[player].letters.forEach(letter => letter.setVisible(false));

        if (this.players['1'].validated && this.players['2'].validated) {
            const score = {
                winner: this.players[this.winner].nameValue,
                loser: this.players[this.loser].nameValue
            };
            Ranking.twoPlayerScores().add(score);
            this.scene.start('sceneScoresTwoPlayers');
            this.soundEnded.play();
        }
    }
}

module.exports = SceneEnterNameTwoPlayers;