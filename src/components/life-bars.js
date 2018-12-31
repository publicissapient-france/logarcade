const Screen = require('./screen');
const Colors = require('./colors');
const HealthBar = require('./healthbar');

class LifeBars {
    constructor(game) {
        Object.assign(this, game);
    }

    create() {
        this.lifebars = [
            new HealthBar(this, {
                x: 25,
                y: 27,
                width: 270,
                bar: {color: Colors.color_P1, direction: -1, progress: 270}
            }),
            this.lifebar2 = new HealthBar(this, {
                x: Screen.WIDTH - 295,
                y: 27,
                width: 270,
                bar: {color: Colors.color_P2, direction: 1, progress:  0 }
            })
        ]
    }

    updatePlayerBars() {
        const This = this
        _.forEach(this.getLifeBars(), function (lifebar) {
            if(lifebar.getPlayer()){
                lifebar.updateProgress(This.getPowerShot() * lifebar.getPlayer().getCurrentLife())

            }
        });
    }

    setPowerShot(power){
        this.powerShot = power;
    }
    getPowerShot(){
        return this.powerShot;
    }

    getWidthDefault(){
        return _.head(this.lifebars).getConfig().width;
    }
    getBorderDefault(){
        return _.head(this.lifebars).getConfig().box.borderSize * 2;
    }

    getLifeBars() {
       return this.lifebars;
    }

}

module.exports = LifeBars;