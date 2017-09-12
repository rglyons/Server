const Notification = require('../models').Notification;

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
    return Notification
      .findAll({
        where: {
          userId: req.user.id
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
    return Notification
      .findAll({
        where: {
          userId: req.user.id,
          dismissed: false
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
