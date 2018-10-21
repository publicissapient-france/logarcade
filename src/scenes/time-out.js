const Screen = require('../screen');

class SceneTimeOut extends Phaser.Scene {

    constructor() {
        super({key: 'sceneTimeOut'});
    }

    preload() {
        this.add.text(Screen.WIDTH / 2, Screen.HEIGHT / 2, 'TIME OUT');
    }

    create() {
        this.time.delayedCall(3000, () => {
            this.scene.start('sceneTitle')
        }, [], this);
    }
}

module.exports = SceneTimeOut;