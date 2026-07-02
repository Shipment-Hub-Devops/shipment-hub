const express = require('express');
const { login, me } = require('../controllers/auth.controller');
const authenticate = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');
const { loginSchema } = require('../validators/auth.validator');

const router = express.Router();

router.post('/login', validate(loginSchema), login);
router.get('/me', authenticate, me);

module.exports = router;