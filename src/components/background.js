const Screen = require('../screen');

class Background {

    constructor(game) {
        Object.assign(this, game);
    }

    preload() {
        this.load.image('bg', 'assets/backgrounds/BG.png');
    }

    create() {
        this.bg = this.add.image(0, 0, 'bg').setOrigin(0);
        this.bg.setScale(Screen.ZOOM, Screen.ZOOM);
        this.bg.setZ(-1);
    }

}

module.exports = Background;