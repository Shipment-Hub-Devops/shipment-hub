const bcrypt = require('bcryptjs');
const db = require('../database/models');
const { signToken } = require('../utils/jwt');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  const user = await db.User.findOne({ where: { email } });
  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatches) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const token = signToken({ id: user.id, role: user.role });
  res.json({ token, user: user.toSafeJSON() });
});

const me = catchAsync(async (req, res) => {
  res.json({ user: req.user.toSafeJSON() });
});

module.exports = { login, me };