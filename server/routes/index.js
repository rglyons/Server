const readingsController = require('../controllers').reading;
const nodesController = require('../controllers').node;
const usersController = require('../controllers').user;
const auth = require('../auth').auth;

module.exports = (app) => {
  app.get('/api', (req, res) => res.status(200).send({
    message: 'Welcome to the Smart Irrigation API!',
  }));

  // nodes & entries
  app.post('/api/nodes', auth.validate, nodesController.create); //create node under user
  app.get('/api/nodes/all', nodesController.list); // list all nodes
  app.get('/api/nodes/:nid', nodesController.getNodeById); // retrieve node + readings
  app.post('/api/nodes/:nid/readings', readingsController.create); // create reading for node
  app.put('/api/nodes/:nid', auth.validate, nodesController.update); // update node fields
  app.delete('/api/nodes/:nid', auth.validate, nodesController.destroy); // delete node

  // users
  app.post('/api/users/login', auth.login); // login user
  app.post('/api/users', usersController.create); //create user
  app.put('/api/users/update', auth.validate, usersController.update); // update user fields
  app.put('/api/users/token', auth.validate, usersController.generateApiToken); // generate new api token for existing user
  app.post('/api/users/getuser', auth.validate, usersController.getUser); // retrieve user + nodes
  app.delete('/api/users/delete', auth.validate, usersController.destroy); // delete user

  //other methods
  app.post('/api/nodes/:nid/latest_reading',
            auth.validate, nodesController.getLatestNodeReading); // retrieve latest reading for one of a user's nodes
            
  app.post('/api/nodes/latest_readings/all',
            auth.validate, nodesController.getLatestNodeReadingsForUser); // retrieve latest reading for each of a user's nodes
            
  app.post('/api/nodes/prev_24h/:nid', auth.validate, nodesController.getLast24hrsOfReadingsForNode); // retrieve the last 24 hrs of readings for a node
};
