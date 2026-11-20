import Joi from 'joi';
import { CATEGORIES, PRODUCT_STATUS } from '../utils/constants.js';

export const createProductSchema = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    'string.min': 'Name must be at least 2 characters',
    'string.max': 'Name cannot exceed 100 characters',
    'any.required': 'Product name is required',
  }),
  description: Joi.string().max(1000).allow('').default(''),
  price: Joi.number().min(0).required().messages({
    'number.min': 'Price cannot be negative',
    'any.required': 'Price is required',
  }),
  category: Joi.string()
    .valid(...CATEGORIES)
    .required()
    .messages({
      'any.only': `Category must be one of: ${CATEGORIES.join(', ')}`,
      'any.required': 'Category is required',
    }),
  images: Joi.array().items(Joi.string()).max(5).default([]),
  status: Joi.string()
    .valid(...PRODUCT_STATUS)
    .default('draft'),
  stock: Joi.number().integer().min(0).max(100000).default(0).messages({
    'number.min': 'Stock cannot be negative',
    'number.max': 'Stock cannot exceed 100000',
    'number.integer': 'Stock must be a whole number',
  }),
});

export const updateProductSchema = Joi.object({
  name: Joi.string().min(2).max(100),
  description: Joi.string().max(1000).allow(''),
  price: Joi.number().min(0),
  category: Joi.string().valid(...CATEGORIES),
  images: Joi.array().items(Joi.string()).max(5),
  status: Joi.string().valid(...PRODUCT_STATUS),
  stock: Joi.number().integer().min(0).max(100000).messages({
    'number.min': 'Stock cannot be negative',
    'number.max': 'Stock cannot exceed 100000',
    'number.integer': 'Stock must be a whole number',
  }),
});

export const productQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).max(10000).default(1),
  limit: Joi.number().integer().min(1).max(50).default(12),
  category: Joi.string().valid(...CATEGORIES),
  search: Joi.string().max(100).allow(''),
  status: Joi.string().valid('published'),
});

export const brandProductQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).max(10000).default(1),
  limit: Joi.number().integer().min(1).max(50).default(12),
  status: Joi.string().valid(...PRODUCT_STATUS),
});
