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

        this.score = 0;
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

        //button - animation
        this.load.spritesheet('explosion',
            'assets/explosion.png',
            { frameWidth: 128, frameHeight: 128 }
        );

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

       this.scoreText = this.add.text(10, 10, "-", {font:"bold 24px VT323"});

       //animation explosion

        this.anims.create({
            key: 'boom',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 15 }),
            frameRate: 20,
            repeat: 0
        });



        this.nextQuestion();
    }

    nextQuestion() {
        this.currentQuestion++;

        if (this.currentQuestion >= this.quiz.length) { //when no more question
            this.scene.start('sceneTitle');
        }

        if (this.logo) {
            this.logo.setTexture(this.quiz[this.currentQuestion].validAnswer.name);
        } else {
            this.logo = this.add.image(Screen.WIDTH / 2, Screen.HEIGHT / 2, this.quiz[this.currentQuestion].validAnswer.name);
            this.logo.setScale(0.1);

            this.explosion = this.physics.add.sprite(Screen.WIDTH / 2, Screen.HEIGHT / 2, 'explosion');
            this.explosion.setScale(1.5);
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
                this.texts[i].setText(question.answers[i]); //.toUpperCase());
            } else {
                //this.texts[i] = this.add.dynamicBitmapText(Screen.WIDTH * column++ / 4, 450, 'knighthawks', question.answers[i].toUpperCase()).setScale(0.5);
                this.texts[i] = this.add.text(Screen.WIDTH * column++ / 4, 450, question.answers[i], {font:"bold 24px VT323"});
            }
        }
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.buttons.A)) {
            this.checkAnswer(this.texts[0]);
            this.onKeyDown(this.texts[0]);
        }
        if (Phaser.Input.Keyboard.JustDown(this.buttons.B)) {
            this.checkAnswer(this.texts[1]);
            this.onKeyDown(this.texts[1]);
        }
        if (Phaser.Input.Keyboard.JustDown(this.buttons.C)) {
            this.checkAnswer(this.texts[2]);
            this.onKeyDown(this.texts[2]);
        }
        if (Phaser.Input.Keyboard.JustDown(this.buttons.D)) {
            this.checkAnswer(this.texts[3]);
            this.onKeyDown(this.texts[3]);
        }
        const elapsedTime = (new Date().getTime() - this.start.getTime()) / 1000;
        this.remainingTime = Math.round(INITIAL_REMAINING_TIME - elapsedTime);
        this.time.setText(this.remainingTime);


        if( this.remainingTime == 0 ){ //Action to start when the time is over
            console.log('time out ! ');

            this.scene.start('sceneTimeOut'); //change scene because time is over
        }



    }

    onKeyDown(text) {
        text.setTint(0xff00ff, 0xffff00, 0x0000ff, 0xff0000);
        setTimeout(() => {
            text.clearTint();
        }, 150);
    }

    checkAnswer(answer){
        console.log(answer);
        console.log('the given answer : ', answer.text.toLowerCase());
        if( answer.text.toLowerCase() == this.quiz[this.currentQuestion].validAnswer.name){
            console.log("you're Right !");
            this.score += 10;
            this.explosion.anims.play('boom', true);
            setTimeout(() => {
                this.nextQuestion(); //we go to the next question only if the answer given is correct
            }, 1500);
        }else{
            console.log("Looser !");
            this.score -= 10;
        }
        this.scoreText.text = "Score : " + this.score.toString() + " ";
    }


}

module.exports = SceneGameOnePlayer;