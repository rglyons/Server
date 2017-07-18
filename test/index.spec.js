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
          expect(res).to.have.status(404)
          expect(res.body).to.be.a('object')
          // message
          expect(res.body).to.have.property('message')
          expect(res.body.message).to.be.a('string')
          expect(res.body.message).to.equal('Invalid login credentials provided')
          done()
        })
  })
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

/*
* /api/users/update
*/
describe('PUT to /api/users/update - Test updating an existing user', () => {
  let theUser = null
  before(() => { // create a new user
    User.create({
      username: 'mocha_test_update',
      password: 'mocha_test_update',
      nodeCount: 0
    });
  })
  after(() => { // delete the test user
    User.destroy({ where: {
      api_token: theUser.api_token
    }})
  })
  beforeEach(() => {
    if (theUser) {
      User.update({
        username: 'mocha_test_update',
        password: 'mocha_test_update'
      }, {
        where: {
          api_token: theUser.api_token
        }
      })
    }
  })
  afterEach(() => {})
  it('with required data: it should update the user and return it in the response', (done) => {
    User.findOne({where:
      {
        username: 'mocha_test_update',
        password: 'mocha_test_update',
      }
    })
    .then (user => { 
      theUser = user
      const newUser = {
        username: 'test1',
        password: 'test1',
        api_token: user.api_token
      }
      chai.request(server)
          .put('/api/users/update')
          .send(newUser)
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
            expect(res.body.createdAt).to.be.a('string')
            expect(res.body.updatedAt).to.be.a('string')
            expect(res.body.nodes).to.be.a('array')
  
            // Value Check
            expect(res.body.nodeCount).to.equal(0, 'new user nodeCount != 0')
            expect(res.body.username).to.equal('test1')
            expect(res.body.nodes.length).to.equal(0)
            
            done()
          })
    })
  })
  it('with no api_token: it should return a message about invalid API token', (done) => {
    const theUser = {
        username: 'test1',
        password: 'test1'
    }
    chai.request(server)
        .put('/api/users/update')
        .send(theUser)
        .end((err, res) => {
          expect(res).to.have.status(404)
          expect(res.body).to.be.a('object')
          // message
          expect(res.body).to.have.property('message')
          expect(res.body.message).to.be.a('string')
          expect(res.body.message).to.equal('Invalid API token provided')
          done()
        })
  })
  it('with no username: it should not update the user\'s username, and return the user in the response', (done) => {
    User.findOne({where:
      {
        username: 'mocha_test_update',
        password: 'mocha_test_update',
      }
    })
    .then (user => { 
      theUser = user
      const newUser = {
        password: 'test1',
        api_token: user.api_token
      }

      chai.request(server)
          .put('/api/users/update')
          .send(newUser)
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
            expect(res.body.createdAt).to.be.a('string')
            expect(res.body.updatedAt).to.be.a('string')
            expect(res.body.nodes).to.be.a('array')
  
            // Value Check
            expect(res.body.nodeCount).to.equal(0, 'new user nodeCount != 0')
            expect(res.body.username).to.equal('mocha_test_update')
            expect(res.body.nodes.length).to.equal(0)
            
            done()
          })
    })
  })
  it('with no password: it should not update the user\'s password, and return the user in the response', (done) => {
    User.findOne({where:
      {
        username: 'mocha_test_update',
        password: 'mocha_test_update',
      }
    })
    .then (user => { 
      theUser = user
      const newUser = {
        username: 'test1',
        api_token: user.api_token
      }
      chai.request(server)
          .put('/api/users/update')
          .send(newUser)
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
            expect(res.body.createdAt).to.be.a('string')
            expect(res.body.updatedAt).to.be.a('string')
            expect(res.body.nodes).to.be.a('array')
  
            // Value Check
            expect(res.body.nodeCount).to.equal(0, 'new user nodeCount != 0')
            expect(res.body.username).to.equal('test1')
            expect(res.body.nodes.length).to.equal(0)
            
            done()
          })
    })
  })
  it('with nothing: it should not update the user\'s username or password, and return the user in the response', (done) => {
    User.findOne({where:
      {
        username: 'mocha_test_update',
        password: 'mocha_test_update',
      }
    })
    .then (user => { 
      theUser = user
      const newUser = {
        api_token: user.api_token
      }

      chai.request(server)
          .put('/api/users/update')
          .send(newUser)
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
            expect(res.body.createdAt).to.be.a('string')
            expect(res.body.updatedAt).to.be.a('string')
            expect(res.body.nodes).to.be.a('array')
  
            // Value Check
            expect(res.body.nodeCount).to.equal(0, 'new user nodeCount != 0')
            expect(res.body.username).to.equal('mocha_test_update')
            expect(res.body.nodes.length).to.equal(0)
            
            done()
          })
    })
  })

})
