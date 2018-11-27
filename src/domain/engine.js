const _ = require('lodash');

const notEqualTo = validAnswer =>
    option => option.file !== validAnswer.file;

class Question {
    constructor(v1, w1, w2, w3) {
        this.logoName = v1;
        this.answers = [
            {name: v1, valid: true},
            {name: w1, valid: false},
            {name: w2, valid: false},
            {name: w3, valid: false},
        ]
    }

    isValid(answer) {
        return _.find(this.answers, a => a.name === answer).valid;
    }

    getLogo() {
        return this.logoName;
    }
}


module.exports = {
    Question,
    createQuizFrom: (logos, length = 20) => {
        const questions = [];
        _.shuffle(logos).forEach((validAnswer) => {
            const options = logos.filter(notEqualTo(validAnswer));
            const wrongAnswers = _(options).shuffle().take(3).value();
            questions.push({validAnswer, wrongAnswers});
        });
        return _.take(questions, length);
    },
    createQuizFromV2: (logos, length = 20) =>
        _(logos)
            .shuffle()
            .map(validAnswer => {
                const wrongAnswers = _(logos).filter(notEqualTo(validAnswer)).shuffle().take(3).value();
                return new Question(
                    validAnswer.name, 
                    wrongAnswers[0].name, 
                    wrongAnswers[1].name, 
                    wrongAnswers[2].name
                );
            })
            .take(length)
            .value()

};