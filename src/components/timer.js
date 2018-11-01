const Screen = require('../screen');
const INITIAL_REMAINING_TIME = require('../game').INITIAL_REMAINING_TIME;

class Timer {
    constructor(game) {
        Object.assign(this, game);
    }

    preload() {
        this.load.image('timer', 'assets/elements/TIMER.png');
    }

    create() {
        this.timer = this.add.image(Screen.WIDTH / 2, 45, 'timer');
        this.timer.setScale(Screen.ZOOM);

        this.remainingTime = INITIAL_REMAINING_TIME;
        this.timeText = this.add.text(Screen.WIDTH / 2 - 17, 20, this.remainingTime, {font: `${Screen.FONT_SIZE}px VT323`});
        this.start = new Date();
    }

    update() {
        const elapsedTime = (new Date().getTime() - this.start.getTime()) / 1000;
        this.remainingTimeInMs = INITIAL_REMAINING_TIME - elapsedTime;
        this.remainingTime = Math.round(this.remainingTimeInMs);
        this.timeText.setText(_.padStart(this.remainingTime, 2, '0'));
    }

    isTimeUp() {
        return this.remainingTime <= 0;
    }
}

module.exports = Timer;