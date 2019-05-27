'use strict';

const faker = require("faker");

module.exports = {
  up: async (queryInterface, Sequelize) => {

    const users = [];

    for(let i = 1 ; i <= 3 ; i++){
      users.push({
        name: faker.name.findName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        role: i-1,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    await queryInterface.bulkInsert('Users', users, {});

    const addedUsers = await queryInterface.sequelize.query(
      `SELECT id from "Users";`
    );

    const userRows = addedUsers[0];

    let wikis = [];
      
     for(let i = 1 ; i <= 15 ; i++){
     wikis.push({
        title: "title",
        body: "title",
        private: false,
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    return await queryInterface.bulkInsert('Wikis', wikis, {});
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.
      Example:
      return queryInterface.bulkInsert('Person', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
  },

  down: async (queryInterface) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.
      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
    await queryInterface.bulkDelete("Wikis", null, {});
    // queryInterface.bulkDelete("Users", null, {});

  }
};