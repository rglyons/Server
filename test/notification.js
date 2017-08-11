/* eslint no-undef:0 */
/* eslint no-unused-expressions:0 */

// tests dealing directly with notifications.

// Require the dev-dependencies
const User = require('../server/models').User
const Node = require('../server/models').Node
const Reading = require('../server/models').Reading
const Notification = require('../server/models').Notification
const chai = require('chai')
const chaiHttp = require('chai-http')
const chaiSubset = require('chai-subset')
const server = require('../app')
const expect = chai.expect
chai.use(chaiHttp)
chai.use(chaiSubset)

/* 
* /api/notifications
*/
describe('POST to /api/notifications - test creating a new notification', () => {
  let theUser = null
  let theNode = null
  let theNotification = null
  before(() => { 
    return User.create({
      username: 'mocha_test_create_notification',
      password: 'mocha_test_create_notification',
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
    })
    .then(node => {
      theNode = node
    })
  })
  after(() => {
    theUser.destroy()
    theNode.destroy()
  })
  beforeEach(() => {})
  afterEach(() => {
    Notification.destroy({ where: {
      id: theNotification.id
    }})
  })
  it('with all required+optional data - it should create and return a new notification', (done) => {
    notification = {
      sensor: 'humidity',
      overMax: true,
      reading: 12
    }
    chai.request(server)
      .post('/api/notifications?nodeId=' + theNode.id)
      .set('Authorization', theUser.api_token)
      .send(notification)
      .end((err, res) => {
        if (err) console.trace(err)
        expect(res).to.have.status(201)
        expect(res.body).to.be.a('object')
        
        expect(res.body).to.have.all.keys([ 'dismissed', 'underMin', 'overMax', 'id',
                                            'reading', 'sensor', 'nodeId', 'userId', 
                                            'createdAt', 'updatedAt'])

        // Type Check
        expect(res.body.dismissed).to.be.a('boolean')
        expect(res.body.underMin).to.be.a('boolean')
        expect(res.body.overMax).to.be.a('boolean')
        expect(res.body.reading).to.be.a('number')
        expect(res.body.id).to.be.a('number')
        expect(res.body.nodeId).to.be.a('number')
        expect(res.body.userId).to.be.a('number')
        expect(res.body.createdAt).to.be.a('string')
        expect(res.body.updatedAt).to.be.a('string')

        // Value Check
        expect(res.body.userId).to.equal(theUser.id)
        expect(res.body.nodeId).to.equal(theNode.id)
        expect(res.body.dismissed).to.equal(false)
        expect(res.body.underMin).to.equal(false)
        expect(res.body.overMax).to.equal(true)
        expect(res.body.reading).to.equal(12)
        expect(res.body.sensor).to.equal('humidity')
        expect(res.body.underMin).to.equal(!res.body.overMax)
        
        theNotification = res.body
        
        done()
      })
  })
  it('with only required data - it should create and return a new notification', (done) => {
    notification = {
      sensor: 'humidity',
      overMax: true
    }
    chai.request(server)
      .post('/api/notifications?nodeId=' + theNode.id)
      .set('Authorization', theUser.api_token)
      .send(notification)
      .end((err, res) => {
        if (err) console.trace(err)
        expect(res).to.have.status(201)
        expect(res.body).to.be.a('object')
        
        expect(res.body).to.have.all.keys([ 'dismissed', 'underMin', 'overMax', 'id',
                                            'reading', 'sensor', 'nodeId', 'userId', 
                                            'createdAt', 'updatedAt'])

        // Type Check
        expect(res.body.dismissed).to.be.a('boolean')
        expect(res.body.underMin).to.be.a('boolean')
        expect(res.body.overMax).to.be.a('boolean')
        expect(res.body.reading).to.be.null
        expect(res.body.id).to.be.a('number')
        expect(res.body.nodeId).to.be.a('number')
        expect(res.body.userId).to.be.a('number')
        expect(res.body.createdAt).to.be.a('string')
        expect(res.body.updatedAt).to.be.a('string')

        // Value Check
        expect(res.body.userId).to.equal(theUser.id)
        expect(res.body.nodeId).to.equal(theNode.id)
        expect(res.body.dismissed).to.equal(false)
        expect(res.body.underMin).to.equal(false)
        expect(res.body.overMax).to.equal(true)
        expect(res.body.sensor).to.equal('humidity')
        expect(res.body.underMin).to.equal(!res.body.overMax)
        
        theNotification = res.body
        
        done()
      })
  })
  it('with incorrect sensor value  - it should return an error message', (done) => {
    notification = {
      sensor: 'incorrect value',
      overMax: true
    }
    chai.request(server)
      .post('/api/notifications?nodeId=' + theNode.id)
      .set('Authorization', theUser.api_token)
      .send(notification)
      .end((err, res) => {
        expect(res).to.have.status(400)
        expect(res.body).to.have.all.keys([ 'name', 'message', 'errors'])
        
        // Type Check
        expect(res.body.name).to.be.a('string')
        expect(res.body.message).to.be.a('string')
        expect(res.body.errors).to.be.a('array')

        // Value Check
        expect(res.body.name).to.equal('SequelizeValidationError')
        expect(res.body.message).to.equal('Validation error: Value for sensor field must be "temperature", "moisture", "humidity", or "sunlight"')
        expect(res.body.errors.length).to.equal(1)        
        
        done()
      })
  })
  it('without underMin/overMax - it should return an error message', (done) => {
    notification = {
      sensor: 'temperature'
    }
    chai.request(server)
      .post('/api/notifications?nodeId=' + theNode.id)
      .set('Authorization', theUser.api_token)
      .send(notification)
      .end((err, res) => {
        expect(res).to.have.status(400)
        expect(res.body).to.have.all.keys([ 'name', 'message', 'errors'])
        
        // Type Check
        expect(res.body.name).to.be.a('string')
        expect(res.body.message).to.be.a('string')
        expect(res.body.errors).to.be.a('array')

        // Value Check
        expect(res.body.name).to.equal('SequelizeValidationError')
        expect(res.body.message).to.equal('Validation error: overMax cannot equal underMin!')
        expect(res.body.errors.length).to.equal(1)        
        
        done()
      })
  })
  it('without sensor - it should return an error message', (done) => {
    notification = {
      overMax: true
    }
    chai.request(server)
      .post('/api/notifications?nodeId=' + theNode.id)
      .set('Authorization', theUser.api_token)
      .send(notification)
      .end((err, res) => {
        expect(res).to.have.status(400)
        expect(res.body).to.have.all.keys([ 'name', 'message', 'errors'])
        
        // Type Check
        expect(res.body.name).to.be.a('string')
        expect(res.body.message).to.be.a('string')
        expect(res.body.errors).to.be.a('array')

        // Value Check
        expect(res.body.name).to.equal('SequelizeValidationError')
        expect(res.body.message).to.equal('notNull Violation: sensor cannot be null')
        expect(res.body.errors.length).to.equal(1)        
        
        done()
      })
  })
  it('without api_token: it should return a message about invalid API token', (done) => {
    const notification = { }
    chai.request(server)
      .post('/api/notifications?nodeId=' + theNode.id)
      .send(notification)
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
    const notification = {}
    chai.request(server)
      .post('/api/notifications?nodeId=' + theNode.id)
      .set('Authorization', 'wrong api_token')
      .send(notification)
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
* /api/notifications/all
*/
describe('GET to /api/notifications/all - test getting all of a user\'s notifications', () => {
  let theUser = null
  let theNode = null
  let theNotification = null
  before(() => { 
    return User.create({
      username: 'mocha_test_get_all_notifications',
      password: 'mocha_test_get_all_notifications',
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
    })
    .then(node => {
      theNode = node
      return Notification
        .create({
          sensor: 'temperature',
          overMax: true,
          reading: 12,
          nodeId: theNode.id,
          userId: theUser.id
        })
    }).then(notification => {
      theNotification = notification
    })
  })
  after(() => {
    theUser.destroy()
    theNode.destroy()
  })
  beforeEach(() => {})
  afterEach(() => {})
  it('it should return a list of notifications for the user', (done) => {
    chai.request(server)
      .get('/api/notifications/all')
      .set('Authorization', theUser.api_token)
      .end((err, res) => {
        if (err) console.trace(err)
        expect(res).to.have.status(200)
        expect(res.body).to.be.a('array')
        
        expect(res.body[0]).to.have.all.keys(['dismissed', 'underMin', 'overMax', 'id',
                                              'reading', 'sensor', 'nodeId', 'userId', 
                                              'createdAt', 'updatedAt'])
  
        // Type Check
        expect(res.body[0].dismissed).to.be.a('boolean')
        expect(res.body[0].underMin).to.be.a('boolean')
        expect(res.body[0].overMax).to.be.a('boolean')
        expect(res.body[0].reading).to.be.a('number')
        expect(res.body[0].id).to.be.a('number')
        expect(res.body[0].nodeId).to.be.a('number')
        expect(res.body[0].userId).to.be.a('number')
        expect(res.body[0].createdAt).to.be.a('string')
        expect(res.body[0].updatedAt).to.be.a('string')
  
        // Value Check
        expect(res.body[0].userId).to.equal(theUser.id)
        expect(res.body[0].nodeId).to.equal(theNode.id)
        expect(res.body[0].dismissed).to.equal(false)
        expect(res.body[0].underMin).to.equal(false)
        expect(res.body[0].overMax).to.equal(true)
        expect(res.body[0].reading).to.equal(12)
        expect(res.body[0].sensor).to.equal('temperature')
        expect(res.body[0].underMin).to.equal(!res.body[0].overMax)
                
        done()
      })
  })
  it('it should return a list of notifications for the user, even dismissed notifications', (done) => {
    theNotification.update({
      dismissed: true
    })
    .then(() => {
      chai.request(server)
        .get('/api/notifications/all')
        .set('Authorization', theUser.api_token)
        .end((err, res) => {
          if (err) console.trace(err)
          expect(res).to.have.status(200)
          expect(res.body).to.be.a('array')
          
          expect(res.body[0]).to.have.all.keys(['dismissed', 'underMin', 'overMax', 'id',
                                                'reading', 'sensor', 'nodeId', 'userId', 
                                                'createdAt', 'updatedAt'])
    
          // Type Check
          expect(res.body[0].dismissed).to.be.a('boolean')
          expect(res.body[0].underMin).to.be.a('boolean')
          expect(res.body[0].overMax).to.be.a('boolean')
          expect(res.body[0].reading).to.be.a('number')
          expect(res.body[0].id).to.be.a('number')
          expect(res.body[0].nodeId).to.be.a('number')
          expect(res.body[0].userId).to.be.a('number')
          expect(res.body[0].createdAt).to.be.a('string')
          expect(res.body[0].updatedAt).to.be.a('string')
    
          // Value Check
          expect(res.body[0].userId).to.equal(theUser.id)
          expect(res.body[0].nodeId).to.equal(theNode.id)
          expect(res.body[0].dismissed).to.equal(true)
          expect(res.body[0].underMin).to.equal(false)
          expect(res.body[0].overMax).to.equal(true)
          expect(res.body[0].reading).to.equal(12)
          expect(res.body[0].sensor).to.equal('temperature')
          expect(res.body[0].underMin).to.equal(!res.body[0].overMax)
                  
          done()
        })
    })
  })
  it('without api_token: it should return a message about invalid API token', (done) => {
    chai.request(server)
      .get('/api/notifications/all')
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
      .get('/api/notifications/all')
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
* /api/notifications/undismissed
*/
describe('GET to /api/notifications/undismissed - test getting all of a user\'s undismissed notifications', () => {
  let theUser = null
  let theNode = null
  let theNotification = null
  before(() => { 
    return User.create({
      username: 'mocha_test_get_all_undismissed',
      password: 'mocha_test_get_all_undismissed',
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
    })
    .then(node => {
      theNode = node
      return Notification
        .create({
          sensor: 'temperature',
          overMax: true,
          reading: 12,
          nodeId: theNode.id,
          userId: theUser.id
        })
    }).then(notification => {
      theNotification = notification
    })
  })
  after(() => {
    theUser.destroy()
    theNode.destroy()
  })
  beforeEach(() => {})
  afterEach(() => {})
  it('it should return a list of undismissed notifications for the user', (done) => {
    chai.request(server)
      .get('/api/notifications/undismissed')
      .set('Authorization', theUser.api_token)
      .end((err, res) => {
        if (err) console.trace(err)
        expect(res).to.have.status(200)
        expect(res.body).to.be.a('array')
        
        expect(res.body[0]).to.have.all.keys(['dismissed', 'underMin', 'overMax', 'id',
                                              'reading', 'sensor', 'nodeId', 'userId', 
                                              'createdAt', 'updatedAt'])
  
        // Type Check
        expect(res.body[0].dismissed).to.be.a('boolean')
        expect(res.body[0].underMin).to.be.a('boolean')
        expect(res.body[0].overMax).to.be.a('boolean')
        expect(res.body[0].reading).to.be.a('number')
        expect(res.body[0].id).to.be.a('number')
        expect(res.body[0].nodeId).to.be.a('number')
        expect(res.body[0].userId).to.be.a('number')
        expect(res.body[0].createdAt).to.be.a('string')
        expect(res.body[0].updatedAt).to.be.a('string')
  
        // Value Check
        expect(res.body[0].userId).to.equal(theUser.id)
        expect(res.body[0].nodeId).to.equal(theNode.id)
        expect(res.body[0].dismissed).to.equal(false)
        expect(res.body[0].underMin).to.equal(false)
        expect(res.body[0].overMax).to.equal(true)
        expect(res.body[0].reading).to.equal(12)
        expect(res.body[0].sensor).to.equal('temperature')
        expect(res.body[0].underMin).to.equal(!res.body[0].overMax)
                
        done()
      })
  })
  it('it should return an empty list for the user', (done) => {
    theNotification.update({
      dismissed: true
    })
    .then(() => {
      chai.request(server)
        .get('/api/notifications/undismissed')
        .set('Authorization', theUser.api_token)
        .end((err, res) => {
          if (err) console.trace(err)
          expect(res).to.have.status(200)
          expect(res.body).to.be.a('array')
          
          expect(res.body.length).to.equal(0)
                  
          done()
        })
    })
  })
  it('without api_token: it should return a message about invalid API token', (done) => {
    chai.request(server)
      .get('/api/notifications/undismissed')
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
      .get('/api/notifications/undismissed')
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
* /api/notifications/:nid (PUT)
*/
describe('PUT to /api/notifications/:nid - test updating a notification', () => {
  let theUser = null
  let theNode = null
  let theNotification = null
  before(() => { 
    return User.create({
      username: 'mocha_test_update_notification',
      password: 'mocha_test_update_notification',
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
    })
    .then(node => {
      theNode = node
      return Notification
        .create({
          sensor: 'temperature',
          overMax: true,
          reading: 12,
          nodeId: theNode.id,
          userId: theUser.id
        })
    }).then(notification => {
      theNotification = notification
    })
  })
  after(() => {
    theUser.destroy()
    theNode.destroy()
  })
  beforeEach(() => {})
  afterEach(() => {
    return Notification.update({
        dismissed: false,
        overMax: true
    }, { where : {
      id: theNotification.id
    }})
  })
  it('with optional data - it should update and return the notification', (done) => {
    notification = {
      dismissed: true
    }
    chai.request(server)
    .put('/api/notifications/' + theNotification.id)
      .set('Authorization', theUser.api_token)
      .send(notification)
      .end((err, res) => {
        if (err) console.trace(err)
        expect(res).to.have.status(200)
        expect(res.body).to.be.a('object')
        
        expect(res.body).to.have.all.keys(['dismissed', 'underMin', 'overMax', 'id',
                                              'reading', 'sensor', 'nodeId', 'userId', 
                                              'createdAt', 'updatedAt'])
  
        // Type Check
        expect(res.body.dismissed).to.be.a('boolean')
        expect(res.body.underMin).to.be.a('boolean')
        expect(res.body.overMax).to.be.a('boolean')
        expect(res.body.reading).to.be.a('number')
        expect(res.body.id).to.be.a('number')
        expect(res.body.nodeId).to.be.a('number')
        expect(res.body.userId).to.be.a('number')
        expect(res.body.createdAt).to.be.a('string')
        expect(res.body.updatedAt).to.be.a('string')
  
        // Value Check
        expect(res.body.userId).to.equal(theUser.id)
        expect(res.body.nodeId).to.equal(theNode.id)
        expect(res.body.dismissed).to.equal(true)
        expect(res.body.underMin).to.equal(false)
        expect(res.body.overMax).to.equal(true)
        expect(res.body.reading).to.equal(12)
        expect(res.body.sensor).to.equal('temperature')
        expect(res.body.underMin).to.equal(!res.body.overMax)
                
        done()
      })
  })
  it('without optional data - it should not update the notification, just return it', (done) => {
    notification = {}
    chai.request(server)
      .put('/api/notifications/' + theNotification.id)
      .set('Authorization', theUser.api_token)
      .send(notification)
      .end((err, res) => {
        if (err) console.trace(err)
        expect(res).to.have.status(200)
        expect(res.body).to.be.a('object')
        
        expect(res.body).to.have.all.keys([ 'dismissed', 'underMin', 'overMax', 'id',
                                            'reading', 'sensor', 'nodeId', 'userId', 
                                            'createdAt', 'updatedAt'])
  
        // Type Check
        expect(res.body.dismissed).to.be.a('boolean')
        expect(res.body.underMin).to.be.a('boolean')
        expect(res.body.overMax).to.be.a('boolean')
        expect(res.body.reading).to.be.a('number')
        expect(res.body.id).to.be.a('number')
        expect(res.body.nodeId).to.be.a('number')
        expect(res.body.userId).to.be.a('number')
        expect(res.body.createdAt).to.be.a('string')
        expect(res.body.updatedAt).to.be.a('string')
  
        // Value Check
        expect(res.body.userId).to.equal(theUser.id)
        expect(res.body.nodeId).to.equal(theNode.id)
        expect(res.body.dismissed).to.equal(false)
        expect(res.body.underMin).to.equal(false)
        expect(res.body.overMax).to.equal(true)
        expect(res.body.reading).to.equal(12)
        expect(res.body.sensor).to.equal('temperature')
        expect(res.body.underMin).to.equal(!res.body.overMax)
                
        done()
      })
  })
  it('without api_token: it should return a message about invalid API token', (done) => {
    chai.request(server)
      .put('/api/notifications/' + theNotification.id)
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
      .put('/api/notifications/' + theNotification.id)
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
* /api/notifications/:nid (DELETE)
*/
describe('DELETE to /api/notifications/:nid - Test deleting a notification', () => {
  let theUser = null
  let theNode = null
  let theNotification = null
  before(() => { 
    return User.create({
      username: 'mocha_test_update_notification',
      password: 'mocha_test_update_notification',
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
    })
    .then(node => {
      theNode = node
      return Notification
        .create({
          sensor: 'temperature',
          overMax: true,
          reading: 12,
          nodeId: theNode.id,
          userId: theUser.id
        })
    }).then(notification => {
      theNotification = notification
    })
  })
  after(() => {
    theUser.destroy()
    theNode.destroy()
  })
  beforeEach(() => {})
  afterEach(() => {})
  it('with required data: it should delete the notification and return no content', (done) => {
    chai.request(server)
        .delete('/api/notifications/' + theNotification.id)
        .set('Authorization', theUser.api_token)
        .end((err, res) => {
          if (err) console.trace(err)
          expect(res).to.have.status(204)
                    
          done()
        })
  })
  it('without api_token: it should return a message about invalid API token', (done) => {
    chai.request(server)
        .delete('/api/nodes/' + theNode.id)
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
        .delete('/api/nodes/' + theNode.id)
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
* notification auto-generation
*/
describe('Test posting a bad reading and generating a new notification', () => {
  let theUser = null
  let theNode = null
  let theNotification = null
  before(() => { // create user, node, bad reading to generate notifications
    return User.create({
      username: 'mocha_test_generate_notification',
      password: 'mocha_test_generate_notification',
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
    })
    .then(node => {
      theNode = node
      return node.update({
        tempMin: 20,
        tempMax: 30,
        humidityMin: 20,
        humidityMax: 30
      })
    })
    .then(node => { 
      Reading // this reading should generate an overMax temperature notification
        .create({
          humidity: 25,
          sunlight: 50,
          temperature: 40,
          moisture: 50,
          battery: null,
          nodeId: node.id,
        })
        return Reading  // this reading should generate an underMin humidity notification
          .create({
            humidity: 10,
            sunlight: 50,
            temperature: 25,
            moisture: 50,
            battery: null,
            nodeId: node.id,
          })
    })
  })
  after(() => {
    theUser.destroy()
    theNode.destroy()
  })
  beforeEach(() => {})
  afterEach(() => {})
  it('it should return the user with the newly generated notifications included', (done) => {
    user = {
      username: 'mocha_test_generate_notification',
      password: 'mocha_test_generate_notification'
    }
    chai.request(server)
      .post('/api/users/login')
      .send(user)
      .end((err, res) => {
        if (err) console.trace(err)
        expect(res).to.have.status(200)
        expect(res.body).to.be.a('object')
        
        expect(res.body).to.have.all.keys([ 'id', 'username', 'password', 'nodeCount', 'api_token',
                                            'createdAt', 'updatedAt', 'nodes', 'notifications'])

        // Type Check
        expect(res.body.username).to.be.a('string')
        expect(res.body.password).to.be.null
        expect(res.body.nodeCount).to.be.a('number')
        expect(res.body.api_token).to.be.a('string')
        expect(res.body.id).to.be.a('number')
        expect(res.body.nodes).to.be.a('array')
        expect(res.body.notifications).to.be.a('array')
        expect(res.body.createdAt).to.be.a('string')
        expect(res.body.updatedAt).to.be.a('string')

        // Value Check
        expect(res.body.nodeCount).to.equal(1)
        expect(res.body.nodes.length).to.equal(1)
        expect(res.body.notifications.length).to.equal(2)
        
        // consistency of notification order is questionable
        expect(res.body.notifications[0].sensor).to.equal('temperature')
        expect(res.body.notifications[0].overMax).to.equal(true)
        expect(res.body.notifications[0].underMin).to.equal(false)
        expect(res.body.notifications[0].reading).to.equal(40)
        expect(res.body.notifications[0].dismissed).to.equal(false)
        
        expect(res.body.notifications[1].sensor).to.equal('humidity')
        expect(res.body.notifications[1].overMax).to.equal(false)
        expect(res.body.notifications[1].underMin).to.equal(true)
        expect(res.body.notifications[1].reading).to.equal(10)
        expect(res.body.notifications[1].dismissed).to.equal(false)
        
        Notification.destroy({ where: {
          id: res.body.notifications[0].id
        }})
        
         Notification.destroy({ where: {
          id: res.body.notifications[1].id
        }})
        
        done()
      })
  })
})
