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
      
      // this function is called after a sensor is created, using 
      // the just created sensor as the 'sensor' argument
      afterCreate: function(sensor, options) {
        sensor.getUser()  // getUser() defined by sequelize based on name 
        .then(user => {   // of relationship between sensor and its user
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
      
      // this function is called after a sensor is destroyed, using 
      // the just created sensor as the 'sensor' argument
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
          as: 'user'  // this name is used by Sequelize to create the getUser() function
        });           // used in the hooks above
      }
    }
  });
  return Sensor;
};