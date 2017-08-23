/* eslint no-undef:0 */
/* eslint no-unused-expressions:0 */

// tests not dealing directly with users, nodes, or readings.
// general test file

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
* /api/nodes/:nid/latest_reading
*/
describe('GET to /api/nodes/:nid/latest_reading - Test getting a node\'s latest reading', (done) => {
  let theUser = null
  let theNode = null
  before(() => { // create a new user, node, and dummy reading
    return User.create({
      username: 'mocha_test_latest_reading',
      password: 'mocha_test_latest_reading',
      email: 'mocha_test_latest_reading',
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
    chai.request(server)
        .get('/api/nodes/' + theNode.id + '/latest_reading')
        .set('Authorization', theUser.api_token)
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
          .get('/api/nodes/' + theNode.id + '/latest_reading')
          .set('Authorization', theUser.api_token)
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
    chai.request(server)
        .get('/api/nodes/' + theNode.id + '/latest_reading')
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
    chai.request(server)
        .get('/api/nodes/' + theNode.id + '/latest_reading')
        .set('Authorization', 'wrong api_token')
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
describe('GET to /api/nodes/latest_readings/all - Test getting a node\'s latest reading', () => {
  let theUser = null
  let theNode1 = null
  let theNode2 = null
  before(() => { // create a new user, two nodes, and dummy readings
    return User.create({
      username: 'mocha_test_latest_readings_all',
      password: 'mocha_test_latest_readings_all',
      email: 'mocha_test_latest_readings_all',
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
    chai.request(server)
        .get('/api/nodes/latest_readings/all')
        .set('Authorization', theUser.api_token)
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
          .get('/api/nodes/latest_readings/all')
          .set('Authorization', theUser.api_token)
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
    chai.request(server)
        .get('/api/nodes/latest_readings/all')
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
    chai.request(server)
        .get('/api/nodes/latest_readings/all')
        .set('Authorization', 'wrong api_token')
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
describe('GET to /api/nodes/prev_24h/:nid - Test getting all readings for node within the last 24 hours', () => {
  let theUser = null
  let theNode = null
  let readingCreationTime = null
  before(() => { // create a new user, node, and dummy reading
    return User.create({
      username: 'mocha_test_prev_24h',
      password: 'mocha_test_prev_24h',
      email: 'mocha_test_prev_24h'
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
    chai.request(server)
        .get('/api/nodes/prev_24h/' + theNode.id)
        .set('Authorization', theUser.api_token)
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
          
          readingCreationTime = res.body[0].createdAt   // for timestamp query test
          
          done()
        })
  })
  it('with in-range optional timestamp - it should build a list of the last 24 hours of readings for a node and return it in the response', (done) => {
    chai.request(server)
        .get('/api/nodes/prev_24h/' + theNode.id + '?timestamp=' + readingCreationTime)
        .set('Authorization', theUser.api_token)
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
  it('with out-of-range optional timestamp - it should return an empty list of readings in the response', (done) => {
    chai.request(server)
        .get('/api/nodes/prev_24h/' + theNode.id + '?timestamp=2017-07-29 21:23:08.986+00')
        .set('Authorization', theUser.api_token)
        .end((err, res) => {
          if (err) console.trace(err)
          expect(res).to.have.status(200)
          expect(res.body).to.be.a('array')
          
          // Value Check
          expect(res.body.length).to.equal(0)
          
          done()
        })
  })
  it('node doesn\'t belong to requesting user - it should return an error message', () => {
    return User
      .create({
        username: 'mocha_test_prev_24h_fake_user',
        password: 'mocha_test_prev_24h_fake_user',
        email: 'mocha_test_prev_24h_fake_user'
      })
    .then(user => {
      chai.request(server)
          .get('/api/nodes/prev_24h/' + theNode.id)
          .set('Authorization', user.api_token)
          .end((err, res) => {
            expect(res).to.have.status(404)
            expect(res.body).to.be.a('object')
            
            expect(res.body).to.have.all.keys(['message'])
            
            // Type Check          
            expect(res.body.message).to.be.a('string')
  
            // Value Check
            expect(res.body.message).to.equal('User with id ' + user.id + ' does not own node with id ' + theNode.id)
            
            return user.destroy()
          })
    })
  })
  it('without api_token: it should return a message about invalid API token', (done) => {
    chai.request(server)
        .get('/api/nodes/prev_24h/' + theNode.id)
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
    chai.request(server)
        .get('/api/nodes/prev_24h/' + theNode.id)
        .set('Authorization', 'wrong api_token')
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
* /api/nodes/prev_xh/:nid
*/
describe('GET to /api/nodes/prev_xh/:nid - Test getting all readings for node within the last x hours', () => {
  let theUser = null
  let theNode = null
  let readingCreationTime = null
  before(() => { // create a new user, node, and dummy reading
    return User.create({
      username: 'mocha_test_prev_xh',
      password: 'mocha_test_prev_xh',
      email: 'mocha_test_prev_xh'
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
  it('it should build a list of the last 10 hours of readings for a node and return it in the response', (done) => {
    chai.request(server)
        .get('/api/nodes/prev_xh/' + theNode.id + '?hours=10')
        .set('Authorization', theUser.api_token)
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
          
          readingCreationTime = res.body[0].createdAt   // for timestamp query test
          
          done()
        })
  })
  it('with in-range optional timestamp - it should build a list of the last 10 hours of readings for a node and return it in the response', (done) => {
    chai.request(server)
        .get('/api/nodes/prev_xh/' + theNode.id + '?hours=10&timestamp=' + readingCreationTime)
        .set('Authorization', theUser.api_token)
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
  it('with out-of-range optional timestamp - it should return an empty list of readings in the response', (done) => {
    chai.request(server)
        .get('/api/nodes/prev_xh/' + theNode.id + '?hours=10&timestamp=2017-07-29 21:23:08.986+00')
        .set('Authorization', theUser.api_token)
        .end((err, res) => {
          if (err) console.trace(err)
          expect(res).to.have.status(200)
          expect(res.body).to.be.a('array')
          
          // Value Check
          expect(res.body.length).to.equal(0)
          
          done()
        })
  })
  it('node doesn\'t belong to requesting user - it should return an error message', () => {
    return User
      .create({
        username: 'mocha_test_prev_xh_fake_user',
        password: 'mocha_test_prev_xh_fake_user',
        email: 'mocha_test_prev_xh_fake_user'
      })
    .then(user => {
      chai.request(server)
          .get('/api/nodes/prev_xh/' + theNode.id + '?hours=10')
          .set('Authorization', user.api_token)
          .end((err, res) => {
            expect(res).to.have.status(404)
            expect(res.body).to.be.a('object')
            
            expect(res.body).to.have.all.keys(['message'])
            
            // Type Check          
            expect(res.body.message).to.be.a('string')
  
            // Value Check
            expect(res.body.message).to.equal('User with id ' + user.id + ' does not own node with id ' + theNode.id)
            
            return user.destroy()
          })
    })
  })
  it('without api_token: it should return a message about invalid API token', (done) => {
    chai.request(server)
        .get('/api/nodes/prev_xh/' + theNode.id + '?hours=10')
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
    chai.request(server)
        .get('/api/nodes/prev_xh/' + theNode.id + '?hours=10')
        .set('Authorization', 'wrong api_token')
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
