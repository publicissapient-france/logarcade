const _ = require('lodash');
const Screen = require('../screen');

const CYCLE = true;
const fontSize = 36;

const DEFAULT_SCORES = [
    {player: 'AAAAAAAA', time: 99840},
    {player: 'BBBBBBB', time: 99830},
    {player: 'CCCCCCCC', time: 99550},
    {player: 'DDDDD', time: 99450},
    {player: 'EEEEEEEE', time: 99240},
    {player: 'FFFFF', time: 99340},
    {player: 'GGGGGGGG', time: 99090},
    {player: 'HHHHHHHH', time: 99370},
    {player: 'IIIIIIII', time: 99290},
    {player: 'JJJJJJJJ', time: 99730},
];

const formatRank = rank => {
    switch (rank) {
        case 1:
            return `${rank}st`;
        case 2:
            return `${rank}nd`;
        case 3:
            return `${rank}rd`;
        default:
            return `${rank}th`;
    }
};

const formatTime = time => {
    return `${parseInt(time / 1000)}"${_.padStart((time - (parseInt(time / 1000) * 1000)) / 10, 2, '0') }`;
};

class SceneScoresOnePlayer extends Phaser.Scene {

    constructor() {
        super({key: 'sceneScoresOnePlayer'});
        this.scores = localStorage.getItem('1P_scores') || DEFAULT_SCORES;
    }

    preload() {
        this.load.image('bg', 'assets/backgrounds/BG.png');
    }

    create() {
        const bg = this.add.image(0, 0, 'bg');
        bg.setScale(Screen.ZOOM, Screen.ZOOM);
        bg.setZ(-1);

        const titleValue = 'ONE PLAYER MODE';
        const title = this.add.text(0, 30, titleValue, {font: `${fontSize}px Monospace`, boundsAlignH: "center"});
        title.x = Screen.WIDTH / 2 - title.width / 2;

        const texts = _(this.scores)
            .orderBy(score => score.time)
            .take(10)
            .map((score, i) => {
                const x = -Screen.WIDTH;
                const y = 90 + (fontSize * i);
                const rank = _.padStart(formatRank(i + 1), 4);
                const player = _.padEnd(score.player, 8);
                const time = formatTime(score.time);
                const style = {font: `${fontSize}px Monospace`};
                return this.add.text(x, y, `${rank}.   ${player}   ${time}`, style);
            })
            .value();

        this.tweens.add({
            targets: texts,
            x: 70,
            duration: 1500,
            ease: 'Power3',
            delay: i => i * 100
        });

        if (CYCLE) {
            this.time.delayedCall(5000, () => {
                this.scene.start('sceneScoresTwoPlayers')
            }, [], this);
        }
    }
}

module.exports = SceneScoresOnePlayer;