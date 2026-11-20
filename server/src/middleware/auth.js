import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw ApiError.unauthorized('Access token required');
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select('-password -refreshToken');
    if (!user) {
      throw ApiError.unauthorized('User not found');
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      next(ApiError.unauthorized('Invalid or expired token'));
    } else {
      next(error);
    }
  }
};

// Sets req.user when a valid token is present, but never rejects.
export const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return next();

  try {
    const decoded = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password -refreshToken');
    if (user) req.user = user;
  } catch {
    // Ignore invalid tokens on public routes.
  }
  next();
};
