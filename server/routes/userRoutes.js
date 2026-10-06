const express = require('express');
const { getProfile, updateProfile } = require('../controllers/userController');
const { getMyImpact } = require('../controllers/healthController');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(protect);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.get('/impact', getMyImpact);

module.exports = router;
