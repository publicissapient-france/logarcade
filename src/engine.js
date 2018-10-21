const _ = require('lodash');

const isValidWrongAnswer = validAnswer =>
    option => option.file !== validAnswer.file;

module.exports = {
    createQuizFrom: (logos) => {
        const questions = [];
        _.shuffle(logos).forEach((validAnswer) => {
            const options = logos.filter(isValidWrongAnswer(validAnswer));
            const wrongAnswers = _(options).shuffle().take(3).value();
            questions.push({validAnswer, wrongAnswers});
        });
        let length = 50;
        console.log('le quizz', _.take(questions, length));

        return _.take(questions, length);
    }
};