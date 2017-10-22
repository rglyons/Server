const Notification = require('../models').Notification;
const Sequelize = require('sequelize')
const Op = Sequelize.Op


module.exports = {
  create(req, res) {
    return Notification
      .create({
        sensor: req.body.sensor,
        overMax: req.body.overMax,
        underMin: req.body.underMin,
        reading: req.body.reading,
        nodeId: req.query.nodeId,
        userId: req.user.id
      })
      .then (notification => {
        return res.status(201).send(notification)
      })
      .catch(error => res.status(400).send(error));
  },

  getAllNotificationsForUser(req, res) {
    if (req.query.timestamp != null) {
      // convert the timestamp from the body into a date object
      var time = req.query.timestamp
      var yr = parseInt(time.slice(0,4))
      var mth = parseInt(time.slice(5,7)) - 1
      var day = parseInt(time.slice(8,10))
      var hr = parseInt(time.slice(11,13))
      var min = parseInt(time.slice(14,16))
      var sc = parseInt(time.slice(17,19))
      var ms = parseInt(time.slice(20,23))
      req.timestamp = new Date(Date.UTC(yr, mth, day, hr, min, sc, ms))
      time = new Date(req.timestamp.getTime())  // make a copy of req.timestamp to manipulate
    } else {
      req.timestamp = Date.now() // record the timestamp when the request is made
      var time = new Date(req.timestamp)  // make a copy of req.timestamp to manipulate
    }
    let endTime = req.timestamp
    if (req.query.numDays != null) {
      var numDays = parseInt(req.query.numDays)
      if (isNaN(numDays) || numDays < 0) {
        return res.status(400).send({
          message: 'numDays must be a positive integer!',
        });
      }
      var startTime = time.setDate(time.getDate() - numDays)
    } else {
      var startTime = new Date(0) // start at the beginning of the epoch
    }
    return Notification
      .findAll({
        where: {
          userId: req.user.id,
          createdAt: {
            $gte: startTime,
            $lte: endTime
          }
        }
      })
      .then(notifications => {
        if (!notifications) {
          return res.status(404).send({
            message: 'No notifications found for user',
          });
        }
        sortedNotifications = notifications.sort(function(reading1, reading2) {
          return reading2["createdAt"]-reading1["createdAt"] // sort readings by decreasing createdAt timestamp
        })
        
        return res.status(200).send(sortedNotifications);
      })
      .catch(error => res.status(400).send(error));
  },
  
  getUndismissedNotificationsForUser(req, res) {
    if (req.query.timestamp != null) {
      // convert the timestamp from the body into a date object
      var time = req.query.timestamp
      var yr = parseInt(time.slice(0,4))
      var mth = parseInt(time.slice(5,7)) - 1
      var day = parseInt(time.slice(8,10))
      var hr = parseInt(time.slice(11,13))
      var min = parseInt(time.slice(14,16))
      var sc = parseInt(time.slice(17,19))
      var ms = parseInt(time.slice(20,23))
      req.timestamp = new Date(Date.UTC(yr, mth, day, hr, min, sc, ms))
      time = new Date(req.timestamp.getTime())  // make a copy of req.timestamp to manipulate
    } else {
      req.timestamp = Date.now() // record the timestamp when the request is made
      var time = new Date(req.timestamp)  // make a copy of req.timestamp to manipulate
    }
    let endTime = req.timestamp
    if (req.query.numDays != null) {
      var numDays = parseInt(req.query.numDays)
      if (isNaN(numDays) || numDays < 0) {
        return res.status(400).send({
          message: 'numDays must be a positive integer!',
        });
      }
      var startTime = time.setDate(time.getDate() - numDays)
    } else {
      var startTime = new Date(0) // start at the beginning of the epoch
    }
    return Notification
      .findAll({
        where: {
          userId: req.user.id,
          dismissed: false,
          createdAt: {
            $gte: startTime,
            $lte: endTime
          }
        }
      })
      .then(notifications => {
        if (!notifications) {
          return res.status(404).send({
            message: 'No undismissed notifications found for user',
          });
        }
        sortedNotifications = notifications.sort(function(reading1, reading2) {
          return reading2["createdAt"]-reading1["createdAt"] // sort readings by decreasing createdAt timestamp
        })
        return res.status(200).send(sortedNotifications);
      })
      .catch(error => res.status(400).send(error));
  },

  update(req, res) {
    return Notification
      .findOne({
        where: {
          userId: req.user.id,
          id: req.params.nid
        }
      })
      .then(notification => {
        if (!notification) {
          return res.status(404).send({
            message: 'Notification Not Found',
          });
        }
        return notification
          .update({
            dismissed: req.body.dismissed || notification.dismissed,
          })
          .then(() => res.status(200).send(notification))  // Send back the updated notification.
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },
  
  updateMultipleNotifications(req, res) {
    if (!req.query.notifications) {
      return res.status(400).send({
        message: 'No notifications provided in request query!',
      });
    }
    var query_elems = req.query.notifications.split(',')
    var notifications = query_elems.map(Number)
    var promises = []
    // find all nodes in query
    for (let i=0; i<notifications.length; i++) {
      // check for bad input
      if (isNaN(notifications[i])) {
        return res.status(400).send({
          message: query_elems[i] + ' is not an integer node ID',
        });
      }
      let newPromise = Notification
        .findOne({
          where: {
            userId: req.user.id,
            id: notifications[i]
          } 
        })
      promises.push(newPromise)
    }
    return Promise.all(promises)
      .then(notifications => {
        promises = []
        // update all nodes in query
        for (let i=0; i<notifications.length; i++) {
          if (!notifications[i]) {
            return res.status(404).send({
              message: 'Notification Not Found. Aborting update procedure.',
            });
          }
          newPromise = notifications[i]
            .update({
              dismissed: req.body.dismissed || notification.dismissed,
            })
          promises.push(newPromise)
        }
        return Promise.all(promises)
      })
      .then(updatedNotifications => {
        res.status(200).send(updatedNotifications)
      })
      .catch(error => {
        console.log(error)
        res.status(400).send(error)
      })
  },

  destroy(req, res) {
    return Notification
      .findOne({
        where: {
          userId: req.user.id,
          id: req.params.nid
        }
      })
      .then(notification => {
        if (!notification) {
          return res.status(400).send({
            message: 'Notification Not Found',
          });
        }
        return notification
          .destroy()
          .then(() => res.status(204).send())
          .catch(error => res.status(400).send(error));
      })
      .catch(error => res.status(400).send(error));
  },
};
