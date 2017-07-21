'use strict';
module.exports = function(sequelize, DataTypes) {
  var Reading = sequelize.define('Reading', {
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
        Reading.belongsTo(models.Node, {
          foreignKey: 'nodeId',
        });
      }
    }
  });
  return Reading;
};