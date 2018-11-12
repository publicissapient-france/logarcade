const SceneLogo = require('./scenes/logo');
const SceneTitle = require('./scenes/title');
const SceneDemo = require('./scenes/demo');
const SceneScoresOnePlayer = require('./scenes/hiscores-one-player');
const SceneScoresTwoPlayers = require('./scenes/hiscores-two-players');
const SceneGameOnePlayer = require('./scenes/game-one-player');
const SceneGameTwoPlayers = require('./scenes/game-two-player');
const SceneEnterNameOnePlayer = require('./scenes/entername-one-player');
const SceneEnterNameTwoPlayers = require('./scenes/entername-two-players');

const Screen = require('./components/screen');

const config = {
    type: Phaser.AUTO,
    pixelArt: true,
    width: Screen.WIDTH,
    height: Screen.HEIGHT,
    input: {
        gamepad: true
    },
    scene: [
        SceneLogo,
        SceneTitle,
        SceneDemo,

        SceneScoresOnePlayer,
        SceneScoresTwoPlayers,

        SceneGameOnePlayer,
        SceneGameTwoPlayers,

        SceneEnterNameOnePlayer,
        SceneEnterNameTwoPlayers,
    ],
};

new Phaser.Game(config);