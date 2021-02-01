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
        "userId": "175045185976139785",
        "title": "Eat a piece of garlic",
        "time": 694267200000,
        "worth": 21000000000,
        "positive": 2,
        "negative": 1,
        "createdAt": new Date,
        "updatedAt": new Date
      },
      {
        "userId": "242093291447910420",
        "title": "Exist",
        "worth": 100000000,
        "positive": 1,
        "negative": 2,
        "createdAt": new Date,
        "updatedAt": new Date
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
