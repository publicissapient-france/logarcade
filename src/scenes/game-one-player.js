const {CONTROLS_P1, CONTROLS_P2} = require('../controls');
const Screen = require('../screen');
const LOGOS = require('../logos');
const {INITIAL_REMAINING_TIME} = require('../game');
const Engine = require('../engine');
const Game = require('../game');
const _ = require('lodash');
const {HealthBar} = require('../healthbar');
const Ranking = require('../ranking');

var power;

const color_P1 = 0xFBB03B;
const color_P2 = 0x6C1D5F;

class SceneGameOnePlayer extends Phaser.Scene {
    constructor() {
        super({key: 'sceneGameOnePlayer'});
    }

    preload() {
        this.load.path = 'assets/';

        this.load.audio('theme', ['audio/remix.mp3']);

        this.load.audio('invalid', ['audio/Jingle 011.wav']);
        this.load.audio('valid', ['audio/Notification 2.wav']);

        LOGOS.forEach(l => {
            console.log(`Loading ${l.name} ... ${l.file}`);
            return this.load.image(l.name, `logos/re_${l.file}`);
        });

        this.load.image('bg', 'backgrounds/BG.png');
        this.load.image('timer', 'elements/TIMER.png');

        this.load.image('BTN_A', 'elements/BTN_A.png');
        this.load.image('BTN_B', 'elements/BTN_B.png');
        this.load.image('BTN_C', 'elements/BTN_C.png');
        this.load.image('BTN_D', 'elements/BTN_D.png');

        this.load.image('BTN_A_pressed', 'elements/BTN_A_PRESS.png');
        this.load.image('BTN_B_pressed', 'elements/BTN_B_PRESS.png');
        this.load.image('BTN_C_pressed', 'elements/BTN_C_PRESS.png');
        this.load.image('BTN_D_pressed', 'elements/BTN_D_PRESS.png');

        this.load.image('WINDOW', 'elements/WINDOW_V2.png');
        this.load.image('TIMES_UP', 'elements/TIMES_UP.png');
        this.load.image('GAME_OVER', 'elements/GAME_OVER.png');
        this.load.image('PERFECT', 'elements/PERFECT.png');
        this.load.image('LAYER', 'elements/LAYER.png');

        this.buttons = {};
        this.feedback = {};
    }

