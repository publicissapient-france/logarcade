const Screen = require('../screen');
const Format = require('../format');

const CYCLE = true;

const DEFAULT_SCORES = [
    {winner: 'MPAQUE', loser: 'JSMADJA'},
    {winner: 'JSMADJA', loser: 'JSMADJA'},
    {winner: 'DATTALI', loser: 'FDESROUS'},
    {winner: 'PTIRMAN', loser: 'MPAQE'},
    {winner: 'ABEAUCHA', loser: 'PTIRMAN'},
    {winner: 'CNGUYEN', loser: 'PTIRMAN'},
    {winner: 'CNGUYEN', loser: 'FDESROUS'},
    {winner: 'CNGUYEN', loser: 'PTIRMAN'},
    {winner: 'KKERNINO', loser: 'JSMADJA'},
    {winner: 'MTRACCO', loser: 'JSMADJA'},
];

class SceneScoresTwoPlayers extends Phaser.Scene {

    constructor() {
        super({key: 'sceneScoresTwoPlayers'});
        this.scores = localStorage.getItem('2P_scores') || DEFAULT_SCORES;
    }

    preload() {
        this.load.image('bg', 'assets/backgrounds/BG.png');
        this.load.image('score_line', 'assets/elements/SCORE_LINE.png');
    }

    create() {
        this.bg = this.add.image(0, 0, 'bg').setOrigin(0);
        this.bg.setScale(Screen.ZOOM, Screen.ZOOM);
        this.bg.setZ(-1);

        const titleValue = '          SCORE RANKING          ';
        this.title = this.add.text(0, 25, titleValue, {font: `${Screen.FONT_SIZE}px Impact`});
        this.title
            .setBackgroundColor('#ee4239')
            .setFontStyle('italic')
            .setDisplaySize(Screen.WIDTH, Screen.FONT_SIZE);
        this.title.alpha = CYCLE ? 0 : 1;

        const ranking = this.computeRanking();
        this.addScoreLines();
        const scores = this.computeScores(ranking);
        this.addRanks(scores);
        this.addPlayers(scores);
        this.addScores(scores);

        if (CYCLE) {
            this.time.delayedCall(5000, () => {
                this.scene.start('sceneLogo')
            }, [], this);
        }

        this.events.on('transitionstart', this.transitionStart, this);
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

    computeScores(ranking) {
        return _(ranking)
            .orderBy(result => {
                if (result.loses === 0) {
                    return -result.wins;
                }
                return -(result.wins / result.loses);
            })
            .take(5)
            .map((score, i) => {
                const rank = Format.formatRank(i + 1);
                const player = Format.formatPlayer(score.player);
                return {rank, player, score: `${score.wins}-${score.loses}`};
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

    computeRanking() {
        const winners = _.groupBy(this.scores, e => e.winner);
        const losers = _.groupBy(this.scores, e => e.loser);

        const winnerNames = _.keys(winners);

        return _(winnerNames)
            .map(name => ({
                player: name,
                wins: winners[name].length,
                loses: losers[name] ? losers[name].length : 0,
            }))
            .value();
    }

    transitionStart(fromScene, progress) {
        this.title.alpha = progress;
    }
}

module.exports = SceneScoresTwoPlayers;