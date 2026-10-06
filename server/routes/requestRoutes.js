const express = require('express');
const {
  createRequest,
  getMyRequests,
  getIncomingRequests,
  getRequestById,
  acceptRequest,
  rejectRequest,
  cancelRequest,
  completeRequest,
} = require('../controllers/requestController');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(protect);

router.post('/', createRequest);
router.get('/my', getMyRequests);
router.get('/incoming', getIncomingRequests);
router.get('/:id', getRequestById);
router.put('/:id/accept', acceptRequest);
router.put('/:id/reject', rejectRequest);
router.put('/:id/cancel', cancelRequest);
router.put('/:id/complete', completeRequest);

module.exports = router;
