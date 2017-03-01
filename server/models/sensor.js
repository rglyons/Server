'use strict';
const User = require('./user');

module.exports = function(sequelize, DataTypes) {
  var Sensor = sequelize.define('Sensor', {
    ipaddress: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, {
    hooks: {
      
      afterCreate: function(sensor, options) {
        console.log(sensor.userId);
        console.log(User);
        return User.findById(sensor.userId)
        .then(user => {
          if (!user) {
            return console.log('user is null');
          }
          return user
            .update({
              sensor_count: user.sensor_count + 1,
            });
        })
        .catch(error => res.status(400).send(error));
      },
      
      afterDestroy: function(sensor, options) {
        return User.findById(sensor.userId)
        .then(user => user.update(
          {
            sensor_count: user.sensor_count - 1
          }
        ));      
      }
    },
    classMethods: {
      associate: function(models) {
        Sensor.hasMany(models.Entry, {
          foreignKey: 'sensorId',
          as: 'entries',
        });  
        Sensor.belongsTo(models.User, {
          foreignKey: 'userId',
          onDelete: 'CASCADE',
        });  
      }
    }
  });
  return Sensor;
};