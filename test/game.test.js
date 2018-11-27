const assert = require('chai').assert;
const Game = require('../src/domain/game');
const { Question } = require('../src/domain/engine');

describe('Game', () => {

    it('should create a game with a quiz of 10 questions length', () => {
        const game = new Game(10);

        const questions = game.getQuestions();
        assert.equal(questions.length, 10);
    });

    it('should have a game over at false', () => {
        const game = new Game(10);
        assert.equal(game.isOver() , false);
    });

    it('should start a game', () => {
        const game = new Game(10);

        game.start();

        const question = game.getCurrentQuestion();

        assert.ok(question.logoName.length > 0);
        assert.equal(question.answers.filter(q => q.valid).length, 1);
        assert.equal(question.answers.filter(q => !q.valid).length, 3);
    });

    it('should have one valid answer', () => {
        const game = new Game(10);
        game.start();
        const question = game.getCurrentQuestion();
        const answer = question.answers.filter(q => q.valid)[0].name;
        assert.ok(question.isValid(answer));
    });

    it('should go to the next question', () => {
        const game = new Game(2);
        game.start();

        let A = new Question('one', 'two', 'three', 'four');
        let B = new Question('five', 'six', 'seven', 'eight');

        game.quiz[0] = A;
        game.quiz[1] = B;

        assert.equal(game.getCurrentQuestion(), A);
        assert.equal(game.nextQuestion(), B);
    });

    it('should get the current question Logo', () => {
        const game = new Game(1);
        game.start();

        game.quiz[0] = new Question('one', 'two', 'three', 'four');

        assert.equal(game.getCurrentLogo(), 'one');
    });

    it('should not remove one life if player one choose right answer', () => {
        const game = new Game(3);
        game.start();

        game.quiz = [
            new Question('one', 'two', 'three', 'four'),
            new Question('A', 'B', 'C', 'D'),
            new Question('Paris', 'Londres', 'Rio', 'Berlin'),
        ];

        const player1 = game.addPlayer();
        game.choice(player1, 'one');

        assert.equal(player1.life, 3);
    });

    it('should remove one life if player one choose wrong answer', () => {
        const game = new Game(3);
        game.start();

        game.quiz = [
            new Question('one', 'two', 'three', 'four'),
            new Question('A', 'B', 'C', 'D'),
            new Question('Paris', 'Londres', 'Rio', 'Berlin'),
        ];

        const player1 = game.addPlayer();
        game.choice(player1, 'two');

        assert.equal(player1.life, 2);
    });

    it('should remove one life of player Two if player one choose right answer', () => {
        const game = new Game(3);
        game.start();

        game.quiz = [
            new Question('one', 'two', 'three', 'four'),
            new Question('A', 'B', 'C', 'D'),
            new Question('Paris', 'Londres', 'Rio', 'Berlin'),
        ];

        const player1 = game.addPlayer();
        const player2 = game.addPlayer();

        game.choice(player1, "one");
        assert.equal(player2.life, 2);

    });


});