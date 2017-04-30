'use strict';
const randomstring = require("randomstring")

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sensor_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    api_token: {
      type: DataTypes.STRING,
      defaultValue: function() { return randomstring.generate(30) },
      allowNull: false
    }
  }, {
    classMethods: {
      associate: function(models) {
        User.hasMany(models.Sensor, {
          foreignKey: 'userId',
          as: 'sensors',
        });
      }
    }
  });
  return User;
};