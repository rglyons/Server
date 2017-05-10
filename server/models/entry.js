'use strict';
module.exports = function(sequelize, DataTypes) {
  var Entry = sequelize.define('Entry', {
    humidity: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    temperature:  {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    sunlight:  {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    moisture:  {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    battery:  {
      type: DataTypes.INTEGER,
      allowNull: true,
    }
  }, {
    classMethods: {
      associate: function(models) {
        Entry.belongsTo(models.Sensor, {
          foreignKey: 'sensorId',
          //onDelete: 'CASCADE',
        });
      }
    }
  });
  return Entry;
};