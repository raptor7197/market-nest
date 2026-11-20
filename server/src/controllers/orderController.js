import mongoose from 'mongoose';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import ApiError from '../utils/ApiError.js';
import { PAGINATION, ORDER_STATUS_TRANSITIONS } from '../utils/constants.js';

const buildPagination = (page, limit, total) => ({
  currentPage: page,
  totalPages: Math.ceil(total / limit),
  totalItems: total,
  itemsPerPage: limit,
  hasNextPage: page * limit < total,
  hasPrevPage: page > 1,
});

const isBrandParticipant = (order, userId) =>
  order.items.some((item) => item.brand.toString() === userId.toString());

export const createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;

    // Merge duplicate product lines.
    const merged = new Map();
    for (const item of items) {
      const existing = merged.get(item.product);
      if (existing) {
        existing.quantity += item.quantity;
      } else {
        merged.set(item.product, { product: item.product, quantity: item.quantity });
      }
    }

    const productIds = [...merged.keys()];
    const products = await Product.find({ _id: { $in: productIds } });

    if (products.length !== productIds.length) {
      throw ApiError.badRequest('One or more products no longer exist');
    }

    const productMap = new Map(products.map((p) => [p._id.toString(), p]));

    const orderItems = [];
    let totalAmount = 0;

    for (const { product, quantity } of merged.values()) {
      const found = productMap.get(product);
      if (found.status !== 'published') {
        throw ApiError.badRequest(`Product "${found.name}" is not available`);
      }
      if (quantity > 99) {
        throw ApiError.badRequest('Quantity cannot exceed 99 per item');
      }

      orderItems.push({
        product: found._id,
        brand: found.brand,
        name: found.name,
        image: found.images?.[0] || '',
        price: found.price,
        quantity,
      });

      totalAmount += found.price * quantity;
    }

    const order = await Order.create({
      customer: req.user._id,
      items: orderItems,
      totalAmount,
      shippingAddress,
      paymentMethod: paymentMethod || 'cod',
    });

    const populated = await Order.findById(order._id).populate(
      'customer',
      'name email'
    );

    res.status(201).json({ success: true, data: { order: populated } });
  } catch (error) {
    next(error);
  }
};

export const getMyOrders = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || PAGINATION.DEFAULT_PAGE;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const query = { customer: req.user._id };
    if (req.query.status) query.status = req.query.status;

    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate('items.brand', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Order.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: { orders, pagination: buildPagination(page, limit, total) },
    });
  } catch (error) {
    next(error);
  }
};

export const getBrandOrders = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || PAGINATION.DEFAULT_PAGE;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const query = { 'items.brand': req.user._id };
    if (req.query.status) query.status = req.query.status;

    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate('customer', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Order.countDocuments(query),
    ]);

    // A brand should only see its own line items.
    const scoped = orders.map((order) => {
      const obj = order.toObject();
      obj.items = obj.items.filter(
        (item) => item.brand.toString() === req.user._id.toString()
      );
      obj.brandTotal = obj.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      return obj;
    });

    res.json({
      success: true,
      data: { orders: scoped, pagination: buildPagination(page, limit, total) },
    });
  } catch (error) {
    next(error);
  }
};

export const getBrandOrderStats = async (req, res, next) => {
  try {
    const brandId = new mongoose.Types.ObjectId(req.user._id);

    const [result] = await Order.aggregate([
      { $match: { 'items.brand': brandId } },
      {
        $facet: {
          totalOrders: [{ $count: 'count' }],
          byStatus: [{ $group: { _id: '$status', count: { $sum: 1 } } }],
          revenue: [
            { $match: { status: { $ne: 'cancelled' } } },
            { $unwind: '$items' },
            { $match: { 'items.brand': brandId } },
            {
              $group: {
                _id: null,
                total: {
                  $sum: { $multiply: ['$items.price', '$items.quantity'] },
                },
              },
            },
          ],
        },
      },
    ]);

    const byStatus = {};
    for (const entry of result?.byStatus || []) {
      byStatus[entry._id] = entry.count;
    }

    res.json({
      success: true,
      data: {
        totalOrders: result?.totalOrders?.[0]?.count || 0,
        revenue: result?.revenue?.[0]?.total || 0,
        byStatus,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customer', 'name email')
      .populate('items.brand', 'name');

    if (!order) throw ApiError.notFound('Order not found');

    const isOwner = order.customer?._id?.toString() === req.user._id.toString();
    const isBrand =
      req.user.role === 'brand' && isBrandParticipant(order, req.user._id);

    if (!isOwner && !isBrand) {
      throw ApiError.forbidden('You do not have permission to view this order');
    }

    let payload = order.toObject();
    if (isBrand && !isOwner) {
      payload.items = payload.items.filter(
        (item) => item.brand?._id?.toString() === req.user._id.toString()
      );
    }

    res.json({ success: true, data: { order: payload } });
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) throw ApiError.notFound('Order not found');

    if (!isBrandParticipant(order, req.user._id)) {
      throw ApiError.forbidden('You do not have permission to update this order');
    }

    const allowed = ORDER_STATUS_TRANSITIONS[order.status] || [];
    if (!allowed.includes(status)) {
      throw ApiError.badRequest(
        `Cannot change status from "${order.status}" to "${status}"`
      );
    }

    order.status = status;
    await order.save();

    const populated = await Order.findById(order._id).populate(
      'customer',
      'name email'
    );

    res.json({ success: true, data: { order: populated } });
  } catch (error) {
    next(error);
  }
};

export const cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) throw ApiError.notFound('Order not found');

    if (order.customer.toString() !== req.user._id.toString()) {
      throw ApiError.forbidden('You can only cancel your own orders');
    }

    if (!['pending', 'confirmed'].includes(order.status)) {
      throw ApiError.badRequest(
        `Orders that are "${order.status}" cannot be cancelled`
      );
    }

    order.status = 'cancelled';
    await order.save();

    res.json({ success: true, data: { order } });
  } catch (error) {
    next(error);
  }
};
