const path = require('path');
const fs = require('fs');
const Item = require('../models/Item');
const Request = require('../models/Request');
const { ok, created, fail } = require('../utils/response');

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const UPDATABLE_FIELDS = [
  'title',
  'description',
  'category',
  'size',
  'condition',
  'gender',
  'image',
  'location',
  'type',
];

// GET /api/items
// Public browse with search + filters. `owner=<userId|me>` restricts results
// to that owner (used by My Listings); `mine=1` requires auth and returns the
// caller's own items regardless of status.
const getItems = async (req, res, next) => {
  try {
    const {
      search,
      category,
      size,
      condition,
      type,
      location,
      status,
      owner,
      mine,
      exclude,
    } = req.query;

    const filter = {};

    if (search) {
      const rx = new RegExp(escapeRegex(String(search).trim()), 'i');
      filter.$or = [{ title: rx }, { description: rx }];
    }
    if (category) filter.category = category;
    if (size) filter.size = size;
    if (condition) filter.condition = condition;
    if (type) filter.type = type;
    if (location) filter.location = new RegExp(escapeRegex(String(location).trim()), 'i');

    if (mine === '1' || mine === 'true') {
      if (!req.user) return fail(res, 401, 'Authentication required');
      filter.owner = req.user._id;
    } else if (owner) {
      if (owner === 'me') {
        if (!req.user) return fail(res, 401, 'Authentication required');
        filter.owner = req.user._id;
      } else {
        filter.owner = owner;
      }
    }

    // Public browse shows active listings only, unless an explicit status is given.
    if (status) {
      filter.status = status;
    } else if (!filter.owner) {
      filter.status = { $in: ['Available', 'Requested'] };
    }

    if (exclude) {
      filter._id = { $ne: exclude };
    }

    const items = await Item.find(filter)
      .populate('owner', 'name email location role')
      .sort({ createdAt: -1 });

    return ok(res, items, 'Items fetched');
  } catch (error) {
    next(error);
  }
};

// GET /api/items/:id
const getItemById = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id).populate('owner', 'name email location role createdAt');
    if (!item || item.status === 'Removed') {
      return fail(res, 404, 'Item not found');
    }
    return ok(res, item, 'Item fetched');
  } catch (error) {
    next(error);
  }
};

// POST /api/items (multipart when an image is attached, JSON otherwise)
const createItem = async (req, res, next) => {
  try {
    const { title, description, category, size, condition, gender, location, type } = req.body;

    const missing = ['title', 'description', 'category', 'size', 'condition', 'gender', 'location', 'type']
      .filter((f) => !req.body[f]);
    if (missing.length) {
      return fail(res, 400, `Missing required fields: ${missing.join(', ')}`);
    }

    const item = await Item.create({
      owner: req.user._id,
      title,
      description,
      category,
      size,
      condition,
      gender,
      location,
      type,
      image: req.file ? `/uploads/${req.file.filename}` : '',
      status: 'Available',
    });

    const populated = await item.populate('owner', 'name email location role');
    return created(res, populated, 'Item listed successfully');
  } catch (error) {
    next(error);
  }
};

// PUT /api/items/:id (owner or admin)
const updateItem = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item || item.status === 'Removed') return fail(res, 404, 'Item not found');

    const isOwner = String(item.owner) === String(req.user._id);
    if (!isOwner && req.user.role !== 'admin') {
      return fail(res, 403, 'You can only edit your own listings');
    }

    if (item.status !== 'Available' && item.status !== 'Requested') {
      return fail(res, 400, `A ${item.status.toLowerCase()} item can no longer be edited`);
    }

    UPDATABLE_FIELDS.forEach((field) => {
      if (req.body[field] !== undefined) item[field] = req.body[field];
    });

    if (req.file) item.image = `/uploads/${req.file.filename}`;

    await item.save();
    const populated = await item.populate('owner', 'name email location role');
    return ok(res, populated, 'Item updated successfully');
  } catch (error) {
    next(error);
  }
};

// DELETE /api/items/:id - owner hard-deletes own listing, admin may remove any.
const deleteItem = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return fail(res, 404, 'Item not found');

    const isOwner = String(item.owner) === String(req.user._id);
    if (!isOwner && req.user.role !== 'admin') {
      return fail(res, 403, 'You can only delete your own listings');
    }

    if (item.status === 'Exchanged' || item.status === 'Donated') {
      return fail(res, 400, 'Completed transactions cannot be deleted');
    }

    // Cancel any open requests so the data stays consistent.
    await Request.updateMany(
      { item: item._id, status: 'Pending' },
      { $set: { status: 'Cancelled' } }
    );

    // Delete the uploaded image file (ignore failures).
    if (item.image) {
      const file = path.join(__dirname, '..', 'uploads', path.basename(item.image));
      fs.unlink(file, () => {});
    }

    await item.deleteOne();
    return ok(res, { id: req.params.id }, 'Item deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = { getItems, getItemById, createItem, updateItem, deleteItem };
