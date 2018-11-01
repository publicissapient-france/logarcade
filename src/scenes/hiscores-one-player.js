const _ = require('lodash');
const Format = require('../format');
const Ranking = require('../ranking');
const StartGameAction = require('../actions/start-game');
const Background = require('../components/background');
const TitleBanner = require('../components/title-banner');
const ScoreLines = require('../components/score-lines');

const CYCLE = true;

class SceneScoresOnePlayer extends Phaser.Scene {

    constructor() {
        super({key: 'sceneScoresOnePlayer'});
    }

    init() {
        this.actions = {
            startGame: new StartGameAction(this),
        };
        this.components ={
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
        this.components.titleBanner.create('SCORE RANKING 1P');
        this.components.scoreLines.create(this.computeScores());

        if (CYCLE) {
            this.time.delayedCall(5000, () => this.scene.start('sceneScoresTwoPlayers'), [], this);
        }
    }

    update() {
        this.actions.startGame.update();
    }

    computeScores() {
        return _.map(Ranking.onePlayerScores().list(), score => ({
            rank: Format.formatRank(score.rank),
            player: score.player,
            score: Format.formatTime(score.score)
        }));
    }

}

module.exports = SceneScoresOnePlayer;