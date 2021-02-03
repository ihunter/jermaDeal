'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Deals', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.STRING
      },
      messageId: {
        type: Sequelize.STRING
      },
      challenge: {
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
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Deals');
  }
};