import express from 'express';
import {
  signup,
  login,
  logout,
  refreshAccessToken,
  getMe,
} from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { signupSchema, loginSchema } from '../validators/authValidator.js';

const router = express.Router();

router.post('/signup', validate(signupSchema), signup);
router.post('/login', validate(loginSchema), login);
router.post('/logout', authenticate, logout);
router.post('/refresh', refreshAccessToken);
router.get('/me', authenticate, getMe);

export default router;
