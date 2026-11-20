import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../services/tokenService.js';
import { COOKIE_OPTIONS, CLEAR_COOKIE_OPTIONS } from '../utils/constants.js';
import ApiError from '../utils/ApiError.js';
import { validate } from '../middleware/validate.js';
import { signupSchema, loginSchema } from '../validators/authValidator.js';

const normalizeEmail = (email = '') => String(email).trim().toLowerCase();

const publicUser = (user) => ({
  id: user._id,
  email: user.email,
  name: user.name,
  role: user.role,
});

export const signup = async (req, res, next) => {
  try {
    const { password, name, role } = req.body;
    const email = normalizeEmail(req.body.email);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw ApiError.conflict('Email already registered');
    }

    let user;
    try {
      user = await User.create({ email, password, name, role });
    } catch (error) {
      if (error.code === 11000) {
        throw ApiError.conflict('Email already registered');
      }
      throw error;
    }

    const { token: refreshToken, hashedToken } = await generateRefreshToken(user._id);
    user.refreshToken = hashedToken;
    await user.save();

    const accessToken = generateAccessToken(user._id);

    res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);

    res.status(201).json({
      success: true,
      data: { user: publicUser(user), accessToken },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { password } = req.body;
    const email = normalizeEmail(req.body.email);

    const user = await User.findOne({ email }).select('+password +refreshToken');
    if (!user) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    const { token: refreshToken, hashedToken } = await generateRefreshToken(user._id);
    user.refreshToken = hashedToken;
    await user.save();

    const accessToken = generateAccessToken(user._id);

    res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);

    res.json({
      success: true,
      data: { user: publicUser(user), accessToken },
    });
  } catch (error) {
    next(error);
  }
};

// Logout is intentionally not behind `authenticate`: an expired access token
// must not prevent clearing the refresh cookie / server-side refresh hash.
export const logout = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (refreshToken) {
      try {
        const decoded = jwt.verify(
          refreshToken,
          process.env.JWT_REFRESH_SECRET
        );
        const user = await User.findById(decoded.id);
        if (user) {
          user.refreshToken = null;
          await user.save();
        }
      } catch {
        // Token already invalid/expired: still clear the cookie below.
      }
    }

    res.clearCookie('refreshToken', CLEAR_COOKIE_OPTIONS);

    res.json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const refreshAccessToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw ApiError.unauthorized('Refresh token not found');
    }

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch {
      throw ApiError.unauthorized('Invalid or expired refresh token');
    }

    const user = await User.findById(decoded.id).select('+refreshToken');
    if (!user || !user.refreshToken) {
      throw ApiError.unauthorized('Session expired. Please login again.');
    }

    const isValid = await verifyRefreshToken(refreshToken, user.refreshToken);
    if (!isValid) {
      throw ApiError.unauthorized('Invalid refresh token');
    }

    const accessToken = generateAccessToken(user._id);

    res.json({
      success: true,
      data: { accessToken },
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({
      success: true,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

export const validateMiddleware = validate;
export { signupSchema, loginSchema };
