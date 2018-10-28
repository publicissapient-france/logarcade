const SceneTitle = require('./scenes/title');
const SceneDemo = require('./scenes/demo');
const SceneScoresOnePlayer = require('./scenes/hiscores-one-player');
const SceneScoresTwoPlayers = require('./scenes/hiscores-two-players');
const SceneGameOnePlayer = require('./scenes/game-one-player');
const SceneGameTwoPlayers = require('./scenes/game-two-player');
const SceneEnterNameOnePlayer = require('./scenes/entername-one-player');

const Screen = require('./screen');

const config = {
    type: Phaser.CANVAS,
    pixelArt: true,
    width: Screen.WIDTH,
    height: Screen.HEIGHT,
    scene: [
        // SceneEnterNameOnePlayer,

        SceneTitle,
        SceneDemo,
        SceneScoresOnePlayer,
        SceneScoresTwoPlayers,
        SceneGameOnePlayer,
        SceneGameTwoPlayers,
    ],
};

new Phaser.Game(config);