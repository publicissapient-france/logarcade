const LOGOS = require('./logos');
const Engine = require('./engine');
const _ = require('lodash');

class Player {
    constructor() {
        this.life = 3;
    }

    setLife(n){
      this.life = n;
    }

    hurt() {
        this.life--;
    }

    getCurrentLife(){
        return this.life;
    }

    isDead(){
        return this.getCurrentLife() == 0;
    }

    getId(){ return this.id} ;


}

class Game {
    constructor(length) {
        this.addQuestions(length);
        this.gameOver = false;
        this.players = [];
    }
    start() {
        this.currentQuestionIndex = 0;
    }

    isOver() {
        return this.gameOver;
    }

    choice(player, answer) {
        if (this.getCurrentQuestion().isValid(answer)) {
            _.difference(this.players, [player]).forEach(other => other.hurt());
        } else {
            player.hurt();
        }
    }

    addQuestions(length) {
        this.quiz = Engine.createQuizFromV2(LOGOS, length);
    }

    getQuestions() {
        return this.quiz;
    }

    nextQuestion() {
        this.currentQuestionIndex++;
        return this.getCurrentQuestion();
    }

    getCurrentQuestion() {
        return this.quiz[this.currentQuestionIndex];
    }

    getCurrentLogo() {
        return this.getCurrentQuestion().getLogo();
    }


    addPlayer() {
        this.players.push(new Player());
        _.last(this.players).id = this.players.length;
        return _.last(this.players);
    }

    getPlayers(){
        return this.players
    }

    getPlayersAlive(){
        return _.filter(this.getPlayers() , function(player) {
                return  !player.isDead();
            });
    }
    getPlayerById(id){
        return _.head(_.filter(this.getPlayers(), {id: id}));
    }

    getPodium(){
        return _.sortBy(this.players, 'life').reverse();
    }


}

module.exports = Game;