    create() {
        this.logo = null;
        this.texts = [];

        this.quiz = Engine.createQuizFrom(LOGOS, Game.ONE_PLAYER_QUIZ_LENGTH);

        this.currentQuestion = -1;
        this.gameOver = false;

        this.bg = this.add.image(0, 0, 'bg').setOrigin(0);
        this.bg.setScale(Screen.ZOOM);
        this.bg.setZ(-1);

        this.buttons.A = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[CONTROLS_P1.A]);
        this.buttons.B = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[CONTROLS_P1.B]);
        this.buttons.C = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[CONTROLS_P1.C]);
        this.buttons.D = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[CONTROLS_P1.D]);

        this.anims.create({
            key: 'A_active',
            frames: [
                {key: 'BTN_A_pressed', duration: 50},
                {key: 'BTN_A'}
            ],
            frameRate: 8,
            repeat: 0
        });
        this.anims.create({
            key: 'B_active',
            frames: [
                {key: 'BTN_B_pressed', duration: 50},
                {key: 'BTN_B'}
            ],
            frameRate: 8,
            repeat: 0
        });
        this.anims.create({
            key: 'C_active',
            frames: [
                {key: 'BTN_C_pressed', duration: 50},
                {key: 'BTN_C'}
            ],
            frameRate: 8,
            repeat: 0
        });
        this.anims.create({
            key: 'D_active',
            frames: [
                {key: 'BTN_D_pressed', duration: 50},
                {key: 'BTN_D'}
            ],
            frameRate: 8,
            repeat: 0
        });

        this.feedback.A = this.add.graphics();
        this.feedback.A.beginPath();
        this.feedback.A.fillStyle(0x000000);
        this.feedback.A.arc(52, 313, 42, Phaser.Math.DegToRad(0), Phaser.Math.DegToRad(180), false, 0.2);
        this.feedback.A.setScale(1, 0.5);
        this.feedback.A.fillPath();
        this.feedback.A.alpha = 0;

        this.feedback.B = this.add.graphics();
        this.feedback.B.beginPath();
        this.feedback.B.fillStyle(0x000000);
        this.feedback.B.arc(52, 493, 42, Phaser.Math.DegToRad(0), Phaser.Math.DegToRad(180), false, 0.2);
        this.feedback.B.setScale(1, 0.5);
        this.feedback.B.fillPath();
        this.feedback.B.alpha = 0;

        this.feedback.C = this.add.graphics();
        this.feedback.C.beginPath();
        this.feedback.C.fillStyle(0x000000);
        this.feedback.C.arc(52, 673, 42, Phaser.Math.DegToRad(0), Phaser.Math.DegToRad(180), false, 0.2);
        this.feedback.C.setScale(1, 0.5);
        this.feedback.C.fillPath();
        this.feedback.C.alpha = 0;

        this.feedback.D = this.add.graphics();
        this.feedback.D.beginPath();
        this.feedback.D.fillStyle(0x000000);
        this.feedback.D.arc(52, 853, 42, Phaser.Math.DegToRad(0), Phaser.Math.DegToRad(180), false, 0.2);
        this.feedback.D.setScale(1, 0.5);
        this.feedback.D.fillPath();
        this.feedback.D.alpha = 0;

        this.BTN_A = this.add.sprite(50, 150, 'BTN_A').setScale(Screen.ZOOM);
        this.BTN_B = this.add.sprite(50, 240, 'BTN_B').setScale(Screen.ZOOM);
        this.BTN_C = this.add.sprite(50, 330, 'BTN_C').setScale(Screen.ZOOM);
        this.BTN_D = this.add.sprite(50, 420, 'BTN_D').setScale(Screen.ZOOM);

        this.add.image(470, 280, 'WINDOW').setScale(Screen.ZOOM);

        this.healthbarPlayerOne = new HealthBar(this, {
            x: 25,
            y: 27,
            width: 270,
            bar: {color: color_P1, direction: -1}
        });

        new HealthBar(this, {
            x: Screen.WIDTH - 295,
            y: 27,
            width: 270,
            bar: {color: color_P2, direction: 1}
        });

        this.health_P1 = {state: 270 - 4};

        power = this.health_P1.state / 3;

        this.layer = this.add.image(0, 0, 'LAYER').setScale(Screen.ZOOM).setVisible(false).setOrigin(0);

        var music = this.sound.add('theme');
        music.play();

        this.validSound = this.sound.add('valid');
        this.invalidSound = this.sound.add('invalid');

        this.timer = this.add.image(Screen.WIDTH / 2, 45, 'timer');
        this.timer.setScale(Screen.ZOOM);

        this.remainingTime = INITIAL_REMAINING_TIME;
        this.timeText = this.add.text(Screen.WIDTH / 2 - 17, 20, this.remainingTime, {font: `${Screen.FONT_SIZE}px VT323`});
        this.start = new Date();

        this.nextQuestion();

        this.timesUp = this.add.image(Screen.WIDTH / 2, Screen.HEIGHT / 2, 'TIMES_UP').setScale(0).setVisible(true);
        this.gameOverImage = this.add.image(Screen.WIDTH / 2, Screen.HEIGHT / 2, 'GAME_OVER').setScale(0).setVisible(true);
        this.perfectImage = this.add.image(Screen.WIDTH / 2, Screen.HEIGHT / 2, 'PERFECT').setScale(0).setVisible(true);

        this.tweenTimesUp = this.tweens.add({
            targets: this.timesUp,
            scaleX: 2,
            scaleY: 2,
            duration: 200,
            paused: true,
        });

        this.tweenGameOver = this.tweens.add({
            targets: this.gameOverImage,
            scaleX: 2,
            scaleY: 2,
            duration: 200,
            paused: true,
        });

        this.tweenPerfect = this.tweens.add({
            targets: this.perfectImage,
            scaleX: 2,
            scaleY: 2,
            duration: 200,
            paused: true,
        });

        this.p2start = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[CONTROLS_P2.START]);
    }

    nextQuestion() {
        this.currentQuestion++;

        if (this.currentQuestion >= Game.ONE_PLAYER_QUIZ_LENGTH) {
            this.gameOver = true;
            if (!this.tweenPerfect.isPlaying()) {
                this.layer.setVisible(true);
                this.tweenPerfect.resume();
            }
            const elapsedTime =  Math.round((INITIAL_REMAINING_TIME - this.remainingTimeInMs) * 1000);
            if(SceneGameOnePlayer.isHiScore(elapsedTime)) {
                this.time.delayedCall(1000, () => this.scene.start('sceneEnterNameOnePlayer', {score: elapsedTime}), [], this);
            } else {
                this.time.delayedCall(2000, () => this.scene.start('sceneLogo'), [], this);
            }
            return;
        }

        if (this.logo) {
            this.logo.setTexture(this.quiz[this.currentQuestion].validAnswer.name);
        } else {
            this.logo = this.add.image(470, 280, this.quiz[this.currentQuestion].validAnswer.name).setScale(Screen.ZOOM);
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
                this.texts[i] = this.make.text({
                    x: 100,
                    y: 125 + (column++ * 90),
                    text: question.answers[i],
                    style: {
                        font: `${Screen.FONT_SIZE}px VT323`,
                        wordWrap: {width: 200, useAdvancedWrap: true}
                    }
                });
            }
        }
    }

    update() {
        if (this.health_P1.state <= 0) {
            if (!this.tweenGameOver.isPlaying()) {
                this.layer.setVisible(true);
                this.tweenGameOver.resume();
            }
            this.time.delayedCall(5000, () => this.scene.start('sceneLogo'), [], this);
            this.gameOver = true;
        }

        if (!this.gameOver) {
            this.healthbarPlayerOne.setProgress(this.health_P1.state);

            if (Phaser.Input.Keyboard.JustDown(this.buttons.A)) {
                this.onKeyDown(this.texts[0]);
                this.getFeedBack(this.feedback.A, color_P1);
                this.nextQuestion();
            }
            if (Phaser.Input.Keyboard.JustDown(this.buttons.B)) {
                this.onKeyDown(this.texts[1]);
                this.getFeedBack(this.feedback.B, color_P1);
                this.nextQuestion();
            }
            if (Phaser.Input.Keyboard.JustDown(this.buttons.C)) {
                this.onKeyDown(this.texts[2]);
                this.getFeedBack(this.feedback.C, color_P1);
                this.nextQuestion();
            }
            if (Phaser.Input.Keyboard.JustDown(this.buttons.D)) {
                this.onKeyDown(this.texts[3]);
                this.getFeedBack(this.feedback.D, color_P1);
                this.nextQuestion();
            }

            if (this.buttons.A.isDown) {
                this.BTN_A.play('A_active');
            }
            if (this.buttons.B.isDown) {
                this.BTN_B.play('B_active');
            }
            if (this.buttons.C.isDown) {
                this.BTN_C.play('C_active');
            }
            if (this.buttons.D.isDown) {
                this.BTN_D.play('D_active');
            }

            const elapsedTime = (new Date().getTime() - this.start.getTime()) / 1000;
            this.remainingTimeInMs = INITIAL_REMAINING_TIME - elapsedTime;
            this.remainingTime = Math.round(this.remainingTimeInMs);
            if (this.remainingTime <= 0) {
                if (!this.tweenTimesUp.isPlaying()) {
                    this.layer.setVisible(true);
                    this.tweenTimesUp.resume();
                }
                this.time.delayedCall(5000, () => this.scene.start('sceneLogo'), [], this);
                this.gameOver = true;
            }
            this.timeText.setText(_.padStart(this.remainingTime, 2, '0'));

            //DUAL GAME
            if (Phaser.Input.Keyboard.JustDown(this.p2start)) {
                this.scene.start('sceneGameTwoPlayers');
            }
        }
    }

    getFeedBack(target, color) {
        target.fillStyle(color);
        target.lineStyle(2, color);
        target.fillPath();
        target.strokePath();

        this.tweens.timeline({
            targets: target,
            ease: 'Power1',
            duration: 100,
            tweens: [{alpha: 1}],
            yoyo: true,
        });
    }

    onKeyDown(text) {
        const valid = text._text === this.quiz[this.currentQuestion].validAnswer.name;
        if (valid) {
            this.validSound.play();
        } else {
            this.tweens.timeline({
                targets: this.health_P1,
                ease: 'Power1',
                duration: 1000,
                tweens: [{state: this.health_P1.state - power}]
            });
            this.invalidSound.play();
        }
    }

    static isHiScore(score) {
        return Ranking.onePlayerScores().isHiScore(score);
    }
}

module.exports = SceneGameOnePlayer;