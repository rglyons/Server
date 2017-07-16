// Require the dev-dependencies
const User = require('../server/models').User
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
* /api/users
*/
describe('Test creation of new user - POST to /api/users', () => {
  let newUser = null
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
          newUser = res.body
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

