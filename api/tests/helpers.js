const bcrypt = require('bcryptjs');
const db = require('../src/database/models');

// Recreates the schema from the models for an isolated test run.
const resetDatabase = async () => {
  await db.sequelize.sync({ force: true });
};

const seedUsers = async () => {
  const operator = await db.User.create({
    name: 'Test Operator',
    email: 'operator@test.local',
    passwordHash: bcrypt.hashSync('Operator123!', 10),
    role: 'operator',
  });
  const client = await db.User.create({
    name: 'Test Client',
    email: 'client@test.local',
    passwordHash: bcrypt.hashSync('Client123!', 10),
    role: 'client',
  });
  return { operator, client };
};

module.exports = { resetDatabase, seedUsers, db };
