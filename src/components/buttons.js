const Screen = require('./screen');

const BUTTONS = ['A', 'B', 'C', 'D'];

class Buttons {
    constructor(game) {
        Object.assign(this, game);
    }

    preload() {
        BUTTONS.forEach(button => {
            this.load.image(`BTN_${button}`, `assets/elements/BTN_${button}.png`);
            this.load.image(`BTN_${button}_pressed`, `assets/elements/BTN_${button}_PRESS.png`);
        });
        this.feedback = {};
    }

    create() {
        BUTTONS.forEach((button, i) => {
            const animationName = `${button}_active`;
            if (!this.anims.get(animationName)) {
                this.anims.create({
                    key: animationName,
                    frames: [
                        {key: `BTN_${button}_pressed`, duration: 50},
                        {key: `BTN_${button}`}
                    ],
                    frameRate: 8,
                    repeat: 0
                });
            }

            this.feedback[button] = this.add.graphics();
            this.feedback[button].beginPath();
            this.feedback[button].fillStyle(0x000000);
            this.feedback[button].arc(52, 313 + (i * 180), 42, Phaser.Math.DegToRad(0), Phaser.Math.DegToRad(180), false, 0.2);
            this.feedback[button].setScale(1, 0.5);
            this.feedback[button].fillPath();
            this.feedback[button].alpha = 0;

            this[`BTN_${button}`] = this.add.sprite(50, 150 + (i * 90), `BTN_${button}`).setScale(Screen.ZOOM);
        });
    }

    getFeedBack(button, color) {
        const target = this.feedback[button];

        this.tweens.timeline({
            targets: target,
            ease: 'Power1',
            duration: 100,
            tweens: [{alpha: 1}],
            yoyo: true,
            onStart: () => {
                target.fillStyle(color);
                target.lineStyle(2, color);
                target.fillPath();
                target.strokePath();
            },
            onComplete: () => {
                target.alpha = 0;
            }

        });
    }

    push(button) {
        this[`BTN_${button}`].play(`${button}_active`);
    }

    hide() {
        BUTTONS.forEach((button) => {
            this[`BTN_${button}`].setVisible(false)
            this.feedback[button].setVisible(false)
        });
    }

}

module.exports = Buttons;