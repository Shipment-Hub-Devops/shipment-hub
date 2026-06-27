const express = require('express');
const { trackShipment } = require('../controllers/tracking.controller');

const router = express.Router();

// Public — no authentication. Access is controlled by the unguessable token.
router.get('/:token', trackShipment);

module.exports = router;
