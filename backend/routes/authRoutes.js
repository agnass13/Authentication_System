import express from 'express';
import {
  register,
  login,
  getMe,
  logout,
  getSystemHealth,
} from '../controllers/authController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public Authentication Endpoints
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

// Protected User Profile Endpoint
router.get('/me', authenticateToken, getMe);

// System Inspection & Health Endpoint
router.get('/health', getSystemHealth);

export default router;
