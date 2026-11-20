import Joi from 'joi';
import { ORDER_STATUS, PAYMENT_METHODS } from '../utils/constants.js';

const shippingAddressSchema = Joi.object({
  fullName: Joi.string().min(2).max(80).required().messages({
    'any.required': 'Full name is required',
  }),
  phone: Joi.string()
    .pattern(/^[0-9+\-\s]{7,15}$/)
    .required()
    .messages({
      'string.pattern.base': 'Phone must be a valid number',
      'any.required': 'Phone number is required',
    }),
  street: Joi.string().min(3).max(200).required().messages({
    'any.required': 'Street address is required',
  }),
  city: Joi.string().min(2).max(80).required().messages({
    'any.required': 'City is required',
  }),
  state: Joi.string().min(2).max(80).required().messages({
    'any.required': 'State is required',
  }),
  postalCode: Joi.string().min(3).max(12).required().messages({
    'any.required': 'Postal code is required',
  }),
  country: Joi.string().max(80).default('India'),
});

export const createOrderSchema = Joi.object({
  items: Joi.array()
    .items(
      Joi.object({
        product: Joi.string().hex().length(24).required().messages({
          'string.length': 'Invalid product id',
          'any.required': 'Product id is required',
        }),
        quantity: Joi.number().integer().min(1).max(99).required().messages({
          'number.min': 'Quantity must be at least 1',
          'number.max': 'Quantity cannot exceed 99',
          'any.required': 'Quantity is required',
        }),
      })
    )
    .min(1)
    .required()
    .messages({
      'array.min': 'Order must contain at least one item',
      'any.required': 'Order items are required',
    }),
  shippingAddress: shippingAddressSchema.required(),
  paymentMethod: Joi.string()
    .valid(...PAYMENT_METHODS)
    .default('cod'),
});

export const updateOrderStatusSchema = Joi.object({
  status: Joi.string()
    .valid(...ORDER_STATUS)
    .required()
    .messages({
      'any.only': `Status must be one of: ${ORDER_STATUS.join(', ')}`,
      'any.required': 'Status is required',
    }),
});

export const orderQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(10),
  status: Joi.string().valid(...ORDER_STATUS),
});
