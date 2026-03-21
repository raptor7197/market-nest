export const TOKEN_EXPIRY = {
  ACCESS: '15m',
  REFRESH: '7d',
};

export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
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
