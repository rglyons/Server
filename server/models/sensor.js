'use strict';
module.exports = function(sequelize, DataTypes) {
  var Sensor = sequelize.define('Sensor', {
    ipaddress: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, {
    classMethods: {
      associate: function(models) {
        Sensor.hasMany(models.Entry, {
          foreignKey: 'sensorId',
          as: 'entries',
        });
      }
    }
  });
  return Sensor;
};