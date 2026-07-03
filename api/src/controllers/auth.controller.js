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

const register = async (req, res) => {
  try {
    // 1. Extract the name alongside email and password
    const { name, email, password } = req.body;

    const existingUser = await db.User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'A user with this email already exists.' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 2. Pass the name, and change 'password' to 'passwordHash'
    const newUser = await db.User.create({
      name,
      email,
      passwordHash: hashedPassword, 
    });

    return res.status(201).json({
      message: 'User registered successfully!',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error('Registration Error:', error);
    return res.status(500).json({ message: 'Internal server error during registration.' });
  }
};

module.exports = { login, me, register };