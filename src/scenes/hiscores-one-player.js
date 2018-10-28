const _ = require('lodash');
const Screen = require('../screen');
const Format = require('../format');

const CYCLE = true;
const fontSize = 36;

const DEFAULT_SCORES = [
    {player: 'MPAQUE', time: 99840},
    {player: 'JSMADJA', time: 99830},
    {player: 'DATTALI', time: 99550},
    {player: 'PTIRMAN', time: 99450},
    {player: 'ABEAUCHA', time: 99240},
    {player: 'CNGUYEN', time: 99340},
    {player: 'JJOUANNE', time: 99090},
    {player: 'FDESROUS', time: 99370},
    {player: 'KKERNINO', time: 99290},
    {player: 'MTRACCO', time: 99730},
];

class SceneScoresOnePlayer extends Phaser.Scene {

    constructor() {
        super({key: 'sceneScoresOnePlayer'});
        this.scores = localStorage.getItem('1P_scores') || DEFAULT_SCORES;
    }

    preload() {
        this.load.image('bg', 'assets/backgrounds/BG.png');
    }

    create() {
        this.bg = this.add.image(0, 0, 'bg').setOrigin(0);
        this.bg.setScale(Screen.ZOOM, Screen.ZOOM);
        this.bg.setZ(-1);

        const titleValue = 'ONE PLAYER MODE';
        this.title = this.add.text(0, 30, titleValue, {font: `${fontSize}px VT323`, boundsAlignH: "center"});
        this.title.x = Screen.WIDTH / 2 - this.title.width / 2;

        this.texts = _(this.scores)
            .orderBy(score => score.time)
            .take(10)
            .map((score, i) => {
                const x = -Screen.WIDTH;
                const y = 90 + (fontSize * i);
                const rank = Format.formatRank(i + 1);
                const player = Format.formatPlayer(score.player);
                const time = Format.formatTime(score.time);
                const style = {font: `${fontSize}px VT323`};
                return this.add.text(x, y, `${rank}.   ${player}   ${time}`, style);
            })
            .value();

        this.tweens.add({
            targets: this.texts,
            x: 70,
            duration: 1500,
            ease: 'Power3',
            delay: i => i * 100
        });

        if (CYCLE) {
            this.time.delayedCall(5000, () => {
                this.scene.transition({
                    target: 'sceneScoresTwoPlayers',
                    duration: 500,
                    onUpdate: this.transitionOut,
                    moveBelow: true,
                });
            }, [], this);
        }
    }

    transitionOut(progress) {
        const alpha = 1 - progress;
        this.title.alpha = alpha;
        this.texts.forEach(t => t.alpha = alpha);
    }
}

module.exports = SceneScoresOnePlayer;