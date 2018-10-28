const Screen = require('../screen');
const { HealthBar } = require('../healthbar');

class SceneGameTwoPlayers extends Phaser.Scene {
    constructor() {
        super({key: 'sceneGameTwoPlayers'});
    }

    preload() {
        this.add.text(Screen.WIDTH / 2, Screen.HEIGHT / 2, 'sceneGameTwoPlayers', {font:"bold 24px VT323"});
    }

    create() {

        this.healthbarPlayerOne = new HealthBar(this, { x: 30, y: 30, bar: {color : 0xFF6347, direction: -1 }});
        console.log("healthbarPlayerOne",this.healthbarPlayerOne);
        this.healthbarPlayerOne.setProgress(50);

        this.healthbarPlayerTwo = new HealthBar(this, { x: Screen.WIDTH - 280, y: 30, bar: {color : 0xFF6347 }});
        console.log("healthbarPlayerTwo",this.healthbarPlayerTwo);

        this.healthbarPlayerTwo.setProgress(100);
    }
}

module.exports = SceneGameTwoPlayers;


