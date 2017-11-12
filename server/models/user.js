'use strict';
const randomstring = require("randomstring")

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
      unique: true,
    },
    firstname: {
      type: DataTypes.STRING,
      defaultValue: 'empty',
      allowNull: false,
    },
    lastname: {
      type: DataTypes.STRING,
      defaultValue: 'empty',
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nodeCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    api_token: {
      type: DataTypes.STRING,
      defaultValue: function() { return randomstring.generate(30) },
      allowNull: false,
      unique: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    }
  }, {
    classMethods: {
      associate: function(models) {
        User.hasMany(models.Node, {
          foreignKey: 'userId',
          as: 'nodes',
        });
        User.hasMany(models.Notification, {
          foreignKey: 'userId',
          as: 'notifications',
        });
      }
    }
  });
  return User;
};