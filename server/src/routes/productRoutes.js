import express from 'express';
import {
  createProduct, getProducts, getProductById, updateProduct, deleteProduct,
  getBrandDashboard, getBrandProducts,
} from '../controllers/productController.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/role.js';
import { checkOwnership } from '../middleware/ownership.js';
import { validate, validateQuery } from '../middleware/validate.js';
import {
  createProductSchema,
  updateProductSchema,
  productQuerySchema,
  brandProductQuerySchema,
} from '../validators/productValidator.js';

const router = express.Router();

router.get('/brand/dashboard', authenticate, requireRole('brand'), getBrandDashboard);
router.get(
  '/brand/all',
  authenticate,
  requireRole('brand'),
  validateQuery(brandProductQuerySchema),
  getBrandProducts
);

router.get('/', validateQuery(productQuerySchema), getProducts);
router.get('/:id', optionalAuth, getProductById);

router.post('/', authenticate, requireRole('brand'), validate(createProductSchema), createProduct);

router.put('/:id', authenticate, requireRole('brand'), checkOwnership, validate(updateProductSchema), updateProduct);

router.delete('/:id', authenticate, requireRole('brand'), checkOwnership, deleteProduct);

export default router;
