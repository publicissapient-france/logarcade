const {CONTROLS_P1, CONTROLS_P2, JOYPADS} = require('../controls');
const LOGOS = require('../domain/logos');
const Engine = require('../domain/engine');
const GameConfig = require('../domain/game.config');

const Game = require('../domain/game');
const _ = require('lodash');
const Ranking = require('../domain/ranking');
const Background = require('../components/background');
const Buttons = require('../components/buttons');
const Answers = require('../components/answers');
const Alert = require('../components/alert');
const LogoWindow = require('../components/logo_window');
const Timer = require('../components/timer');
const LifeBars = require('../components/life-bars');
const Colors = require('../components/colors');
const CountDown = require('../components/countdown');

const FREEZE_BETWEEN_QUESTION = 500;


class SceneGameOnePlayer extends Phaser.Scene {
    constructor() {
        super({key: 'sceneGameOnePlayer'});
        this.BUTTON_PRESS_STATES = {
            0: {},
            1: {},
        }
    }

    init() {
        this.components = {
            background: new Background(this),
            buttons: new Buttons(this),
            answers: new Answers(this),
            alertTimesUp: new Alert(this),
            alertGameOver: new Alert(this),
            alertPerfect: new Alert(this),
            alertNewChallenger: new Alert(this),
            logoWindow: new LogoWindow(this),
            timer: new Timer(this),
            lifeBars: new LifeBars(this),
            countdown: new CountDown(this),
        };
    }

    preload() {
        this.components.background.preload();
        this.components.buttons.preload();
        this.components.logoWindow.preload(LOGOS);
        this.components.timer.preload();
        this.components.countdown.preload();
        this.components.alertTimesUp.preload('TIMES_UP', 'assets/elements/TIMES_UP.png');
        this.components.alertGameOver.preload('GAME_OVER', 'assets/elements/GAME_OVER.png');
        this.components.alertPerfect.preload('PERFECT', 'assets/elements/PERFECT.png');
        this.components.alertNewChallenger.preload('NEW_CHALLENGER', 'assets/elements/NEW_CHALLENGER.png');
        this.components.countdown.preload();

        this.load.path = 'assets/';

        this.load.audio('theme', 'audio/background-game-3.mp3'); // 1 or 3 sounds good
        this.load.audio('game-over', 'audio/perc-record-stop.mp3');
        this.load.audio('timesup', 'audio/timesup.mp3');
        this.load.audio('invalid', 'audio/wrong.mp3');
        this.load.audio('valid', 'audio/right.mp3');

        this.load.audio('sound_game_over', ['audio/theme_streetfighter/GAME_OVER.wav']);
        this.load.audio('sound_perfect', ['audio/theme_streetfighter/PERFECT.wav']);
        this.load.audio('sound_fight', ['audio/theme_streetfighter/FIGHT.wav']);
        this.load.audio('sound_new_challenger', ['audio/theme_streetfighter/NEW_CHALLENGER.wav']);

        this.buttons = {};
    }

