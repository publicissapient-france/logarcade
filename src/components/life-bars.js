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


        /*var healthbarPlayerOne = new HealthBar(this, {
            x: 25,
            y: 27,
            width: 270,
            bar: {color: Colors.color_P1, direction: -1}
        });*/



        console.log('game on lifebar', this.game);
        //this.lifebar1.linkWithPlayer(this.game.getPlayers()[0]);
        //this.lifebar2.linkWithPlayer(this.game.getPlayers()[1]);

        console.log('this.lifebar1', this.lifebar1);
        console.log('this.lifebar2', this.lifebar2);

        this.health_P1 = {state: 270 - 4};
        this.power = this.health_P1.state / 3;

        this.health_P2 = {state: 270 - 4};



    }

    updatePlayerBar(onComplete, target = 1) {
        let health_player = (target != 1) ? this.health_P2 : this.health_P1;
        this.tweens.timeline({
            targets: health_player,
            ease: 'Power1',
            duration: 500,
            tweens: [{state: health_player.state - this.power}],
            onComplete,
        });
    }

    updatePlayerBars() {
        const This = this
        // console.log('this.getLifeBars()' , this.getLifeBars());
        _.forEach(this.getLifeBars(), function (lifebar) {
            if(lifebar.getPlayer()){
                lifebar.updateProgress(This.getPowerShot() * lifebar.getPlayer().getCurrentLife())

            }
          //  console.log('lifbar', lifebar);
            //console.log('progress lifbar', lifebar.getConfig().bar.progress);
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