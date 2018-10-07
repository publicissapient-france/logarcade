const {CONTROLS_P1} = require('../controls');
const Screen = require('../screen');
const LOGOS = require('../logos');
const {INITIAL_REMAINING_TIME} = require('../game');

class SceneGameOnePlayer extends Phaser.Scene {
    constructor() {
        super({key: 'sceneGameOnePlayer'});
    }

    preload() {
        this.add.text(Screen.WIDTH / 2, Screen.HEIGHT / 2, 'sceneGameOnePlayer');
        this.load.audio('theme', [
            'assets/audio/Retrojäbä_-_Retrojäbä_-_sbrp_tutorial_remix.mp3'
        ]);

        LOGOS.forEach(l => this.load.image(l.name, `assets/logos/${l.file}`));

        this.buttons = {};
    }

    create() {
        this.buttons.A = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[CONTROLS_P1.A]);
        this.buttons.B = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[CONTROLS_P1.B]);
        this.buttons.C = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[CONTROLS_P1.C]);
        this.buttons.D = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[CONTROLS_P1.D]);

        var music = this.sound.add('theme');
        music.play();
        this.remainingTime = INITIAL_REMAINING_TIME;
        this.time = this.add.text(400, 50, this.remainingTime);
        this.start = new Date();
        this.logo = this.add.image(400, 300, 'Angular');
        this.text1 = this.add.text(100, 300, 'Angular');
        this.text2 = this.add.text(200, 300, 'VueJS');
        this.text3 = this.add.text(300, 300, 'React');
        this.text4 = this.add.text(400, 300, 'EmberJS');
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.buttons.A)) {
            this.onKeyDown(this.text1);
        }
        if (Phaser.Input.Keyboard.JustDown(this.buttons.B)) {
            this.onKeyDown(this.text2);
        }
        if (Phaser.Input.Keyboard.JustDown(this.buttons.C)) {
            this.onKeyDown(this.text3);
        }
        if (Phaser.Input.Keyboard.JustDown(this.buttons.D)) {
            this.onKeyDown(this.text4);
        }
        const elapsedTime = (new Date().getTime() - this.start.getTime()) / 1000;
        this.remainingTime = Math.round(INITIAL_REMAINING_TIME - elapsedTime);
        this.time.setText(this.remainingTime);
    }

    onKeyDown(text) {
        text.setTint(0xff00ff, 0xffff00, 0x0000ff, 0xff0000);
        text.setFontSize(32);
        setTimeout(() => {
            text.clearTint();
            text.setFontSize(16);
        }, 150);
    }
}

module.exports = SceneGameOnePlayer;