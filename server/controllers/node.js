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
  
  getLatestNodeReading(req, res) {
    return Node
      .findOne({
        where: {
          userId: req.user.id,
          id: req.params.nid
        }
      })
      .then(node =>
        Reading.findOne({
          where: {
            nodeId: node.id
          },
          order: [
            ['id', 'DESC']
          ]
        }))
      .then(reading => res.status(200).send(reading))
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
  
  getLast24hrsOfReadingsForNode(req, res) {
    if (req.body.timestamp != null) {
      // convert the timestamp from the body into a date object
      var time = req.body.timestamp
      var yr = parseInt(time.slice(0,4))
      var mth = parseInt(time.slice(6,8)) - 1
      var day = parseInt(time.slice(8,10))
      var hr = parseInt(time.slice(11,13))
      var min = parseInt(time.slice(14,16))
      var sc = parseInt(time.slice(17,19))
      var ms = parseInt(time.slice(20,23))
      req.timestamp = new Date(Date.UTC(yr, mth, day, hr, min, sc, ms))
    } else {
      req.timestamp = Date.now() // record the timestamp when the request is made
    }
    return Node
      .findOne({
        where: {
          userId: req.user.id,
          id: req.params.nid
        }
      })
      .then(node => {
        if (!node) {
          throw new Error('Invalid Node For User')
        }
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
        lastReadingTime = req.timestamp // option to give timestamp in request body
        // remove any readings that happened after the provided timestamp
        i = 0
        while (sorted_readings[i]["createdAt"] > req.timestamp) {
          console.log('splicing reading posted at ' + new Date(sorted_readings[i]["createdAt"]).toJSON())
          sorted_readings.splice(i, 1)
        }
        // look at readings before the provided timestamp up until 24 hrs before said timestamp
        i = 0
        while (lastReadingTime > req.timestamp - 24*60*60*1000) { // looking at readings in the last 24 hrs
          console.log('lastReadingtime = ' + new Date(lastReadingTime).toJSON())
          thisReadingTime = (i < sorted_readings.length) ? sorted_readings[i]["createdAt"] : lastReadingTime - 1.01*60*60*1000
          console.log('thisReadingTime = ' + new Date(thisReadingTime).toJSON())
          // if this reading was made within an hour of the last one (w error margin), put it on the back of the list
          if (thisReadingTime >= lastReadingTime - 1*60*60*1000) { 
            result.unshift(sorted_readings[i])
            i++
          } else {
            result.unshift({"id": null, "createdAt": new Date(lastReadingTime).toJSON()})
          }
          lastReadingTime -= 1*60*60*1000
        }
        return res.status(200).send(result)
      })
      .catch((error) => {
        console.log(error)
        if (error.message == 'Invalid Node For User') {
          res.status(404).send({
            message: 'User with id ' + req.user.id + ' does not own node with id ' + req.params.nid,
          });
        } else {
          res.status(400).send(error)
        }
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
