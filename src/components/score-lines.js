const Screen = require('../screen');

class ScoreLines {

    constructor(props) {
        this.load = props.load;
        this.add = props.add;
        this.tweens = props.tweens;
    }

    preload() {
        this.load.image('score_line', 'assets/elements/SCORE_LINE.png');
    }

    create(scores) {
        this.addScoreLines();
        this.addRanks(scores);
        this.addPlayers(scores);
        this.addScores(scores);
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

module.exports = ScoreLines;