const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const negotiationRoutes = require('./routes/negotiationRoutes');
const adminRoutes = require('./routes/adminRoutes');
const mlRoutes = require('./routes/mlRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
const rawMongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/agriconnect';
const MONGODB_URI = rawMongoUri.trim().replace(/^["']|["']$/g, '');

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Security HTTP headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: false // Allows inline images and fonts seamlessly
}));

// Rate limiting to mitigate DDoS & Brute Force
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000,
  message: { message: 'Too many requests from this IP, please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', apiLimiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 60,
  message: { message: 'Too many authentication attempts, please try again after 15 minutes.' }
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// Middleware
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Input sanitization against NoSQL injection
const sanitizeInput = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  for (const key of Object.keys(obj)) {
    if (key.startsWith('$') || key.includes('.')) {
      delete obj[key];
    } else if (typeof obj[key] === 'object') {
      sanitizeInput(obj[key]);
    }
  }
  return obj;
};

app.use((req, res, next) => {
  if (req.body) sanitizeInput(req.body);
  if (req.params) sanitizeInput(req.params);
  next();
});

// Serve static images for avatars and crops
app.use('/images', express.static(path.join(__dirname, '../frontend/public/images')));

// Request logger for debugging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/negotiations', negotiationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ml', mlRoutes);
app.use('/api/market', mlRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'AgriConnect National Agricultural Platform API',
    mongoConnected: mongoose.connection.readyState === 1
  });
});

// Quick seed endpoint - accessible directly via browser or button
const seedDatabase = require('./seed/seedData');
app.get('/api/seed', async (req, res) => {
  try {
    const result = await seedDatabase(false);
    res.json({
      success: true,
      message: 'Successfully seeded 26 Indian crops, farmers, and demo accounts!',
      result
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Self-ping to keep Render free tier alive (every 14 minutes)
if (process.env.NODE_ENV === 'production' && process.env.RENDER_EXTERNAL_URL) {
  const selfPingUrl = `${process.env.RENDER_EXTERNAL_URL}/api/health`;
  setInterval(() => {
    const http = require('https');
    http.get(selfPingUrl, (res) => {
      console.log(`[KeepAlive] Self-ping → ${res.statusCode}`);
    }).on('error', (err) => {
      console.warn('[KeepAlive] Self-ping error:', err.message);
    });
  }, 14 * 60 * 1000); // 14 minutes
}

// Production Frontend Static Assets Serving
const fs = require('fs');
const distPath = path.join(__dirname, '../frontend/dist');
if (process.env.NODE_ENV === 'production' || fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res, next) => {
    if (req.url.startsWith('/api') || req.url.startsWith('/images')) return next();
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// MongoDB connection options with retry logic
const mongoOptions = {
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  maxPoolSize: 10,
  retryWrites: true,
  retryReads: true,
};

// Auto-reconnect handler
mongoose.connection.on('disconnected', () => {
  console.warn('[MongoDB] Disconnected. Attempting reconnect in 5s...');
  setTimeout(() => {
    mongoose.connect(MONGODB_URI, mongoOptions).catch(err =>
      console.error('[MongoDB] Reconnect failed:', err.message)
    );
  }, 5000);
});

mongoose.connection.on('reconnected', () => {
  console.log('[MongoDB] Reconnected successfully.');
});

mongoose.connection.on('error', (err) => {
  console.error('[MongoDB] Connection error:', err.message);
});

// Connect to MongoDB & Start Server
mongoose.connect(MONGODB_URI, mongoOptions)
  .then(async () => {
    console.log('Successfully connected to MongoDB:', MONGODB_URI);

    // Auto-seed if DB is empty (happens after Atlas cluster resume or fresh deployment)
    try {
      const Product = require('./models/Product');
      const count = await Product.countDocuments();
      if (count === 0) {
        console.log('[AutoSeed] Database is empty — auto-seeding crops and demo users...');
        await seedDatabase(false);
        console.log('[AutoSeed] 26 crops seeded successfully.');
      } else {
        console.log(`[AutoSeed] DB has ${count} products — ready.`);
      }
    } catch (seedErr) {
      console.warn('[AutoSeed] Check failed:', seedErr.message);
    }

    app.listen(PORT, () => {
      console.log(`AgriConnect Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    // Still start server so frontend can serve and show error
    app.listen(PORT, () => {
      console.log(`AgriConnect Server running on port ${PORT} (DB offline — retrying in background)`);
    });
    // Keep retrying connection in background
    const retryConnect = () => {
      setTimeout(() => {
        mongoose.connect(MONGODB_URI, mongoOptions)
          .then(() => console.log('[MongoDB] Reconnected after startup failure.'))
          .catch(() => retryConnect());
      }, 10000);
    };
    retryConnect();
  });
