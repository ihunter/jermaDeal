'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     await queryInterface.bulkInsert('People', [{
       name: 'John Doe',
       isBetaMember: false
     }], {});
    */
    await queryInterface.bulkInsert('Challenges', [
      {
        "challenge": "Eat a piece of garlic",
        "time": 694267200000,
        "worth": 21000000000,
        "type": "",
        "positive": 2,
        "negative": 1
      },
      {
        "challenge": "Eat a piece of garlic",
        "time": 694267200000,
        "worth": 21000000000,
        "type": "",
        "positive": 2,
        "negative": 1
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Challenges', null, {});
  }
};
