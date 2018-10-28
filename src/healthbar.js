var HealthBar = function(game, barConfig){
    this.game = game;

    this.box = this.game.add.graphics();
    this.bar = this.game.add.graphics();


    this.setupConfiguration(barConfig);  //install config
    //this.setPosition(this.config.x, this.config.y); //set bar position
    this.drawBox();  //draw the hidded part of bar , his background
    this.drawHealthBar();   // draw the part of bar which represent health
};



HealthBar.prototype.constructor = HealthBar

HealthBar.prototype.setupConfiguration = function (barConfig){
    //each parameter has a default value
    this.config = this.mergeWithDefaultConfiguration(barConfig);
}
HealthBar.prototype.mergeWithDefaultConfiguration = function(newConfig){
    var defaultConfig  = {
        width : 250,
        height : 35,
        x : 0,
        y : 0,
        box:{
            color : 0x222222,
            borderSize : 2
        },
        bar:{
            color: 0xFF6347,
            progress: 0,
            direction : 1  // direction 1 => bar se rempli de gauche à droite, direction -1 => bar se rempli de droite  à gauche
        },
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


HealthBar.prototype.drawBox = function(){
    this.box.clear();
    this.box.fillStyle(this.config.box.color, 0.8);
    this.box.fillRect(this.config.x, this.config.y, this.config.width, this.config.height);
    this.box.lineStyle(this.config.box.borderSize, 0xFFFFFF, 0.5);
    this.box.strokeRect(this.config.x, this.config.y, this.config.width, this.config.height);


    console.log("we draw box !");
}


HealthBar.prototype.drawHealthBar = function(){
    this.bar.clear();

    if(this.config.bar.direction == 1){
        this.bar.fillStyle(this.config.bar.color, 1);
        this.bar.fillRect(this.config.x + this.config.box.borderSize, this.config.y  + this.config.box.borderSize, this.config.bar.progress, this.config.height - 2*this.config.box.borderSize);
        console.log("we draw bar Left to Right !");
    }else{
        this.bar.fillStyle(this.config.bar.color, 1);
        this.bar.fillRect(this.config.x + this.config.width - this.config.box.borderSize, this.config.y + this.config.box.borderSize, - this.config.bar.progress, this.config.height  - 2*this.config.box.borderSize);
        console.log("we draw bar Right to Left !");
    }
}

HealthBar.prototype.setPosition = function(x,y){
   this.config.x = x;
   this.config.y = y;
   this.drawBox();
   this.drawHealthBar();
}

HealthBar.prototype.setProgress = function(progress){
    this.config.bar.progress = progress;
    this.drawHealthBar();
}



module.exports = { HealthBar };