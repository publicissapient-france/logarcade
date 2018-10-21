const SceneTitle = require('./scenes/title');
const SceneDemo = require('./scenes/demo');
const SceneScoresOnePlayer = require('./scenes/hiscores-one-player');
const SceneScoresTwoPlayers = require('./scenes/hiscores-two-players');
const SceneGameOnePlayer = require('./scenes/game-one-player');
const SceneGameTwoPlayers = require('./scenes/game-two-player');
const SceneTimeOut = require('./scenes/time-out');
const SceneLoadingGame = require('./scenes/loading');

const Screen = require('./screen');

const config = {
    type: Phaser.CANVAS,
    pixelArt: true,
    width: Screen.WIDTH,
    height: Screen.HEIGHT,
    scene: [
        SceneTitle,
        SceneDemo,
        SceneScoresOnePlayer,
        SceneScoresTwoPlayers,
        SceneGameOnePlayer,
        SceneGameTwoPlayers,
        SceneTimeOut,
        SceneLoadingGame
    ],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    }
};

new Phaser.Game(config);

