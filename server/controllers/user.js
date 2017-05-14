const User = require('../models').User;
const Sensor = require('../models').Sensor;
const randomstring = require("randomstring")

module.exports = {
  create(req, res) {
    return User
      .create({
        username: req.body.username,
        password: req.body.password,
        sensor_count: 0,
      })
      .then(user => {
          user.password = null 
          res.status(201).send(user)
        }
      )
      .catch(error => res.status(400).send(error));
  },
    
  getUser(req, res) {
    response = {}
    response["id"] = req.user.id
    response["username"] = req.user.username
    response["sensor_count"] = req.user.sensor_count
    response["sensors"] = req.user.sensors
    return res.status(200).send(response);
  },
  
  generateApiToken(req, res) {
    return req.user
      .update({
        api_token: randomstring.generate(30)
      })
      .then(() => {
        user.password = null 
        res.status(200).send(user)  // Send back the updated sensor.
      })
      .catch((error) => res.status(400).send(error));
  },
  
  update(req, res) {
    return req.user
      .update({
        password: req.body.password || user.password,
        username: req.body.username || user.username,
      })
      .then(() => res.status(200).send(user))  // Send back the updated sensor.
      .catch((error) => res.status(400).send(error));
  },
  
  destroy(req, res) {
    return req.user
      .destroy()
      .then(() => res.status(204).send())
      .catch(error => res.status(400).send(error));
  }  
};