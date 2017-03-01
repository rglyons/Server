const User = require('../models').User;
const Sensor = require('../models').Sensor;

module.exports = {
  create(req, res) {
    return User
      .create({
        username: req.body.username,
        password: req.body.password,
        sensor_count: 0,
      })
      .then(user => res.status(201).send(user))
      .catch(error => res.status(400).send(error));
  },
  
  list(req, res) {
    return User
      .all({
        include: [{
          model: Sensor,
          as: 'sensors',
        }],
      })
      .then(users => res.status(200).send(users))
      .catch(error => res.status(400).send(error));
  },
  
  getUserById(req, res) {
    return User
      .findById(req.params.uid, {
        include: [{
          model: Sensor,
          as: 'sensors',
        }],
      })
      .then(user => {
        if (!user) {
          return res.status(404).send({
            message: 'User Not Found',
          });
        }
        return res.status(200).send(user);
      })
      .catch(error => res.status(400).send(error));
  },
  
  getUserByUsername(req, res) {
    return User
      .findOne({ where: {username: req.params.username},
        include: [{
          model: Sensor,
          as: 'sensors',
        }],
      })
      .then(user => {
        if (!user) {
          return res.status(404).send({
            message: 'User Not Found',
          });
        }
        return res.status(200).send(user);
      })
      .catch(error => res.status(400).send(error));
  },
  
  update(req, res) {
    return User
      .findById(req.params.uid)
      .then(user => {
        if (!user) {
          return res.status(404).send({
            message: 'User Not Found',
          });
        }
        return user
          .update({
            password: req.body.password || user.password,
            username: req.body.username || user.username,
          })
          .then(() => res.status(200).send(user))  // Send back the updated sensor.
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },
  
  destroy(req, res) {
    return User
      .findById(req.params.uid)
      .then(user => {
        if (!user) {
          return res.status(400).send({
            message: 'User Not Found',
          });
        }
        return user
          .destroy()
          .then(() => res.status(204).send())
          .catch(error => res.status(400).send(error));
      })
      .catch(error => res.status(400).send(error));
  },
};