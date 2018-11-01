const Screen = require('../screen');

class Answers {
    constructor(game) {
        Object.assign(this, game);
    }

    create() {
        this.texts = [];
    }

    update(question) {
        let column = 0;
        for (let i = 0; i < 4; i++) {
            if (this.texts[i]) {
                this.texts[i].setText(question.answers[i]);
            } else {
                this.texts[i] = this.make.text({
                    x: 100,
                    y: 117 + (column++ * 90),
                    text: question.answers[i],
                    style: {
                        font: `${Screen.FONT_SIZE}px VT323`,
                        wordWrap: {width: 200, useAdvancedWrap: true}
                    }
                });
            }
        }
    }
}

module.exports = Answers;