require('dotenv').config();

const app = require('./app');
const db = require('./database/models');

const PORT = process.env.PORT || 4000;
const MAX_RETRIES = Number(process.env.DB_CONNECT_RETRIES) || 10;
const RETRY_DELAY_MS = Number(process.env.DB_CONNECT_RETRY_DELAY_MS) || 3000;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Wait for the database to accept connections. In containerised setups the API
// often starts before PostgreSQL is ready, so we retry instead of crashing.
const connectWithRetry = async () => {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt += 1) {
    try {
      await db.sequelize.authenticate();
      return;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn(
        `Database not ready (attempt ${attempt}/${MAX_RETRIES}): ${error.message}`
      );
      if (attempt === MAX_RETRIES) throw error;
      await wait(RETRY_DELAY_MS);
    }
  }
};

(async () => {
  try {
    await connectWithRetry();
    app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`ShipmentHub API running on http://localhost:${PORT}`);
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Unable to start server:', error);
    process.exit(1);
  }
})();