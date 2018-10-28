const Screen = require('../screen');

const fontSize = 36;

class SceneScoresTwoPlayers extends Phaser.Scene {

    constructor() {
        super({key: 'sceneScoresTwoPlayers'});
    }

    preload() {
        this.load.image('bg', 'assets/backgrounds/BG.png');
    }

    create() {
        this.bg = this.add.image(0, 0, 'bg').setOrigin(0);
        this.bg.setScale(Screen.ZOOM, Screen.ZOOM);
        this.bg.setZ(-1);

        const titleValue = 'TWO PLAYER MODE';
        this.title = this.add.text(0, 30, titleValue, {font: `${fontSize}px VT323`, boundsAlignH: "center"});
        this.title.x = Screen.WIDTH / 2 - this.title.width / 2;
        this.title.alpha = 0;

        this.time.delayedCall(3000, () => {
            this.scene.start('sceneTitle')
        }, [], this);

        this.events.on('transitionstart', this.transitionStart, this);
    }

    transitionStart(fromScene, progress) {
        const alpha = progress;
        this.title.alpha = alpha;
    }
}

module.exports = SceneScoresTwoPlayers;