const _ = require('lodash');

class OnePlayerScores {

    constructor() {
        const DEFAULT_SCORES = [
            {player: 'MPAQUE', time: 60000},
            {player: 'JSMADJA', time: 60000},
            {player: 'DATTALI', time: 60000},
            {player: 'PTIRMAN', time: 60000},
            {player: 'ABEAUCHA', time: 60000},
        ];
        this.scores = OnePlayerScores.load() || DEFAULT_SCORES;
    }

    isHiScore(score) {
        return _.last(this.list()).score > score;
    }

    list() {
        return _(this.scores)
            .orderBy(score => score.time)
            .take(5)
            .map((score, i) => ({rank: i + 1, player: score.player, score: score.time}))
            .value();
    }

    save() {
        localStorage.setItem('1P_scores', JSON.stringify(this.scores));
    }

    add(score) {
        this.scores.push(score);
        this.save();
    }

    static load() {
        return JSON.parse(localStorage.getItem('1P_scores'));
    }

}

module.exports = {
    onePlayerScores: () => {
        return new OnePlayerScores();
    }
};