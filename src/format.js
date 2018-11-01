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

const formatTime = time => {
    const seconds = _.padStart(parseInt(time / 1000), 2, '0');
    const ms = _.padStart((time - (parseInt(time / 1000) * 1000)) / 10, 2, '0').split('.')[0];
    return `${seconds}"${ms}`;
};

module.exports = {formatRank, formatTime};