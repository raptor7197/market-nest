import express from 'express';
import { uploadImages, uploadMiddleware } from '../controllers/uploadController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/role.js';

const router = express.Router();

router.post('/', authenticate, requireRole('brand'), uploadMiddleware, uploadImages);

export default router;
