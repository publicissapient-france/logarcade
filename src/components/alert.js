const Screen = require('./screen');

class Alert {
    constructor(game) {
        Object.assign(this, game);
    }

    preload(name, image) {
        this.name = name;
        this.load.image('LAYER', 'assets/elements/LAYER.png');
        this.load.image(name, image);
    }

    create() {
        this.layer = this.add.image(0, 0, 'LAYER')
            .setScale(Screen.ZOOM)
            .setVisible(false)
            .setOrigin(0);

        this.alert = this.add.image(Screen.WIDTH / 2, Screen.HEIGHT / 2, this.name)
            .setScale(0)
            .setVisible(true)
            .setZ(110000);

        this.tween = this.tweens.add({
            targets: this.alert,
            scaleX: 2,
            scaleY: 2,
            duration: 200,
            paused: true,
        });
    }

    launch() {
        if (!this.tween.isPlaying()) {
            this.layer.setVisible(true);
            this.tween.resume();
        }
    }
}

module.exports = Alert;