    create() {
        const eventEmitter = this.sys.events;
        eventEmitter.on('countDownFinish', this.onCountDownFinish, this);

        this.game = new Game(GameConfig.ONE_PLAYER_QUIZ_LENGTH);
        this.game.addPlayer();

        // UI
        this.components.answers.create();
        this.components.background.create();

        this.components.buttons.create();
        this.components.logoWindow.create();

        this.components.lifeBars.create();
        this.components.lifeBars.setPowerShot(
            (this.components.lifeBars.getWidthDefault() - this.components.lifeBars.getBorderDefault() )  / this.game.getPlayerById(1).getCurrentLife()
        );
        this.components.lifeBars.getLifeBars()[0].linkWithPlayer(this.game.getPlayerById(1));


        this.components.timer.create();
        this.components.countdown.create();
        this.components.alertTimesUp.create();
        this.components.alertGameOver.create();
        this.components.alertPerfect.create();
        this.components.alertNewChallenger.create();

        this.components.logoWindow.hide();

        // INPUTS
        this.buttons.A = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[CONTROLS_P1.A]);
        this.buttons.B = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[CONTROLS_P1.B]);
        this.buttons.C = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[CONTROLS_P1.C]);
        this.buttons.D = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[CONTROLS_P1.D]);
        this.p2start = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[CONTROLS_P2.START]);

        // SOUNDS
        this.theme = this.sound.add('theme');
        this.theme.addMarker({
            name: 'loop',
            config: {
                loop: true
            }
        });
        this.validSound = this.sound.add('valid');
        this.invalidSound = this.sound.add('invalid');
        this.gameOverSound = this.sound.add('game-over');
        this.timesupSound = this.sound.add('timesup');
        this.gameOverSound = this.sound.add('sound_game_over');
        this.perfectSound = this.sound.add('sound_perfect');
        this.fightSound = this.sound.add('sound_fight');
        this.newChallengerSound = this.sound.add('sound_new_challenger');

        this.time.delayedCall(3000, () => {
            this.fightSound.play();
            this.components.logoWindow.show();
            this.components.timer.launch();
            this.game.start();
            this.showCurrentQuestionOnView();
        }, [], this);

    }

    onCountDownFinish() {
        this.theme.play('loop');
    }

    showCurrentQuestionOnView(){
        if(!this.game.getCurrentQuestion()){
            return  this.endPerfectGame();
        }

        const logoName = this.game.getCurrentLogo();
        this.components.logoWindow.update(logoName);

        const question = {
            answers: _.orderBy([
                logoName,
                this.game.getCurrentQuestion().answers[1].name,
                this.game.getCurrentQuestion().answers[2].name,
                this.game.getCurrentQuestion().answers[3].name,
            ]),
        };
        this.components.answers.update(question);
    }

    goToLogo() {
        this.time.delayedCall(2000, () => this.scene.start('sceneLogo'), [], this);
    }

    goToEnterName(elapsedTime) {
        this.time.delayedCall(1000, () => this.scene.start('sceneEnterNameOnePlayer', {score: elapsedTime}), [], this);
    }


    endPerfectGame() {
        this.onEndGame();
        this.gameOver = true;
        this.perfectSound.play();
        this.components.alertPerfect.launch();
        const elapsedTime = this.components.timer.getElapsedTime();
        if (SceneGameOnePlayer.isHiScore(elapsedTime)) {
            return this.goToEnterName(elapsedTime);
        }
        this.goToLogo();
    }

    endNoMoreLife() {
        this.onEndGame();
        this.gameOver = true;
        this.components.alertGameOver.launch();
        this.time.delayedCall(4000, () => this.scene.start('sceneLogo'), [], this);
        this.gameOverSound.play();
    }

    endTimeUpGame() {
        this.timesupSound.play();
        this.onEndGame();
        this.gameOver = true;
        this.components.alertTimesUp.launch();
        this.time.delayedCall(3000, () => this.scene.start('sceneLogo'), [], this);
    }

    onEndGame() {
        this.hideHUD();
        this.theme.pause();
    }

    update() {

        if (!this.gameOver) {
            if (!this.freezed) {
                this.updateKeyboard();
                this.updateGamepads();
            }
            this.components.timer.update();
            if (this.components.timer.isTimeUp()) {
                return this.endTimeUpGame();
            }

            this.components.lifeBars.updatePlayerBars();

            if (Phaser.Input.Keyboard.JustDown(this.p2start)) {
                this.onNewChallenger();
            }
        }
    }

    onNewChallenger() {
        this.hideHUD();
        this.components.alertNewChallenger.launch();
        this.theme.pause();
        this.newChallengerSound.play();
        this.time.delayedCall(2000, () => this.scene.start('sceneGameTwoPlayers'), [], this);
    }

    updateGamepads() {
        this.input.gamepad.on('down', (pad, button) => {
            const padIndex = pad.index;
            if (this.currentQuestion < 0) {
                return;
            }
            const buttonIndex = button.index;
            const pressed = this.BUTTON_PRESS_STATES[padIndex][buttonIndex];

            if (!pressed) {
                const joypad = JOYPADS[padIndex];
                if (joypad.mapping[buttonIndex] === 'START') {
                    this.onNewChallenger();
                }

                const pressedButton = joypad.reverse_mapping[buttonIndex];
                if (pressedButton) {
                    const text = this.components.answers.texts[pressedButton.index];
                    this.onKeyDown(text, pressedButton.letter, padIndex + 1);
                }
                this.BUTTON_PRESS_STATES[padIndex][buttonIndex] = true;
            }
        }, this);
        this.input.gamepad.on('up', (pad, button) => this.BUTTON_PRESS_STATES[pad.index][button.index] = false, this);
    }

    updateKeyboard() {
        ['A', 'B', 'C', 'D']
            .forEach((button, i) => {
                if ( this.game.getCurrentQuestion() && Phaser.Input.Keyboard.JustDown(this.buttons[button])) {
                    const text = this.components.answers.texts[i];
                    const letter = button;
                    this.onKeyDown(text, letter, 1);
                }
            });
    }



    onKeyDown(text, letter, player) {
        this.freezed = true;

        this.components.buttons.push(letter);
        this.components.buttons.getFeedBack(letter, Colors.color_P1);
        this.game.choice(this.game.getPlayerById(player), text.text);

        setTimeout(() => {
            this.game.nextQuestion();
            this.showCurrentQuestionOnView();
            this.freezed = false;
        }, FREEZE_BETWEEN_QUESTION);

        (this.game.getCurrentQuestion().isValid(text.text)) ? this.validSound.play() : this.invalidSound.play();

          if(this.game.getPlayerById(player).isDead()){
            this.endNoMoreLife();
        }

    }

    static isHiScore(score) {
        return Ranking.onePlayerScores().isHiScore(score);
    }

    hideHUD() {
        this.components.logoWindow.hide();
        this.components.buttons.hide();
        this.components.answers.hide();
    }
}

module.exports = SceneGameOnePlayer;