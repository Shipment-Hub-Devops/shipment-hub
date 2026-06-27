'use strict';

const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface) {
    const now = new Date();
    await queryInterface.bulkInsert('users', [
      {
        name: 'Amina Operator',
        email: 'operator@shipmenthub.test',
        password_hash: bcrypt.hashSync('Operator123!', 10),
        role: 'operator',
        created_at: now,
        updated_at: now,
      },
      {
        name: 'Kwame Client',
        email: 'client@shipmenthub.test',
        password_hash: bcrypt.hashSync('Client123!', 10),
        role: 'client',
        created_at: now,
        updated_at: now,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users', {
      email: ['operator@shipmenthub.test', 'client@shipmenthub.test'],
    });
  },
};
