import mongoose from 'mongoose';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import ApiError from '../utils/ApiError.js';
import { PAGINATION, ORDER_STATUS_TRANSITIONS } from '../utils/constants.js';

const roundMoney = (value) => Math.round(value * 100) / 100;

const buildPagination = (page, limit, total) => ({
  currentPage: page,
  totalPages: Math.max(Math.ceil(total / limit), 1),
  totalItems: total,
  itemsPerPage: limit,
  hasNextPage: page * limit < total,
  hasPrevPage: page > 1,
});

const brandIdOf = (item) => String(item.brand?._id ?? item.brand);

const isBrandParticipant = (order, userId) =>
  order.items.some((item) => brandIdOf(item) === String(userId));

// Return reserved units to inventory in one round-trip.
const restoreStock = async (items) => {
  if (!items?.length) return;
  await Product.bulkWrite(
    items.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { stock: item.quantity } },
      },
    }))
  );
};

const populateOrder = (id) =>
  Order.findById(id)
    .populate('customer', 'name email')
    .populate('brand', 'name')
    .populate('items.brand', 'name');

// Strip other brands' line items from a payload.
const scopeItems = (order, userId) => {
  const payload = order.toObject ? order.toObject() : { ...order };
  payload.items = payload.items.filter(
    (item) => brandIdOf(item) === String(userId)
  );
  payload.brandTotal = roundMoney(
    payload.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  );
  return payload;
};

export const createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;
    const idempotencyKey =
      req.get('Idempotency-Key') || req.body.idempotencyKey || null;

    // Replay protection for retries/double submits.
    if (idempotencyKey) {
      const existing = await Order.find({
        customer: req.user._id,
        idempotencyKey,
      })
        .populate('customer', 'name email')
        .populate('brand', 'name')
        .populate('items.brand', 'name');

      if (existing.length > 0) {
        return res.status(200).json({
          success: true,
          data: {
            orders: existing,
            order: existing[0],
            idempotentReplay: true,
          },
        });
      }
    }

    // Merge duplicate product lines normalizing ids.
    const merged = new Map();
    for (const item of items) {
      const key = item.product.toLowerCase();
      const existing = merged.get(key);
      if (existing) {
        existing.quantity += item.quantity;
      } else {
        merged.set(key, { product: key, quantity: item.quantity });
      }
    }

    const productIds = [...merged.keys()];
    const products = await Product.find({ _id: { $in: productIds } });

    if (products.length !== productIds.length) {
      throw ApiError.badRequest('One or more products no longer exist');
    }

    const productMap = new Map(
      products.map((p) => [p._id.toString().toLowerCase(), p])
    );

    // One group (→ order) per brand so brand-side changes never affect
    // another brand's inventory.
    const groups = new Map();
    let totalQuantity = 0;

    for (const { product, quantity } of merged.values()) {
      const found = productMap.get(product);
      if (!found) {
        throw ApiError.badRequest('One or more products no longer exist');
      }
      if (found.status !== 'published') {
        throw ApiError.badRequest(`Product "${found.name}" is not available`);
      }
      if (quantity > 99) {
        throw ApiError.badRequest('Quantity cannot exceed 99 per item');
      }

      totalQuantity += quantity;
      if (totalQuantity > 200) {
        throw ApiError.badRequest('Order cannot exceed 200 total items');
      }

      const available = found.stock ?? 0;
      if (available < quantity) {
        throw ApiError.badRequest(
          available === 0
            ? `Product "${found.name}" is out of stock`
            : `Only ${available} unit(s) of "${found.name}" left in stock`
        );
      }

      const brandKey = String(found.brand);
      if (!groups.has(brandKey)) {
        groups.set(brandKey, {
          brand: found.brand,
          items: [],
          total: 0,
        });
      }
      const group = groups.get(brandKey);
      group.items.push({
        product: found._id,
        brand: found.brand,
        name: found.name,
        image: found.images?.[0] || '',
        price: found.price,
        quantity,
      });
      group.total = roundMoney(group.total + found.price * quantity);
    }

    const reserved = [];
    const created = [];
    try {
      for (const group of groups.values()) {
        for (const item of group.items) {
          const updated = await Product.findOneAndUpdate(
            {
              _id: item.product,
              status: 'published',
              stock: { $gte: item.quantity },
            },
            { $inc: { stock: -item.quantity } },
            { new: true }
          );

          if (!updated) {
            throw ApiError.conflict(
              `"${item.name}" no longer has enough stock`
            );
          }
          reserved.push(item);
        }
      }

      for (const group of groups.values()) {
        const order = await Order.create({
          customer: req.user._id,
          brand: group.brand,
          items: group.items,
          totalAmount: group.total,
          shippingAddress,
          paymentMethod: paymentMethod || 'cod',
          idempotencyKey,
          statusHistory: [
            { status: 'pending', at: new Date(), changedBy: null },
          ],
        });
        created.push(order);
      }
    } catch (error) {
      try {
        await restoreStock(reserved);
      } catch (restoreError) {
        console.error('Rollback restock failed:', restoreError.message);
      }
      if (created.length > 0) {
        await Order.deleteMany({ _id: { $in: created.map((o) => o._id) } });
      }

      // A concurrent request won the idempotency race: return its orders.
      if (error.code === 11000 && idempotencyKey) {
        const existing = await Order.find({
          customer: req.user._id,
          idempotencyKey,
        })
          .populate('customer', 'name email')
          .populate('brand', 'name')
          .populate('items.brand', 'name');

        if (existing.length > 0) {
          return res.status(200).json({
            success: true,
            data: {
              orders: existing,
              order: existing[0],
              idempotentReplay: true,
            },
          });
        }
      }
      throw error;
    }

    const populated = await Promise.all(
      created.map((order) => populateOrder(order._id))
    );

    res.status(201).json({
      success: true,
      data: { orders: populated, order: populated[0] },
    });
  } catch (error) {
    next(error);
  }
};

