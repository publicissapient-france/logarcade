const {CONTROLS_P1, CONTROLS_P2} = require('../controls');
const LOGOS = require('../logos');
const {INITIAL_REMAINING_TIME} = require('../game');
const Engine = require('../engine');
const Game = require('../game');
const _ = require('lodash');
const Ranking = require('../ranking');
const Background = require('../components/background');
const Buttons = require('../components/buttons');
const Answers = require('../components/answers');
const Alert = require('../components/alert');
const LogoWindow = require('../components/logo_window');
const Timer = require('../components/timer');
const LifeBars = require('../components/life-bars');
const Colors = require('../colors');

class SceneGameOnePlayer extends Phaser.Scene {
    constructor() {
        super({key: 'sceneGameOnePlayer'});
    }

    init() {
        this.components = {
            background: new Background(this),
            buttons: new Buttons(this),
            answers: new Answers(this),
            alertTimesUp: new Alert(this),
            alertGameOver: new Alert(this),
            alertPerfect: new Alert(this),
            logoWindow: new LogoWindow(this),
            timer: new Timer(this),
            lifeBars: new LifeBars(this),
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
        this.components.alertTimesUp.create();
        this.components.alertGameOver.create();
        this.components.alertPerfect.create();

        // INPUTS
        this.buttons.A = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[CONTROLS_P1.A]);
        this.buttons.B = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[CONTROLS_P1.B]);
        this.buttons.C = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[CONTROLS_P1.C]);
        this.buttons.D = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[CONTROLS_P1.D]);
        this.p2start = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[CONTROLS_P2.START]);

        // SOUNDS
        this.sound.add('theme').play();
        this.validSound = this.sound.add('valid');
        this.invalidSound = this.sound.add('invalid');

        this.nextQuestion();
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

    endPerfectGame() {
        this.gameOver = true;
        this.components.alertPerfect.launch();
        const elapsedTime = Math.round((INITIAL_REMAINING_TIME - this.remainingTimeInMs) * 1000);
        if (SceneGameOnePlayer.isHiScore(elapsedTime)) {
            return this.goToEnterName(elapsedTime);
        }
        this.goToLogo();
    }

    goToLogo() {
        this.time.delayedCall(2000, () => this.scene.start('sceneLogo'), [], this);
    }

    goToEnterName(elapsedTime) {
        this.time.delayedCall(1000, () => this.scene.start('sceneEnterNameOnePlayer', {score: elapsedTime}), [], this);
    }

    endNoMoreLifeGame() {
        this.gameOver = true;
        this.components.alertGameOver.launch();
        this.time.delayedCall(5000, () => this.scene.start('sceneLogo'), [], this);
        }

    endTimeUpGame() {
        this.gameOver = true;
        this.components.alertTimesUp.launch();
        this.time.delayedCall(5000, () => this.scene.start('sceneLogo'), [], this);
    }

    update() {
        if (!this.gameOver) {
            this.components.lifeBars.updatePlayer1Progress();

            ['A', 'B', 'C', 'D']
                .forEach((button, i) => {
                    if (Phaser.Input.Keyboard.JustDown(this.buttons[button])) {
                        this.onKeyDown(this.components.answers.texts[i]);
                        this.components.buttons.getFeedBack(button, Colors.color_P1);
                        this.nextQuestion();
                    }
                    if (this.buttons[button].isDown) {
                        this.components.buttons.push(button);
                    }
                });

            this.components.timer.update();
            if (this.components.timer.isTimeUp()) {
                return this.endTimeUpGame();
            }

            if (Phaser.Input.Keyboard.JustDown(this.p2start)) {
                this.scene.start('sceneGameTwoPlayers');
            }
        }
    }

    onKeyDown(text) {
        if (this.isAnswerValid(text)) {
            return this.validSound.play();
        }
        this.components.lifeBars.updatePlayer1Bar(() => {
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
}

module.exports = SceneGameOnePlayer;