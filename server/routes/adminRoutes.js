const express = require('express');
const {
  getStats,
  getUsers,
  toggleUserStatus,
  deleteUser,
  getItems,
  removeItem,
  getRequests,
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(protect, adminOnly);

router.get('/stats', getStats);
router.get('/users', getUsers);
router.put('/users/:id/toggle-status', toggleUserStatus);
router.delete('/users/:id', deleteUser);
router.get('/items', getItems);
router.delete('/items/:id', removeItem);
router.get('/requests', getRequests);

module.exports = router;
