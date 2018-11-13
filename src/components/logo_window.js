const Screen = require('./screen');

class LogoWindow {
    constructor(game) {
        Object.assign(this, game);
    }

    preload(logos) {
        this.load.image('WINDOW', 'assets/elements/WINDOW_V2.png');
        logos.forEach(l => this.load.image(l.name, `assets/logos/re_${l.file}`));
    }

    create() {
        this.logo = null;
        this.window = this.add.image(470, 280, 'WINDOW').setScale(Screen.ZOOM);
    }

    update(logoName) {
        if (this.logo) {
            this.logo.setTexture(logoName);
        } else {
            this.logo = this.add.image(470, 280, logoName)
                .setScale(Screen.ZOOM);
        }
    }

    hideLogo() {
        if (this.logo) {
            this.logo.setVisible(false);
        }
    }

    hide() {
        this.hideLogo();
        this.window.setVisible(false);
    }

    show() {
        if (this.logo) {
            this.logo.setVisible(true);
        }
        this.window.setVisible(true);
    }
}

module.exports = LogoWindow;