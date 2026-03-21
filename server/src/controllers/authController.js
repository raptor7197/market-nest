import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../services/tokenService.js';
import { COOKIE_OPTIONS } from '../utils/constants.js';
import ApiError from '../utils/ApiError.js';
import { validate } from '../middleware/validate.js';
import { signupSchema, loginSchema } from '../validators/authValidator.js';

export const signup = async (req, res, next) => {
  try {
    const { email, password, name, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw ApiError.conflict('Email already registered');
    }

    const user = await User.create({ email, password, name, role });

    const { token: refreshToken, hashedToken } = await generateRefreshToken(user._id);
    user.refreshToken = hashedToken;
    await user.save();

    const accessToken = generateAccessToken(user._id);

    res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
        accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

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
      data: {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
        accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.refreshToken = null;
      await user.save();
    }

    res.clearCookie('refreshToken', COOKIE_OPTIONS);

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

    const decoded = jwt.decode(refreshToken);
    if (!decoded || !decoded.id) {
      throw ApiError.unauthorized('Invalid refresh token');
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
