const {CONTROLS_P1} = require('../controls');

var startBtn;

class SceneTitle extends Phaser.Scene {

    constructor() {
        super({key: 'sceneTitle'});
    }

    init() {
        var canvas = this.sys.game.canvas;
        var fullscreen = this.sys.game.device.fullscreen;

        if (!fullscreen.available)
        {
            return;
        }

        startBtn = document.createElement('button');

        startBtn.textContent = 'Start Fullscreen';

        canvas.parentNode.appendChild(startBtn);

        startBtn.addEventListener('click', function ()
        {
            if (document.fullscreenElement) { return; }

            canvas[fullscreen.request]();
        });

        this.events.on('shutdown', this.shutdown, this);
    }

    preload() {
        this.load.image('knighthawks', 'assets/fonts/knighthawks-font.png');
    }

    create() {
        this.time.delayedCall(3000, () => {
            this.scene.start('sceneDemo')
        }, [], this);
        this.p1start = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[CONTROLS_P1.START]);

        const config = {
            image: 'knighthawks',
            width: 32,
            height: 25,
            chars: Phaser.GameObjects.RetroFont.TEXT_SET2,
            charsPerRow: 10
        };

        this.cache.bitmapFont.add('knighthawks', Phaser.GameObjects.RetroFont.Parse(this, config));

        this.dynamic = this.add.dynamicBitmapText(0, 190, 'knighthawks', 'LOG ARCADE');
        this.dynamic.setScale(2);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.p1start)) {
            this.scene.start('sceneLoading');
        }
    }

    shutdown ()
    {
        var canvas = this.sys.game.canvas;

        canvas.parentNode.removeChild(startBtn);
    }

}

module.exports = SceneTitle;