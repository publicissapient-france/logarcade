class HealthBar {
    constructor(game, barConfig) {
        this.game = game;

        this.box = this.game.add.graphics();
        this.bar = this.game.add.graphics();

        this.setupConfiguration(barConfig);  //install config
        this.drawBox();  //draw the hidded part of bar , his background
        this.drawHealthBar();   // draw the part of bar which represent health
    }

    setupConfiguration(barConfig) {
        //each parameter has a default value
        this.config = HealthBar.mergeWithDefaultConfiguration(barConfig);
    }

    static mergeWithDefaultConfiguration(newConfig) {
        const defaultConfig = {
            width: 300,
            height: 35,
            x: 0,
            y: 0,
            box: {
                color: 0x222222,
                borderSize: 2
            },
            bar: {
                color: 0xFF6347,
                progress: 0,
                direction: 1  // direction 1 => bar se rempli de gauche à droite, direction -1 => bar se rempli de droite  à gauche
            },
        };
        return Object.assign(defaultConfig, newConfig);
    }

    drawBox() {
        this.box.clear();
        this.box.fillStyle(this.config.box.color, 0.8);
        this.box.fillRoundedRect(this.config.x, this.config.y, this.config.width, this.config.height, 6);
        this.box.lineStyle(this.config.box.borderSize, 0xFFFFFF, 0.5);
        this.box.strokeRoundedRect(this.config.x, this.config.y, this.config.width, this.config.height, 6);
    }

    drawHealthBar() {
        this.bar.clear();
        if (this.config.bar.direction === 1) {
            this.bar.fillStyle(this.config.bar.color, 1);
            this.bar.fillRect(this.config.x + this.config.box.borderSize, this.config.y + this.config.box.borderSize, this.config.bar.progress, this.config.height - 2 * this.config.box.borderSize);
        } else {
            this.bar.fillStyle(this.config.bar.color, 1);
            this.bar.fillRect(this.config.x + this.config.width - this.config.box.borderSize, this.config.y + this.config.box.borderSize, -this.config.bar.progress, this.config.height - 2 * this.config.box.borderSize);
        }
    }

    setPosition(x, y) {
        this.getConfig().x = x;
        this.getConfig().y = y;
        this.drawBox();
        this.drawHealthBar();
    }

    linkWithPlayer(player){
        if(player){ this.config.player = player; }
    }

    getConfig(){
        return this.config;
    }

    getPlayer(){
        if(this.getConfig().player){ return this.config.player; }
    }

    updateProgress(p){
        this.drawHealthBar();
        this.game.tweens.timeline({
            targets:  this.config.bar,
            ease: 'Power1',
            duration: 500,
            tweens: [{progress: p}],
        });
    }

}

module.exports = HealthBar;

