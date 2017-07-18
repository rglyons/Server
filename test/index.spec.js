/* eslint no-undef:0 */
/* eslint no-unused-expressions:0 */

// Require the dev-dependencies
const User = require('../server/models').User
// const Node = require('../server/models').Node
const chai = require('chai')
const chaiHttp = require('chai-http')
const chaiSubset = require('chai-subset')
const server = require('../app')
const expect = chai.expect
chai.use(chaiHttp)
chai.use(chaiSubset)

describe('Test on server/routes/index.js', () => {
  before(() => {})
  after(() => {})
  beforeEach(() => {})
  afterEach(() => {})

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

/*
* /api/users/login
*/
describe('POST to /api/users/login - Test user login', () => {
  before(() => { // create a new user
    User.create({
      username: 'mocha_test_login',
      password: 'mocha_test_login',
      nodeCount: 0
    })
  })
  after(() => { // delete the test user
    User.destroy({ where: {
      username: 'mocha_test_login',
      password: 'mocha_test_login'
    }})
  })
  beforeEach(() => {})
  afterEach(() => {})

  it('with correct credential: it should return the user', (done) => {
    const credentials = {
      username: 'mocha_test_login',
      password: 'mocha_test_login'
    }
    chai.request(server)
        .post('/api/users/login')
        .send(credentials)
        .end((err, res) => {
          if (err) console.trace(err)
          expect(res).to.have.status(200)
          expect(res.body).to.be.a('object')
          expect(res.body).to.have.all.keys(['id', 'username', 'password', 'nodeCount', 'api_token', 'createdAt', 'updatedAt', 'nodes'])

          // Type Check
          expect(res.body.id).to.be.a('number')
          expect(res.body.username).to.be.a('string')
          expect(res.body.password).to.be.null
          expect(res.body.nodeCount).to.be.a('number')
          expect(res.body.api_token).to.be.a('string')
          expect(res.body.createdAt).to.be.a('string')
          expect(res.body.updatedAt).to.be.a('string')
          expect(res.body.nodes).to.be.a('array')

          // Value check
          expect(res.body.nodeCount).to.equal(0, 'new user nodeCount != 0')
          expect(res.body.nodes.length).to.equal(0)

          done()
        })
  })
  it('with none-nonexistent credential: it should return a message about invalid credentials', (done) => {
    const credentials = {
      username: 'mocha_test_login',
      password: 'mocha_test_login_wrong_password'
    }
    chai.request(server)
        .post('/api/users/login')
        .send(credentials)
        .end((err, res) => {
//           if (err) console.trace(err)
          expect(res).to.have.status(404)
          expect(res.body).to.be.a('object')
          // message
          expect(res.body).to.have.property('message')
          expect(res.body.message).to.be.a('string')
          expect(res.body.message).to.equal('Invalid login credentials provided')
          done()
        })
  })
  it('with no password: it should return a message about invalid credentials', (done) => {
    const credentials = { username: 'mocha_test_login' }
    chai.request(server)
        .post('/api/users/login')
        .send(credentials)
        .end((err, res) => {
//           if (err) console.trace(err)
          expect(res).to.have.status(404)
          expect(res.body).to.be.a('object')
          // message
          expect(res.body).to.have.property('message')
          expect(res.body.message).to.be.a('string')
          expect(res.body.message).to.equal('Invalid login credentials provided')
          done()
        })
  })
  it('with no username: it should return a message about invalid credentials', (done) => {
    let credentials = { password: 'mocha_test_login' }
    chai.request(server)
        .post('/api/users/login')
        .send(credentials)
        .end((err, res) => {
//           if (err) console.trace(err)
          expect(res).to.have.status(404)
          expect(res.body).to.be.a('object')
          // message
          expect(res.body).to.have.property('message')
          expect(res.body.message).to.be.a('string')
          expect(res.body.message).to.equal('Invalid login credentials provided')
          done()
        })
  })
  it('with nothing: it should return a message about invalid credentials', (done) => {
    let credentials = {}
    chai.request(server)
        .post('/api/users/login')
        .send(credentials)
        .end((err, res) => {
//           if (err) console.trace(err)
          expect(res).to.have.status(404)
          expect(res.body).to.be.a('object')
          // message
          expect(res.body).to.have.property('message')
          expect(res.body.message).to.be.a('string')
          expect(res.body.message).to.equal('Invalid login credentials provided')
          done()
        })
  })
  /* describe('POST correct user credentials to login after creating node under user', () => {
    it('it should validate credentials and return the user with non-empty nodes list', (done) => {
      let credentials = {
        username: 'mocha_test_login',
        password: 'mocha_test_login'
      }
      // create a node under the test case user
      User
        .findOne({ where:
          {
            username: 'mocha_test_login',
            password: 'mocha_test_login'
          }
        })
      .then(user => {
        Node
        .create({
          ipaddress: '1.1.1.1',
          userId: user.id
        })
      })
      .then(node => {
        // check is done before the node hook runs to increment nodeCount. How do we make sure the hook runs first?
        chai.request(server)
          .post('/api/users/login')
          .send(credentials)
          .end((err, res) => {
            if (err) console.trace(err);
            res.should.have.status(200);
            res.body.should.be.a('object');
            // id
            res.body.should.have.property('id');
            res.body.id.should.be.a('number');
            // username
            res.body.should.have.property('username');
            res.body.username.should.be.a('string');
            // password
            res.body.should.have.property('password');
            expect(res.body.password).to.be.null;
            // nodeCount
            res.body.should.have.property('nodeCount');
            res.body.nodeCount.should.be.a('number');
            res.body.nodeCount.should.equal(1);
            // api_token
            res.body.should.have.property('api_token');
            res.body.api_token.should.be.a('string');
            // createdAt
            res.body.should.have.property('createdAt');
            res.body.createdAt.should.be.a('string');
            // updatedAt
            res.body.should.have.property('updatedAt');
            res.body.updatedAt.should.be.a('string');
            // nodes
            res.body.should.have.property('nodes')
            res.body.nodes.should.be.a('array');
            res.body.nodes.length.should.equal(1);

            done();
          })
        })
    })
  }) */
})

/*
* /api/users
*/
describe('POST to /api/users - Test creation of new user', () => {
  before(() => {})
  after(() => {})
  beforeEach(() => {
    // clear the Users table
    /* User.sync({ force : true }) // drops table and re-creates it
      .then(function() {
        console.log('Users table dropped and recreated')
        done(null);
      })
      .catch(function(error) {
        done(error);
      }); */
  })
  afterEach(() => {})
  it('with required data: it should create the user and return it in the response', (done) => {
    const user = {
      username: 'test1',
      password: 'test1'
    }
    chai.request(server)
        .post('/api/users')
        .send(user)
        .end((err, res) => {
          if (err) console.trace(err)
          expect(res).to.have.status(201)
          expect(res.body).to.be.a('object')

          expect(res.body).to.have.all.keys(['id', 'username', 'password', 'nodeCount', 'api_token', 'createdAt', 'updatedAt'])

          // Type Check
          expect(res.body.id).to.be.a('number')
          expect(res.body.username).to.be.a('string')
          expect(res.body.password).to.be.null
          expect(res.body.nodeCount).to.be.a('number')
          expect(res.body.createdAt).to.be.a('string')
          expect(res.body.updatedAt).to.be.a('string')

          // Value Check
          expect(res.body.nodeCount).to.equal(0, 'new user nodeCount != 0')
          User.destroy({ where: {
            api_token: res.body.api_token
          } })
          done()
        })
  })
  it('with no passwd: it should generate an error message and respond with 400', (done) => {
    const user = {username: 'test1'}
    chai.request(server)
        .post('/api/users')
        .send(user)
        .end((err, res) => {
          expect(err).to.not.be.null
          expect(res).to.have.status(400)
          expect(res.body).to.be.a('object')

          expect(res.body).to.have.all.keys(['name', 'message', 'errors'])

          // Type Check
          expect(res.body.name).to.be.a('string')
          expect(res.body.message).to.be.a('string')
          expect(res.body.errors).to.be.a('array')

          // Value Check
          expect(res.body.name).to.equal('SequelizeValidationError')
          expect(res.body.message).to.equal('notNull Violation: password cannot be null')
          expect(res.body.errors.length).to.equal(1)
          done()
        })
  })
  it('with no username: it should generate an error message and respond with 400', (done) => {
    let user = {
      password: 'test1'
    }
    chai.request(server)
        .post('/api/users')
        .send(user)
        .end((err, res) => {
          expect(err).to.not.be.null
          expect(res).to.have.status(400)
          expect(res.body).to.be.a('object')

          expect(res.body).to.have.all.keys(['name', 'message', 'errors'])

          // Type Check
          expect(res.body.name).to.be.a('string')
          expect(res.body.message).to.be.a('string')
          expect(res.body.errors).to.be.a('array')

          // Value Check
          expect(res.body.name).to.equal('SequelizeValidationError')
          expect(res.body.message).to.equal('notNull Violation: username cannot be null')

          done()
        })
  })
  it('with no username nor passwd: it should generate an error message and respond with 400', (done) => {
    let user = {}
    chai.request(server)
        .post('/api/users')
        .send(user)
        .end((err, res) => {
          expect(err).to.not.be.null
          expect(res).to.have.status(400)
          expect(res.body).to.be.a('object')

          expect(res.body).to.have.all.keys(['name', 'message', 'errors'])

            // Type Check
          expect(res.body.name).to.be.a('string')
          expect(res.body.message).to.be.a('string')
          expect(res.body.errors).to.be.a('array')

            // Value Check
          expect(res.body.name).to.equal('SequelizeValidationError')
          expect(res.body.message).to.equal('notNull Violation: username cannot be null,\nnotNull Violation: password cannot be null')

          done()
        })
  })
})
