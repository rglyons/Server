/*
* all tests in this file test deprecated API endpoints that deal with users
* most of these endpoints still work the same and return the
* same content, however the HTTP method of access has changed,
* i.e. from POST + req.body.api_token to GET + req.headers.authorization
*/
const User = require('../server/models').User
const Node = require('../server/models').Node
const Reading = require('../server/models').Reading
const chai = require('chai')
const chaiHttp = require('chai-http')
const chaiSubset = require('chai-subset')
const server = require('../app')
const expect = chai.expect
chai.use(chaiHttp)
chai.use(chaiSubset)

/*
* /api/users/update
*/
describe('PUT to /api/users/update - Test updating an existing user', () => {
  let theUser = null
  before(() => { // create a new user
    return User.create({
      username: 'mocha_test_update',
      password: 'mocha_test_update',
      email: 'mocha_test_update',
      nodeCount: 0
    })
    .then(user => {
      theUser = user
    })
  })
  after(() => { // delete the test user
    theUser.destroy()
  })
  beforeEach(() => {})
  afterEach(() => {
    return User.update({
      username: 'mocha_test_update',
      password: 'mocha_test_update',
      email: 'mocha_test_update'
    }, { where: {
      api_token: theUser.api_token
    }})
  })
  it('with required data: it should update the user and return it in the response', (done) => {
    const newUser = {
      username: 'test1',
      password: 'test1',
      email: 'email1',
      api_token: theUser.api_token
    }
    chai.request(server)
        .put('/api/users/update')
        .send(newUser)
        .end((err, res) => {
          if (err) console.trace(err)
          expect(res).to.have.status(200)
          expect(res.body).to.be.a('object')

          expect(res.body).to.have.all.keys(['id', 'username', 'password', 'email', 'nodeCount', 'api_token', 'createdAt', 'updatedAt', 'nodes'])

          // Type Check
          expect(res.body.id).to.be.a('number')
          expect(res.body.username).to.be.a('string')
          expect(res.body.email).to.be.a('string')
          expect(res.body.password).to.be.null
          expect(res.body.nodeCount).to.be.a('number')
          expect(res.body.api_token).to.be.a('string')
          expect(res.body.createdAt).to.be.a('string')
          expect(res.body.updatedAt).to.be.a('string')
          expect(res.body.nodes).to.be.a('array')

          // Value Check
          expect(res.body.nodeCount).to.equal(0, 'new user nodeCount != 0')
          expect(res.body.username).to.equal('test1')
          expect(res.body.email).to.equal('email1')
          expect(res.body.nodes.length).to.equal(0)
          
          done()
        })
  })
  it('with no api_token: it should return a message about invalid API token', (done) => {
    const user = {
        username: 'test1',
        password: 'test1',
        email: 'email1'
    }
    chai.request(server)
        .put('/api/users/update')
        .send(user)
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
    const newUser = {
      password: 'test1',
      email: 'email1',
      api_token: theUser.api_token
    }
    chai.request(server)
        .put('/api/users/update')
        .send(newUser)
        .end((err, res) => {
          if (err) console.trace(err)
          expect(res).to.have.status(200)
          expect(res.body).to.be.a('object')

          expect(res.body).to.have.all.keys(['id', 'username', 'password', 'email', 'nodeCount', 'api_token', 'createdAt', 'updatedAt', 'nodes'])

          // Type Check
          expect(res.body.id).to.be.a('number')
          expect(res.body.username).to.be.a('string')
          expect(res.body.email).to.be.a('string')
          expect(res.body.password).to.be.null
          expect(res.body.nodeCount).to.be.a('number')
          expect(res.body.api_token).to.be.a('string')
          expect(res.body.createdAt).to.be.a('string')
          expect(res.body.updatedAt).to.be.a('string')
          expect(res.body.nodes).to.be.a('array')

          // Value Check
          expect(res.body.nodeCount).to.equal(0, 'new user nodeCount != 0')
          expect(res.body.username).to.equal('mocha_test_update')
          expect(res.body.email).to.equal('email1')
          expect(res.body.nodes.length).to.equal(0)
          
          done()
        })
  })
  it('with no password: it should not update the user\'s password, and return the user in the response', (done) => {
    const newUser = {
      username: 'test1',
      email: 'email1',
      api_token: theUser.api_token
    }
    chai.request(server)
        .put('/api/users/update')
        .send(newUser)
        .end((err, res) => {
          if (err) console.trace(err)
          expect(res).to.have.status(200)
          expect(res.body).to.be.a('object')

          expect(res.body).to.have.all.keys(['id', 'username', 'password', 'email', 'nodeCount', 'api_token', 'createdAt', 'updatedAt', 'nodes'])

          // Type Check
          expect(res.body.id).to.be.a('number')
          expect(res.body.username).to.be.a('string')
          expect(res.body.email).to.be.a('string')
          expect(res.body.password).to.be.null
          expect(res.body.nodeCount).to.be.a('number')
          expect(res.body.api_token).to.be.a('string')
          expect(res.body.createdAt).to.be.a('string')
          expect(res.body.updatedAt).to.be.a('string')
          expect(res.body.nodes).to.be.a('array')

          // Value Check
          expect(res.body.nodeCount).to.equal(0, 'new user nodeCount != 0')
          expect(res.body.username).to.equal('test1')
          expect(res.body.email).to.equal('email1')
          expect(res.body.nodes.length).to.equal(0)
          
          done()
        })
  })
  it('with no email: it should not update the user\'s email, and return the user in the response', (done) => {
    const newUser = {
      username: 'test1',
      password: 'test1',
      api_token: theUser.api_token
    }
    chai.request(server)
        .put('/api/users/update')
        .send(newUser)
        .end((err, res) => {
          if (err) console.trace(err)
          expect(res).to.have.status(200)
          expect(res.body).to.be.a('object')

          expect(res.body).to.have.all.keys(['id', 'username', 'password', 'email', 'nodeCount', 'api_token', 'createdAt', 'updatedAt', 'nodes'])

          // Type Check
          expect(res.body.id).to.be.a('number')
          expect(res.body.username).to.be.a('string')
          expect(res.body.email).to.be.a('string')
          expect(res.body.password).to.be.null
          expect(res.body.nodeCount).to.be.a('number')
          expect(res.body.api_token).to.be.a('string')
          expect(res.body.createdAt).to.be.a('string')
          expect(res.body.updatedAt).to.be.a('string')
          expect(res.body.nodes).to.be.a('array')

          // Value Check
          expect(res.body.nodeCount).to.equal(0, 'new user nodeCount != 0')
          expect(res.body.username).to.equal('test1')
          expect(res.body.email).to.equal('mocha_test_update')
          expect(res.body.nodes.length).to.equal(0)
          
          done()
        })
  })
  it('with nothing: it should not update the user\'s username or password, and return the user in the response', (done) => {
    const newUser = {
      api_token: theUser.api_token
    }
    chai.request(server)
        .put('/api/users/update')
        .send(newUser)
        .end((err, res) => {
          if (err) console.trace(err)
          expect(res).to.have.status(200)
          expect(res.body).to.be.a('object')

          expect(res.body).to.have.all.keys(['id', 'username', 'password', 'email', 'nodeCount', 'api_token', 'createdAt', 'updatedAt', 'nodes'])

          // Type Check
          expect(res.body.id).to.be.a('number')
          expect(res.body.username).to.be.a('string')
          expect(res.body.email).to.be.a('string')
          expect(res.body.password).to.be.null
          expect(res.body.nodeCount).to.be.a('number')
          expect(res.body.api_token).to.be.a('string')
          expect(res.body.createdAt).to.be.a('string')
          expect(res.body.updatedAt).to.be.a('string')
          expect(res.body.nodes).to.be.a('array')

          // Value Check
          expect(res.body.nodeCount).to.equal(0, 'new user nodeCount != 0')
          expect(res.body.username).to.equal('mocha_test_update')
          expect(res.body.email).to.equal('mocha_test_update')
          expect(res.body.nodes.length).to.equal(0)
          
          done()
        })
  })
})

