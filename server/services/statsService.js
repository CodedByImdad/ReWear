const User = require('../models/User');
const Item = require('../models/Item');
const Request = require('../models/Request');

// All figures are PLATFORM / PROJECT-DEFINED METRICS (not scientifically
// verified environmental savings).
const getStats = async () => {
  const [
    totalUsers,
    activeUsers,
    totalItems,
    availableItems,
    requestedItems,
    exchangedItems,
    donatedItems,
    pendingRequests,
    acceptedRequests,
    totalRequests,
    completedExchanges,
    completedDonations,
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ isActive: true }),
    Item.countDocuments({ status: { $ne: 'Removed' } }),
    Item.countDocuments({ status: 'Available' }),
    Item.countDocuments({ status: 'Requested' }),
    Item.countDocuments({ status: 'Exchanged' }),
    Item.countDocuments({ status: 'Donated' }),
    Request.countDocuments({ status: 'Pending' }),
    Request.countDocuments({ status: 'Accepted' }),
    Request.countDocuments(),
    Request.countDocuments({ status: 'Completed', type: 'Exchange' }),
    Request.countDocuments({ status: 'Completed', type: 'Donation' }),
  ]);

  const impactScore = completedExchanges + completedDonations;

  return {
    totalUsers,
    activeUsers,
    totalItems,
    availableItems,
    requestedItems,
    exchangedItems,
    donatedItems,
    pendingRequests,
    acceptedRequests,
    totalRequests,
    completedExchanges,
    completedDonations,
    impactScore,
    itemsKeptInCirculation: exchangedItems + donatedItems,
  };
};

// Per-user figures for the dashboard.
const getUserStats = async (userId) => {
  const [myListings, myPendingRequests, incomingPendingRequests] = await Promise.all([
    Item.countDocuments({ owner: userId, status: { $ne: 'Removed' } }),
    Request.countDocuments({ requester: userId, status: 'Pending' }),
    Request.countDocuments({ owner: userId, status: 'Pending' }),
  ]);

  const [completedExchanges, completedDonations] = await Promise.all([
    Request.countDocuments({
      $or: [{ requester: userId }, { owner: userId }],
      status: 'Completed',
      type: 'Exchange',
    }),
    Request.countDocuments({
      $or: [{ requester: userId }, { owner: userId }],
      status: 'Completed',
      type: 'Donation',
    }),
  ]);

  return {
    myListings,
    myPendingRequests,
    incomingPendingRequests,
    completedExchanges,
    completedDonations,
    impactScore: completedExchanges + completedDonations,
  };
};

module.exports = { getStats, getUserStats };
