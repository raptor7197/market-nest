export const TOKEN_EXPIRY = {
  ACCESS: '15m',
  REFRESH: '7d',
};

// Cross-site cookies (https client / ngrok) need SameSite=None + Secure.
const isCrossSite =
  (process.env.CLIENT_URL || '').startsWith('https://') ||
  process.env.NODE_ENV === 'production';

export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: isCrossSite,
  sameSite: isCrossSite ? 'none' : 'lax',
  path: '/',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

// clearCookie must NOT carry maxAge/expires, otherwise the browser keeps a
// future-dated empty cookie.
export const CLEAR_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: isCrossSite,
  sameSite: isCrossSite ? 'none' : 'lax',
  path: '/',
};

export const CATEGORIES = ['clothing', 'shoes', 'accessories', 'bags', 'jewelry'];

export const PRODUCT_STATUS = ['draft', 'published', 'archived'];

export const ROLES = {
  BRAND: 'brand',
  CUSTOMER: 'customer',
};

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 12,
};

export const ORDER_STATUS = [
  'pending',
  'confirmed',
  'shipped',
  'delivered',
  'cancelled',
];

// Allowed status transitions a brand may perform.
export const ORDER_STATUS_TRANSITIONS = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['shipped', 'cancelled'],
  shipped: ['delivered'],
  delivered: [],
  cancelled: [],
};

export const PAYMENT_METHODS = ['cod'];