/*
* /api/users/token
*/
describe('PUT to /api/users/token - Test creating a new api token for user', () => {
  let theUser = null
  before(() => { // create a new user
    return User.create({
      username: 'mocha_test_token',
      password: 'mocha_test_token',
      email: 'mocha_test_token',
      nodeCount: 0
    })
    .then(user => {
      theUser = user
    })
  })
  after(() => { // delete the test user
    User.destroy({ where: {
      api_token: theUser.api_token
    }})
  })
  beforeEach(() => {})
  afterEach(() => {})
  it('with required data: it should update the user and return it in the response', (done) => {
    const newUser = {
      api_token: theUser.api_token
    }
    chai.request(server)
        .put('/api/users/token')
        .send(newUser)
        .end((err, res) => {
          if (err) console.trace(err)
          expect(res).to.have.status(200)
          expect(res.body).to.be.a('object')

          expect(res.body).to.have.all.keys(['id', 'username', 'password', 'email', 'nodeCount', 'api_token', 'createdAt', 'updatedAt', 'nodes'])

          // Type Check
          expect(res.body.id).to.be.a('number')
          expect(res.body.username).to.be.a('string')
          expect(res.body.email).to.be.a('string')
          expect(res.body.password).to.be.null
          expect(res.body.nodeCount).to.be.a('number')
          expect(res.body.api_token).to.be.a('string')
          expect(res.body.createdAt).to.be.a('string')
          expect(res.body.updatedAt).to.be.a('string')
          expect(res.body.nodes).to.be.a('array')

          // Value Check
          expect(res.body.nodeCount).to.equal(0, 'new user nodeCount != 0')
          expect(res.body.username).to.equal('mocha_test_token')
          expect(res.body.email).to.equal('mocha_test_token')
          expect(res.body.nodes.length).to.equal(0)
          expect(res.body.api_token).to.not.equal(theUser.api_token)
          
          // to remove the user in the after() hook
          theUser.api_token = res.body.api_token
          
          done()
        })
  })
  it('without api_token: it should return a message about invalid API token', (done) => {
    const newUser = { }
    chai.request(server)
        .put('/api/users/token')
        .send(newUser)
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
  it('with improper api_token: it should return a message about invalid API token', (done) => {
    const newUser = {
      api_token: 'incorrect_api_token'  
    }
    chai.request(server)
        .put('/api/users/token')
        .send(newUser)
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
})

/*
* /api/users/delete
*/
describe('DELETE to /api/users/delete - Test deleting a user', () => {
  let theUser = null
  before(() => { // create a new user
    return User.create({
      username: 'mocha_test_delete',
      password: 'mocha_test_delete',
      email: 'mocha_test_delete',
      nodeCount: 0
    })
    .then(user => {
      theUser = user
    })
  })
  after(() => {})
  beforeEach(() => {})
  afterEach(() => {})
  it('with required data: it should delete the user and return no content', (done) => {
    const newUser = {
      api_token: theUser.api_token
    }
    chai.request(server)
        .delete('/api/users/delete')
        .send(newUser)
        .end((err, res) => {
          if (err) console.trace(err)
          expect(res).to.have.status(204)
                    
          done()
        })
  })
  it('without api_token: it should return a message about invalid API token', (done) => {
    const newUser = { }
    chai.request(server)
        .delete('/api/users/delete')
        .send(newUser)
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
  it('with improper api_token: it should return a message about invalid API token', (done) => {
    const newUser = {
      api_token: 'incorrect_api_token'  
    }
    chai.request(server)
        .delete('/api/users/delete')
        .send(newUser)
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
})

/*
* /api/users/getuser
*/
describe('POST to /api/users/getuser - Test getting a user and his/her nodes', () => {
  let theUser = null
  before(() => { // create a new user
    return User.create({
      username: 'mocha_test_getUser',
      password: 'mocha_test_getUser',
      email: 'mocha_test_getUser',
      nodeCount: 0
    })
    .then(user => {
      theUser = user
    })
  })
  after(() => { // delete the test user
    User.destroy({ where: {
      api_token: theUser.api_token
    }})
  })
  beforeEach(() => {})
  afterEach(() => {})
  it('with required data: it should get the user and return it in the response', (done) => {
    const newUser = {
      api_token: theUser.api_token
    }
    chai.request(server)
        .post('/api/users/getuser')
        .send(newUser)
        .end((err, res) => {
          if (err) console.trace(err)
          expect(res).to.have.status(200)
          expect(res.body).to.be.a('object')

          expect(res.body).to.have.all.keys(['id', 'username', 'email', 'nodeCount', 'nodes'])

          // Type Check
          expect(res.body.id).to.be.a('number')
          expect(res.body.username).to.be.a('string')
          expect(res.body.email).to.be.a('string')
          expect(res.body.nodeCount).to.be.a('number')
          expect(res.body.nodes).to.be.a('array')

          // Value Check
          expect(res.body.nodeCount).to.equal(0, 'new user nodeCount != 0')
          expect(res.body.username).to.equal('mocha_test_getUser')
          expect(res.body.email).to.equal('mocha_test_getUser')
          expect(res.body.nodes.length).to.equal(0)
          
          done()
        })
  })
  it('without api_token: it should return a message about invalid API token', (done) => {
    const newUser = { }
    chai.request(server)
        .post('/api/users/getuser')
        .send(newUser)
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
  it('with improper api_token: it should return a message about invalid API token', (done) => {
    const newUser = {
      api_token: 'incorrect_api_token'  
    }
    chai.request(server)
        .post('/api/users/getuser')
        .send(newUser)
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
})
