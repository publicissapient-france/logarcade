const Format = require('../src/domain/format');
const assert = require('assert');

describe('Format', () => {
    it('should format time', () => {
        assert.equal(Format.formatTime(3153), '03"15');
    });
});