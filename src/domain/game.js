const LOGOS = require('./logos');
const Engine = require('./engine');
const _ = require('lodash');

class Player {
    constructor() {
        this.life = 3;
    }

    hurt() {
        this.life--;
    }

}

class Game {
    constructor(length) {
        this.addQuestions(length);
        this.gameOver = false;
        this.players = [];
    }

    addQuestions(length) {
        this.quiz = Engine.createQuizFromV2(LOGOS, length);
    }

    getQuestions() {
        return this.quiz;
    }

    isOver() {
        return this.gameOver;
    }

    start() {
        this.currentQuestionIndex = 0;
    }

    getCurrentQuestion() {
        return this.quiz[this.currentQuestionIndex];
    }

    nextQuestion() {
        this.currentQuestionIndex++;
        return this.getCurrentQuestion();
    }

    getCurrentLogo() {
        return this.getCurrentQuestion().getLogo();
    }

    addPlayer() {
        this.players.push(new Player());
        return _.last(this.players);
    }

    choice(player, answer) {
        if (this.getCurrentQuestion().isValid(answer)) {
            _.difference(this.players, [player]).forEach(other => other.hurt());
        } else {
            player.hurt();
        }
    }


}

module.exports = Game;