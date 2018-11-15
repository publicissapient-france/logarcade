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
    RIGHT: 'J',
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

const STICK_SOULCA = {
    reverse_mapping: {
        0: {letter: 'A', index: 0},
        2: {letter: 'B', index: 1},
        3: {letter: 'C', index: 2},
        1: {letter: 'D', index: 3},
    },
    mapping: {
        9: 'START',
    }
};
const STICK_HORI = {
    reverse_mapping: {
        0: {letter: 'A', index: 0},
        3: {letter: 'B', index: 1},
        5: {letter: 'C', index: 2},
        4: {letter: 'D', index: 3},
    },
    mapping: {
        9: 'START',
    }
};
const JOYPADS = [STICK_SOULCA, STICK_HORI];
//const JOYPADS = [STICK_HORI, STICK_HORI];


const JPAC = false;

let CONTROLS_P1 = controlsPlayer1_Keyboard;
let CONTROLS_P2 = controlsPlayer2_Keyboard;

if (JPAC) {
    CONTROLS_P1 = controlsPlayer1_Jpac;
    CONTROLS_P2 = controlsPlayer2_Jpac;
}

module.exports = {CONTROLS_P1, CONTROLS_P2, JOYPADS};