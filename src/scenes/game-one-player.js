const {CONTROLS_P1, CONTROLS_P2} = require('../controls');
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
    }

    preload() {
        this.load.image('knighthawks', 'assets/fonts/knighthawks-font.png');

        this.load.audio('theme', [
            'assets/audio/Retrojäbä_-_Retrojäbä_-_sbrp_tutorial_remix.mp3'
        ]);
        this.quiz.forEach(l => {
            console.log(`Loading ${l.validAnswer.name} ... ${l.validAnswer.file}`);
            return this.load.image(l.validAnswer.name, `assets/logos/${l.validAnswer.file}`);
        });

        this.buttons = {};
    }

    create() {
        this.buttons.A = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[CONTROLS_P1.A]);
        this.buttons.B = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[CONTROLS_P1.B]);
        this.buttons.C = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[CONTROLS_P1.C]);
        this.buttons.D = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[CONTROLS_P1.D]);

        var music = this.sound.add('theme');
        music.play();
        this.remainingTime = INITIAL_REMAINING_TIME;
        this.time = this.add.text(400, 50, this.remainingTime);
        this.start = new Date();

        const config = {
            image: 'knighthawks',
            width: 32,
            height: 25,
            chars: Phaser.GameObjects.RetroFont.TEXT_SET2,
            charsPerRow: 10
        };

        this.cache.bitmapFont.add('knighthawks', Phaser.GameObjects.RetroFont.Parse(this, config));

        this.nextQuestion();

        //DUEL GAME
        console.log("CONTROLS_P2", CONTROLS_P2);
        this.p2start = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[CONTROLS_P2.START]);
        console.log("p2", this.p2start);


    }

    nextQuestion() {
        this.currentQuestion++;

        if (this.currentQuestion >= 20) {
            this.currentQuestion = 0;
        }

        if (this.logo) {
            this.logo.setTexture(this.quiz[this.currentQuestion].validAnswer.name);
        } else {
            this.logo = this.add.image(Screen.WIDTH / 2, Screen.HEIGHT / 2, this.quiz[this.currentQuestion].validAnswer.name);
            this.logo.setScale(0.1);
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
                this.texts[i].setText(question.answers[i].toUpperCase());
            } else {
                this.texts[i] = this.add.dynamicBitmapText(Screen.WIDTH * column++ / 4, 450, 'knighthawks', question.answers[i].toUpperCase()).setScale(0.8);
            }
        }
    }

    update() {
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
        this.time.setText(this.remainingTime);


        //DUAL GAME
        if (Phaser.Input.Keyboard.JustDown(this.p2start)) {
            this.scene.start('sceneGameTwoPlayers');
        }


    }

    onKeyDown(text) {
        text.setTint(0xff00ff, 0xffff00, 0x0000ff, 0xff0000);
        setTimeout(() => {
            text.clearTint();
        }, 150);
    }



}

module.exports = SceneGameOnePlayer;