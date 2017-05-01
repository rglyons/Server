const entriesController = require('../controllers').entry;
const sensorsController = require('../controllers').sensor;
const usersController = require('../controllers').user;
const auth = require('../auth').auth;

module.exports = (app) => {
  app.get('/api', (req, res) => res.status(200).send({
    message: 'Welcome to the Smart Irrigation API!',
  }));

  // sensors & entries
  app.post('/api/sensors', auth.validate, sensorsController.create); //create sensor under user
  app.get('/api/sensors/all', sensorsController.list); // list all sensors
  app.get('/api/sensors/:sid', sensorsController.getSensorById); // retrieve sensor + entries
  app.get('/api/sensors/ip/:ip', sensorsController.getSensorByIP); // retrieve sensor + entries
  app.post('/api/sensors/:sid/entries', entriesController.create); // create entry for sensor
  app.put('/api/sensors/:sid', auth.validate, sensorsController.update); // update sensor fields
  app.delete('/api/sensors/:sid', auth.validate, sensorsController.destroy); // delete sensor
  
  // users
  app.post('/api/users/login', auth.login); // login user
  app.post('/api/users', usersController.create); //create user
  app.put('/api/users/update', auth.validate, usersController.update); // update user fields
  app.put('/api/users/token', auth.validate, usersController.generateApiToken); // generate new api token for existing user
  app.post('/api/users/getuser', auth.validate, usersController.getUser); // retrieve user + sensors
  app.post('/api/users/sensor_readings', 
            auth.validate, sensorsController.getLatestSensorReadingsForUser); // retrieve latest reading for each of a user's sensors
  app.delete('/api/users/delete', auth.validate, usersController.destroy); // delete user
};