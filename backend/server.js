import express from 'express';
import cors from 'cors';
import config from './config/index.js';
import { initDatabase } from './database/db.js';
import authRoutes from './routes/authRoutes.js';
import { notFoundHandler, globalErrorHandler } from './middleware/errorMiddleware.js';

const app = express();

// Enable Cross-Origin Resource Sharing (CORS)
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  config.CLIENT_ORIGIN,
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, postman)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true); // Dev-friendly fallback
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body Parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logging (development aid)
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  next();
});

// Root API Welcome Route
app.get('/api', (req, res) => {
  res.json({
    status: 'online',
    service: 'AuthShield Enterprise Authentication API',
    version: '1.0.0',
    documentation: {
      register: 'POST /api/auth/register',
      login: 'POST /api/auth/login',
      getMe: 'GET /api/auth/me',
      logout: 'POST /api/auth/logout',
      health: 'GET /api/auth/health',
    },
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/system', authRoutes);

// 404 Not Found Catch-All
app.use(notFoundHandler);

// Global Error Handler
app.use(globalErrorHandler);

// Start Server and Initialize SQLite
const startServer = async () => {
  try {
    await initDatabase();

    app.listen(config.PORT, () => {
      console.log('====================================================');
      console.log(`🚀 AuthShield Server running on port ${config.PORT}`);
      console.log(`🌐 Base API URL: http://localhost:${config.PORT}/api`);
      console.log(`🛡️  Auth Endpoints: http://localhost:${config.PORT}/api/auth`);
      console.log(`💾 SQLite Database connected & schema verified`);
      console.log('====================================================');
    });
  } catch (error) {
    console.error('Fatal: Failed to start backend server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
