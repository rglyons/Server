/*
* all tests in this file test deprecated API endpoints that deal with
* nodes and readings.
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
      email: 'mocha_test_create_node',
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

          expect(res.body).to.have.all.keys(['id', 'username', 'email', 'nodeCount', 'nodes'])

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
* api_token in request body instead of Authorization header
*/
describe('PUT to /api/nodes/:nid - Test updating an existing node', () => {
  let theUser = null
  let theNode = null
  before(() => { // create a new user, node, and dummy reading
    return User.create({
      username: 'mocha_test_update_node',
      password: 'mocha_test_update_node',
      email: 'mocha_test_update_node',
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
* /api/nodes/:nid (PUT)
* updating a single node instead of offering only one node ID
* to the update function that can update multiple nodes
*/
describe('PUT to /api/nodes/:nid - Test updating an existing node', () => {
  let theUser = null
  let theNode = null
  before(() => { // create a new user, node, and dummy reading
    return User.create({
      username: 'mocha_test_update_node',
      password: 'mocha_test_update_node',
      email: 'mocha_test_update_node',
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
        .set('Authorization', theUser.api_token)
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
      name: '',
      groupName: ''
    }
    chai.request(server)
        .put('/api/nodes/' + theNode.id)
        .set('Authorization', theUser.api_token)
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
    const newNode = {}
    chai.request(server)
        .put('/api/nodes/' + theNode.id)
        .set('Authorization', theUser.api_token)
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
  it('as different user: it should return a message about not finding the node', () => {
    const newNode = {
      tempMin: 1,
    }
    return User
      .create({
        username: 'mocha_test_update_node_fake_user',
        password: 'mocha_test_update_node_fake_user',
        email: 'mocha_test_update_node_fake_user'
      })
    .then(user => {
      chai.request(server)
          .put('/api/nodes/' + theNode.id)
          .set('Authorization', user.api_token)
          .send(newNode)
          .end((err, res) => {
            expect(res).to.have.status(404)
            expect(res.body).to.be.a('object')
  
            expect(res.body).to.have.all.keys(['message'])
  
            // Type Check
            expect(res.body.message).to.be.a('string')
  
            // Value Check
            expect(res.body.message).to.equal('Node Not Found')
            
            return user.destroy()
          })
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
    const newNode = {}
    chai.request(server)
        .put('/api/nodes/' + theNode.id)
        .set('Authorization', 'wrong api_token')
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
    const newNode = {}
    chai.request(server)
        .put('/api/nodes/-1')
        .set('Authorization', theUser.api_token)
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
      email: 'mocha_test_delete_node',
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
