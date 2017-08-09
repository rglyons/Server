// Calls all test modules in sequence
// to avoid race conditions

describe('user.js', function () {
  require('./user.js')
});

describe('node_and_reading.js', function () {
  require('./node_and_reading.js')
});

describe('other.js', function () {
  require('./other.js')
});

describe('depr_user.js', function () {
  require('./depr_user.js')
});

describe('depr_node_and_reading.js', function () {
  require('./depr_node_and_reading.js')
});

describe('depr_other.js', function () {
  require('./depr_other.js')
});
