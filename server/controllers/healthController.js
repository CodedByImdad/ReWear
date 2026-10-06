const statsService = require('../services/statsService');
const { ok } = require('../utils/response');

// GET /api/health
const health = (req, res) => {
  res.json({ success: true, message: 'ReWear API is running' });
};

// GET /api/impact - public platform metrics (project-defined, not
// scientifically verified environmental savings).
const getImpact = async (req, res, next) => {
  try {
    const stats = await statsService.getStats();
    return ok(res, stats, 'Impact metrics fetched');
  } catch (error) {
    next(error);
  }
};

// GET /api/impact/dashboard - authenticated per-user metrics
const getMyImpact = async (req, res, next) => {
  try {
    const stats = await statsService.getUserStats(req.user._id);
    return ok(res, stats, 'Personal impact fetched');
  } catch (error) {
    next(error);
  }
};

module.exports = { health, getImpact, getMyImpact };
