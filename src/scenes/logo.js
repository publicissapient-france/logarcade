const Screen = require('../screen');
const _ = require('lodash');

class SceneLogo extends Phaser.Scene {

    constructor() {
        super({key: 'sceneLogo'});
    }

    preload() {
        this.load.path = 'assets/elements/Xebia/';
        for (let i = 0; i < 25; i++) {
            this.load.image(`logo${i}`, `Composition 1_000${_.padStart(i, 2, '0')}.png`);
        }
    }

    create() {
        const data = {
            key: 'snooze',
            frames: [],
            frameRate: 25,
            repeat: 0,
        };
        for (let i = 0; i < 25; i++) {
            data.frames.push({key: 'logo' + i});
        }
        this.anims.create(data);
        this.add.sprite(Screen.WIDTH / 2, Screen.HEIGHT / 2, 'logo0').setScale(Screen.ZOOM).play('snooze');

        this.time.delayedCall(2000, () => this.scene.start('sceneTitle'), [], this);

    }


}

module.exports = SceneLogo;
