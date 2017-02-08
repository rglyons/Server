'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Entries', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      humidity: {
        type: Sequelize.INTEGER
      },
      temperature: {
        type: Sequelize.INTEGER
      },
      sunlight: {
        type: Sequelize.INTEGER
      },
      moisture: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      sensorId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Sensors',
          key: 'id',
          as: 'sensorId',
        },
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('Entries');
  }
};