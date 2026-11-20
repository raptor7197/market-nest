import Joi from 'joi';

export const signupSchema = Joi.object({
  email: Joi.string().trim().lowercase().email().required().messages({
    'string.email': 'Please enter a valid email',
    'string.empty': 'Email is required',
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters',
    'string.empty': 'Password is required',
  }),
  name: Joi.string().trim().min(2).max(50).required().messages({
    'string.min': 'Name must be at least 2 characters',
    'string.max': 'Name cannot exceed 50 characters',
    'string.empty': 'Name is required',
  }),
  role: Joi.string().valid('brand', 'customer').required().messages({
    'any.only': 'Role must be either brand or customer',
    'string.empty': 'Role is required',
  }),
});

export const loginSchema = Joi.object({
  email: Joi.string().trim().lowercase().email().required(),
  password: Joi.string().required(),
});

export const refreshSchema = Joi.object({});
