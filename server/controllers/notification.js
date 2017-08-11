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
        return res.status(200).send(notifications);
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
        return res.status(200).send(notifications);
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
