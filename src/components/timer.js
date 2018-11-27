const Screen = require('./screen');
const INITIAL_REMAINING_TIME = require('../domain/game.config').INITIAL_REMAINING_TIME;

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
    }

    launch() {
        this.start = new Date();
    }

    update() {
        const time = this.start ? this.start.getTime() : new Date().getTime();
        const elapsedTime = (new Date().getTime() - time) / 1000;
        this.remainingTimeInMs = INITIAL_REMAINING_TIME - elapsedTime;
        this.remainingTime = Math.round(this.remainingTimeInMs);
        this.timeText.setText(_.padStart(this.remainingTime, 2, '0'));
    }

    isTimeUp() {
        return this.remainingTime <= 0;
    }

    getElapsedTime() {
        return Math.round((INITIAL_REMAINING_TIME - this.remainingTimeInMs) * 1000);
    }
}

module.exports = Timer;