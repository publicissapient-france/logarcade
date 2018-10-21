const Screen = require('../screen');
const {CONTROLS_P1} = require('../controls');
const _ = require('lodash');


var progress = 0;

class SceneLoadingGame extends Phaser.Scene {

    constructor() {
        super({key: 'sceneLoading'});
    }

    preload() {

        this.buttons = {};

        //progress bar  - action on click
        this.progressBar = this.add.graphics();
        this.progressBox = this.add.graphics();
        this.progressBox.fillStyle(0x222222, 0.8);
        this.progressBox.fillRect(50, 270, 320, 50);

        this.p1start = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[CONTROLS_P1.START]);

        //progress bar - action with time
        this.progressBarTime = this.add.graphics();
        this.progressTime = this.add.graphics();
        this.progressTime.fillStyle(0x222222, 0.8);
        this.progressTime.fillRect(50, 170, 320, 50);

    }

    create() {

        this.start = new Date();

        this.buttons.A = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[CONTROLS_P1.A]);
        this.buttons.B = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[CONTROLS_P1.B]);

        this.progressBar.clear();
        this.progressBar.fillStyle(0xffffff, 1);
        this.progressBar.fillRect(50, 280, 0 + progress, 30);

        this.progressBarTime.clear();
        this.progressTime.fillStyle(0xFF6347, 1);
        this.progressTime.fillRect(50, 180, 0, 30);

    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.buttons.A)) {
            this.updateProgress( -10 ) ;
        }

        if (Phaser.Input.Keyboard.JustDown(this.buttons.B)) {
            this.updateProgress( 10 ) ;
        }

        const elapsedTime = (new Date().getTime() - this.start.getTime()) / 1000;
        this.timePassed = Math.round(elapsedTime);

        console.log(this.timePassed);
        this.progressTime.fillRect(50, 180, 0 + this.timePassed * 3, 30);

        if (progress > 300 || (this.timePassed * 3) > 300  ) {
            this.scene.start('sceneGameOnePlayer' , { sizeOfQuiz : 30 });
        }

    }

    updateProgress( point ){
        progress += point;
        console.log("progress", progress);
        this.progressBar.clear();
        this.progressBar.fillStyle(0xffffff, 1);
        this.progressBar.fillRect(50, 280, 0 + progress, 30);
    }


}

module.exports = SceneLoadingGame;