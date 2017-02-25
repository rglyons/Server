'use strict';
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