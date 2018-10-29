const {CONTROLS_P1, CONTROLS_P2} = require('../controls');
const Screen = require('../screen');
const LOGOS = require('../logos');
const {INITIAL_REMAINING_TIME} = require('../game');
const Engine = require('../engine');

const {HealthBar} = require('../healthbar');

const fontSize = 36;


class SceneGameTwoPlayers extends Phaser.Scene {
    constructor() {
        super({key: 'sceneGameTwoPlayers'});
        this.quiz = Engine.createQuizFrom(LOGOS);
        this.currentQuestion = -1;
        this.texts = [];
    }

    preload() {
        this.load.audio('invalid', ['assets/audio/Jingle 011.wav']);
        this.load.audio('valid', ['assets/audio/Notification 2.wav']);

        this.quiz.forEach(l => {
            console.log(`Loading ${l.validAnswer.name} ... ${l.validAnswer.file}`);
            return this.load.image(l.validAnswer.name, `assets/logos/re_${l.validAnswer.file}`);
        });

        this.load.image('bg', 'assets/backgrounds/BG.png');

        this.load.image('BTN_A', 'assets/elements/BTN_A.png');
        this.load.image('BTN_B', 'assets/elements/BTN_B.png');
        this.load.image('BTN_C', 'assets/elements/BTN_C.png');
        this.load.image('BTN_D', 'assets/elements/BTN_D.png');

        this.load.image('WINDOW', 'assets/elements/WINDOW.png');

        this.buttons = {
            P1: {},
            P2: {}
        };
    }

    create() {
        this.bg = this.add.image(0, 0, 'bg').setOrigin(0);
        this.bg.setScale(2);
        this.bg.setZ(-1);

        this.buttons.P1.A = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[CONTROLS_P1.A]);
        this.buttons.P1.B = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[CONTROLS_P1.B]);
        this.buttons.P1.C = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[CONTROLS_P1.C]);
        this.buttons.P1.D = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[CONTROLS_P1.D]);

        this.buttons.P2.A = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[CONTROLS_P2.A]);
        this.buttons.P2.B = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[CONTROLS_P2.B]);
        this.buttons.P2.C = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[CONTROLS_P2.C]);
        this.buttons.P2.D = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[CONTROLS_P2.D]);

        this.add.image(50, 150, 'BTN_A').setScale(2);
        this.add.image(50, 240, 'BTN_B').setScale(2);
        this.add.image(50, 330, 'BTN_C').setScale(2);
        this.add.image(50, 420, 'BTN_D').setScale(2);

        this.add.image(450, 280, 'WINDOW').setScale(2);

        this.validSound = this.sound.add('valid');
        this.invalidSound = this.sound.add('invalid');

        this.remainingTime = INITIAL_REMAINING_TIME;
        this.time = this.add.text(305, 30, this.remainingTime, {font: `${fontSize}px VT323`});
        this.start = new Date();

        this.nextQuestion();

        this.healthbarPlayerOne = new HealthBar(this, {x: 30, y: 30, bar: {color: 0xFF6347, direction: -1}});
        console.log("healthbarPlayerOne", this.healthbarPlayerOne);

        this.healthbarPlayerTwo = new HealthBar(this, {x: Screen.WIDTH - 280, y: 30, bar: {color: 0xFF6347}});
        console.log("healthbarPlayerTwo", this.healthbarPlayerTwo);


        this.health_P1 = 250;
        this.health_P2 = 250;


        console.log('this.healthbarPlayerOne', this.healthbarPlayerOne);

    }

    nextQuestion() {
        this.currentQuestion++;

        if (this.currentQuestion >= 20) {
            this.currentQuestion = 0;
        }

        if (this.logo) {
            this.logo.setTexture(this.quiz[this.currentQuestion].validAnswer.name);
        } else {
            this.logo = this.add.image(450, 280, this.quiz[this.currentQuestion].validAnswer.name).setScale(6);
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
                this.texts[i] = this.add.text(100, 125 + (column++ * 90), question.answers[i], {font: `${fontSize}px VT323`});
            }
        }
    }


    update() {
        this.healthbarPlayerOne.setProgress(this.health_P1);
        this.healthbarPlayerTwo.setProgress(this.health_P2);


        if (Phaser.Input.Keyboard.JustDown(this.buttons.P1.A)) {
            this.onKeyDown(this.texts[0], 1);
            this.nextQuestion();
        }
        if (Phaser.Input.Keyboard.JustDown(this.buttons.P1.B)) {
            this.onKeyDown(this.texts[1], 1);
            this.nextQuestion();
        }
        if (Phaser.Input.Keyboard.JustDown(this.buttons.P1.C)) {
            this.onKeyDown(this.texts[2], 1);
            this.nextQuestion();
        }
        if (Phaser.Input.Keyboard.JustDown(this.buttons.P1.D)) {
            this.onKeyDown(this.texts[3], 1);
            this.nextQuestion();
        }

        if (Phaser.Input.Keyboard.JustDown(this.buttons.P2.A)) {
            this.onKeyDown(this.texts[0], 2);
            this.nextQuestion();
        }
        if (Phaser.Input.Keyboard.JustDown(this.buttons.P2.B)) {
            this.onKeyDown(this.texts[1], 2);
            this.nextQuestion();
        }
        if (Phaser.Input.Keyboard.JustDown(this.buttons.P2.C)) {
            this.onKeyDown(this.texts[2], 2);
            this.nextQuestion();
        }
        if (Phaser.Input.Keyboard.JustDown(this.buttons.P2.D)) {
            this.onKeyDown(this.texts[3], 2);
            this.nextQuestion();
        }

        const elapsedTime = (new Date().getTime() - this.start.getTime()) / 1000;
        this.remainingTime = Math.round(INITIAL_REMAINING_TIME - elapsedTime);
        this.time.setText(this.remainingTime);


        //END
        if (this.remainingTime == 0 || this.health_P1 <= 0 || this.health_P2 <= 0) {
            console.log('End of Game');
            this.start('sceneEnternameTwoPlayers', {player_one: this.health_P1, player_two : this.health_P2});
        }
    }

    onKeyDown(text, player) {
        const valid = text._text === this.quiz[this.currentQuestion].validAnswer.name;
        if (valid) {
            this.validSound.play();

            if (player == 1) {
                this.health_P2 -= 10;
            } else {
                this.health_P1 -= 10;
            }

        } else {
            this.invalidSound.play();
        }
    }


}

module.exports = SceneGameTwoPlayers;