const parsePaging = (query) => {
  const page = Math.max(parseInt(query.page, 10) || PAGINATION.DEFAULT_PAGE, 1);
  const limit = Math.min(Math.max(parseInt(query.limit, 10) || 10, 1), 50);
  return { page, limit, skip: (page - 1) * limit };
};

export const getMyOrders = async (req, res, next) => {
  try {
    const { page, limit, skip } = parsePaging(req.query);

    const query = { customer: req.user._id };
    if (req.query.status) query.status = req.query.status;

    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate('brand', 'name')
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
    const { page, limit, skip } = parsePaging(req.query);

    const query = { 'items.brand': req.user._id };
    if (req.query.status) query.status = req.query.status;

    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate('customer', 'name email')
        .populate('items.brand', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Order.countDocuments(query),
    ]);

    const scoped = orders.map((order) => scopeItems(order, req.user._id));

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
        revenue: roundMoney(result?.revenue?.[0]?.total || 0),
        byStatus,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) throw ApiError.notFound('Order not found');

    const isOwner = String(order.customer) === String(req.user._id);
    const isBrand =
      req.user.role === 'brand' && isBrandParticipant(order, req.user._id);

    if (!isOwner && !isBrand) {
      throw ApiError.forbidden('You do not have permission to view this order');
    }

    await order.populate([
      { path: 'customer', select: 'name email' },
      { path: 'brand', select: 'name' },
      { path: 'items.brand', select: 'name' },
    ]);

    const payload =
      isBrand && !isOwner ? scopeItems(order, req.user._id) : order.toObject();

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

    // Only single-brand orders are actionable; legacy mixed orders would let
    // one brand change/restock another brand's inventory.
    const distinctBrands = new Set(order.items.map(brandIdOf));
    if (distinctBrands.size > 1) {
      throw ApiError.conflict(
        'Legacy multi-brand order cannot be modified by a single brand'
      );
    }

    const previousStatus = order.status;
    const allowed = ORDER_STATUS_TRANSITIONS[previousStatus] || [];
    if (!allowed.includes(status)) {
      throw ApiError.badRequest(
        `Cannot change status from "${previousStatus}" to "${status}"`
      );
    }

    const isCancelling = status === 'cancelled';
    const update = {
      $set: {
        status,
        ...(isCancelling ? { stockRestored: true } : {}),
      },
      $push: {
        statusHistory: {
          status,
          at: new Date(),
          changedBy: req.user._id,
        },
      },
      ...(isCancelling ? { $unset: { idempotencyKey: 1 } } : {}),
    };

    const filter = {
      _id: order._id,
      status: previousStatus,
      ...(isCancelling ? { stockRestored: { $ne: true } } : {}),
    };

    const updated = await Order.findOneAndUpdate(filter, update, { new: true });
    if (!updated) {
      throw ApiError.conflict('Order status changed, please retry');
    }

    if (isCancelling) {
      try {
        await restoreStock(updated.items);
      } catch (error) {
        // Revert so the cancellation can be retried without losing stock.
        await Order.updateOne(
          { _id: updated._id, status: 'cancelled' },
          {
            $set: { status: previousStatus, stockRestored: false },
            $pop: { statusHistory: 1 },
          }
        );
        throw error;
      }
    }

    const populated = await populateOrder(updated._id);

    res.json({
      success: true,
      data: { order: scopeItems(populated, req.user._id) },
    });
  } catch (error) {
    next(error);
  }
};

