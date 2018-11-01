const assert = require('assert');
const Engine = require('../src/domain/engine');
const logos = require('../src/domain/logos');

describe('Engine', () => {
    it('should create quiz of 20 logos', () => {
        const quiz = Engine.createQuizFrom(logos);
        assert.equal(quiz.length, 20);
    });
});