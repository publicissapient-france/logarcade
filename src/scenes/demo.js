const StartGameAction = require('../actions/start-game');
const LOGOS = require('../domain/logos');
const Engine = require('../domain/engine');
const Game = require('../domain/game');
const _ = require('lodash');
const Background = require('../components/background');
const Buttons = require('../components/buttons');
const Answers = require('../components/answers');
const LogoWindow = require('../components/logo_window');
const Timer = require('../components/timer');
const LifeBars = require('../components/life-bars');
const Colors = require('../components/colors');

class SceneDemo extends Phaser.Scene {
    constructor() {
        super({key: 'sceneDemo'});
    }

    init() {
        this.actions = {
            startGame: new StartGameAction(this),
        };
        this.components = {
            background: new Background(this),
            buttons: new Buttons(this),
            answers: new Answers(this),
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

        this.nextQuestion();

        // SIMULATE PLAYER PUSH
        this.time.delayedCall(1000, () => this.push(0), [], this);
        this.time.delayedCall(4000, () => this.push(1), [], this);
        this.time.delayedCall(7000, () => this.push(2), [], this);

        this.actions.startGame.create();
        this.time.delayedCall(10000, () => this.scene.start('sceneScoresOnePlayer'), [], this);
    }

    push(index) {
        const buttons = ['A', 'B', 'C', 'D'];
        this.onKeyDown(this.components.answers.texts[index]);
        this.components.buttons.getFeedBack(buttons[index], Colors.color_P1);
        this.nextQuestion();
    }

    onKeyDown(text) {
        this.components.lifeBars.updatePlayerBar(() => {
            this.lives--;
        });
    }

    nextQuestion() {
        this.currentQuestion++;

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

    update() {
        this.components.lifeBars.updatePlayer1Progress();

        /*
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
        */
        this.components.timer.update();
        this.actions.startGame.update();
    }
}

module.exports = SceneDemo;