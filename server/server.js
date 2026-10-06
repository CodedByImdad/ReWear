const path = require('path');
const express = require('express');
const cors = require('cors');
const env = require('./config/env');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/error.middleware');

const authRoutes = require('./routes/authRoutes');
const itemRoutes = require('./routes/itemRoutes');
const requestRoutes = require('./routes/requestRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const healthRoutes = require('./routes/healthRoutes');

const app = express();

app.use(cors({ origin: env.CLIENT_URL === '*' ? true : env.CLIENT_URL, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve uploaded clothing images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API routes
app.use('/api', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

// 404 + centralized error handling
app.use(notFound);
app.use(errorHandler);

const start = async () => {
  await connectDB();
  app.listen(env.PORT, () => {
    console.log(`ReWear API running on http://localhost:${env.PORT}`);
    console.log(`Health check: http://localhost:${env.PORT}/api/health`);
    if (env.IS_DEV) {
      console.warn('WARNING: JWT_SECRET not set - using development default. Set it in server/.env');
    }
  });
};

start();

module.exports = app;
