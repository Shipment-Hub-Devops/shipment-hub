# ShipmentHub API

Express + Sequelize REST API for the ShipmentHub logistics coordination platform.

## Stack

Node.js · Express 4 · Sequelize (PostgreSQL) · JWT auth · Joi validation · Helmet · Jest + Supertest

## Setup

```bash
cp .env.example .env     # Windows PowerShell: copy .env.example .env
npm install
# create the databases referenced in .env (e.g. shipmenthub_dev, shipmenthub_test)
npm run migrate
npm run seed
npm run dev              # http://localhost:4000
```

## Scripts

| Script                | Description                                  |
| --------------------- | -------------------------------------------- |
| `npm run dev`         | Start with nodemon (auto-reload)             |
| `npm start`           | Start the server                             |
| `npm run migrate`     | Run Sequelize migrations                     |
| `npm run seed`        | Seed demo users and a sample shipment        |
| `npm run db:reset`    | Undo migrations, re-migrate and re-seed      |
| `npm test`            | Run the Jest + Supertest suite (needs test DB) |

## Environment

| Variable             | Description                               |
| -------------------- | ----------------------------------------- |
| `PORT`               | API port (default 4000)                   |
| `DATABASE_URL`       | PostgreSQL connection string              |
| `DATABASE_URL_TEST`  | Connection string for the test database   |
| `JWT_SECRET`         | Secret used to sign JWTs                   |
| `JWT_EXPIRES_IN`     | Token lifetime (e.g. `7d`)                |
| `CLIENT_ORIGIN`      | Allowed CORS origin (the web app URL)     |

## Project layout

```
src/
├── app.js              # Express app (middleware + routes)
├── server.js           # Entry point
├── config/             # Sequelize config
├── database/
│   ├── models/         # User, Shipment, ShipmentEvent
│   ├── migrations/
│   └── seeders/
├── controllers/        # auth, shipments, tracking
├── routers/            # /auth, /shipments, /track
├── middlewares/        # auth, role, validation, errors
├── validators/         # Joi schemas
└── utils/              # jwt, tokens, constants
```
