const Sensor = require('../models').Sensor;
const Entry = require('../models').Entry;
const User = require('../models').User;

module.exports = {
  create(req, res) {
    return Sensor
      .create({
        ipaddress: req.body.ipaddress,
        userId: req.params.uid
      })
      .then(sensor => res.status(201).send(sensor))
      .catch(error => res.status(400).send(error));
  },
  
  list(req, res) {
    return Sensor
      .all({
        include: [{
          model: Entry,
          as: 'entries',
        }],
        order: [
            [
              {model: Entry, as:'entries'},
              'id',
              'DESC'
            ]
        ]
      })
      .then(sensors => res.status(200).send(sensors))
      .catch(error => res.status(400).send(error));
  },
  
  getSensorById(req, res) {
    return Sensor
      .findById(req.params.sid, {
        include: [{
          model: Entry,
          as: 'entries',
        }],
        order: [
            [
              {model: Entry, as:'entries'},
              'id',
              'DESC'
            ]
        ]
      })
      .then(sensor => {
        if (!sensor) {
          return res.status(404).send({
            message: 'Sensor Not Found',
          });
        }
        return res.status(200).send(sensor);
      })
      .catch(error => res.status(400).send(error));
  },
  
  getSensorByIP(req, res) {
    return Sensor
      .findOne({ where: {ipaddress: req.params.ip},
        include: [{
          model: Entry,
          as: 'entries',
        }],
        order: [
            [
              {model: Entry, as:'entries'},
              'id',
              'DESC'
            ]
        ]
      })
      .then(sensor => {
        if (!sensor) {
          return res.status(404).send({
            message: 'Sensor Not Found',
          });
        }
        return res.status(200).send(sensor);
      })
      .catch(error => res.status(400).send(error));
  },
  
  getLatestSensorReadingsForUser(req, res) {
    Sensor
      .findAll({ where: {userId: req.params.uid}
      })
      .map(sensor => sensor.getEntries(
        {
          order: [
            ['id', 'DESC']
          ],
          limit: 1,
      }))
      .then(entries => {
        return res.status(200).send(entries);
      }) 
  },
  
  update(req, res) {
    return Sensor
      .findById(req.params.sid)
      .then(sensor => {
        if (!sensor) {
          return res.status(404).send({
            message: 'Sensor Not Found',
          });
        }
        return sensor
          .update({
            ipaddress: req.body.ipaddress || sensor.ipaddress,
          })
          .then(() => res.status(200).send(sensor))  // Send back the updated sensor.
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },
  
  destroy(req, res) {
    return Sensor
      .findById(req.params.sid)
      .then(sensor => {
        if (!sensor) {
          return res.status(400).send({
            message: 'Sensor Not Found',
          });
        }
        return sensor
          .destroy()
          .then(() => res.status(204).send())
          .catch(error => res.status(400).send(error));
      })
      .catch(error => res.status(400).send(error));
  },
};