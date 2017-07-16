// Require the dev-dependencies
const User = require('../server/models').User
const Node = require('../server/models').Node
const chai = require('chai')
const chaiHttp = require('chai-http')
const chaiSubset = require('chai-subset')
const server = require('../app')
const expect = chai.expect
const should = chai.should()
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

/*
* /api/users/login
*/
describe('Test user login - POST to /api/users/login', () => {
  before(() => {
    // runs before all tests in this block
    // create a new user
    User
      .create({
        username: 'mocha_test_login',
        password: 'mocha_test_login',
        nodeCount: 0,
      })
  })
  after(() => {
    // runs after all tests in this block
    // delete the test user
    User
      .destroy({ where: 
        { 
          username: 'mocha_test_login',
          password: 'mocha_test_login'
        }
      })
  })
  beforeEach(() => {
    // runs before each test in this block
  })
  afterEach(() => {
    // runs after each test in this block
  })
  describe('POST correct user credentials to login', () => {
    it('it should validate credentials and return the user', (done) => {
      let credentials = {
        username: 'mocha_test_login',
        password: 'mocha_test_login'
      }
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
          res.body.nodeCount.should.equal(0, 'new user nodeCount != 0');
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
          res.body.nodes.length.should.equal(0);
          
          done();
        })
    })
  })
  describe('POST nonexistent user credentials to login', () => {
    it('it should return a message about invalid credentials', (done) => {
      let credentials = {
        username: 'mocha_test_login',
        password: 'mocha_test_login_wrong_password'
      }
      chai.request(server)
        .post('/api/users/login')
        .send(credentials)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a('object');
          // message
          res.body.should.have.property('message');
          res.body.message.should.be.a('string');
          res.body.message.should.equal('Invalid login credentials provided')
          done();
        })
    })
  })
  describe('POST user credentials to login without password', () => {
    it('it should return a message about invalid credentials', (done) => {
      let credentials = {
        username: 'mocha_test_login'
      }
      chai.request(server)
        .post('/api/users/login')
        .send(credentials)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a('object');
          // message
          res.body.should.have.property('message');
          res.body.message.should.be.a('string');
          res.body.message.should.equal('Invalid login credentials provided')
          done();
        })
    })
  })
  describe('POST user credentials to login without username', () => {
    it('it should return a message about invalid credentials', (done) => {
      let credentials = {
        password: 'mocha_test_login'
      }
      chai.request(server)
        .post('/api/users/login')
        .send(credentials)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a('object');
          // message
          res.body.should.have.property('message');
          res.body.message.should.be.a('string');
          res.body.message.should.equal('Invalid login credentials provided')
          done();
        })
    })
  })
  describe('POST user credentials to login without username or password', () => {
    it('it should return a message about invalid credentials', (done) => {
      let credentials = {
      }
      chai.request(server)
        .post('/api/users/login')
        .send(credentials)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a('object');
          // message
          res.body.should.have.property('message');
          res.body.message.should.be.a('string');
          res.body.message.should.equal('Invalid login credentials provided')
          done();
        })
    })
  })
  /*describe('POST correct user credentials to login after creating node under user', () => {
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
  })*/
})

/*
* /api/users
*/
describe('Test creation of new user - POST to /api/users', () => {
  before(() => {
    // runs before all tests in this block
  })
  after(() => {
    // runs after all tests in this block
  })
  beforeEach(() => {
    // runs before each test in this block
    // clear the Users table
    /*User.sync({ force : true }) // drops table and re-creates it
      .then(function() {
        console.log('Users table dropped and recreated')
        done(null);
      })
      .catch(function(error) {
        done(error);
      });*/
  })
  afterEach(() => {
    // runs after each test in this block
  })
  describe('POST new user with all required data', () => {
    it('it should create the user and return it in the response', (done) => {
      let user = {
        username: 'test1',
        password: 'test1'
      }
      chai.request(server)
        .post('/api/users')
        .send(user)
        .end((err, res) => {
          if (err) console.trace(err);
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('api_token');
          res.body.api_token.should.be.a('string');
          res.body.should.have.property('id');
          res.body.id.should.be.a('number');
          res.body.should.have.property('username');
          res.body.username.should.be.a('string');
          res.body.should.have.property('password');
          expect(res.body.password).to.be.null;
          res.body.should.have.property('nodeCount');
          res.body.nodeCount.should.be.a('number');
          res.body.nodeCount.should.equal(0, 'new user nodeCount != 0');
          res.body.should.have.property('updatedAt');
          res.body.updatedAt.should.be.a('string');
          res.body.should.have.property('createdAt');
          res.body.createdAt.should.be.a('string');
          // delete the newly created user
          User
            .destroy({ where: 
              { 
                api_token: res.body.api_token
              }
            })
          done();
        })
    })
  })
  describe('POST new user without password', () => {
    it('it should generate an error message and respond with 400', (done) => {
      let user = {
        username: 'test1'
      }
      chai.request(server)
        .post('/api/users')
        .send(user)
        .end((err, res) => {
          expect(err).to.not.be.null;
          res.should.have.status(400);
          res.body.should.be.a('object');
          // name 
          res.body.should.have.property('name');
          res.body.name.should.be.a('string');
          res.body.name.should.equal('SequelizeValidationError');
          // message
          res.body.should.have.property('message');
          res.body.message.should.be.a('string');
          res.body.message.should.equal('notNull Violation: password cannot be null');
          // errors
          res.body.should.have.property('errors');
          res.body.errors.should.be.a('array');
          res.body.errors.length.should.equal(1);
          done();
        })
    })
  })
  describe('POST new user without username', () => {
    it('it should generate an error message and respond with 400', (done) => {
      let user = {
        password: 'test1'
      }
      chai.request(server)
        .post('/api/users')
        .send(user)
        .end((err, res) => {
          expect(err).to.not.be.null;
          res.should.have.status(400);
          res.body.should.be.a('object');
          // name 
          res.body.should.have.property('name');
          res.body.name.should.be.a('string');
          res.body.name.should.equal('SequelizeValidationError');
          // message
          res.body.should.have.property('message');
          res.body.message.should.be.a('string');
          res.body.message.should.equal('notNull Violation: username cannot be null');
          // errors
          res.body.should.have.property('errors');
          res.body.errors.should.be.a('array');
          res.body.errors.length.should.equal(1);
          done();
        })
    })
  })
  describe('POST new user without username or password', () => {
    it('it should generate an error message and respond with 400', (done) => {
      let user = {
      }
      chai.request(server)
        .post('/api/users')
        .send(user)
        .end((err, res) => {
          expect(err).to.not.be.null;
          res.should.have.status(400);
          res.body.should.be.a('object');
          // name 
          res.body.should.have.property('name');
          res.body.name.should.be.a('string');
          res.body.name.should.equal('SequelizeValidationError');
          // message
          res.body.should.have.property('message');
          res.body.message.should.be.a('string');
          res.body.message.should.equal('notNull Violation: username cannot be null,\nnotNull Violation: password cannot be null');
          // errors
          res.body.should.have.property('errors');
          res.body.errors.should.be.a('array');
          res.body.errors.length.should.equal(2);
          done();
        })
    })
  })
})

