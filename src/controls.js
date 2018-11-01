const controlsPlayer1_Keyboard = {
    A: 'A',
    B: 'Z',
    C: 'E',
    D: 'R',
    START: 'SPACE',
    UP: 'UP',
    DOWN: 'DOWN',
    LEFT: 'LEFT',
    RIGHT: 'RIGHT',
};

const controlsPlayer2_Keyboard = {
    A: 'U',
    B: 'I',
    C: 'O',
    D: 'P',
    START: 'ENTER',
    UP: 'Y',
    DOWN: 'H',
    LEFT: 'G',
    RIGHT: 'D',
};

const controlsPlayer1_Jpac = {
    A: 'CTRL',
    B: 'ALT',
    C: 'SPACE',
    D: 'SHIFT',
    START: 'ONE',
    UP: 'UP',
    DOWN: 'DOWN',
    LEFT: 'LEFT',
    RIGHT: 'RIGHT',
};

const controlsPlayer2_Jpac = {
    A: 'A',
    B: 'S',
    C: 'Q',
    D: 'W',
    START: 'TWO',
    UP: 'R',
    DOWN: 'F',
    LEFT: 'D',
    RIGHT: 'G',
};

const JPAC = false;

const CONTROLS_P1 = JPAC ? controlsPlayer1_Jpac : controlsPlayer1_Keyboard;
const CONTROLS_P2 = JPAC ? controlsPlayer2_Jpac : controlsPlayer2_Keyboard;

module.exports = {CONTROLS_P1, CONTROLS_P2};