const Entry = require('../models').Entry;

module.exports = {
  create(req, res) {
    return Entry
      .create({
        humidity: req.body.humidity,
        sunlight: req.body.sunlight,
        temperature: req.body.temperature,
        moisture: req.body.moisture,
        sensorId: req.params.sid,
      })
      .then(entry => res.status(201).send(entry))
      .catch(error => res.status(400).send(error));
  },
};