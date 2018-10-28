const _ = require('lodash');

const formatRank = rank => {
    switch (rank) {
        case 1:
            return _.padStart(`${rank}st`, 4);
        case 2:
            return _.padStart(`${rank}nd`, 4);
        case 3:
            return _.padStart(`${rank}rd`, 4);
        default:
            return _.padStart(`${rank}th`, 4);
    }
};

const formatTime = time => `${parseInt(time / 1000)}"${_.padStart((time - (parseInt(time / 1000) * 1000)) / 10, 2, '0') }`;

const formatPlayer = player => _.padEnd(player, 8);

module.exports = {formatRank, formatTime, formatPlayer};