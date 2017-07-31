'use strict';
const User = require('./user');

module.exports = function(sequelize, DataTypes) {
  var Node = sequelize.define('Node', {
    ipaddress: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      defaultValue: null,
      allowNull: true,
    },
    groupName: {
      type: DataTypes.STRING,
      defaultValue: null,
      allowNull: true,
    },
    tempMin: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    tempMax: {
      type: DataTypes.INTEGER,
      defaultValue: 100,
      allowNull: false,
    },
    humidityMin: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    humidityMax: {
      type: DataTypes.INTEGER,
      defaultValue: 100,
      allowNull: false,
    },
    moistureMin: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    moistureMax: {
      type: DataTypes.INTEGER,
      defaultValue: 100,
      allowNull: false,
    },
    sunlightMin: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    sunlightMax: {
      type: DataTypes.INTEGER,
      defaultValue: 100,
      allowNull: false,
    }
  }, {
    hooks: {
      
      // this function is called after a sensor is created, using 
      // the just created sensor as the 'sensor' argument
      afterCreate: function(node, options) {
        node.getUser()  // getUser() defined by sequelize based on name 
        .then(user => {   // of relationship between sensor and its user
          if (!user) {
            return console.log('user is null');
          }
          return user
            .update({
              nodeCount: user.nodeCount + 1,
            });
        })
        .catch(error => console.log(error));
      },
      
      // this function is called after a sensor is destroyed, using 
      // the just created sensor as the 'sensor' argument
      afterDestroy: function(node, options) {
        node.getUser()
        .then(user => {
          if (!user) {
            return console.log('user is null');
          }
          return user
            .update({
              nodeCount: user.nodeCount - 1,
            });
        })
        .catch(error => console.log(error));     
      }
    },
    classMethods: {
      associate: function(models) {
        Node.hasMany(models.Reading, {
          foreignKey: 'nodeId',
          as: 'readings',
        });  
        Node.belongsTo(models.User, {
          foreignKey: 'userId',
          hooks: true,
          as: 'user'  // this name is used by Sequelize to create the getUser() function
        });           // used in the hooks above
      }
    }
  });
  return Node;
};