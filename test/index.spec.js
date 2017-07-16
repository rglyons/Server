// Require the dev-dependencies
const chai = require('chai')
const chaiHttp = require('chai-http')
const chaiSubset = require('chai-subset')
const server = require('../app')
const expect = chai.expect
chai.use(chaiHttp)
chai.use(chaiSubset)

/* eslint no-undef:0 */
describe('Test on server/routes/index.js', () => {
  before(() => {
      // runs before all tests in this block
  })
  after(() => {
      // runs after all tests in this block
  })
  beforeEach(() => {
      // runs before each test in this block
  })
  afterEach(() => {
      // runs after each test in this block
  })
  describe('GET api welcome msg', () => {
    it('it should return a welcome message', (done) => {
      chai.request(server)
        .get('/api')
        .end((err, res) => {
          if (err) console.trace(err)
          expect(res).to.have.status(200)
          expect(res.body).to.be.a('object')
          expect(res.body.message).to.be.a('string')
          expect(res.body.message).to.equal('Welcome to the Smart Irrigation API!')
          done()
        })
    })
  })
})
