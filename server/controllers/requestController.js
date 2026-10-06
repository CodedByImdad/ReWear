const Request = require('../models/Request');
const Item = require('../models/Item');
const { ok, created, fail } = require('../utils/response');

const POPULATE = [
  { path: 'item', select: 'title image category size condition type status location owner' },
  { path: 'requester', select: 'name email location' },
  { path: 'owner', select: 'name email location' },
  { path: 'offeredItem', select: 'title image category size condition type status location' },
];

// owner/requester may be populated objects (after loadRequest) or plain ids.
const ownerIdOf = (r) => String(r.owner?._id || r.owner);
const requesterIdOf = (r) => String(r.requester?._id || r.requester);

// POST /api/requests
// Body: { itemId, message?, offeredItemId? }
const createRequest = async (req, res, next) => {
  try {
    const { itemId, message = '', offeredItemId } = req.body || {};
    if (!itemId) return fail(res, 400, 'itemId is required');

    const item = await Item.findById(itemId);
    if (!item || item.status === 'Removed') return fail(res, 404, 'Item not found');
    if (String(item.owner) === String(req.user._id)) {
      return fail(res, 400, 'You cannot request your own item');
    }
    if (item.status !== 'Available') {
      return fail(res, 400, 'This item is no longer available for requests');
    }

    const duplicate = await Request.findOne({
      item: item._id,
      requester: req.user._id,
      status: { $in: ['Pending', 'Accepted'] },
    });
    if (duplicate) return fail(res, 400, 'You already have an open request for this item');

    let offeredItem = null;
    if (item.type === 'Exchange') {
      if (!offeredItemId) return fail(res, 400, 'Select one of your items to offer in exchange');
      offeredItem = await Item.findById(offeredItemId);
      if (!offeredItem || offeredItem.status === 'Removed') {
        return fail(res, 404, 'Offered item not found');
      }
      if (String(offeredItem.owner) !== String(req.user._id)) {
        return fail(res, 403, 'You can only offer your own items');
      }
      if (offeredItem.status !== 'Available') {
        return fail(res, 400, 'The offered item must be available');
      }
      if (String(offeredItem._id) === String(item._id)) {
        return fail(res, 400, 'You cannot offer the same item');
      }
    }

    const request = await Request.create({
      item: item._id,
      requester: req.user._id,
      owner: item.owner,
      type: item.type,
      message,
      offeredItem: offeredItem ? offeredItem._id : null,
      status: 'Pending',
    });

    item.status = 'Requested';
    await item.save();

    const populated = await request.populate(POPULATE);
    return created(res, populated, `${item.type} request sent to the owner`);
  } catch (error) {
    next(error);
  }
};

// GET /api/requests/my
const getMyRequests = async (req, res, next) => {
  try {
    const requests = await Request.find({ requester: req.user._id })
      .populate(POPULATE)
      .sort({ createdAt: -1 });
    return ok(res, requests, 'My requests fetched');
  } catch (error) {
    next(error);
  }
};

// GET /api/requests/incoming
const getIncomingRequests = async (req, res, next) => {
  try {
    const requests = await Request.find({ owner: req.user._id })
      .populate(POPULATE)
      .sort({ createdAt: -1 });
    return ok(res, requests, 'Incoming requests fetched');
  } catch (error) {
    next(error);
  }
};

// GET /api/requests/:id
const getRequestById = async (req, res, next) => {
  try {
    const request = await Request.findById(req.params.id).populate(POPULATE);
    if (!request) return fail(res, 404, 'Request not found');
    const uid = String(req.user._id);
    if (requesterIdOf(request) !== uid && ownerIdOf(request) !== uid && req.user.role !== 'admin') {
      return fail(res, 403, 'Not authorized to view this request');
    }
    return ok(res, request, 'Request fetched');
  } catch (error) {
    next(error);
  }
};

