import Product from '../models/Product.js';
import ApiError from '../utils/ApiError.js';

export const checkOwnership = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);

    if (!product) {
      throw ApiError.notFound('Product not found');
    }

    if (product.brand.toString() !== req.user._id.toString()) {
      throw ApiError.forbidden('You do not have permission to modify this product');
    }

    req.product = product;
    next();
  } catch (error) {
    next(error);
  }
};
