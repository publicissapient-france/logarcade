const Screen = require('../screen');
const {INITIAL_REMAINING_TIME} = require('../game');

const { HealthBar } = require('../healthbar');

class SceneGameTwoPlayers extends Phaser.Scene {
    constructor() {
        super({key: 'sceneGameTwoPlayers'});
    }

    preload() {
        this.load.image('bg', 'assets/backgrounds/BG.png');
        this.add.text(Screen.WIDTH / 2, Screen.HEIGHT / 2, 'sceneGameTwoPlayers', {font:"bold 24px VT323"});
    }

    create() {
        this.bg = this.add.image(0, 0, 'bg').setOrigin(0);
        this.bg.setScale(Screen.ZOOM, Screen.ZOOM);
        this.bg.setZ(-1);


        this.remainingTime = INITIAL_REMAINING_TIME;
        this.time = this.add.text(Screen.WIDTH / 2, 50, this.remainingTime, {font:"bold 24px VT323"});
        this.start = new Date();


        this.healthbarPlayerOne = new HealthBar(this, { x: 30, y: 30, bar: {color : 0xFF6347, direction: -1 }});
        console.log("healthbarPlayerOne",this.healthbarPlayerOne);
        this.healthbarPlayerOne.setProgress(50);

        this.healthbarPlayerTwo = new HealthBar(this, { x: Screen.WIDTH - 280, y: 30, bar: {color : 0xFF6347 }});
        console.log("healthbarPlayerTwo",this.healthbarPlayerTwo);

        this.healthbarPlayerTwo.setProgress(100);
    }

    update(){
        const elapsedTime = (new Date().getTime() - this.start.getTime()) / 1000;
        this.remainingTime = Math.round(INITIAL_REMAINING_TIME - elapsedTime);
        this.time.setText(this.remainingTime);
    }
}

module.exports = SceneGameTwoPlayers;


