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
        bg.setScale(Screen.ZOOM,Screen.ZOOM);
        bg.setZ(-1);

        const titleValue = 'ONE PLAYER MODE';
        const title = this.add.text(0, 30, titleValue, {font: `${fontSize}px Monospace`, boundsAlignH: "center"});
        title.x = Screen.WIDTH / 2 - title.width / 2;

        let idx = 0;
        let rank = 1;
        const texts = _(this.scores)
            .map(score => {
                score.rank = rank++;
                return score;
            })
            .map(score => this.add.text(-Screen.WIDTH, 90 + (fontSize * idx++), `${_.padStart(formatRank(score.rank), 4)}.   ${_.padEnd(score.player, 8)}   ${formatTime(score.time)}`, {font: `${fontSize}px Monospace`}))
            .value();

        this.tweens.add({
            targets: texts,
            x: 70,
            duration: 2000,
            ease: 'Power3',
            delay: function (i, total, target) {
                return i * 100;
            }
        });

        if (CYCLE) {
            this.time.delayedCall(3000, () => {
                this.scene.start('sceneScoresTwoPlayers')
            }, [], this);
        }
    }
}

module.exports = SceneScoresOnePlayer;