const loadRequest = async (req, res) => {
  const request = await Request.findById(req.params.id).populate(POPULATE);
  if (!request) {
    fail(res, 404, 'Request not found');
    return null;
  }
  return request;
};

// PUT /api/requests/:id/accept - item owner only
const acceptRequest = async (req, res, next) => {
  try {
    const request = await loadRequest(req, res);
    if (!request) return;
    if (ownerIdOf(request) !== String(req.user._id)) {
      return fail(res, 403, 'Only the item owner can accept this request');
    }
    if (request.status !== 'Pending') {
      return fail(res, 400, `Only pending requests can be accepted (current: ${request.status})`);
    }
    request.status = 'Accepted';
    await request.save();
    const populated = await request.populate(POPULATE);
    return ok(res, populated, 'Request accepted');
  } catch (error) {
    next(error);
  }
};

// PUT /api/requests/:id/reject - item owner only; item returns to Available
const rejectRequest = async (req, res, next) => {
  try {
    const request = await loadRequest(req, res);
    if (!request) return;
    if (ownerIdOf(request) !== String(req.user._id)) {
      return fail(res, 403, 'Only the item owner can reject this request');
    }
    if (request.status !== 'Pending') {
      return fail(res, 400, `Only pending requests can be rejected (current: ${request.status})`);
    }
    request.status = 'Rejected';
    await request.save();

    const item = await Item.findById(request.item);
    if (item && item.status === 'Requested') {
      item.status = 'Available';
      await item.save();
    }
    if (request.offeredItem) {
      const offered = await Item.findById(request.offeredItem);
      if (offered && offered.status === 'Requested') {
        offered.status = 'Available';
        await offered.save();
      }
    }
    const populated = await request.populate(POPULATE);
    return ok(res, populated, 'Request rejected');
  } catch (error) {
    next(error);
  }
};

// PUT /api/requests/:id/cancel - requester only; item returns to Available
const cancelRequest = async (req, res, next) => {
  try {
    const request = await loadRequest(req, res);
    if (!request) return;
    if (requesterIdOf(request) !== String(req.user._id)) {
      return fail(res, 403, 'Only the requester can cancel this request');
    }
    if (request.status !== 'Pending' && request.status !== 'Accepted') {
      return fail(res, 400, `This request can no longer be cancelled (current: ${request.status})`);
    }
    request.status = 'Cancelled';
    await request.save();

    const item = await Item.findById(request.item);
    if (item && item.status === 'Requested') {
      item.status = 'Available';
      await item.save();
    }
    const populated = await request.populate(POPULATE);
    return ok(res, populated, 'Request cancelled');
  } catch (error) {
    next(error);
  }
};

// PUT /api/requests/:id/complete - either party, from Accepted.
// Donation -> item Donated. Exchange -> both items Exchanged.
const completeRequest = async (req, res, next) => {
  try {
    const request = await loadRequest(req, res);
    if (!request) return;
    const uid = String(req.user._id);
    if (requesterIdOf(request) !== uid && ownerIdOf(request) !== uid) {
      return fail(res, 403, 'Only the involved parties can complete this request');
    }
    if (request.status !== 'Accepted') {
      return fail(res, 400, `Only accepted requests can be completed (current: ${request.status})`);
    }

    request.status = 'Completed';
    await request.save();

    const item = await Item.findById(request.item);
    if (item) {
      item.status = request.type === 'Donation' ? 'Donated' : 'Exchanged';
      await item.save();
    }

    if (request.type === 'Exchange' && request.offeredItem) {
      const offered = await Item.findById(request.offeredItem);
      if (offered) {
        offered.status = 'Exchanged';
        await offered.save();
      }
    }

    const populated = await request.populate(POPULATE);
    return ok(res, populated, `${request.type} completed. Thank you for keeping clothes in circulation!`);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRequest,
  getMyRequests,
  getIncomingRequests,
  getRequestById,
  acceptRequest,
  rejectRequest,
  cancelRequest,
  completeRequest,
};
