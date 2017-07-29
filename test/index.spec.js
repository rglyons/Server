/* eslint no-undef:0 */
/* eslint no-unused-expressions:0 */

// Require the dev-dependencies
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
    return User.create({
      username: 'mocha_test_login',
      password: 'mocha_test_login',
      nodeCount: 0
    })
    .then(user => {
      theUser = user
    })
  })
  after((done) => { // delete the test user
    User.destroy({ where: {
      api_token: theUser.api_token
    }})
    done()
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
  it('with non-existent credential: it should return a message about invalid credentials', (done) => {
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
          expect(res.body.api_token).to.be.a('string')
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
    return User.create({
      username: 'mocha_test_update',
      password: 'mocha_test_update',
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
      password: 'mocha_test_update'
    }, { where: {
      api_token: theUser.api_token
    }})
  })
  it('with required data: it should update the user and return it in the response', (done) => {
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

          // Value Check
          expect(res.body.nodeCount).to.equal(0, 'new user nodeCount != 0')
          expect(res.body.username).to.equal('test1')
          expect(res.body.nodes.length).to.equal(0)
          
          done()
        })
  })
  it('with no api_token: it should return a message about invalid API token', (done) => {
    const user = {
        username: 'test1',
        password: 'test1'
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
      api_token: theUser.api_token
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
          expect(res.body.api_token).to.be.a('string')
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
  it('with no password: it should not update the user\'s password, and return the user in the response', (done) => {
    const newUser = {
      username: 'test1',
      api_token: theUser.api_token
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
          expect(res.body.api_token).to.be.a('string')
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

          // Value Check
          expect(res.body.nodeCount).to.equal(0, 'new user nodeCount != 0')
          expect(res.body.username).to.equal('mocha_test_update')
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

          // Value Check
          expect(res.body.nodeCount).to.equal(0, 'new user nodeCount != 0')
          expect(res.body.username).to.equal('mocha_test_token')
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
* /api/users/getuser
*/
describe('POST to /api/users/getuser - Test getting a user and his/her nodes', () => {
  let theUser = null
  before(() => { // create a new user
    return User.create({
      username: 'mocha_test_getUser',
      password: 'mocha_test_getUser',
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

          expect(res.body).to.have.all.keys(['id', 'username', 'nodeCount', 'nodes'])

          // Type Check
          expect(res.body.id).to.be.a('number')
          expect(res.body.username).to.be.a('string')
          expect(res.body.nodeCount).to.be.a('number')
          expect(res.body.nodes).to.be.a('array')

          // Value Check
          expect(res.body.nodeCount).to.equal(0, 'new user nodeCount != 0')
          expect(res.body.username).to.equal('mocha_test_getUser')
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

/*
* /api/users/delete
*/
describe('DELETE to /api/users/delete - Test deleting a user', () => {
  let theUser = null
  before(() => { // create a new user
    return User.create({
      username: 'mocha_test_delete',
      password: 'mocha_test_delete',
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
* /api/nodes
*/
describe('POST to /api/nodes - Test creating a node under a user', () => {
  let theUser = null
  let theNode = null
  before(() => { // create a new user
    return User.create({
      username: 'mocha_test_create_node',
      password: 'mocha_test_create_node',
    })
    .then(user => {
      theUser = user
    })
  })
  after(() => {
    theUser.destroy()
    return Node
      .findById(theNode.id)
      .then(node => node.destroy())
  })
  beforeEach(() => {})
  afterEach(() => {})
  it('with required data: it should create the node and return it in the response', (done) => {
    const newNode = {
      api_token: theUser.api_token,
      ipaddress: '1.1.1.1'
    }
    chai.request(server)
        .post('/api/nodes')
        .send(newNode)
        .end((err, res) => {
          if (err) console.trace(err)
          expect(res).to.have.status(201)
          expect(res.body).to.be.a('object')

          expect(res.body).to.have.all.keys(['name', 'groupName', 'tempMin', 'tempMax', 'humidityMin', 'humidityMax',
                                            'moistureMin', 'moistureMax', 'sunlightMin', 'sunlightMax', 'id',
                                            'ipaddress', 'userId', 'createdAt', 'updatedAt'])

          // Type Check
          expect(res.body.name).to.be.null
          expect(res.body.groupName).to.be.null
          expect(res.body.tempMin).to.be.a('number')
          expect(res.body.tempMax).to.be.a('number')
          expect(res.body.humidityMin).to.be.a('number')
          expect(res.body.humidityMax).to.be.a('number')
          expect(res.body.moistureMin).to.be.a('number')
          expect(res.body.moistureMax).to.be.a('number')
          expect(res.body.sunlightMin).to.be.a('number')
          expect(res.body.sunlightMax).to.be.a('number')
          expect(res.body.id).to.be.a('number')
          expect(res.body.ipaddress).to.be.a('string')
          expect(res.body.userId).to.be.a('number')
          expect(res.body.createdAt).to.be.a('string')
          expect(res.body.updatedAt).to.be.a('string')

          // Value Check
          expect(res.body.userId).to.equal(theUser.id)
          expect(res.body.tempMin).to.equal(0)
          expect(res.body.tempMax).to.equal(100)
          expect(res.body.humidityMin).to.equal(0)
          expect(res.body.humidityMax).to.equal(100)
          expect(res.body.moistureMin).to.equal(0)
          expect(res.body.moistureMax).to.equal(100)
          expect(res.body.sunlightMin).to.equal(0)
          expect(res.body.sunlightMax).to.equal(100)
          expect(res.body.ipaddress).to.equal('1.1.1.1')
          
          theNode = res.body
          
          done()

        })
  })
  it('with required data + optional id: it should create the node and return it in the response', (done) => {
    const newNode = {
      api_token: theUser.api_token,
      ipaddress: '1.1.1.1',
      id: 101
    }
    chai.request(server)
        .post('/api/nodes')
        .send(newNode)
        .end((err, res) => {
          if (err) console.trace(err)
          expect(res).to.have.status(201)
          expect(res.body).to.be.a('object')

          expect(res.body).to.have.all.keys(['name', 'groupName', 'tempMin', 'tempMax', 'humidityMin', 'humidityMax',
                                            'moistureMin', 'moistureMax', 'sunlightMin', 'sunlightMax', 'id',
                                            'ipaddress', 'userId', 'createdAt', 'updatedAt'])

          // Type Check
          expect(res.body.name).to.be.null
          expect(res.body.groupName).to.be.null
          expect(res.body.tempMin).to.be.a('number')
          expect(res.body.tempMax).to.be.a('number')
          expect(res.body.humidityMin).to.be.a('number')
          expect(res.body.humidityMax).to.be.a('number')
          expect(res.body.moistureMin).to.be.a('number')
          expect(res.body.moistureMax).to.be.a('number')
          expect(res.body.sunlightMin).to.be.a('number')
          expect(res.body.sunlightMax).to.be.a('number')
          expect(res.body.id).to.be.a('number')
          expect(res.body.ipaddress).to.be.a('string')
          expect(res.body.userId).to.be.a('number')
          expect(res.body.createdAt).to.be.a('string')
          expect(res.body.updatedAt).to.be.a('string')

          // Value Check
          expect(res.body.userId).to.equal(theUser.id)
          expect(res.body.id).to.equal(101)
          expect(res.body.tempMin).to.equal(0)
          expect(res.body.tempMax).to.equal(100)
          expect(res.body.humidityMin).to.equal(0)
          expect(res.body.humidityMax).to.equal(100)
          expect(res.body.moistureMin).to.equal(0)
          expect(res.body.moistureMax).to.equal(100)
          expect(res.body.sunlightMin).to.equal(0)
          expect(res.body.sunlightMax).to.equal(100)
          expect(res.body.ipaddress).to.equal('1.1.1.1')
                    
          // delete the special case test node
          return Node
            .findById(res.body.id)
            .then(node => {
              node.destroy()
              done()
            })
                          
        })
  })
  it('with no ipaddress: it should generate an error message and respond with 400', (done) => {
    const node = {
      api_token: theUser.api_token
    }
    chai.request(server)
        .post('/api/nodes')
        .send(node)
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
          expect(res.body.message).to.equal('notNull Violation: ipaddress cannot be null')
          expect(res.body.errors.length).to.equal(1)
          done()
        })
  })
  it('without api_token: it should return a message about invalid API token', (done) => {
    const newUser = { }
    chai.request(server)
        .post('/api/nodes')
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
        .post('/api/nodes')
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
  it('afterCreate/afterDestroy hook (/models/node.js): it should get and return the user, and check the user\'s nodeCount', (done) => {
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

          expect(res.body).to.have.all.keys(['id', 'username', 'nodeCount', 'nodes'])

          // Type Check
          expect(res.body.id).to.be.a('number')
          expect(res.body.username).to.be.a('string')
          expect(res.body.nodeCount).to.be.a('number')
          expect(res.body.nodes).to.be.a('array')

          // Value Check
          expect(res.body.nodeCount).to.equal(1)
          expect(res.body.username).to.equal('mocha_test_create_node')
          expect(res.body.nodes.length).to.equal(1)
          
          done()
        })
  })
})

/*
* /api/nodes/all
*/
describe('GET to /api/nodes/all - Test listing all nodes', () => {
  let theUser = null
  let theNode = null
  before(() => { // create a new user, node, and dummy reading
    return User.create({
      username: 'mocha_test_list_nodes',
      password: 'mocha_test_list_nodes',
    })
    .then(user => {
      theUser = user
      return theUser
    })
    .then(theUser => {
      return Node
        .create({
          ipaddress: '1.1.1.1',
          userId: theUser.id
        })
        .then(node => {
          theNode = node
          return Reading
            .create({
              humidity: 0,
              sunlight: 0,
              temperature: 0,
              moisture: 0,
              battery: null,
              nodeId: node.id,
            })
          })
    })
  })
  after(() => {
    theUser.destroy()
    theNode.destroy()
  })
  beforeEach(() => {})
  afterEach(() => {})
  it('it should return the one node in a list in the response', (done) => {
    chai.request(server)
        .get('/api/nodes/all')
        .end((err, res) => {
          if (err) console.trace(err)
          expect(res).to.have.status(200)
          expect(res.body).to.be.a('array')

          expect(res.body[0]).to.have.all.keys(['name', 'groupName', 'tempMin', 'tempMax', 'humidityMin', 'humidityMax',
                                            'moistureMin', 'moistureMax', 'sunlightMin', 'sunlightMax', 'id',
                                            'ipaddress', 'userId', 'createdAt', 'updatedAt', 'readings'])
          // check included reading objects
          expect(res.body[0].readings[0]).to.have.all.keys(['temperature', 'humidity', 'sunlight', 'moisture', 'id',
                                                          'battery', 'nodeId', 'createdAt', 'updatedAt'])

          // Type Check
          expect(res.body[0].name).to.be.null
          expect(res.body[0].groupName).to.be.null
          expect(res.body[0].tempMin).to.be.a('number')
          expect(res.body[0].tempMax).to.be.a('number')
          expect(res.body[0].humidityMin).to.be.a('number')
          expect(res.body[0].humidityMax).to.be.a('number')
          expect(res.body[0].moistureMin).to.be.a('number')
          expect(res.body[0].moistureMax).to.be.a('number')
          expect(res.body[0].sunlightMin).to.be.a('number')
          expect(res.body[0].sunlightMax).to.be.a('number')
          expect(res.body[0].id).to.be.a('number')
          expect(res.body[0].ipaddress).to.be.a('string')
          expect(res.body[0].userId).to.be.a('number')
          expect(res.body[0].createdAt).to.be.a('string')
          expect(res.body[0].updatedAt).to.be.a('string')
          expect(res.body[0].readings).to.be.a('array')

          expect(res.body[0].readings[0].id).to.be.a('number')
          expect(res.body[0].readings[0].humidity).to.be.a('number')
          expect(res.body[0].readings[0].temperature).to.be.a('number')
          expect(res.body[0].readings[0].sunlight).to.be.a('number')
          expect(res.body[0].readings[0].moisture).to.be.a('number')
          expect(res.body[0].readings[0].battery).to.be.null
          expect(res.body[0].readings[0].createdAt).to.be.a('string')
          expect(res.body[0].readings[0].updatedAt).to.be.a('string')
          expect(res.body[0].readings[0].nodeId).to.be.a('number')
          
          // Value Check
          expect(res.body[0].userId).to.equal(theUser.id)
          expect(res.body[0].tempMin).to.equal(0)
          expect(res.body[0].tempMax).to.equal(100)
          expect(res.body[0].humidityMin).to.equal(0)
          expect(res.body[0].humidityMax).to.equal(100)
          expect(res.body[0].moistureMin).to.equal(0)
          expect(res.body[0].moistureMax).to.equal(100)
          expect(res.body[0].sunlightMin).to.equal(0)
          expect(res.body[0].sunlightMax).to.equal(100)
          expect(res.body[0].ipaddress).to.equal('1.1.1.1')
          expect(res.body[0].readings.length).to.equal(1)
          
          expect(res.body[0].readings[0].humidity).to.equal(0)
          expect(res.body[0].readings[0].temperature).to.equal(0)
          expect(res.body[0].readings[0].sunlight).to.equal(0)
          expect(res.body[0].readings[0].moisture).to.equal(0)
                    
          done()

        })
  })
})

/*
* /api/nodes/:nid
*/
describe('GET to /api/nodes/:nid - Test getting a specific node', () => {
  let theUser = null
  let theNode = null
  before(() => { // create a new user, node, and dummy reading
    return User.create({
      username: 'mocha_test_get_node',
      password: 'mocha_test_get_node',
    })
    .then(user => {
      theUser = user
      return theUser
    })
    .then(theUser => {
      return Node
        .create({
          ipaddress: '1.1.1.1',
          userId: theUser.id
        })
        .then(node => {
          theNode = node
          return Reading
            .create({
              humidity: 0,
              sunlight: 0,
              temperature: 0,
              moisture: 0,
              battery: null,
              nodeId: node.id,
            })
          })
    })
  })
  after(() => {
    theUser.destroy()
    theNode.destroy()
  })
  beforeEach(() => {})
  afterEach(() => {})
  it('it should return the specific node in the response', (done) => {
    chai.request(server)
        .get('/api/nodes/' + theNode.id)
        .end((err, res) => {
          if (err) console.trace(err)
          expect(res).to.have.status(200)
          expect(res.body).to.be.a('object')

          expect(res.body).to.have.all.keys(['name', 'groupName', 'tempMin', 'tempMax', 'humidityMin', 'humidityMax',
                                            'moistureMin', 'moistureMax', 'sunlightMin', 'sunlightMax', 'id',
                                            'ipaddress', 'userId', 'createdAt', 'updatedAt', 'readings'])
          // check included reading objects
          expect(res.body.readings[0]).to.have.all.keys(['temperature', 'humidity', 'sunlight', 'moisture', 'id',
                                                          'battery', 'nodeId', 'createdAt', 'updatedAt'])

          // Type Check
          expect(res.body.name).to.be.null
          expect(res.body.groupName).to.be.null
          expect(res.body.tempMin).to.be.a('number')
          expect(res.body.tempMax).to.be.a('number')
          expect(res.body.humidityMin).to.be.a('number')
          expect(res.body.humidityMax).to.be.a('number')
          expect(res.body.moistureMin).to.be.a('number')
          expect(res.body.moistureMax).to.be.a('number')
          expect(res.body.sunlightMin).to.be.a('number')
          expect(res.body.sunlightMax).to.be.a('number')
          expect(res.body.id).to.be.a('number')
          expect(res.body.ipaddress).to.be.a('string')
          expect(res.body.userId).to.be.a('number')
          expect(res.body.createdAt).to.be.a('string')
          expect(res.body.updatedAt).to.be.a('string')
          expect(res.body.readings).to.be.a('array')

          expect(res.body.readings[0].id).to.be.a('number')
          expect(res.body.readings[0].humidity).to.be.a('number')
          expect(res.body.readings[0].temperature).to.be.a('number')
          expect(res.body.readings[0].sunlight).to.be.a('number')
          expect(res.body.readings[0].moisture).to.be.a('number')
          expect(res.body.readings[0].battery).to.be.null
          expect(res.body.readings[0].createdAt).to.be.a('string')
          expect(res.body.readings[0].updatedAt).to.be.a('string')
          expect(res.body.readings[0].nodeId).to.be.a('number')
          
          // Value Check
          expect(res.body.userId).to.equal(theUser.id)
          expect(res.body.tempMin).to.equal(0)
          expect(res.body.tempMax).to.equal(100)
          expect(res.body.humidityMin).to.equal(0)
          expect(res.body.humidityMax).to.equal(100)
          expect(res.body.moistureMin).to.equal(0)
          expect(res.body.moistureMax).to.equal(100)
          expect(res.body.sunlightMin).to.equal(0)
          expect(res.body.sunlightMax).to.equal(100)
          expect(res.body.ipaddress).to.equal('1.1.1.1')
          expect(res.body.readings.length).to.equal(1)
          
          expect(res.body.readings[0].humidity).to.equal(0)
          expect(res.body.readings[0].temperature).to.equal(0)
          expect(res.body.readings[0].sunlight).to.equal(0)
          expect(res.body.readings[0].moisture).to.equal(0)
                    
          done()

        })
  })
})

/*
* /api/nodes/:nid/new_reading
*/
describe('POST to /api/nodes/:nid/new_reading - Test creation of a new reading', () => {
  let theUser = null
  let theNode = null
  let theReading = null
  before(() => { // create a new user, node, and dummy reading
    return User.create({
      username: 'mocha_test_create_reading',
      password: 'mocha_test_create_reading',
    })
    .then(user => {
      theUser = user
      return theUser
    })
    .then(theUser => {
      return Node
        .create({
          ipaddress: '1.1.1.1',
          userId: theUser.id
        })
        .then(node => {
          theNode = node
          return Reading
            .create({
              humidity: 0,
              sunlight: 0,
              temperature: 0,
              moisture: 0,
              battery: null,
              nodeId: node.id,
            })
          })
    })
  })
  after(() => {
    theUser.destroy()
    theNode.destroy()
  })
  beforeEach(() => {})
  afterEach(() => {
    return Reading
      .findById(theReading.id)
      .then(reading => reading.destroy())
  })
  it('without battery: it should create the reading with battery=NULL and return the reading in the response', (done) => {
    const newReading = {
      temperature: 1,
      moisture: 2,
      humidity: 3,
      sunlight: 4
    }
    chai.request(server)
        .post('/api/nodes/' + theNode.id + '/new_reading')
        .send(newReading)
        .end((err, res) => {
          if (err) console.trace(err)
          expect(res).to.have.status(201)
          expect(res.body).to.be.a('object')

          expect(res.body).to.have.all.keys(['temperature', 'humidity', 'sunlight', 'moisture', 'id',
                                              'battery', 'nodeId', 'createdAt', 'updatedAt'])

          // Type Check
          expect(res.body.id).to.be.a('number')
          expect(res.body.humidity).to.be.a('number')
          expect(res.body.temperature).to.be.a('number')
          expect(res.body.sunlight).to.be.a('number')
          expect(res.body.moisture).to.be.a('number')
          expect(res.body.battery).to.be.null
          expect(res.body.createdAt).to.be.a('string')
          expect(res.body.updatedAt).to.be.a('string')
          expect(res.body.nodeId).to.be.a('number')
          
          // Value Check
          expect(res.body.humidity).to.equal(3)
          expect(res.body.temperature).to.equal(1)
          expect(res.body.sunlight).to.equal(4)
          expect(res.body.moisture).to.equal(2)
          
          theReading = res.body
                    
          done()

        })
  })
  it('with battery: it should create the reading with battery=value and return the reading in the response', (done) => {
    const newReading = {
      temperature: 1,
      moisture: 2,
      humidity: 3,
      sunlight: 4,
      battery: 99
    }
    chai.request(server)
        .post('/api/nodes/' + theNode.id + '/new_reading')
        .send(newReading)
        .end((err, res) => {
          if (err) console.trace(err)
          expect(res).to.have.status(201)
          expect(res.body).to.be.a('object')

          expect(res.body).to.have.all.keys(['temperature', 'humidity', 'sunlight', 'moisture', 'id',
                                              'battery', 'nodeId', 'createdAt', 'updatedAt'])

          // Type Check
          expect(res.body.id).to.be.a('number')
          expect(res.body.humidity).to.be.a('number')
          expect(res.body.temperature).to.be.a('number')
          expect(res.body.sunlight).to.be.a('number')
          expect(res.body.moisture).to.be.a('number')
          expect(res.body.battery).to.be.a('number')
          expect(res.body.createdAt).to.be.a('string')
          expect(res.body.updatedAt).to.be.a('string')
          expect(res.body.nodeId).to.be.a('number')
          
          // Value Check
          expect(res.body.humidity).to.equal(3)
          expect(res.body.temperature).to.equal(1)
          expect(res.body.sunlight).to.equal(4)
          expect(res.body.moisture).to.equal(2)
          expect(res.body.battery).to.equal(99)
          
          theReading = res.body
                    
          done()

        })
  })
  it('with battery: it should create the reading all metrics NULL and return the reading in the response', (done) => {
    const newReading = {}
    chai.request(server)
        .post('/api/nodes/' + theNode.id + '/new_reading')
        .send(newReading)
        .end((err, res) => {
          if (err) console.trace(err)
          expect(res).to.have.status(201)
          expect(res.body).to.be.a('object')

          expect(res.body).to.have.all.keys(['temperature', 'humidity', 'sunlight', 'moisture', 'id',
                                              'battery', 'nodeId', 'createdAt', 'updatedAt'])

          // Type Check
          expect(res.body.id).to.be.a('number')
          expect(res.body.humidity).to.be.null
          expect(res.body.temperature).to.be.null
          expect(res.body.sunlight).to.be.null
          expect(res.body.moisture).to.be.null
          expect(res.body.battery).to.be.null
          expect(res.body.createdAt).to.be.a('string')
          expect(res.body.updatedAt).to.be.a('string')
          expect(res.body.nodeId).to.be.a('number')
                    
          theReading = res.body
                    
          done()

        })
  })
})

/*
* /api/nodes/:nid (PUT)
*/
describe('PUT to /api/nodes/:nid - Test updating an existing node', () => {
  let theUser = null
  let theNode = null
  before(() => { // create a new user, node, and dummy reading
    return User.create({
      username: 'mocha_test_update_node',
      password: 'mocha_test_update_node',
    })
    .then(user => {
      theUser = user
      return theUser
    })
    .then(theUser => {
      return Node
        .create({
          ipaddress: '1.1.1.1',
          userId: theUser.id
        })
        .then(node => {
          theNode = node
          return Reading
            .create({
              humidity: 0,
              sunlight: 0,
              temperature: 0,
              moisture: 0,
              battery: null,
              nodeId: node.id,
            })
          })
    })
  })
  after((done) => {
    theUser.destroy()
    theNode.destroy()
    done()
  })
  beforeEach(() => {})
  afterEach(() => {
    // reset theNode
    return Node.update({
        ipaddress: '1.1.1.1',
        name: null,
        groupName: null,
        tempMin: 0,
        tempMax: 100,
        humidityMin: 0,
        humidityMax: 100,
        moistureMin: 0,
        moistureMax: 100,
        sunlightMin: 0,
        sunlightMax: 100
    }, { where : {
      id: theNode.id
    }})
  })
  it('with all optional data: it should update the node and return it in the response', (done) => {
    const newNode = {
      api_token: theUser.api_token,
      ipaddress: '1.1.1.2',
      name: 'name',
      groupName: 'groupName',
      tempMin: 1,
      tempMax: 99,
      humidityMin: 2,
      humidityMax: 98,
      moistureMin: 3,
      moistureMax: 97,
      sunlightMin: 4,
      sunlightMax: 96
    }
    chai.request(server)
        .put('/api/nodes/' + theNode.id)
        .send(newNode)
        .end((err, res) => {
          if (err) console.trace(err)
          expect(res).to.have.status(200)
          expect(res.body).to.be.a('object')

          expect(res.body).to.have.all.keys(['name', 'groupName', 'tempMin', 'tempMax', 'humidityMin', 'humidityMax',
                                            'moistureMin', 'moistureMax', 'sunlightMin', 'sunlightMax', 'id',
                                            'ipaddress', 'userId', 'createdAt', 'updatedAt'])

          // Type Check
          expect(res.body.name).to.be.a('string')
          expect(res.body.groupName).to.be.a('string')
          expect(res.body.tempMin).to.be.a('number')
          expect(res.body.tempMax).to.be.a('number')
          expect(res.body.humidityMin).to.be.a('number')
          expect(res.body.humidityMax).to.be.a('number')
          expect(res.body.moistureMin).to.be.a('number')
          expect(res.body.moistureMax).to.be.a('number')
          expect(res.body.sunlightMin).to.be.a('number')
          expect(res.body.sunlightMax).to.be.a('number')
          expect(res.body.id).to.be.a('number')
          expect(res.body.ipaddress).to.be.a('string')
          expect(res.body.userId).to.be.a('number')
          expect(res.body.createdAt).to.be.a('string')
          expect(res.body.updatedAt).to.be.a('string')

          // Value Check
          expect(res.body.userId).to.equal(theUser.id)
          expect(res.body.name).to.equal('name')
          expect(res.body.groupName).to.equal('groupName')
          expect(res.body.tempMin).to.equal(1)
          expect(res.body.tempMax).to.equal(99)
          expect(res.body.humidityMin).to.equal(2)
          expect(res.body.humidityMax).to.equal(98)
          expect(res.body.moistureMin).to.equal(3)
          expect(res.body.moistureMax).to.equal(97)
          expect(res.body.sunlightMin).to.equal(4)
          expect(res.body.sunlightMax).to.equal(96)
          expect(res.body.ipaddress).to.equal('1.1.1.2')
          
          done()
        })
  })
  it('empty string name and groupName: it should update the node and return it in the response', (done) => {
    const newNode = {
      api_token: theUser.api_token,
      name: '',
      groupName: ''
    }
    chai.request(server)
        .put('/api/nodes/' + theNode.id)
        .send(newNode)
        .end((err, res) => {
          if (err) console.trace(err)
          expect(res).to.have.status(200)
          expect(res.body).to.be.a('object')

          expect(res.body).to.have.all.keys(['name', 'groupName', 'tempMin', 'tempMax', 'humidityMin', 'humidityMax',
                                            'moistureMin', 'moistureMax', 'sunlightMin', 'sunlightMax', 'id',
                                            'ipaddress', 'userId', 'createdAt', 'updatedAt'])

          // Type Check
          expect(res.body.name).to.be.null
          expect(res.body.groupName).to.be.null
          expect(res.body.tempMin).to.be.a('number')
          expect(res.body.tempMax).to.be.a('number')
          expect(res.body.humidityMin).to.be.a('number')
          expect(res.body.humidityMax).to.be.a('number')
          expect(res.body.moistureMin).to.be.a('number')
          expect(res.body.moistureMax).to.be.a('number')
          expect(res.body.sunlightMin).to.be.a('number')
          expect(res.body.sunlightMax).to.be.a('number')
          expect(res.body.id).to.be.a('number')
          expect(res.body.ipaddress).to.be.a('string')
          expect(res.body.userId).to.be.a('number')
          expect(res.body.createdAt).to.be.a('string')
          expect(res.body.updatedAt).to.be.a('string')

          // Value Check
          expect(res.body.userId).to.equal(theUser.id)
          expect(res.body.tempMin).to.equal(0)
          expect(res.body.tempMax).to.equal(100)
          expect(res.body.humidityMin).to.equal(0)
          expect(res.body.humidityMax).to.equal(100)
          expect(res.body.moistureMin).to.equal(0)
          expect(res.body.moistureMax).to.equal(100)
          expect(res.body.sunlightMin).to.equal(0)
          expect(res.body.sunlightMax).to.equal(100)
          expect(res.body.ipaddress).to.equal('1.1.1.1')
          
          done()
        })
  })
  it('with no optional data: it should not update any fields and return the node in the response', (done) => {
    const newNode = {
      api_token: theUser.api_token,
    }
    chai.request(server)
        .put('/api/nodes/' + theNode.id)
        .send(newNode)
        .end((err, res) => {
          if (err) console.trace(err)
          expect(res).to.have.status(200)
          expect(res.body).to.be.a('object')
          
          expect(res.body).to.have.all.keys([/*'name', 'groupName',*/ 'tempMin', 'tempMax', 'humidityMin', 'humidityMax',
                                            'moistureMin', 'moistureMax', 'sunlightMin', 'sunlightMax', 'id',
                                            'ipaddress', 'userId', 'createdAt', 'updatedAt'])

          // Type Check
          //expect(res.body.name).to.be.null
          //expect(res.body.groupName).to.be.null
          expect(res.body.tempMin).to.be.a('number')
          expect(res.body.tempMax).to.be.a('number')
          expect(res.body.humidityMin).to.be.a('number')
          expect(res.body.humidityMax).to.be.a('number')
          expect(res.body.moistureMin).to.be.a('number')
          expect(res.body.moistureMax).to.be.a('number')
          expect(res.body.sunlightMin).to.be.a('number')
          expect(res.body.sunlightMax).to.be.a('number')
          expect(res.body.id).to.be.a('number')
          expect(res.body.ipaddress).to.be.a('string')
          expect(res.body.userId).to.be.a('number')
          expect(res.body.createdAt).to.be.a('string')
          expect(res.body.updatedAt).to.be.a('string')

          // Value Check
          expect(res.body.userId).to.equal(theUser.id)
          expect(res.body.tempMin).to.equal(0)
          expect(res.body.tempMax).to.equal(100)
          expect(res.body.humidityMin).to.equal(0)
          expect(res.body.humidityMax).to.equal(100)
          expect(res.body.moistureMin).to.equal(0)
          expect(res.body.moistureMax).to.equal(100)
          expect(res.body.sunlightMin).to.equal(0)
          expect(res.body.sunlightMax).to.equal(100)
          expect(res.body.ipaddress).to.equal('1.1.1.1')
          
          done()
        })
  })
  it('with no api_token: it should return a message about invalid API token', (done) => {
    const newNode = {}
    chai.request(server)
        .put('/api/nodes/' + theNode.id)
        .send(newNode)
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
    const newNode = {
      api_token: 'incorrect_api_token'  
    }
    chai.request(server)
        .put('/api/nodes/' + theNode.id)
        .send(newNode)
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
  it('non-existent node: it should return a node not found message', (done) => {
    const newNode = {
      api_token: theUser.api_token
    }
    chai.request(server)
        .put('/api/nodes/-1')
        .send(newNode)
        .end((err, res) => {
          expect(res).to.have.status(404)
          expect(res.body).to.be.a('object')
          // message
          expect(res.body).to.have.property('message')
          expect(res.body.message).to.be.a('string')
          expect(res.body.message).to.equal('Node Not Found')
          done()
        })
  })
})

/*
* /api/nodes/:nid (DELETE
*/
describe('DELETE to /api/nodes/:nid - Test deleting a node', () => {
  let theUser = null
  let theNode = null
  before(() => { // create a new user, node, and dummy reading
    return User.create({
      username: 'mocha_test_delete_node',
      password: 'mocha_test_delete_node',
    })
    .then(user => {
      theUser = user
      return theUser
    })
    .then(theUser => {
      return Node
        .create({
          ipaddress: '1.1.1.1',
          userId: theUser.id
        })
        .then(node => {
          theNode = node
          return Reading
            .create({
              humidity: 0,
              sunlight: 0,
              temperature: 0,
              moisture: 0,
              battery: null,
              nodeId: node.id,
            })
          })
    })
  })
  after(() => {
    theUser.destroy()
    //theNode.destroy()
  })
  beforeEach(() => {})
  afterEach(() => {})
  it('with required data: it should delete the user and return no content', (done) => {
    const user = {
      api_token: theUser.api_token
    }
    chai.request(server)
        .delete('/api/nodes/' + theNode.id)
        .send(user)
        .end((err, res) => {
          if (err) console.trace(err)
          expect(res).to.have.status(204)
                    
          done()
        })
  })
  it('without api_token: it should return a message about invalid API token', (done) => {
    const user = {}
    chai.request(server)
        .delete('/api/nodes/' + theNode.id)
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
  it('with improper api_token: it should return a message about invalid API token', (done) => {
    const user = {
      api_token: 'incorrect_api_token'  
    }
    chai.request(server)
        .delete('/api/nodes/' + theNode.id)
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
})
