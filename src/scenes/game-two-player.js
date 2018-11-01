const Screen = require('../screen');
const { HealthBar } = require('../healthbar');

class SceneGameTwoPlayers extends Phaser.Scene {
    constructor() {
        super({key: 'sceneGameTwoPlayers'});
    }

    preload() {
        this.add.text(Screen.WIDTH / 2, Screen.HEIGHT / 2, 'sceneGameTwoPlayers');
    }

    create() {

        this.myHealthBar = new HealthBar(this, { x: Screen.WIDTH / 2, y: 200, bar: {color : 0xFF6347, direction: -1 }});
        console.log("HealthBar",this.myHealthBar);

        this.myHealthBar.setPosition(30,30);
        this.myHealthBar.setProgress(50);
    }
}

module.exports = SceneGameTwoPlayers;


