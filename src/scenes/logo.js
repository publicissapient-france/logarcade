const Screen = require('../components/screen');
const StartGameAction = require('../actions/start-game');

const _ = require('lodash');

class SceneLogo extends Phaser.Scene {

    constructor() {
        super({key: 'sceneLogo'});
    }

    init() {
        this.actions = {
            startGame: new StartGameAction(this),
        };
    }

    preload() {
        this.load.audio('hello', ['assets/audio/hello.mp3']);
        for (let i = 0; i < 25; i++) {
            this.load.image(`logo${i}`, `assets/elements/Xebia/Composition 1_000${_.padStart(i, 2, '0')}.png`);
        }
        // this.load.audio('xebia_sound', 'assets/audio/theme_streetfighter/Capcom.mp3');
    }

    create() {
        this.actions.startGame.create();
        if (!this.anim) {
            this.anim = this.anims.create({
                key: 'snooze',
                frames: _.range(25).map(i => ({key: `logo${i}`})),
                frameRate: 25,
                repeat: 0,
            });
        }
        this.sound.add('hello').play();
        this.logo = this.add.sprite(Screen.WIDTH / 2, Screen.HEIGHT / 2, 'logo0')
            .setScale(Screen.ZOOM)
            .play('snooze');

        // this.sound.add('xebia_sound').play();

        this.time.delayedCall(2000, () => this.scene.start('sceneTitle'), [], this);
    }

    update() {
        this.actions.startGame.update();
    }
}

module.exports = SceneLogo;
