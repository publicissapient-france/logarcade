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
        this.save();
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
        console.log('SAVE');
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

class TwoPlayerScores {

    constructor() {
        const DEFAULT_SCORES = [];
        this.scores = TwoPlayerScores.load() || DEFAULT_SCORES;
        this.save();
    }

    save() {
        localStorage.setItem('2P_scores', JSON.stringify(this.scores));
    }

    add(score) {
        this.scores.push(score);
        this.save();
    }

    static load() {
        return JSON.parse(localStorage.getItem('2P_scores'));
    }

    list() {
        const winners = _.groupBy(this.scores, e => e.winner);
        const losers = _.groupBy(this.scores, e => e.loser);
        const winnerNames = _.keys(winners);
        return _(winnerNames)
            .map(name => ({
                player: name,
                wins: winners[name].length,
                loses: losers[name] ? losers[name].length : 0,
            }))
            .orderBy(result => {
                if (result.loses === 0) {
                    return -result.wins;
                }
                return -(result.wins / result.loses);
            })
            .take(5)
            .map((score, i) => {
                const rank = i + 1;
                const player = score.player;
                return {rank, player, score: `${score.wins}-${score.loses}`};
            })
            .value();
    }

}

module.exports = {
    onePlayerScores: () => new OnePlayerScores(),
    twoPlayerScores: () => new TwoPlayerScores(),
};