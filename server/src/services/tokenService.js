import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { TOKEN_EXPIRY } from '../utils/constants.js';

export const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: TOKEN_EXPIRY.ACCESS,
  });
};

export const generateRefreshToken = async (userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: TOKEN_EXPIRY.REFRESH,
  });
  const hashedToken = await bcrypt.hash(token, 10);
  return { token, hashedToken };
};

export const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

export const verifyRefreshToken = async (token, hashedToken) => {
  return await bcrypt.compare(token, hashedToken);
};

export const decodeToken = (token) => {
  return jwt.decode(token);
};
