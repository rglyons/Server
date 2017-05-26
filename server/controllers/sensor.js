const Sensor = require('../models').Sensor;
const Entry = require('../models').Entry;
const User = require('../models').User;

module.exports = {
  create(req, res) {
    return Sensor
      .create({
        id: req.body.id,
        ipaddress: req.body.ipaddress,
        userId: req.user.id
      })
      .then(sensor => {
        res.status(201).send(sensor)
        // create dummy entry (want to remove this and handle null entries in the front)
        Entry
          .create({
            humidity: 0,
            sunlight: 0,
            temperature: 0,
            moisture: 0,
            battery: null,
            sensorId: sensor.id,
          })
        }
      )
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
      .findAll({
        where: {
          userId: req.user.id
        }
      })
      .map(sensor =>
        Entry.findOne({
          where: {
            sensorId: sensor.id
          },
          order: [
            ['id', 'DESC']
          ]
        }))
      .then(entries => {
        return res.status(200).send(entries
          .sort(function(entry1, entry2) {
            return entry1["sensorId"]-entry2["sensorId"] // sort entries by increasing sensor id
          })
        );
      })
  },

  getDayAvgForUser(req, res) {
    Sensor
      .findAll({
        where: {
          userId: req.user.id
        }
      })
      .map(sensor =>
        Entry.findAll({
          where: {
            sensorId: sensor.id
          },
          order: [
            ['id', 'ASC']
          ]
        }))
      .then(entries => {
          entries = entries
            .sort(function(entry1, entry2) {
              return entry1[0]["sensorId"]-entry2[0]["sensorId"] // sort entries by increasing sensor id
          });
          var avgEntries = [];
          var humAvg = 0;
          var tempAvg = 0;
          var sunAvg = 0;
          var moistAvg = 0;
          for(var node in entries){
              var nodeAvgs = [];
              for(var i = 1; i<=entries[node].length&&i<=24;i++){
                  if(i%2==0){
                      humAvg = Math.round((humAvg+entries[node][i-1]['humidity'])/2);
                      tempAvg = Math.round((tempAvg+entries[node][i-1]['temperature'])/2);
                      sunAvg = Math.round((sunAvg+entries[node][i-1]['sunlight'])/2);
                      moistAvg = Math.round((moistAvg+entries[node][i-1]['moisture'])/2);
                      nodeAvgs.push({"id":entries[node][i-1]['sensorId'],"humidity":humAvg,"temperature":tempAvg,"sunlight":sunAvg, "moisture":moistAvg})
                      humAvg = 0;
                      tempAvg = 0;
                      sunAvg = 0;
                      moistAvg = 0;
                  }
                  else{
                      humAvg = humAvg+entries[node][i-1]['humidity'];
                      tempAvg = tempAvg+entries[node][i-1]['temperature'];
                      sunAvg = sunAvg+entries[node][i-1]['sunlight'];
                      moistAvg = moistAvg+entries[node][i-1]['moisture'];
                  }
                  console.log(JSON.stringify(entries[node][i-1]));
              }
              avgEntries.push(nodeAvgs);
          }
        return res.status(200).send(avgEntries);
      })
  },
  
  getDayAvgForUser2(req, res) {
    req.timestamp = Date.now() // record the timestamp when the request is made
    return Sensor
      .findOne({
        where: {
          userId: req.user.id,
          id: req.body.id
        }
      })
      .then(sensor => {
        entries = sensor.getEntries()
        return entries
      })
      .then(entries => {
        sorted_entries = entries.sort(function(entry1, entry2) {
          return entry2["createdAt"]-entry1["createdAt"] // sort entries by decreasing createdAt timestamp
        })
        return sorted_entries
      })
      .then(sorted_entries => {
        result = []
        lastEntryTime = req.timestamp
        i = 0
        while (sorted_entries[i]["createdAt"] > req.timestamp - 24*60*60*1000) { // looking at entries in the last 24 hrs
          console.log(sorted_entries[i]["createdAt"])
          thisEntryTime = sorted_entries[i]["createdAt"]
          if (thisEntryTime > lastEntryTime - 1*60*60*1000) { // if this entry was made within an hour of the last one
            result.unshift(sorted_entries[i])
            lastEntryTime = thisEntryTime
            i++
          } else {
            result.unshift(null)
            lastEntryTime -= 1*60*60*1000
          }
        }
        return res.status(200).send(result)
      })
      .catch((error) => res.status(400).send(error));
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
            name: ((req.body.name == "") ? null : req.body.name),
            tempMin: req.body.tempMin || sensor.tempMin,
            tempMax: req.body.tempMax || sensor.tempMax,
            humidityMin: req.body.humidityMin || sensor.humidityMin,
            humidityMax: req.body.humidityMax || sensor.humidityMax,
            moistureMin: req.body.moistureMin || sensor.moistureMin,
            moistureMax: req.body.moistureMax || sensor.moistureMax,
            sunlightMin: req.body.sunlightMin || sensor.sunlightMin,
            sunlightMax: req.body.sunlightMax || sensor.sunlightMax,
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
