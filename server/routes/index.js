const readingsController = require('../controllers').reading
const nodesController = require('../controllers').node
const usersController = require('../controllers').user
const notificationsController = require('../controllers').notification
const auth = require('../auth').auth

module.exports = (app) => {
  app.get('/api', (req, res) => res.status(200).send({
    message: 'Welcome to the Smart Irrigation API!'
  }))

  // nodes & readings
  app.post('/api/nodes', auth.validate, nodesController.create) // create node under user
  app.get('/api/nodes/all', nodesController.list) // list all nodes
  app.get('/api/nodes/:nid', nodesController.getNodeById) // retrieve node + readings
  app.post('/api/nodes/:nid/new_reading', readingsController.create) // create reading for node
  app.put('/api/nodes/update?', auth.validate, nodesController.updateMultipleNodes) // update fields of one or more nodes
  app.delete('/api/nodes/:nid', auth.validate, nodesController.destroy) // delete node

  // users
  app.post('/api/users/login', auth.login) // login user
  app.post('/api/users', usersController.create) // want to replace this route with the two routes below - init user obj, send and verify email -> create user
  app.post('/api/users/email', usersController.initNewUser) // store user info for creating new user, send verification email
  app.get('/api/verify?', usersController.verifyUserEmail)
  app.put('/api/users/update', auth.validate, usersController.update) // update user fields
  app.put('/api/users/token', auth.validate, usersController.generateApiToken) // generate new api token for existing user
  app.get('/api/users/getuser', auth.validate, usersController.getUser) // retrieve user + nodes
  app.delete('/api/users/delete', auth.validate, usersController.destroy) // delete user
  
  // notifications
  app.post('/api/notifications?', auth.validate, notificationsController.create) // create notification under user & node
  app.get('/api/notifications/all', auth.validate, notificationsController.getAllNotificationsForUser) // get all notifications for user
  app.get('/api/notifications/undismissed', auth.validate, notificationsController.getUndismissedNotificationsForUser) // get undismissed notifications for user
  app.put('/api/notifications/:nid', auth.validate, notificationsController.update) // update notification fields
  app.delete('/api/notifications/:nid', auth.validate, notificationsController.destroy) // create notification under user & node

  // other methods
  app.get('/api/nodes/:nid/latest_reading',
            auth.validate, nodesController.getLatestNodeReading) // retrieve latest reading for one of a user's nodes
  app.get('/api/nodes/latest_readings/all',
            auth.validate, nodesController.getLatestNodeReadingsForUser) // retrieve latest reading for each of a user's nodes
  app.get('/api/nodes/prev_24h/:nid?', auth.validate, nodesController.getLast24hrsOfReadingsForNode) // retrieve the last 24 hrs of readings for a node
  app.get('/api/nodes/prev_xh/:nid?', auth.validate, nodesController.getLastXhrsOfReadingsForNode) // retrieve the last x hrs of readings for a node
  
  // deprecated
  app.put('/api/nodes/:nid', auth.validate, nodesController.updateOneNode) // update fields of one node
  app.post('/api/users/getuser', auth.validate, usersController.getUser) // retrieve user + nodes
  app.post('/api/nodes/:nid/latest_reading',
            auth.validate, nodesController.getLatestNodeReading) // retrieve latest reading for one of a user's nodes
  app.post('/api/nodes/latest_readings/all',
            auth.validate, nodesController.getLatestNodeReadingsForUser) // retrieve latest reading for each of a user's nodes
  app.post('/api/nodes/prev_24h/:nid', auth.validate, nodesController.getLast24hrsOfReadingsForNode) // retrieve the last 24 hrs of readings for a node
  
}
