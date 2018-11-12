const {CONTROLS_P1, CONTROLS_P2, JOYPADS} = require('../controls');
const LOGOS = require('../domain/logos');
const Engine = require('../domain/engine');
const Game = require('../domain/game');
const _ = require('lodash');
const Ranking = require('../domain/ranking');
const Background = require('../components/background');
const Buttons = require('../components/buttons');
const Answers = require('../components/answers');
const Alert = require('../components/alert');
const LogoWindow = require('../components/logo_window');
const Timer = require('../components/timer');
const LifeBars = require('../components/life-bars');
const Colors = require('../components/colors');
const CountDown = require('../components/countdown');

class SceneGameOnePlayer extends Phaser.Scene {
    constructor() {
        super({key: 'sceneGameOnePlayer'});
        this.BUTTON_PRESS_STATES = {
            0: {},
            1: {},
        }
    }

    init() {
        this.components = {
            background: new Background(this),
            buttons: new Buttons(this),
            answers: new Answers(this),
            alertTimesUp: new Alert(this),
            alertGameOver: new Alert(this),
            alertPerfect: new Alert(this),
            alertNewChallenger: new Alert(this),
            logoWindow: new LogoWindow(this),
            timer: new Timer(this),
            lifeBars: new LifeBars(this),
            countdown: new CountDown(this),
        };
    }

    preload() {
        this.components.background.preload();
        this.components.buttons.preload();
        this.components.logoWindow.preload(LOGOS);
        this.components.timer.preload();
        this.components.alertTimesUp.preload('TIMES_UP', 'assets/elements/TIMES_UP.png');
        this.components.alertGameOver.preload('GAME_OVER', 'assets/elements/GAME_OVER.png');
        this.components.alertPerfect.preload('PERFECT', 'assets/elements/PERFECT.png');
        this.components.alertNewChallenger.preload('NEW_CHALLENGER', 'assets/elements/NEW_CHALLENGER.png');

        this.load.path = 'assets/';
        this.load.audio('theme', ['audio/remix.mp3']);
        this.load.audio('invalid', ['audio/Jingle 011.wav']);
        this.load.audio('valid', ['audio/Notification 2.wav']);

        this.buttons = {};
    }

