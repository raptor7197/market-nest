import { upload } from '../config/cloudinary.js';
import ApiError from '../utils/ApiError.js';

export const uploadImages = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      throw ApiError.badRequest('No files uploaded');
    }

    if (req.files.length > 5) {
      throw ApiError.badRequest('Maximum 5 images allowed');
    }

    const imageUrls = req.files.map((file) => file.path);

    res.json({
      success: true,
      data: { images: imageUrls },
    });
  } catch (error) {
    next(error);
  }
};

export const uploadMiddleware = upload.array('images', 5);
