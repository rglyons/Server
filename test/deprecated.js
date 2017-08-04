/*
* all tests in this filetest deprecated API endpoints
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
* /api/nodes/:nid (DELETE)
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
* /api/nodes/:nid/latest_reading
*/
describe('POST to /api/nodes/:nid/latest_reading - Test getting a node\'s latest reading', () => {
  let theUser = null
  let theNode = null
  before(() => { // create a new user, node, and dummy reading
    return User.create({
      username: 'mocha_test_latest_reading',
      password: 'mocha_test_latest_reading',
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
  afterEach(() => {})
  it('it should return the node\'s dummy reading in the response', (done) => {
    const body = {
      api_token: theUser.api_token
    }
    chai.request(server)
        .post('/api/nodes/' + theNode.id + '/latest_reading')
        .send(body)
        .end((err, res) => {
          if (err) console.trace(err)
          expect(res).to.have.status(200)
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
          expect(res.body.humidity).to.equal(0)
          expect(res.body.temperature).to.equal(0)
          expect(res.body.sunlight).to.equal(0)
          expect(res.body.moisture).to.equal(0)
                    
          done()
    })
  })
  it('it should return the node\'s new reading in the response', (done) => {
    const body = {
      api_token: theUser.api_token
    }
    Reading
      .create({
        humidity: 1,
        sunlight: 2,
        temperature: 3,
        moisture: 4,
        battery: 5,
        nodeId: theNode.id,
      })
    .then(reading => {     
      chai.request(server)
          .post('/api/nodes/' + theNode.id + '/latest_reading')
          .send(body)
          .end((err, res) => {
            if (err) console.trace(err)
            expect(res).to.have.status(200)
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
            expect(res.body.humidity).to.equal(1)
            expect(res.body.temperature).to.equal(3)
            expect(res.body.sunlight).to.equal(2)
            expect(res.body.moisture).to.equal(4)
            expect(res.body.battery).to.equal(5) 
          })
    })
    .then(done, done)
  })
  it('without api_token: it should return a message about invalid API token', (done) => {
    const body = {}
    chai.request(server)
        .post('/api/nodes/' + theNode.id + '/latest_reading')
        .send(body)
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
    const body = {
      api_token: 'incorrect_api_token'  
    }
    chai.request(server)
        .post('/api/nodes/' + theNode.id + '/latest_reading')
        .send(body)
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
* /api/nodes/latest_readings/all
*/
describe('POST to /api/nodes/latest_readings/all - Test getting a node\'s latest reading', () => {
  let theUser = null
  let theNode1 = null
  let theNode2 = null
  before(() => { // create a new user, two nodes, and dummy readings
    return User.create({
      username: 'mocha_test_latest_readings_all',
      password: 'mocha_test_latest_readings_all',
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
      theNode1 = node
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
    .then(() => {
      return Node
        .create({
          ipaddress: '1.1.1.2',
          userId: theUser.id
        })
    .then(node => {
      theNode2 = node
      return Reading
        .create({
          humidity: 1,
          sunlight: 1,
          temperature: 1,
          moisture: 1,
          battery: 1,
          nodeId: node.id,
        })
      })
    })
  })
  after((done) => {
    theUser.destroy()
    theNode1.destroy()
    theNode2.destroy()
    done()
  })
  beforeEach(() => {})
  afterEach(() => {})
  it('it should return the nodes\' dummy readings in the response', (done) => {
    const body = {
      api_token: theUser.api_token
    }
    chai.request(server)
        .post('/api/nodes/latest_readings/all')
        .send(body)
        .end((err, res) => {
          if (err) console.trace(err)
          expect(res).to.have.status(200)
          expect(res.body).to.be.a('array')

          expect(res.body[0]).to.have.all.keys(['temperature', 'humidity', 'sunlight', 'moisture', 'id',
                                                'battery', 'nodeId', 'createdAt', 'updatedAt'])
                                              
          expect(res.body[1]).to.have.all.keys(['temperature', 'humidity', 'sunlight', 'moisture', 'id',
                                                'battery', 'nodeId', 'createdAt', 'updatedAt'])

          // Type Check
          expect(res.body[0].id).to.be.a('number')
          expect(res.body[0].humidity).to.be.a('number')
          expect(res.body[0].temperature).to.be.a('number')
          expect(res.body[0].sunlight).to.be.a('number')
          expect(res.body[0].moisture).to.be.a('number')
          expect(res.body[0].battery).to.be.null
          expect(res.body[0].createdAt).to.be.a('string')
          expect(res.body[0].updatedAt).to.be.a('string')
          expect(res.body[0].nodeId).to.be.a('number')
          
          expect(res.body[1].id).to.be.a('number')
          expect(res.body[1].humidity).to.be.a('number')
          expect(res.body[1].temperature).to.be.a('number')
          expect(res.body[1].sunlight).to.be.a('number')
          expect(res.body[1].moisture).to.be.a('number')
          expect(res.body[1].battery).to.be.a('number')
          expect(res.body[1].createdAt).to.be.a('string')
          expect(res.body[1].updatedAt).to.be.a('string')
          expect(res.body[1].nodeId).to.be.a('number')
          
          // Value Check
          expect(res.body[0].humidity).to.equal(0)
          expect(res.body[0].temperature).to.equal(0)
          expect(res.body[0].sunlight).to.equal(0)
          expect(res.body[0].moisture).to.equal(0)
          
          expect(res.body[1].humidity).to.equal(1)
          expect(res.body[1].temperature).to.equal(1)
          expect(res.body[1].sunlight).to.equal(1)
          expect(res.body[1].moisture).to.equal(1)
          expect(res.body[1].battery).to.equal(1)
          
          // Order Check
          expect(res.body[1].nodeId).to.be.greaterThan(res.body[0].nodeId)
                    
          done()
    })
  })
  it('it should return the nodes\' newest readings in the response', (done) => {
    const body = {
      api_token: theUser.api_token
    }
    Reading
      .create({
        humidity: 10,
        sunlight: 11,
        temperature: 12,
        moisture: 13,
        battery: 14,
        nodeId: theNode1.id,
      })
    .then(reading => {     
      chai.request(server)
          .post('/api/nodes/latest_readings/all')
          .send(body)
          .end((err, res) => {
            if (err) console.trace(err)
            expect(res).to.have.status(200)
            expect(res.body).to.be.a('array')
  
            expect(res.body[0]).to.have.all.keys(['temperature', 'humidity', 'sunlight', 'moisture', 'id',
                                                'battery', 'nodeId', 'createdAt', 'updatedAt'])
                                              
            expect(res.body[1]).to.have.all.keys(['temperature', 'humidity', 'sunlight', 'moisture', 'id',
                                                  'battery', 'nodeId', 'createdAt', 'updatedAt'])
  
            // Type Check
            expect(res.body[0].id).to.be.a('number')
            expect(res.body[0].humidity).to.be.a('number')
            expect(res.body[0].temperature).to.be.a('number')
            expect(res.body[0].sunlight).to.be.a('number')
            expect(res.body[0].moisture).to.be.a('number')
            expect(res.body[0].battery).to.be.a('number')
            expect(res.body[0].createdAt).to.be.a('string')
            expect(res.body[0].updatedAt).to.be.a('string')
            expect(res.body[0].nodeId).to.be.a('number')
            
            expect(res.body[1].id).to.be.a('number')
            expect(res.body[1].humidity).to.be.a('number')
            expect(res.body[1].temperature).to.be.a('number')
            expect(res.body[1].sunlight).to.be.a('number')
            expect(res.body[1].moisture).to.be.a('number')
            expect(res.body[1].battery).to.be.a('number')
            expect(res.body[1].createdAt).to.be.a('string')
            expect(res.body[1].updatedAt).to.be.a('string')
            expect(res.body[1].nodeId).to.be.a('number')
            
            // Value Check
            expect(res.body[0].humidity).to.equal(10)
            expect(res.body[0].temperature).to.equal(12)
            expect(res.body[0].sunlight).to.equal(11)
            expect(res.body[0].moisture).to.equal(13)
            expect(res.body[0].battery).to.equal(14)
            
            expect(res.body[1].humidity).to.equal(1)
            expect(res.body[1].temperature).to.equal(1)
            expect(res.body[1].sunlight).to.equal(1)
            expect(res.body[1].moisture).to.equal(1)
            expect(res.body[1].battery).to.equal(1)
                                    
            // Order Check
            expect(res.body[1].nodeId).to.be.greaterThan(res.body[0].nodeId)   
          })
    })
    .then(done, done)
  })
  it('without api_token: it should return a message about invalid API token', (done) => {
    const body = {}
    chai.request(server)
        .post('/api/nodes/latest_readings/all')
        .send(body)
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
    const body = {
      api_token: 'incorrect_api_token'  
    }
    chai.request(server)
        .post('/api/nodes/latest_readings/all')
        .send(body)
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
* /api/nodes/prev_24h/:nid
*/
describe('POST to /api/nodes/prev_24h/:nid - Test getting last 24 hours of a node\'s readings by the hour', () => {
  let theUser = null
  let theNode = null
  before(() => { // create a new user, node, and dummy reading
    return User.create({
      username: 'mocha_test_prev_24h',
      password: 'mocha_test_prev_24h'
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
  afterEach(() => {})
  it('it should build a list of the last 24 hours of readings for a node and return it in the response', (done) => {
    const body = {
      api_token: theUser.api_token,
    }
    chai.request(server)
        .post('/api/nodes/prev_24h/' + theNode.id)
        .send(body)
        .end((err, res) => {
          if (err) console.trace(err)
          expect(res).to.have.status(200)
          expect(res.body).to.be.a('array')

          // Check for dummy reading
          expect(res.body[0]).to.have.all.keys(['temperature', 'humidity', 'sunlight', 'moisture', 'id',
                                                  'battery', 'nodeId', 'createdAt', 'updatedAt'])

          // Type Check          
          expect(res.body[0].id).to.be.a('number')
          expect(res.body[0].humidity).to.be.a('number')
          expect(res.body[0].temperature).to.be.a('number')
          expect(res.body[0].sunlight).to.be.a('number')
          expect(res.body[0].moisture).to.be.a('number')
          expect(res.body[0].battery).to.be.null
          expect(res.body[0].createdAt).to.be.a('string')
          expect(res.body[0].updatedAt).to.be.a('string')
          expect(res.body[0].nodeId).to.be.a('number')

          // Value Check
          expect(res.body[0].humidity).to.equal(0)
          expect(res.body[0].temperature).to.equal(0)
          expect(res.body[0].sunlight).to.equal(0)
          expect(res.body[0].moisture).to.equal(0)
          expect(res.body.length).to.equal(1)
          
          done()
        })
  })
  it('without api_token: it should return a message about invalid API token', (done) => {
    const body = {}
    chai.request(server)
        .post('/api/nodes/latest_readings/all')
        .send(body)
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
    const body = {
      api_token: 'incorrect_api_token'  
    }
    chai.request(server)
        .post('/api/nodes/latest_readings/all')
        .send(body)
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