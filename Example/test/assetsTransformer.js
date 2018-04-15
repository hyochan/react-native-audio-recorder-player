/**
 * Prevent error from requiring asset during test.
 * https://github.com/facebook/jest/issues/2663
 */
const path = require('path');

module.exports = {
  process(src, filename, config, options) {
    return 'module.exports = ' + JSON.stringify(path.basename(filename)) + ';';
  },
};
