const entriesController = require('../controllers').entry;
const sensorsController = require('../controllers').sensor;
const usersController = require('../controllers').user;

module.exports = (app) => {
  app.get('/api', (req, res) => res.status(200).send({
    message: 'Welcome to the Smart Irrigation API!',
  }));

  app.post('/api/sensors/:uid', sensorsController.create); //create sensor under user
  app.get('/api/sensors/all', sensorsController.list); // list all sensors
  app.get('/api/sensors/:sid', sensorsController.getSensorById); // retrieve sensor + entries
  app.get('/api/sensors/ip/:ip', sensorsController.getSensorByIP); // retrieve sensor + entries
  app.post('/api/sensors/:sid/entries', entriesController.create); // create entry for sensor
  app.put('/api/sensors/:sid', sensorsController.update); // update sensor fields
  app.delete('/api/sensors/:sid', sensorsController.destroy); // delete sensor
  
  // users
  app.post('/api/users', usersController.create); //create user
  app.put('/api/users/:uid', usersController.update); // update user fields
  app.get('/api/users/all', usersController.list); // list all users
  app.get('/api/users/:uid', usersController.getUserById); // retrieve user + sensors
  app.get('/api/users/username/:username', usersController.getUserByUsername); // retrieve user + sensors
  app.get('/api/users/:uid/sensor_readings', sensorsController.getLatestSensorReadingsForUser); // retrieve latest reading for each of a user's sensors
  app.delete('/api/users/:uid', usersController.destroy); // delete user
};