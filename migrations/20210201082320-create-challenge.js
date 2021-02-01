'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Challenges', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.STRING
      },
      title: {
        type: Sequelize.STRING
      },
      time: {
        type: Sequelize.BIGINT
      },
      description: {
        type: Sequelize.TEXT
      },
      worth: {
        type: Sequelize.DOUBLE
      },
      type: {
        type: Sequelize.STRING
      },
      username: {
        type: Sequelize.STRING
      },
      positive: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      negative: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Challenges');
  }
};