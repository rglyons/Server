const Reading = require('../models').Reading;

module.exports = {
  create(req, res) {
    return Reading
      .create({
        humidity: req.body.humidity,
        sunlight: req.body.sunlight,
        temperature: req.body.temperature,
        moisture: req.body.moisture,
        battery: req.body.battery,
        nodeId: req.params.nid,
        createdAt: req.body.postTime
      })
      .then(reading => res.status(201).send(reading))
      .catch(error => {
        console.log(error)
        return res.status(400).send(error)
      });
  },
};