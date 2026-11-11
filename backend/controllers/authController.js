import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../config/index.js';
import { dbGet, dbRun, dbAll } from '../database/db.js';

// Helper: Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Controller: Register a new user
 * POST /api/auth/register
 */
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // 1. Validation: Field presence
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields (name, email, password) are required.',
      });
    }

    const trimmedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();

    // 2. Validation: Name length
    if (trimmedName.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Full name must be at least 2 characters.',
      });
    }

    // 3. Validation: Email format
    if (!EMAIL_REGEX.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.',
      });
    }

    // 4. Validation: Password strength
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long.',
      });
    }

    // 5. Check if email already exists in SQLite
    const existingUser = await dbGet(
      'SELECT id FROM users WHERE email = ?',
      [normalizedEmail]
    );

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists. Please log in.',
      });
    }

    // 6. Hash password using bcrypt
    const passwordHash = await bcrypt.hash(password, config.BCRYPT_SALT_ROUNDS);

    // 7. Store user record in SQLite
    const result = await dbRun(
      'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
      [trimmedName, normalizedEmail, passwordHash]
    );

    // 8. Fetch the newly created user record (excluding password_hash)
    const newUser = await dbGet(
      'SELECT id, name, email, created_at FROM users WHERE id = ?',
      [result.lastID]
    );

    // 9. Generate JWT authentication token
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      config.JWT_SECRET,
      { expiresIn: config.JWT_EXPIRES_IN }
    );

    return res.status(201).json({
      success: true,
      message: 'Account created successfully! Welcome to AuthShield.',
      user: newUser,
      token,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller: Authenticate existing user
 * POST /api/auth/login
 */
export const login = async (req, res, next) => {
  try {
    const { email, password, rememberMe } = req.body;

    // 1. Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Both email and password are required.',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // 2. Fetch user from SQLite (including password_hash for comparison)
    const user = await dbGet(
      'SELECT id, name, email, password_hash, created_at FROM users WHERE email = ?',
      [normalizedEmail]
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // 3. Compare submitted password with bcrypt hash
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // 4. Generate JWT with dynamic expiration based on rememberMe
    const expiresIn = rememberMe
      ? config.JWT_REMEMBER_EXPIRES_IN
      : config.JWT_EXPIRES_IN;

    const token = jwt.sign(
      { id: user.id, email: user.email },
      config.JWT_SECRET,
      { expiresIn }
    );

    // 5. Exclude password_hash from the response
    const sanitizedUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.created_at,
    };

    return res.status(200).json({
      success: true,
      message: 'Authentication successful. Welcome back!',
      user: sanitizedUser,
      token,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller: Get current user profile
 * GET /api/auth/me
 */
export const getMe = async (req, res) => {
  // req.user is set by authenticateToken middleware
  return res.status(200).json({
    success: true,
    user: req.user,
  });
};

/**
 * Controller: Logout user session
 * POST /api/auth/logout
 */
export const logout = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Session terminated successfully.',
  });
};

/**
 * Controller: System Health & College Assignment Inspector
 * GET /api/system/health
 */
export const getSystemHealth = async (req, res, next) => {
  try {
    const userCountRow = await dbGet('SELECT COUNT(*) as total_users FROM users');
    const tableInfo = await dbAll('PRAGMA table_info(users)');

    return res.status(200).json({
      success: true,
      status: 'operational',
      database: {
        engine: 'SQLite3',
        schema: 'users',
        columns: tableInfo.map((c) => ({ name: c.name, type: c.type, notnull: !!c.notnull, pk: !!c.pk })),
        total_registered_users: userCountRow?.total_users || 0,
      },
      security: {
        hashing: 'bcrypt',
        salt_rounds: config.BCRYPT_SALT_ROUNDS,
        tokens: 'JSON Web Tokens (JWT)',
        token_expiration: config.JWT_EXPIRES_IN,
      },
      server_time: new Date().toISOString(),
      uptime_seconds: Math.floor(process.uptime()),
    });
  } catch (error) {
    next(error);
  }
};
