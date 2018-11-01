const _ = require('lodash');
const Format = require('../format');
const Ranking = require('../ranking');
const StartGameAction = require('../actions/start-game');
const Background = require('../components/background');
const TitleBanner = require('../components/title-banner');
const ScoreLines = require('../components/score-lines');

class SceneScoresTwoPlayers extends Phaser.Scene {

    constructor() {
        super({key: 'sceneScoresTwoPlayers'});
    }

    init() {
        this.actions = {
            startGame: new StartGameAction(this),
        };
        this.components = {
            background: new Background(this),
            titleBanner: new TitleBanner(this),
            scoreLines: new ScoreLines(this),
        };
    }

    preload() {
        this.components.background.preload();
        this.components.scoreLines.preload();
    }

    create() {
        this.actions.startGame.create();

        this.components.background.create();
        this.components.titleBanner.create('      SCORE RANKING 2P      ');
        this.components.scoreLines.create(this.computeScores());

        this.time.delayedCall(5000, () => this.scene.start('sceneLogo'), [], this);
    }

    update() {
        this.actions.startGame.update();
    }

    computeScores() {
        return _.map(Ranking.twoPlayerScores().list(), score => ({
            rank: Format.formatRank(score.rank),
            player: score.player,
            score: score.score,
        }));
    }
}

module.exports = SceneScoresTwoPlayers;