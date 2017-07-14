const Node = require('../models').Node;
const Reading = require('../models').Reading;
const User = require('../models').User;

module.exports = {
  create(req, res) {
    return Node
      .create({
        id: req.body.id,
        ipaddress: req.body.ipaddress,
        userId: req.user.id
      })
      .then(node => {
        res.status(201).send(node)
        // create dummy reading (want to remove this and handle null readings in the front)
        Reading
          .create({
            humidity: 0,
            sunlight: 0,
            temperature: 0,
            moisture: 0,
            battery: null,
            nodeId: node.id,
          })
        }
      )
      .catch(error => res.status(400).send(error));
  },

  list(req, res) {
    return Node
      .all({
        include: [{
          model: Reading,
          as: 'readings',
        }],
        order: [
            [
              {model: Reading, as:'readings'},
              'id',
              'DESC'
            ]
        ]
      })
      .then(nodes => res.status(200).send(nodes))
      .catch(error => res.status(400).send(error));
  },

  getNodeById(req, res) {
    return Node
      .findById(req.params.nid, {
        include: [{
          model: Reading,
          as: 'readings',
        }],
        order: [
            [
              {model: Readings, as:'readings'},
              'id',
              'DESC'
            ]
        ]
      })
      .then(node => {
        if (!node) {
          return res.status(404).send({
            message: 'Node Not Found',
          });
        }
        return res.status(200).send(node);
      })
      .catch(error => res.status(400).send(error));
  },

  getLatestNodeReadingsForUser(req, res) {
    Node
      .findAll({
        where: {
          userId: req.user.id
        }
      })
      .map(node =>
        Reading.findOne({
          where: {
            nodeId: node.id
          },
          order: [
            ['id', 'DESC']
          ]
        }))
      .then(readings => {
        return res.status(200).send(readings
          .sort(function(reading1, reading2) {
            return reading1["nodeId"]-reading2["nodeId"] // sort readings by increasing nodeId
          })
        );
      })
  },
  
  getDayAvgForUser(req, res) {
    req.timestamp = Date.now() // record the timestamp when the request is made
    return Node
      .findOne({
        where: {
          userId: req.user.id,
          id: req.body.id
        }
      })
      .then(node => {
        return node.getReadings()
      })
      .then(readings => {
        sorted_readings = readings.sort(function(reading1, reading2) {
          return reading2["createdAt"]-reading1["createdAt"] // sort readings by decreasing createdAt timestamp
        })
        return sorted_readings
      })
      .then(sorted_readings => {
        result = []
        lastReadingsTime = req.timestamp
        i = 0
        while (lastReadingTime > req.timestamp - 24*60*60*1000) { // looking at readings in the last 24 hrs
          console.log(new Date(lastReadingTime).toJSON())
          thisReadingTime = (i < sorted_readings.length) ? sorted_readings[i]["createdAt"] : lastReadingTime - 1.01*60*60*1000
          if (thisReadingTime < req.timestamp - 24*60*60*1000) break
          if (thisReadingTime >= lastReadingTime - 1*60*60*1000) { // if this reading was made within an hour of the last one (w error margin)
            result.unshift(sorted_readings[i])
            lastReadingTime = sorted_readings[i]["createdAt"]
            i++
          } else {
            lastReadingTime -= 1*60*60*1000
            result.unshift({"id": null, "createdAt": new Date(lastReadingTime).toJSON()})
          }
        }
        return res.status(200).send(result)
      })
      .catch((error) => {
        console.log(error)
        res.status(400).send(error)
      })
  },

  update(req, res) {
    return Node
      .findById(req.params.nid)
      .then(node => {
        if (!node) {
          return res.status(404).send({
            message: 'Node Not Found',
          });
        }
        return node
          .update({
            ipaddress: req.body.ipaddress || node.ipaddress,
            name: ((req.body.name == "") ? null : req.body.name),
            groupName: ((req.body.groupName == "") ? null : req.body.groupName),
            tempMin: req.body.tempMin || node.tempMin,
            tempMax: req.body.tempMax || node.tempMax,
            humidityMin: req.body.humidityMin || node.humidityMin,
            humidityMax: req.body.humidityMax || node.humidityMax,
            moistureMin: req.body.moistureMin || node.moistureMin,
            moistureMax: req.body.moistureMax || node.moistureMax,
            sunlightMin: req.body.sunlightMin || node.sunlightMin,
            sunlightMax: req.body.sunlightMax || node.sunlightMax,
          })
          .then(() => res.status(200).send(node))  // Send back the updated node.
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },

  destroy(req, res) {
    return Node
      .findById(req.params.nid)
      .then(node => {
        if (!node) {
          return res.status(400).send({
            message: 'Node Not Found',
          });
        }
        return node
          .destroy()
          .then(() => res.status(204).send())
          .catch(error => res.status(400).send(error));
      })
      .catch(error => res.status(400).send(error));
  },
};
