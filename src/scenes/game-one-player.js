const {CONTROLS_P1} = require('../controls');
const Screen = require('../screen');
const LOGOS = require('../logos');
const {INITIAL_REMAINING_TIME} = require('../game');
const Engine = require('../engine');
const _ = require('lodash');

class SceneGameOnePlayer extends Phaser.Scene {
    constructor() {
        super({key: 'sceneGameOnePlayer'});
        this.quiz = Engine.createQuizFrom(LOGOS);
        this.currentQuestion = -1;
        this.texts = [];
        this.gameOver = false;
    }

    preload() {
        this.load.path = 'assets/';

        this.load.audio('theme', ['audio/remix.mp3']);

        this.load.audio('invalid', ['audio/Jingle 011.wav']);
        this.load.audio('valid', ['audio/Notification 2.wav']);

        this.quiz.forEach(l => {
            console.log(`Loading ${l.validAnswer.name} ... ${l.validAnswer.file}`);
            return this.load.image(l.validAnswer.name, `logos/re_${l.validAnswer.file}`);
        });

        this.load.image('bg', 'backgrounds/BG.png');

        this.load.image('BTN_A', 'elements/BTN_A.png');
        this.load.image('BTN_B', 'elements/BTN_B.png');
        this.load.image('BTN_C', 'elements/BTN_C.png');
        this.load.image('BTN_D', 'elements/BTN_D.png');

        this.load.image('WINDOW', 'elements/WINDOW_V2.png');
        this.load.image('TIMES_UP', 'elements/TIMES_UP.png');
        this.load.image('LAYER', 'elements/LAYER.png');

        this.buttons = {};
    }

    create() {
        this.bg = this.add.image(0, 0, 'bg').setOrigin(0);
        this.bg.setScale(2);
        this.bg.setZ(-1);

        this.buttons.A = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[CONTROLS_P1.A]);
        this.buttons.B = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[CONTROLS_P1.B]);
        this.buttons.C = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[CONTROLS_P1.C]);
        this.buttons.D = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[CONTROLS_P1.D]);

        this.add.image(50, 150, 'BTN_A').setScale(Screen.ZOOM);
        this.add.image(50, 240, 'BTN_B').setScale(Screen.ZOOM);
        this.add.image(50, 330, 'BTN_C').setScale(Screen.ZOOM);
        this.add.image(50, 420, 'BTN_D').setScale(Screen.ZOOM);

        this.add.image(450, 280, 'WINDOW').setScale(Screen.ZOOM);
        this.layer = this.add.image(0, 0, 'LAYER').setScale(Screen.ZOOM).setVisible(false).setOrigin(0);

        var music = this.sound.add('theme');
        music.play();

        this.validSound = this.sound.add('valid');
        this.invalidSound = this.sound.add('invalid');

        this.remainingTime = INITIAL_REMAINING_TIME;
        this.timeText = this.add.text(290, 30, this.remainingTime, {font: `${Screen.FONT_SIZE}px VT323`});
        this.start = new Date();

        this.nextQuestion();

        this.timesUp = this.add.image(Screen.WIDTH / 2, Screen.HEIGHT / 2, 'TIMES_UP').setScale(0).setVisible(true);

        this.tweenTimesUp = this.tweens.add({
            targets: this.timesUp,
            scaleX: 2,
            scaleY: 2,
            duration: 200,
            paused: true,
        });
    }

    nextQuestion() {
        this.currentQuestion++;

        if (this.currentQuestion >= 20) {
            this.currentQuestion = 0;
        }

        if (this.logo) {
            this.logo.setTexture(this.quiz[this.currentQuestion].validAnswer.name);
        } else {
            this.logo = this.add.image(450, 280, this.quiz[this.currentQuestion].validAnswer.name).setScale(2);
        }

        let column = 0;

        const question = {
            answers: _.orderBy([
                this.quiz[this.currentQuestion].validAnswer.name,
                this.quiz[this.currentQuestion].wrongAnswers[0].name,
                this.quiz[this.currentQuestion].wrongAnswers[1].name,
                this.quiz[this.currentQuestion].wrongAnswers[2].name,
            ]),
        };
        for (let i = 0; i < 4; i++) {
            if (this.texts[i]) {
                this.texts[i].setText(question.answers[i]);
            } else {
                this.texts[i] = this.add.text(100, 125 + (column++ * 90), question.answers[i], {font: `${Screen.FONT_SIZE}px VT323`});
            }
        }

    }

    update() {
        if (!this.gameOver) {
            if (Phaser.Input.Keyboard.JustDown(this.buttons.A)) {
                this.onKeyDown(this.texts[0]);
                this.nextQuestion();
            }
            if (Phaser.Input.Keyboard.JustDown(this.buttons.B)) {
                this.onKeyDown(this.texts[1]);
                this.nextQuestion();
            }
            if (Phaser.Input.Keyboard.JustDown(this.buttons.C)) {
                this.onKeyDown(this.texts[2]);
                this.nextQuestion();
            }
            if (Phaser.Input.Keyboard.JustDown(this.buttons.D)) {
                this.onKeyDown(this.texts[3]);
                this.nextQuestion();
            }
            const elapsedTime = (new Date().getTime() - this.start.getTime()) / 1000;
            this.remainingTime = Math.round(INITIAL_REMAINING_TIME - elapsedTime);
            if (this.remainingTime <= 0) {
                if (!this.tweenTimesUp.isPlaying()) {
                    this.layer.setVisible(true);
                    this.tweenTimesUp.resume();
                }
                this.time.delayedCall(3000, () => this.scene.start('sceneLogo'), [], this);
                this.gameOver = true;
            }
            this.timeText.setText(_.padStart(this.remainingTime, 2, '0'));
        }
    }

    onKeyDown(text) {
        const valid = text._text === this.quiz[this.currentQuestion].validAnswer.name;
        if (valid) {
            this.validSound.play();
        } else {
            this.invalidSound.play();
        }
    }

}

module.exports = SceneGameOnePlayer;