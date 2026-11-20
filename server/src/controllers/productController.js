import Product from '../models/Product.js';
import ApiError from '../utils/ApiError.js';
import { PAGINATION } from '../utils/constants.js';

export const createProduct = async (req, res, next) => {
  try {
    const productData = {
      ...req.body,
      brand: req.user._id,
    };

    const product = await Product.create(productData);

    res.status(201).json({
      success: true,
      data: { product },
    });
  } catch (error) {
    next(error);
  }
};

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const getProducts = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || PAGINATION.DEFAULT_PAGE, 1);
    const limit = Math.min(
      Math.max(parseInt(req.query.limit, 10) || PAGINATION.DEFAULT_LIMIT, 1),
      50
    );
    const skip = (page - 1) * limit;

    const query = { status: 'published' };

    if (req.query.category) {
      query.category = req.query.category;
    }

    if (req.query.search && typeof req.query.search === 'string') {
      query.$or = [
        { name: { $regex: escapeRegex(req.query.search), $options: 'i' } },
      ];
    }

    const [products, total] = await Promise.all([
      Product.find(query)
        .populate('brand', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Product.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: limit,
          hasNextPage: page * limit < total,
          hasPrevPage: page > 1,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('brand', 'name');

    if (!product) {
      throw ApiError.notFound('Product not found');
    }

    // Unpublished products are only visible to their owning brand.
    if (product.status !== 'published') {
      const isOwner =
        req.user &&
        req.user.role === 'brand' &&
        String(product.brand?._id ?? product.brand) === String(req.user._id);
      if (!isOwner) {
        throw ApiError.notFound('Product not found');
      }
    }

    res.json({
      success: true,
      data: { product },
    });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!product) {
      throw ApiError.notFound('Product not found');
    }

    res.json({
      success: true,
      data: { product },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { status: 'archived', updatedAt: Date.now() },
      { new: true }
    );

    if (!product) {
      throw ApiError.notFound('Product not found');
    }

    res.json({
      success: true,
      message: 'Product archived successfully',
      data: { product },
    });
  } catch (error) {
    next(error);
  }
};

export const getBrandDashboard = async (req, res, next) => {
  try {
    const brandId = req.user._id;

    const [total, published, archived, recentProducts] = await Promise.all([
      Product.countDocuments({ brand: brandId }),
      Product.countDocuments({ brand: brandId, status: 'published' }),
      Product.countDocuments({ brand: brandId, status: 'archived' }),
      Product.find({ brand: brandId })
        .sort({ createdAt: -1 })
        .limit(5),
    ]);

    res.json({
      success: true,
      data: {
        stats: {
          total,
          published,
          archived,
          draft: total - published - archived,
        },
        recentProducts,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getBrandProducts = async (req, res, next) => {
  try {
    const brandId = req.user._id;
    const page = Math.max(parseInt(req.query.page, 10) || PAGINATION.DEFAULT_PAGE, 1);
    const limit = Math.min(
      Math.max(parseInt(req.query.limit, 10) || PAGINATION.DEFAULT_LIMIT, 1),
      50
    );
    const skip = (page - 1) * limit;
    const status = req.query.status;

    const query = { brand: brandId };
    if (status && ['draft', 'published', 'archived'].includes(status)) {
      query.status = status;
    }

    const [products, total] = await Promise.all([
      Product.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Product.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: limit,
          hasNextPage: page * limit < total,
          hasPrevPage: page > 1,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
