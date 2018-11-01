const Screen = require('../screen');
const Colors = require('../colors');
const {HealthBar} = require('../healthbar');

class LifeBars {
    constructor(game) {
        Object.assign(this, game);
    }

    create() {
        this.healthbarPlayerOne = new HealthBar(this, {
            x: 25,
            y: 27,
            width: 270,
            bar: {color: Colors.color_P1, direction: -1}
        });

        this.healthbarPlayerTwo = new HealthBar(this, {
            x: Screen.WIDTH - 295,
            y: 27,
            width: 270,
            bar: {color: Colors.color_P2, direction: 1}
        });

        this.health_P1 = {state: 270 - 4};
        this.power = this.health_P1.state / 3;
    }

    updatePlayer1Bar(onComplete) {
        this.tweens.timeline({
            targets: this.health_P1,
            ease: 'Power1',
            duration: 500,
            tweens: [{state: this.health_P1.state - this.power}],
            onComplete,
        });
    }

    updatePlayer1Progress() {
        this.healthbarPlayerOne.setProgress(this.health_P1.state);
    }

}

module.exports = LifeBars;