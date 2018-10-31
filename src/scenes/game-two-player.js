const {CONTROLS_P1, CONTROLS_P2} = require('../controls');
const Screen = require('../screen');
const LOGOS = require('../logos');
const {INITIAL_REMAINING_TIME} = require('../game');
const Engine = require('../engine');

const {HealthBar} = require('../healthbar');

const fontSize = 36;
var power = 10;

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
        this.load.image('timer', 'assets/elements/TIMER.png');

        this.load.image('BTN_A', 'assets/elements/BTN_A.png');
        this.load.image('BTN_A_pressed', 'assets/elements/BTN_A_PRESS.png');
        this.load.image('BTN_B', 'assets/elements/BTN_B.png');
        this.load.image('BTN_B_pressed', 'assets/elements/BTN_B_PRESS.png');
        this.load.image('BTN_C', 'assets/elements/BTN_C.png');
        this.load.image('BTN_C_pressed', 'assets/elements/BTN_C_PRESS.png');
        this.load.image('BTN_D', 'assets/elements/BTN_D.png');
        this.load.image('BTN_D_pressed', 'assets/elements/BTN_D_PRESS.png');

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
        })

        this.BTN_A = this.add.sprite(50, 150, 'BTN_A').setScale(2);
        this.BTN_B = this.add.sprite(50, 240, 'BTN_B').setScale(2);
        this.BTN_C = this.add.sprite(50, 330, 'BTN_C').setScale(2);
        this.BTN_D = this.add.sprite(50, 420, 'BTN_D').setScale(2);

        this.add.image(470, 280, 'WINDOW').setScale(2);


        this.healthbarPlayerOne = new HealthBar(this, {
            x: 25,
            y: 27,
            width: 270,
            bar: {color: 0xEE4239, direction: -1}
        });
        console.log("healthbarPlayerOne", this.healthbarPlayerOne);

        this.healthbarPlayerTwo = new HealthBar(this, {
            x: Screen.WIDTH - 295,
            y: 27,
            width: 270,
            bar: {color: 0xEE4239, direction: 1}
        });
        console.log("healthbarPlayerTwo", this.healthbarPlayerTwo);


        this.health_P2 = {
            state: 270 - 4
        }
        this.health_P1 = {
            state: 270 - 4
        }


        console.log('this.healthbarPlayerOne', this.healthbarPlayerOne);

        this.validSound = this.sound.add('valid');
        this.invalidSound = this.sound.add('invalid');

        this.timer = this.add.image(Screen.WIDTH / 2 - 55.5, 15, 'timer').setOrigin(0);
        this.timer.setScale(1.8);

        this.remainingTime = INITIAL_REMAINING_TIME;
        this.time = this.add.text(305, 26, this.remainingTime, {font: `${fontSize}px VT323`});
        this.start = new Date();

        this.nextQuestion();

    }

    nextQuestion() {
        this.currentQuestion++;

        if (this.currentQuestion >= 20) {
            this.currentQuestion = 0;
        }

        if (this.logo) {
            this.logo.setTexture(this.quiz[this.currentQuestion].validAnswer.name);
        } else {
            this.logo = this.add.image(470, 280, this.quiz[this.currentQuestion].validAnswer.name).setScale(6);
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
                    x : 100,
                    y : 125 + (column++ * 90),
                    text : question.answers[i],
                    style : {
                        font: `${fontSize}px VT323`,
                        wordWrap : {width : 200, useAdvancedWrap: true }
                    }
                });
            }
        }
    }


    update() {

        this.healthbarPlayerOne.setProgress(this.health_P1.state);
        this.healthbarPlayerTwo.setProgress(this.health_P2.state);


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
        if (this.remainingTime == 0 || this.health_P1.state <= 5 || this.health_P2.state <= 5) {
            console.log('End of Game');
            this.start('sceneEnternameTwoPlayers', {player_one: this.health_P1, player_two: this.health_P2});
        }


        if ((this.buttons.P1.A).isDown) {
            console.log('A is down !');
            console.log(this.health_P2.state);
            this.BTN_A.play('A_active');
        }
        if ((this.buttons.P1.B).isDown) {
            console.log('B is down !');
            this.BTN_B.play('B_active');
            console.log(this.health_P2.state);

        }
        if ((this.buttons.P1.C).isDown) {
            console.log('C is down !');
            this.BTN_C.play('C_active');
            console.log(this.health_P2.state);

        }
        if ((this.buttons.P1.D).isDown) {
            console.log('D is down !');
            this.BTN_D.play('D_active');
            console.log(this.health_P2.state);

        }


    }

    onKeyDown(text, player) {
        const valid = text._text === this.quiz[this.currentQuestion].validAnswer.name;
        if (valid) {
            this.validSound.play();

            if (player == 1) {

                this.tweens.timeline({
                    targets: this.health_P2,
                    ease: 'Power1',
                    duration: 1000,
                    tweens: [
                        {
                            state: this.health_P2.state - 10
                        }]
                });
            } else {
                this.tweens.timeline({
                    targets: this.health_P1,
                    ease: 'Power1',
                    duration: 1000,
                    tweens: [
                        {
                            state: this.health_P1.state - power
                        }]
                });
            }
        } else {
            this.invalidSound.play();
        }
    }


}

module.exports = SceneGameTwoPlayers;