export const cancelOrder = async (req, res, next) => {
  try {
    const existing = await Order.findById(req.params.id);
    if (!existing) throw ApiError.notFound('Order not found');
    if (String(existing.customer) !== String(req.user._id)) {
      throw ApiError.forbidden('You can only cancel your own orders');
    }

    // Idempotent: cancelling an already-cancelled order is a no-op success.
    if (existing.status === 'cancelled') {
      const populated = await populateOrder(existing._id);
      return res.json({
        success: true,
        data: { order: populated.toObject(), alreadyCancelled: true },
      });
    }

    if (!['pending', 'confirmed'].includes(existing.status)) {
      throw ApiError.badRequest(
        `Orders that are "${existing.status}" cannot be cancelled`
      );
    }

    const updated = await Order.findOneAndUpdate(
      {
        _id: existing._id,
        customer: req.user._id,
        status: existing.status,
        stockRestored: { $ne: true },
      },
      {
        $set: { status: 'cancelled', stockRestored: true },
        $unset: { idempotencyKey: 1 },
        $push: {
          statusHistory: {
            status: 'cancelled',
            at: new Date(),
            changedBy: req.user._id,
          },
        },
      },
      { new: true }
    );

    if (!updated) {
      const latest = await Order.findById(existing._id);
      if (latest?.status === 'cancelled') {
        const populated = await populateOrder(latest._id);
        return res.json({
          success: true,
          data: { order: populated.toObject(), alreadyCancelled: true },
        });
      }
      throw ApiError.conflict('Order status changed, please retry');
    }

    try {
      await restoreStock(updated.items);
    } catch (error) {
      await Order.updateOne(
        { _id: updated._id, status: 'cancelled' },
        {
          $set: { status: existing.status, stockRestored: false },
          $pop: { statusHistory: 1 },
        }
      );
      throw error;
    }

    const populated = await populateOrder(updated._id);
    res.json({ success: true, data: { order: populated.toObject() } });
  } catch (error) {
    next(error);
  }
};

export const cancelStalePendingOrders = async (olderThanHours = 24) => {
  const cutoff = new Date(Date.now() - olderThanHours * 60 * 60 * 1000);
  const stale = await Order.find({
    status: 'pending',
    createdAt: { $lt: cutoff },
  }).select('_id');

  let cancelled = 0;
  for (const { _id } of stale) {
    const order = await Order.findOneAndUpdate(
      {
        _id,
        status: 'pending',
        createdAt: { $lt: cutoff },
        stockRestored: { $ne: true },
      },
      {
        $set: { status: 'cancelled', stockRestored: true },
        $unset: { idempotencyKey: 1 },
        $push: {
          statusHistory: {
            status: 'cancelled',
            at: new Date(),
            changedBy: null,
          },
        },
      },
      { new: true }
    );
    if (!order) continue;

    try {
      await restoreStock(order.items);
      cancelled += 1;
    } catch (error) {
      await Order.updateOne(
        { _id, status: 'cancelled' },
        {
          $set: { status: 'pending', stockRestored: false },
          $pop: { statusHistory: 1 },
        }
      );
    }
  }
  return cancelled;
};
