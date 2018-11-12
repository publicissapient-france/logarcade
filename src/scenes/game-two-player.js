const {CONTROLS_P1, CONTROLS_P2, JOYPADS} = require('../controls');
const LOGOS = require('../domain/logos');
const Engine = require('../domain/engine');
const Game = require('../domain/game');

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

class SceneGameTwoPlayers extends Phaser.Scene {
    constructor() {
        super({key: 'sceneGameTwoPlayers'});
        this.BUTTON_PRESS_STATES = {
            0: {},
            1: {},
        };
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

        this.components.alertTimesUp.preload('TIMES_UP', 'assets/elements/TIMES_UP.png');
        this.components.alertGameOver.preload('GAME_OVER', 'assets/elements/GAME_OVER.png');
        this.components.alertPerfect.preload('PERFECT', 'assets/elements/PERFECT.png');

        this.load.path = 'assets/';
        this.load.audio('theme', ['audio/remix.mp3']);
        this.load.audio('invalid', ['audio/Jingle 011.wav']);
        this.load.audio('valid', ['audio/Notification 2.wav']);

        this.buttons = {
            P1: {},
            P2: {}
        };
    }

    create() {
        // GAME
        this.quiz = Engine.createQuizFrom(LOGOS, Game.TWO_PLAYER_QUIZ_LENGTH);
        this.currentQuestion = -1;
        this.gameOver = false;

        // UI
        this.components.answers.create();
        this.components.background.create();

        this.components.buttons.create();
        this.components.logoWindow.create();
        this.components.lifeBars.create();
        this.components.lifeBars.setPower(270 / (this.quiz.length / 2));

        this.components.timer.create();
        this.components.countdown.create();
        this.components.alertTimesUp.create();
        this.components.alertGameOver.create();
        this.components.alertPerfect.create();

        this.components.logoWindow.hide();

        // INPUTS

        this.buttons.P1.A = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[CONTROLS_P1.A]);
        this.buttons.P1.B = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[CONTROLS_P1.B]);
        this.buttons.P1.C = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[CONTROLS_P1.C]);
        this.buttons.P1.D = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[CONTROLS_P1.D]);

        this.buttons.P2.A = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[CONTROLS_P2.A]);
        this.buttons.P2.B = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[CONTROLS_P2.B]);
        this.buttons.P2.C = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[CONTROLS_P2.C]);
        this.buttons.P2.D = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[CONTROLS_P2.D]);

        // SOUNDS
        this.sound.add('theme').play();
        this.validSound = this.sound.add('valid');
        this.invalidSound = this.sound.add('invalid');

        this.time.delayedCall(3000, () => {
            this.components.logoWindow.show();
            this.components.timer.launch();
            this.nextQuestion();
        }, [], this);

    }

    nextQuestion() {
        if (this.currentQuestion == (this.quiz.length - 1)) {
            this.currentQuestion = 0;
        } else {
            this.currentQuestion++;
        }

        const logoName = this.quiz[this.currentQuestion].validAnswer.name;
        this.components.logoWindow.update(logoName);
        const question = {
            answers: _.orderBy([
                logoName,
                this.quiz[this.currentQuestion].wrongAnswers[0].name,
                this.quiz[this.currentQuestion].wrongAnswers[1].name,
                this.quiz[this.currentQuestion].wrongAnswers[2].name,
            ]),
        };
        this.components.answers.update(question);
    }

    goToEnterName() {
        this.time.delayedCall(1000, () => this.scene.start('sceneEnterNameTwoPlayers', {
            winner: this.whoWin(),
            loser: this.whoLose()
        }), [], this);
    }

    whoWin() {
        return (this.components.lifeBars.watchPlayerLife().health_P1 > this.components.lifeBars.watchPlayerLife().health_P2) ? 1 : 2;
    }

    whoLose() {
        return (this.components.lifeBars.watchPlayerLife().health_P1 < this.components.lifeBars.watchPlayerLife().health_P2) ? 1 : 2;
    }

    endOneDead() {
        this.hideHUD();
        this.gameOver = true;
        this.components.alertGameOver.launch();
        this.time.delayedCall(2000, () => this.scene.start('sceneLogo'), [], this);
        this.goToEnterName();
    }

    endTimeUpGame() {
        this.hideHUD();
        this.gameOver = true;
        this.components.alertTimesUp.launch();
        this.time.delayedCall(2000, () => this.scene.start('sceneLogo'), [], this);
    }

    onEndGame() {
        this.hideHUD();
    }

    update() {
        if (!this.gameOver) {
            if (!this.freezed) {
                this.components.lifeBars.updatePlayer1Progress();
                this.components.lifeBars.updatePlayer2Progress();
                this.updateKeyboard();
                this.updateGamepads();
            }

            this.components.timer.update();
            if (this.components.timer.isTimeUp()) {
                return this.endTimeUpGame();
            }
        }
    }

    updateKeyboard() {
        ['A', 'B', 'C', 'D']
            .forEach((button, i) => {
                if (this.currentQuestion >= 0 && Phaser.Input.Keyboard.JustDown(this.buttons.P1[button])) {
                    const text = this.components.answers.texts[i];
                    const letter = button;
                    this.onPushButton(text, letter, 1);

                } else if (this.currentQuestion >= 0 && Phaser.Input.Keyboard.JustDown(this.buttons.P2[button])) {
                    const text = this.components.answers.texts[i];
                    const letter = button;
                    this.onPushButton(text, letter, 2);
                }
                if (this.buttons.P1[button].isDown || this.buttons.P2[button].isDown) {
                    this.components.buttons.push(button);
                }
            });
    }

    updateGamepads() {
        this.input.gamepad.once('down', (pad, button) => {
            const padIndex = pad.index;
            if (padIndex !== 0 || this.currentQuestion < 0) {
                return;
            }
            const buttonIndex = button.index;
            const pressed = this.BUTTON_PRESS_STATES[padIndex][buttonIndex];
            if (!pressed) {
                const joypad = JOYPADS[padIndex];
                const pressedButton = joypad.reverse_mapping[buttonIndex];
                if (pressedButton) {
                    const text = this.components.answers.texts[pressedButton.index];
                    this.onPushButton(text, pressedButton.letter, 1);
                    this.components.buttons.push(pressedButton.letter);
                }
            }
            this.BUTTON_PRESS_STATES[padIndex][buttonIndex] = true;
        }, this);
        this.input.gamepad.on('up', (pad, button) => this.BUTTON_PRESS_STATES[pad.index][button.index] = false, this);
    }

    onPushButton(text, letter, player) {
        this.freezed = true;
        this.onKeyDown(text, player);
        this.components.buttons.getFeedBack(letter, player === 1 ? Colors.color_P1 : Colors.color_P2);
        setTimeout(() => {
            this.nextQuestion();
            this.freezed = false;
        }, FREEZE_BETWEEN_QUESTION);
    }

    onKeyDown(text, player = 1) {
        const onComplete = () => {
            if ((this.components.lifeBars.watchPlayerLife().health_P1 <= 0) || (this.components.lifeBars.watchPlayerLife().health_P2 <= 0)) {
                this.endOneDead();
            }
        };

        if (this.isAnswerValid(text)) {
            this.components.lifeBars.updatePlayerBarMode2Players(onComplete, player === 1 ? 2 : 1);
            return this.validSound.play();
        }
        this.components.lifeBars.updatePlayerBarMode2Players(onComplete, player);
        this.invalidSound.play();
    }

    isAnswerValid(text) {
        return text._text === this.quiz[this.currentQuestion].validAnswer.name;
    }

    hideHUD() {
        this.components.logoWindow.hide();
        this.components.buttons.hide();
        this.components.answers.hide();
    }
}

module.exports = SceneGameTwoPlayers;


