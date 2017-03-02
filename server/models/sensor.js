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
        sensor.getUser()
        .then(user => {
          if (!user) {
            return console.log('user is null');
          }
          return user
            .update({
              sensor_count: user.sensor_count + 1,
            });
        })
        .catch(error => console.log(error));
      },
      
      afterDestroy: function(sensor, options) {
        sensor.getUser()
        .then(user => {
          if (!user) {
            return console.log('user is null');
          }
          return user
            .update({
              sensor_count: user.sensor_count - 1,
            });
        })
        .catch(error => console.log(error));     
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
          as: 'user'
        });  
      }
    }
  });
  return Sensor;
};