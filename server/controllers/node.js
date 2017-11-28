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
              {model: Reading, as:'readings'},
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
  
  // old version of prev_24h that scans hour by hour
  getLast24hrsOfReadingsForNode_depr(req, res) {
    if (req.query.timestamp != null) {
      // convert the timestamp from the body into a date object
      var time = req.query.timestamp
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
        if (error.message == 'Invalid Node For User') {
          res.status(404).send({
            message: 'User with id ' + req.user.id + ' does not own node with id ' + req.params.nid,
          });
        } else {
          res.status(400).send(error)
        }
      })
  },

  getLast24hrsOfReadingsForNode(req, res) {
    if (req.query.timestamp != null) {
      // convert the timestamp from the body into a date object
      var time = req.query.timestamp
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
        lastReadingTime = req.timestamp
        // remove any readings that happened after the provided timestamp
        i = 0
        while (sorted_readings[i] && sorted_readings[i]["createdAt"] > req.timestamp) {
          console.log('splicing reading posted at ' + new Date(sorted_readings[i]["createdAt"]).toJSON())
          sorted_readings.splice(i, 1)
        }
        // look at readings before the provided timestamp up until 24 hrs before said timestamp
        i = 0
        while (sorted_readings[i] && 
                sorted_readings[i]["createdAt"] > req.timestamp - 24*60*60*1000) { // looking at readings in the last 24 hrs
          result.unshift(sorted_readings[i])
          i++
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
  
  getLastXhrsOfReadingsForNode(req, res) {
    if (!req.query.hours || req.query.hours < 0) {
      return res.status(400).send({
        message: 'Positive value for hours not provided in request query!',
      });
    }
    if (req.query.timestamp != null) {
      // convert the timestamp from the body into a date object
      var time = req.query.timestamp
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
        lastReadingTime = req.timestamp
        // remove any readings that happened after the provided timestamp
        i = 0
        while (sorted_readings[i] && sorted_readings[i]["createdAt"] > req.timestamp) {
          console.log('splicing reading posted at ' + new Date(sorted_readings[i]["createdAt"]).toJSON())
          sorted_readings.splice(i, 1)
        }
        // look at readings before the provided timestamp up until 24 hrs before said timestamp
        i = 0
        while (sorted_readings[i] && 
                sorted_readings[i]["createdAt"] > req.timestamp - req.query.hours*60*60*1000) { // looking at readings in the last 24 hrs
          result.unshift(sorted_readings[i])
          i++
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

  updateOneNode(req, res) {
    return Node
      .findOne({
        where: {
          userId: req.user.id,
          id: req.params.nid
        }
      })
      .then(node => {
        if (!node) {
          return res.status(404).send({
            message: 'Node Not Found',
          });
        }
        return node
          .update({
            ipaddress: req.body.ipaddress || node.ipaddress,
            name: ((req.body.name == "") ? null : (req.body.name) ? req.body.name : node.name),
            groupName: ((req.body.groupName == "") ? null : (req.body.groupName) ? req.body.groupName : node.groupName),
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
  
  updateMultipleNodes(req, res) {
    if (!req.query.nodes) {
      return res.status(400).send({
        message: 'No nodes provided in request query!',
      });
    }
    var query_elems = req.query.nodes.split(',')
    var nodes = query_elems.map(Number)
    var promises = []
    // find all nodes in query
    for (let i=0; i<nodes.length; i++) {
      // check for bad input
      if (isNaN(nodes[i])) {
        return res.status(400).send({
          message: query_elems[i] + ' is not an integer node ID',
        });
      }
      let newPromise = Node
        .findOne({
          where: {
            userId: req.user.id,
            id: nodes[i]
          } 
        })
      promises.push(newPromise)
    }
    return Promise.all(promises)
      .then(nodes => {
        promises = []
        // update all nodes in query
        for (let i=0; i<nodes.length; i++) {
          if (!nodes[i]) {
            return res.status(404).send({
              message: 'Node Not Found. Aborting update procedure.',
            });
          }
          newPromise = nodes[i]
            .update({
              ipaddress: req.body.ipaddress || nodes[i].ipaddress,
              name: ((req.body.name == "") ? null : (req.body.name) ? req.body.name : nodes[i].name),
              groupName: ((req.body.groupName == "") ? null : (req.body.groupName) ? req.body.groupName : nodes[i].groupName),
              tempMin: req.body.tempMin || nodes[i].tempMin,
              tempMax: req.body.tempMax || nodes[i].tempMax,
              humidityMin: req.body.humidityMin || nodes[i].humidityMin,
              humidityMax: req.body.humidityMax || nodes[i].humidityMax,
              moistureMin: req.body.moistureMin || nodes[i].moistureMin,
              moistureMax: req.body.moistureMax || nodes[i].moistureMax,
              sunlightMin: req.body.sunlightMin || nodes[i].sunlightMin,
              sunlightMax: req.body.sunlightMax || nodes[i].sunlightMax,
            })
          promises.push(newPromise)
        }
        return Promise.all(promises)
      })
      .then(updatedNodes => {
        res.status(200).send(updatedNodes)
      })
      .catch(error => {
        console.log(error)
        res.status(400).send(error)
      })
  },
  
  getNodeStatus(req, res) {
    var now = new Date()
    var oneHourAgo = new Date()
    oneHourAgo.setHours(now.getHours()-1)
    if (!req.query.nodes) {
      return res.status(400).send({
        message: 'No nodes provided in request query!',
      });
    }
    var query_elems = req.query.nodes.split(',')
    var nodes = query_elems.map(Number)
    var promises = []
    // find all nodes in query
    for (let i=0; i<nodes.length; i++) {
      // check for bad input
      if (isNaN(nodes[i])) {
        return res.status(400).send({
          message: query_elems[i] + ' is not an integer node ID',
        });
      }
      let newPromise = Node
        .findOne({
          where: {
            userId: req.user.id,
            id: nodes[i]
          } 
        })
      promises.push(newPromise)
    }
    return Promise.all(promises)
    .then(nodes => {
      nodesObj = {}
      promises = []
      for (let i=0; i<nodes.length; i++) {
        if (!nodes[i]) {
          return res.status(404).send({
            message: 'Node Not Found. Aborting status report procedure.',
          });
        }
        nodesObj[nodes[i].id] = nodes[i]
        newPromise = Reading
          .findAll({
            limit: 1,
            where: {
              nodeId: nodes[i].id
            },
            order: [[ 'createdAt', 'DESC' ]]
          })
        promises.push(newPromise)
      }
      promises.push(nodesObj)
      return Promise.all(promises)
    })
    .then(readings => {
      statuses = {}
      nodes = readings.pop() // get the nodes object we created earlier
      for (let i=0; i<readings.length; i++) {
        if (readings[i][0].dataValues.createdAt < oneHourAgo) {
          // node status is inactive
          statuses[readings[i][0].dataValues.nodeId] = {
            status: 'inactive',
            latest: readings[i][0]
          }
        } else {
          // node is active, check if healthy or unhealthy
          let thisNode = nodes[readings[i][0].dataValues.nodeId]
          // this code is ugly. Find a better way?
          let metrics = [
            {reading: readings[i][0].dataValues.humidity, min: thisNode.humidityMin, max: thisNode.humidityMax},
            {reading: readings[i][0].dataValues.moisture, min: thisNode.moistureMin, max: thisNode.moistureMax},
            {reading: readings[i][0].dataValues.temperature, min: thisNode.tempMin, max: thisNode.tempMax},
            {reading: readings[i][0].dataValues.sunlight, min: thisNode.sunlightMin, max: thisNode.sunlightMax},
          ]
          let status = 'good'   // start with good status
          for (let j of metrics) {
            if (j.reading <= j.max && j.reading >= j.min) {
              if (status == 'good') status = 'good'   // can't go to good status from warning or bad status
            } else if (j.reading > j.max) {
              status = (j.reading - j.max > 5) ? 'bad' : 'warning'
            } else if (j.reading < j.min) {
              status = (j.min - j.reading > 5) ? 'bad' : 'warning'
            }
            statuses[thisNode.id] = {
              status: status,
              latest: readings[i][0]
            }
            if (status == 'bad') break  // no sense checking the rest if one metric has a bad status
          }
        }
      }
      return res.status(200).send(statuses)
    })
    .catch(error => {
      console.log(error)
      res.status(400).send(error)
    })
  },

  destroy(req, res) {
    return Node
      .findOne({
        where: {
          userId: req.user.id,
          id: req.params.nid
        }
      })
      .then(node => {
        if (!node) {
          return res.status(404).send({
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
