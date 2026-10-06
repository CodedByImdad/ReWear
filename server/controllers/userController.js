const User = require('../models/User');
const { ok, fail } = require('../utils/response');

// GET /api/users/profile
const getProfile = async (req, res, next) => {
  try {
    return ok(res, req.user, 'Profile fetched');
  } catch (error) {
    next(error);
  }
};

// PUT /api/users/profile - name / email / optional password change.
// Users can never change their own role.
const updateProfile = async (req, res, next) => {
  try {
    const { name, email, password } = req.body || {};
    const user = await User.findById(req.user._id).select('+password');

    if (name !== undefined) {
      if (!String(name).trim()) return fail(res, 400, 'Name cannot be empty');
      user.name = String(name).trim();
    }

    if (email !== undefined) {
      const normalized = String(email).toLowerCase().trim();
      const existing = await User.findOne({ email: normalized, _id: { $ne: user._id } });
      if (existing) return fail(res, 400, 'That email is already in use by another account');
      user.email = normalized;
    }

    if (password !== undefined && password !== '') {
      if (String(password).length < 6) {
        return fail(res, 400, 'New password must be at least 6 characters');
      }
      user.password = password; // hashed by the pre-save hook
    }

    await user.save();
    return ok(res, user.toJSON(), 'Profile updated successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = { getProfile, updateProfile };
