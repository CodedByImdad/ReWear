const ok = (res, data, message = 'Success') =>
  res.json({ success: true, message, data });

const created = (res, data, message = 'Created') =>
  res.status(201).json({ success: true, message, data });

const fail = (res, status, message) => res.status(status).json({ success: false, message });

module.exports = { ok, created, fail };
