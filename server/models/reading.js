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
    hooks: {
      // create a notification for each sensor reading that is
      // outside of this node's ideal range for that sensor
      // THIS MAKES POSTING A READING SLOW
      afterCreate: function(reading, options) {
        var theNode = null
        return reading.getNode()
        .then(node => {
          theNode = node
          return node.getUser()
        })
        .then(user => {
          let metrics = [
            {
              sensor: 'temperature',
              reading: reading.temperature, 
              min: theNode.tempMin,
              max: theNode.tempMax
            },
            {
              sensor: 'humidity',
              reading: reading.humidity, 
              min: theNode.humidityMin,
              max: theNode.humidityMax
            },
            {
              sensor: 'moisture',
              reading: reading.moisture, 
              min: theNode.moistureMin,
              max: theNode.moistureMax
            },  
            {
              sensor: 'sunlught',
              reading: reading.sunlight, 
              min: theNode.sunlightMin,
              max: theNode.sunlightMax
            }
          ]
          // loop through reading metrics and generate
          // a notification for each that breaches its ideal range
          for (let i=0; i < metrics.length; i++) {
            let metric = metrics[i]
            if (metric.reading > metric.max) {
              sequelize.models.Notification
                .create({
                  sensor: metric.sensor,
                  overMax: true,
                  underMin: false,
                  reading: metric.reading,
                  nodeId: theNode.id,
                  userId: user.id
                })
            } else if (metric.reading < metric.min) {
              sequelize.models.Notification
                .create({
                  sensor: metric.sensor,
                  overMax: false,
                  underMin: true,
                  reading: metric.reading,
                  nodeId: theNode.id,
                  userId: user.id
                })
            }
          }
        })
      }
    },
    classMethods: {
      associate: function(models) {
        Reading.belongsTo(models.Node, {
          foreignKey: 'nodeId',
          hooks: true,
          as: 'node'  // this name is used by Sequelize to create the getUser() function
        });           // used in the hooks above
      }
    }
  });
  return Reading;
};