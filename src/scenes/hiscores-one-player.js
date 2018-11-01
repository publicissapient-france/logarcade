const _ = require('lodash');
const Screen = require('../screen');
const Format = require('../format');
const Game = require('../game');
const {CONTROLS_P1} = require('../controls');

const CYCLE = true;

const DEFAULT_SCORES = [
    {player: 'MPAQUE', time: Game.INITIAL_REMAINING_TIME * 1000},
    {player: 'JSMADJA', time: Game.INITIAL_REMAINING_TIME * 1000},
    {player: 'DATTALI', time: Game.INITIAL_REMAINING_TIME * 1000},
    {player: 'PTIRMAN', time: Game.INITIAL_REMAINING_TIME * 1000},
    {player: 'ABEAUCHA', time: Game.INITIAL_REMAINING_TIME * 1000},
];

class SceneScoresOnePlayer extends Phaser.Scene {

    constructor() {
        super({key: 'sceneScoresOnePlayer'});
    }

    preload() {
        this.load.image('bg', 'assets/backgrounds/BG.png');
        this.load.image('score_line', 'assets/elements/SCORE_LINE.png');
    }

    create() {
        this.scores = JSON.parse(localStorage.getItem('1P_scores')) || DEFAULT_SCORES;
        localStorage.setItem('1P_scores', JSON.stringify(this.scores));

        this.bg = this.add.image(0, 0, 'bg').setOrigin(0);
        this.bg.setScale(Screen.ZOOM, Screen.ZOOM);
        this.bg.setZ(-1);

        const titleValue = '         SCORE RANKING 1P         ';
        this.title = this.add.text(0, 25, titleValue, {font: `${Screen.FONT_SIZE}px Impact`});
        this.title
            .setBackgroundColor('#ee4239')
            .setFontStyle('italic')
            .setDisplaySize(Screen.WIDTH, Screen.FONT_SIZE);

        this.addScoreLines();
        const scores = this.computeScores();
        this.addRanks(scores);
        this.addPlayers(scores);
        this.addScores(scores);

        if (CYCLE) {
            this.time.delayedCall(5000, () => this.scene.start('sceneScoresTwoPlayers'), [], this);
        }
        this.p1start = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[CONTROLS_P1.START]);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.p1start)) {
            this.scene.start('sceneGameOnePlayer');
        }
    }

    addScores(scores) {
        const scoreValues = scores.map((score, i) => {
            const x = -Screen.WIDTH;
            const y = 100 + (Screen.FONT_SIZE * i * 1.5);
            return this.add.text(x, y, `${score.score}`)
                .setFontSize(Screen.FONT_SIZE)
                .setFontFamily('Impact')
                .setStroke('#2a366b', 4);
        });
        this.tweens.add({
            targets: scoreValues,
            x: 500,
            duration: 1500,
            ease: 'Power3',
            delay: i => i * 100
        });
    }

    addPlayers(scores) {
        const players = scores.map((score, i) => {
            const x = -Screen.WIDTH;
            const y = 100 + (Screen.FONT_SIZE * i * 1.5);
            return this.add.text(x, y, `${score.player}`)
                .setFontSize(Screen.FONT_SIZE)
                .setFontFamily('Impact')
                .setStroke('#2a366b', 4);
        });
        this.tweens.add({
            targets: players,
            x: 200,
            duration: 1500,
            ease: 'Power3',
            delay: i => i * 100
        });
    }

    addRanks(scores) {
        const ranks = scores.map((score, i) => {
            const x = -Screen.WIDTH;
            const y = 100 + (Screen.FONT_SIZE * i * 1.5);
            return this.add.text(x, y, `${score.rank}.`)
                .setFontSize(Screen.FONT_SIZE)
                .setFontFamily('Impact')
                .setStroke('#2a366b', 4);
        });
        this.tweens.add({
            targets: ranks,
            x: 70,
            duration: 1500,
            ease: 'Power3',
            delay: i => i * 100
        });
    }

    computeScores() {
        return _(this.scores)
            .orderBy(score => score.time)
            .take(5)
            .map((score, i) => {
                const rank = Format.formatRank(i + 1);
                const player = score.player;
                const time = Format.formatTime(score.time);
                return {rank, player, score: time};
            })
            .value();
    }

    addScoreLines() {
        const scoreLines = [];
        for (let i = 0; i < 5; i++) {
            scoreLines.push(this.add.image(Screen.WIDTH, 125 + (i * Screen.FONT_SIZE * 1.5), 'score_line')
                .setOrigin(0)
                .setScale(Screen.ZOOM));
        }
        this.tweens.add({
            targets: scoreLines,
            x: 70,
            duration: 1500,
            ease: 'Power3',
            delay: i => i * 100
        });
    }

}

module.exports = SceneScoresOnePlayer;