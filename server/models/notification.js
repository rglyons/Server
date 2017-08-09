'use strict';
module.exports = function(sequelize, DataTypes) {
  var Notification = sequelize.define('Notification', {
    dismissed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    sensor: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { 
        isIn: {   // TEST THIS
          args: [['temperature', 'humidity', 'moisture', 'sunlight']],
          msg: 'Value for sensor field must be "temperature", "moisture", "humidity", or "sunlight"'
        }
      }
    },
    overMax: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    underMin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    reading: {
      type: DataTypes.INTEGER,
      defaultValue: null,
      allowNull: true,
    }
  }, {
    validate: {
      // TEST THIS
      oppositeOverMaxAndUnderMin() {
        if (this.overMax === this.underMin) {
          throw new Error('overMax cannot equal underMin!')
        }
      }
    },
    classMethods: {
      associate: function(models) {
        Notification.belongsTo(models.Node, {
          foreignKey: 'nodeId',
          as: 'node',
        });  
        Notification.belongsTo(models.User, {
          foreignKey: 'userId',
          as: 'user'
        });
      }
    }
  });
  return Notification;
};