    create() {
        // GAME
        this.lives = 3;
        this.quiz = Engine.createQuizFrom(LOGOS, Game.ONE_PLAYER_QUIZ_LENGTH);
        this.currentQuestion = -1;
        this.gameOver = false;

        // UI
        this.components.answers.create();
        this.components.background.create();

        this.components.buttons.create();
        this.components.logoWindow.create();
        this.components.lifeBars.create();
        this.components.timer.create();
        this.components.countdown.create();
        this.components.alertTimesUp.create();
        this.components.alertGameOver.create();
        this.components.alertPerfect.create();
        this.components.alertNewChallenger.create();

        this.components.logoWindow.hide();

        // INPUTS
        this.buttons.A = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[CONTROLS_P1.A]);
        this.buttons.B = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[CONTROLS_P1.B]);
        this.buttons.C = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[CONTROLS_P1.C]);
        this.buttons.D = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[CONTROLS_P1.D]);
        this.p2start = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[CONTROLS_P2.START]);

        // SOUNDS
        this.theme = this.sound.add('theme');
        this.theme.play();
        this.validSound = this.sound.add('valid');
        this.invalidSound = this.sound.add('invalid');

        this.time.delayedCall(3000, () => {
            this.components.timer.launch();
            this.components.logoWindow.show();
            this.nextQuestion();
        }, [], this);

    }

    nextQuestion() {
        this.currentQuestion++;

        if (this.currentQuestion >= Game.ONE_PLAYER_QUIZ_LENGTH) {
            return this.endPerfectGame();
        }

        const logoName = this.quiz[this.currentQuestion].validAnswer.name;
        this.components.logoWindow.update(logoName);
        const question = {
            answers: _.orderBy([
                logoName,
                this.quiz[this.currentQuestion].wrongAnswers[0].name,
                this.quiz[this.currentQuestion].wrongAnswers[1].name,
                this.quiz[this.currentQuestion].wrongAnswers[2].name,
            ]),
        };
        this.components.answers.update(question);
    }

    goToLogo() {
        this.time.delayedCall(2000, () => this.scene.start('sceneLogo'), [], this);
    }

    goToEnterName(elapsedTime) {
        this.time.delayedCall(1000, () => this.scene.start('sceneEnterNameOnePlayer', {score: elapsedTime}), [], this);
    }

    endPerfectGame() {
        this.onEndGame();
        this.gameOver = true;
        this.components.alertPerfect.launch();
        const elapsedTime = this.components.timer.getElapsedTime();
        if (SceneGameOnePlayer.isHiScore(elapsedTime)) {
            return this.goToEnterName(elapsedTime);
        }
        this.goToLogo();
    }

    endNoMoreLifeGame() {
        this.onEndGame();
        this.gameOver = true;
        this.components.alertGameOver.launch();
        this.time.delayedCall(5000, () => this.scene.start('sceneLogo'), [], this);
    }

    endTimeUpGame() {
        this.onEndGame();
        this.gameOver = true;
        this.components.alertTimesUp.launch();
        this.time.delayedCall(3000, () => this.scene.start('sceneLogo'), [], this);
    }

    onEndGame() {
        this.hideHUD();
        this.theme.pause();
    }

    update() {
        if (!this.gameOver) {
            this.components.lifeBars.updatePlayer1Progress();
            this.updateKeyboard();
            this.updateGamepads();

            this.components.timer.update();
            if (this.components.timer.isTimeUp()) {
                return this.endTimeUpGame();
            }

            if (Phaser.Input.Keyboard.JustDown(this.p2start)) {
                this.components.alertNewChallenger.launch();
                this.time.delayedCall(2000, () => this.scene.start('sceneGameTwoPlayers'), [], this);
            }
        }
    }

    updateGamepads() {
        this.input.gamepad.on('down', (pad, button) => {
            const padIndex = pad.index;
            if (padIndex !== 0 || this.currentQuestion < 0) {
                return;
            }
            const buttonIndex = button.index;
            const pressed = this.BUTTON_PRESS_STATES[padIndex][buttonIndex];
            if (!pressed) {
                const joypad = JOYPADS[padIndex];
                const pressedButton = joypad.reverse_mapping[buttonIndex];
                if (pressedButton) {
                    const text = this.components.answers.texts[pressedButton.index];
                    this.onPushButton(text, pressedButton.letter);
                }
            }
            this.BUTTON_PRESS_STATES[padIndex][buttonIndex] = true;
        }, this);
        this.input.gamepad.on('up', (pad, button) => this.BUTTON_PRESS_STATES[pad.index][button.index] = false, this);
    }

    updateKeyboard() {
        ['A', 'B', 'C', 'D']
            .forEach((button, i) => {
                if (this.currentQuestion >= 0 && Phaser.Input.Keyboard.JustDown(this.buttons[button])) {
                    this.onPushButton(this.components.answers.texts[i], button);
                }
                if (this.buttons[button].isDown) {
                    this.components.buttons.push(button);
                }
            });
    }

    onPushButton(text, letter) {
        this.onKeyDown(text);
        this.components.buttons.getFeedBack(letter, Colors.color_P1);
        this.nextQuestion();
    }

    onKeyDown(text) {
        if (this.isAnswerValid(text)) {
            return this.validSound.play();
        }
        this.components.lifeBars.updatePlayerBar(() => {
            this.lives--;
            if (this.lives <= 0) {
                this.endNoMoreLifeGame();
            }
        });
        this.invalidSound.play();
    }

    isAnswerValid(text) {
        return text._text === this.quiz[this.currentQuestion].validAnswer.name;
    }

    static isHiScore(score) {
        return Ranking.onePlayerScores().isHiScore(score);
    }

    hideHUD() {
        this.components.logoWindow.hide();
        this.components.buttons.hide();
        this.components.answers.hide();
    }
}

module.exports = SceneGameOnePlayer;