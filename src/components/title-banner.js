const Screen = require('../screen');

class TitleBanner {

    constructor(game) {
        Object.assign(this, game);
    }

    create(titleValue) {
        this.title = this.add.text(0, 25, '         ' + titleValue + '         ', {font: `${Screen.FONT_SIZE}px Impact`});
        this.title
            .setBackgroundColor('#ee4239')
            .setFontStyle('italic')
            .setDisplaySize(Screen.WIDTH, Screen.FONT_SIZE);
    }

}

module.exports = TitleBanner;