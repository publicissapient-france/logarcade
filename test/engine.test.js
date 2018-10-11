const assert = require('assert');
const Engine = require('../src/engine');
const logos = require('../src/logos');

describe('Engine', () => {
    it('should create quiz of 20 logos', () => {
        const quiz = Engine.createQuizFrom(logos);
        assert.equal(quiz.length, 20);
    });
});