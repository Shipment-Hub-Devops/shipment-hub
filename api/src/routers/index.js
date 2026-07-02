const express = require('express');
const trackingRoutes = require('./tracking.routes');
const authRoutes = require('./auth.routes');

const router = express.Router();

router.get('/', (req, res) =>
  res.json({ name: 'ShipmentHub API', version: 'v1' })
);

router.use('/track', trackingRoutes);
router.use('/auth', authRoutes);

module.exports = router;
