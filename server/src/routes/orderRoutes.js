import express from 'express';
import {
  createOrder,
  getMyOrders,
  getBrandOrders,
  getBrandOrderStats,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
} from '../controllers/orderController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/role.js';
import { validate } from '../middleware/validate.js';
import {
  createOrderSchema,
  updateOrderStatusSchema,
} from '../validators/orderValidator.js';

const router = express.Router();

// Static paths before the dynamic /:id route.
router.post('/', authenticate, requireRole('customer'), validate(createOrderSchema), createOrder);

router.get('/my', authenticate, requireRole('customer'), getMyOrders);
router.get('/brand', authenticate, requireRole('brand'), getBrandOrders);
router.get('/brand/stats', authenticate, requireRole('brand'), getBrandOrderStats);

router.patch(
  '/:id/status',
  authenticate,
  requireRole('brand'),
  validate(updateOrderStatusSchema),
  updateOrderStatus
);
router.post('/:id/cancel', authenticate, requireRole('customer'), cancelOrder);

router.get('/:id', authenticate, getOrderById);

export default router;
