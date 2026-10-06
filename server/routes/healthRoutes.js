const express = require('express');
const { health, getImpact } = require('../controllers/healthController');

const router = express.Router();

router.get('/health', health);
router.get('/impact', getImpact);

module.exports = router;
