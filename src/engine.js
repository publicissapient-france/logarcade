const _ = require('lodash');

const isValidWrongAnswer = validAnswer =>
    option => option.file !== validAnswer.file;

module.exports = {
    createQuizFrom: (logos, length = 20) => {
        const questions = [];
        _.shuffle(logos).forEach((validAnswer) => {
            const options = logos.filter(isValidWrongAnswer(validAnswer));
            const wrongAnswers = _(options).shuffle().take(3).value();
            questions.push({validAnswer, wrongAnswers});
        });
        return _.take(questions, length);
    }
};