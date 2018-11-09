const _ = require('lodash');
const Screen = require('../components/screen');
const Game = require('../domain/game');
const {CONTROLS_P1, CONTROLS_P2} = require('../controls');
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
                if (Phaser.Input.Keyboard.JustDown(this.players[player].buttons.RIGHT)) {
                    this.players[player].selectedIndex++;
                    this.selectLetter(player);
                    this.highlightSelected(player);
                }
                if (Phaser.Input.Keyboard.JustDown(this.players[player].buttons.LEFT)) {
                    this.players[player].selectedIndex--;
                    this.selectLetter(player);
                    this.highlightSelected(player);
                }
                if (Phaser.Input.Keyboard.JustDown(this.players[player].buttons.DOWN)) {
                    this.players[player].selectedIndex += 6;
                    this.selectLetter(player);
                    this.highlightSelected(player);
                }
                if (Phaser.Input.Keyboard.JustDown(this.players[player].buttons.UP)) {
                    this.players[player].selectedIndex -= 6;
                    this.selectLetter(player);
                    this.highlightSelected(player);
                }
                if (Phaser.Input.Keyboard.JustDown(this.players[player].buttons.A)) {
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
                if (Phaser.Input.Keyboard.JustDown(this.players[player].buttons.B)) {
                    this.removeLastCharacter(player);
                    this.updateName(player);
                }
            }
        });
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

            Ranking.twoPlayerScores().add({
                winner: this.players[this.winner].nameValue,
                loser: this.players[this.loser].nameValue});

            this.scene.start('sceneScoresTwoPlayers');
            this.soundEnded.play();
        }
    }
}

module.exports = SceneEnterNameTwoPlayers;