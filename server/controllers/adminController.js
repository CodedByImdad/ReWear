const User = require('../models/User');
const Item = require('../models/Item');
const Request = require('../models/Request');
const statsService = require('../services/statsService');
const { ok, fail } = require('../utils/response');

// GET /api/admin/stats
const getStats = async (req, res, next) => {
  try {
    const stats = await statsService.getStats();
    return ok(res, stats, 'Admin statistics fetched');
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/users
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    const userIds = users.map((u) => u._id);
    const [listingAgg, requestAgg] = await Promise.all([
      Item.aggregate([
        { $match: { owner: { $in: userIds } } },
        { $group: { _id: '$owner', count: { $sum: 1 } } },
      ]),
      Request.aggregate([
        { $match: { $or: [{ requester: { $in: userIds } }, { owner: { $in: userIds } }] } },
        { $group: { _id: null, count: { $sum: 1 } } },
      ]),
    ]);
    const listingMap = {};
    listingAgg.forEach((r) => {
      listingMap[String(r._id)] = r.count;
    });
    const data = users.map((u) => ({
      ...u.toJSON(),
      listingCount: listingMap[String(u._id)] || 0,
    }));
    return ok(res, { users: data, totalRequests: requestAgg[0] ? requestAgg[0].count : 0 }, 'Users fetched');
  } catch (error) {
    next(error);
  }
};

// PUT /api/admin/users/:id/toggle-status - activate / deactivate
const toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return fail(res, 404, 'User not found');
    if (String(user._id) === String(req.user._id)) {
      return fail(res, 400, 'You cannot deactivate your own account');
    }
    if (user.role === 'admin') {
      return fail(res, 400, 'Admin accounts cannot be deactivated here');
    }
    user.isActive = !user.isActive;
    await user.save();
    return ok(res, user.toJSON(), `Account ${user.isActive ? 'activated' : 'deactivated'}`);
  } catch (error) {
    next(error);
  }
};

// DELETE /api/admin/users/:id - removes a regular user and their data.
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return fail(res, 404, 'User not found');
    if (String(user._id) === String(req.user._id)) {
      return fail(res, 400, 'You cannot delete your own admin account');
    }
    if (user.role === 'admin') return fail(res, 400, 'Admin accounts cannot be deleted');

    const items = await Item.find({ owner: user._id }).select('_id image');
    const itemIds = items.map((i) => i._id);

    await Request.deleteMany({
      $or: [{ requester: user._id }, { owner: user._id }, { item: { $in: itemIds } }],
    });
    await Item.deleteMany({ owner: user._id });
    await user.deleteOne();

    return ok(res, { id: req.params.id }, 'User and their listings removed');
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/items - includes Removed items (unlike the public browse)
const getItems = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (search) {
      const rx = new RegExp(String(search).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      filter.$or = [{ title: rx }, { description: rx }];
    }
    const items = await Item.find(filter)
      .populate('owner', 'name email')
      .sort({ createdAt: -1 });
    return ok(res, items, 'Admin items fetched');
  } catch (error) {
    next(error);
  }
};

// DELETE /api/admin/items/:id - soft remove (status -> Removed)
const removeItem = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return fail(res, 404, 'Item not found');
    if (item.status === 'Removed') return fail(res, 400, 'Item is already removed');

    await Request.updateMany(
      { item: item._id, status: { $in: ['Pending', 'Accepted'] } },
      { $set: { status: 'Cancelled' } }
    );

    item.status = 'Removed';
    await item.save();
    return ok(res, item, 'Listing removed from the platform');
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/requests?status=&type=
const getRequests = async (req, res, next) => {
  try {
    const { status, type } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (type) filter.type = type;
    const requests = await Request.find(filter)
      .populate([
        { path: 'item', select: 'title image category size condition type status' },
        { path: 'requester', select: 'name email' },
        { path: 'owner', select: 'name email' },
        { path: 'offeredItem', select: 'title image type status' },
      ])
      .sort({ createdAt: -1 });
    return ok(res, requests, 'Admin requests fetched');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStats,
  getUsers,
  toggleUserStatus,
  deleteUser,
  getItems,
  removeItem,
  getRequests,
};
