import mongoose from 'mongoose';
import { ORDER_STATUS, PAYMENT_METHODS } from '../utils/constants.js';

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product reference is required'],
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Brand reference is required'],
      index: true,
    },
    // Snapshots so order history survives product edits/deletes.
    name: { type: String, required: true, trim: true },
    image: { type: String, default: '' },
    price: {
      type: Number,
      required: true,
      min: [0, 'Item price cannot be negative'],
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1'],
    },
  },
  { _id: false }
);

const shippingAddressSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: [true, 'Full name is required'], trim: true },
    phone: { type: String, required: [true, 'Phone number is required'], trim: true },
    street: { type: String, required: [true, 'Street address is required'], trim: true },
    city: { type: String, required: [true, 'City is required'], trim: true },
    state: { type: String, required: [true, 'State is required'], trim: true },
    postalCode: { type: String, required: [true, 'Postal code is required'], trim: true },
    country: { type: String, default: 'India', trim: true },
  },
  { _id: false }
);

const statusHistorySchema = new mongoose.Schema(
  {
    status: { type: String, enum: ORDER_STATUS, required: true },
    at: { type: Date, default: Date.now },
    changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Customer is required'],
      index: true,
    },
    // Orders are single-brand now that multi-brand carts are split.
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Brand is required'],
      index: true,
    },
    items: {
      type: [orderItemSchema],
      validate: [
        (val) => val.length > 0,
        'An order must contain at least one item',
      ],
    },
    totalAmount: {
      type: Number,
      required: true,
      min: [0, 'Total amount cannot be negative'],
    },
    status: {
      type: String,
      enum: ORDER_STATUS,
      default: 'pending',
      index: true,
    },
    statusHistory: { type: [statusHistorySchema], default: [] },
    shippingAddress: {
      type: shippingAddressSchema,
      required: [true, 'Shipping address is required'],
    },
    paymentMethod: {
      type: String,
      enum: PAYMENT_METHODS,
      default: 'cod',
    },
    // Client-supplied key used to make retries idempotent.
    idempotencyKey: {
      type: String,
      default: null,
      select: false,
    },
    // Guards restock so retries cannot increment inventory twice.
    stockRestored: {
      type: Boolean,
      default: false,
      select: false,
    },
  },
  { timestamps: true }
);

orderSchema.index({ 'items.brand': 1, createdAt: -1 });
orderSchema.index({ customer: 1, createdAt: -1 });
orderSchema.index({ brand: 1, status: 1, createdAt: -1 });
// Concurrent retries with the same key can only create one order per brand.
orderSchema.index(
  { customer: 1, idempotencyKey: 1, brand: 1 },
  {
    unique: true,
    partialFilterExpression: { idempotencyKey: { $type: 'string' } },
  }
);

const Order = mongoose.model('Order', orderSchema);
export default Order;
