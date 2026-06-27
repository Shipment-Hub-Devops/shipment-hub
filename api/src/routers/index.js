const express = require('express');
const trackingRoutes = require('./tracking.routes');

const router = express.Router();

router.get('/', (req, res) =>
  res.json({ name: 'ShipmentHub API', version: 'v1' })
);

router.use('/track', trackingRoutes);

module.exports = router;
