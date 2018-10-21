

// --- NE FONCTIONNE PAS AVEC PHASER IO 3 --




//constructor

//@game is the object which represent our beautiful game
//@barConfig est a JSON object which contains  configuration of barHealth
/*

var HealthBar = function(game, barConfig){
    this.game = game;

    this.setupConfiguration(barConfig);  //install config
    this.setPosition(this.config.x, this.config.y); //set bar position
    this.drawBackground();  //draw the hidded part of bar , his background
    this.drawHealthBar();   // draw the part of bar which represent health
};

HealthBar.prototype.constructor = HealthBar;

HealthBar.prototype.setupConfiguration = function (barConfig){
    //each parameter has a default value
    this.config = this.mergeWithDefaultConfiguration(barConfig);
}

HealthBar.prototype.mergeWithDefaultConfiguration = function(newConfig){
    var defaultConfig  = {
        width : 250,
        height : 40,
        x : 0,
        y : 0,
        bg:{
            color : "#651828"
        },
        bar:{
            color: "#FEFF03"
        }

    };

    return mergeObjects(defaultConfig, newConfig);
}

function mergeObjects(targetObj, newObj){
    for(var p in newObj){
        try{
            targetObj[p] = newObj[p].constructor==Object ? mergeObjects(targetObj[p], newObj[p]) : newObj[p];
        }catch(e){
            targetObj[p]  = newObj[p];
        }
    }
    return targetObj;

}


HealthBar.prototype.drawBackground = function(){
    var bmd = this.game.add.bitmapData(this.config.width, this.config.height);
    bmd.ctx.fillStyle = this.config.bg.color;
    bmd.ctx.beginPath();
    bmd.ctx.rect(0,0, this.config.width, this.config.height);
    bmd.ctx.fill();

    this.bgSprite = this.game.add.sprite(this.x, this.y, bmd);
    this.bgSprite.anchor.set(0.5);
}

HealthBar.prototype.drawHealthBar = function(){
    var bmd = this.game.add.bitmapData(this.config.width, this.config.height);
    bmd.ctx.fillStyle = this.config.bar.color;
    bmd.ctx.beginPath();
    bmd.ctx.rect(0,0,this.config.width, this.config.height);
    bmd.ctx.fill();

    this.barSprite = this.game.add.sprite(this.x - this.bgSprite.width/2, this.y, bmd);
    this.barSprite.anchor.y = 0.5;
}

HealthBar.prototype.setPosition = function(x,y){
    this.x = x;
    this.y = y;

    if(this.bgSprite !== undefined && this.barSprite !== undefined){
        this.bgSprite.position.x = x;
        this.bgSprite.position.y = y;

        this.barSprite.position.x = x - this.config.width/2;
        this.barSprite.position.y = y;
    }
}

module.exports = HealthBar;

*/