import jwt from 'jsonwebtoken';
import config from '../config/index.js';
import { dbGet } from '../database/db.js';

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    // Expected format: "Bearer <token>"
    const token = authHeader && authHeader.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : null;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No authentication token provided.',
      });
    }

    // Verify token signature and expiration
    jwt.verify(token, config.JWT_SECRET, async (err, decoded) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          return res.status(401).json({
            success: false,
            message: 'Session has expired. Please log in again.',
          });
        }
        return res.status(403).json({
          success: false,
          message: 'Invalid or forged authentication token.',
        });
      }

      // Query database to ensure user still exists in SQLite
      const user = await dbGet(
        'SELECT id, name, email, created_at FROM users WHERE id = ?',
        [decoded.id]
      );

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User associated with this token no longer exists.',
        });
      }

      // Attach authenticated user to request context
      req.user = user;
      next();
    });
  } catch (error) {
    console.error('Authentication middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during authentication verification.',
    });
  }
};

export default authenticateToken;
