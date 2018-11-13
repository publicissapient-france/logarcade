const Screen = require('./screen');

class CountDown {
    constructor(game) {
        Object.assign(this, game);
    }

    preload() {
        this.load.audio('countdown-bip', ['assets/audio/countdown-bip-2.mp3']);
    }

    create() {
        const fontSize = Screen.FONT_SIZE * 4;
        const x = Screen.WIDTH / 2 - fontSize / 4;
        const y = Screen.HEIGHT / 2 - fontSize / 2;
        const stroke = Screen.FONT_SIZE / 2;
        const strokeColor = '#6C1D5F';
        const counter = [
            this.add.text(x, y, 3).setFontSize(fontSize).setFontFamily('Impact').setStroke(strokeColor, stroke).setVisible(false),
            this.add.text(x, y, 2).setFontSize(fontSize).setFontFamily('Impact').setStroke(strokeColor, stroke).setVisible(false),
            this.add.text(x, y, 1).setFontSize(fontSize).setFontFamily('Impact').setStroke(strokeColor, stroke).setVisible(false),
        ];

        this.countDownSound = this.sound.add('countdown-bip');
        for (let i = 0; i < counter.length; i++) {
            this.time.delayedCall(i * 1000, () => {
                if (i > 0) {
                    counter[i - 1].setVisible(false);
                }
                counter[i].setVisible(true);
                this.countDownSound.play();
            }, [], this);
        }

        this.time.delayedCall(3000, () => {
            this.sys.events.emit('countDownFinish');
            counter[2].setVisible(false);
        }, [], this);
    }

}

module.exports = CountDown;