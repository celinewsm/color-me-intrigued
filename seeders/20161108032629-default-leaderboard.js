'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('leaderboards', [{
          name: 'Ellen',
          level: 10,
          createdAt: new Date(),
          updatedAt: new Date()
        },{
          name: 'Michelle',
          level: 7,
          createdAt: new Date(),
          updatedAt: new Date()
        },{
          name: 'Jake',
          level: 9,
          createdAt: new Date(),
          updatedAt: new Date()
        },{
          name: 'Barbra',
          level: 9,
          createdAt: new Date(),
          updatedAt: new Date()
        },{
          name: 'Asher',
          level: 8,
          createdAt: new Date(),
          updatedAt: new Date()
        },{
          name: 'Neil',
          level: 6,
          createdAt: new Date(),
          updatedAt: new Date()
        },{
          name: 'Tara',
          level: 12,
          createdAt: new Date(),
          updatedAt: new Date()
        },{
          name: 'Max',
          level: 11,
          createdAt: new Date(),
          updatedAt: new Date()
        },{
          name: 'Damien',
          level: 9,
          createdAt: new Date(),
          updatedAt: new Date()
        },{
          name: 'Kat',
          level: 12,
          createdAt: new Date(),
          updatedAt: new Date()
        }
    ]);
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */

    return queryInterface.bulkDelete('leaderboards', null, {});

  }
};
