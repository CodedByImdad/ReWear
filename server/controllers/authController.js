const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { ok, created, fail } = require('../utils/response');

// POST /api/auth/register
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) {
      return fail(res, 400, 'Name, email and password are required');
    }
    const existing = await User.findOne({ email: String(email).toLowerCase().trim() });
    if (existing) {
      return fail(res, 400, 'An account with this email already exists');
    }
    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);
    return created(res, { token, user }, 'Account created successfully');
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return fail(res, 400, 'Email and password are required');
    }
    const user = await User.findOne({ email: String(email).toLowerCase().trim() }).select(
      '+password'
    );
    if (!user || !(await user.matchPassword(password))) {
      return fail(res, 401, 'Invalid credentials');
    }
    if (!user.isActive) {
      return fail(res, 403, 'Your account has been deactivated. Contact the administrator.');
    }
    const token = generateToken(user._id);
    return ok(res, { token, user: user.toJSON() }, 'Logged in successfully');
  } catch (error) {
    next(error);
  }
};

// GET /api/auth/me
const getMe = async (req, res, next) => {
  try {
    return ok(res, req.user, 'Current user fetched');
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getMe };
