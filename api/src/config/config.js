require('dotenv').config();

const base = {
  dialect: 'postgres',
  logging: false,
};

module.exports = {
  development: {
    url: process.env.DATABASE_URL,
    ...base,
  },
  test: {
    url: process.env.DATABASE_URL_TEST || process.env.DATABASE_URL,
    ...base,
  },
  production: {
    url: process.env.DATABASE_URL,
    ...base,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};
