import express from 'express';
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getBrandDashboard,
  getBrandProducts,
} from '../controllers/productController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/role.js';
import { checkOwnership } from '../middleware/ownership.js';
import { validate } from '../middleware/validate.js';
import { createProductSchema, updateProductSchema } from '../validators/productValidator.js';

const router = express.Router();

router.get('/brand/dashboard', authenticate, requireRole('brand'), getBrandDashboard);
router.get('/brand/all', authenticate, requireRole('brand'), getBrandProducts);

router.get('/', getProducts);
router.get('/:id', getProductById);

router.post(
  '/',
  authenticate,
  requireRole('brand'),
  validate(createProductSchema),
  createProduct
);

router.put(
  '/:id',
  authenticate,
  requireRole('brand'),
  checkOwnership,
  validate(updateProductSchema),
  updateProduct
);

router.delete(
  '/:id',
  authenticate,
  requireRole('brand'),
  checkOwnership,
  deleteProduct
);

export default router;
