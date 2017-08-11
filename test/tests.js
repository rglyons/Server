// Calls all test modules in sequence
// to avoid race conditions

describe('test suite', () => {
  before(() => {})
  after(() => {})
  beforeEach(() => {})
  afterEach(() => {})
  it('run tests in user.js', (done) => {
    require('./user.js')
    done()
  })
  it('run tests in node_and_reading.js', (done) => {
    require('./node_and_reading.js')
    done()
  })
  it('run tests in other.js', (done) => {
    require('./other.js')
    done()
  })
  it('run tests in notification.js', (done) => {
    require('./notification.js')
    done()
  })
  it('run tests in depr_user.js', (done) => {
    require('./depr_user.js')
    done()
  })
  it('run tests in depr_node_and_reading.js', (done) => {
    require('./depr_node_and_reading.js')
    done()
  })
  it('run tests in depr_other.js', (done) => {
    require('./depr_other.js')
    done()
  })
});
