import ApiError from '../utils/ApiError.js';

export const errorHandler = (err, req, res, next) => {
  let error = err;

  if (!(err instanceof ApiError)) {
    if (err.name === 'CastError') {
      // Invalid ObjectId etc.
      error = ApiError.badRequest(`Invalid ${err.path || 'identifier'}`);
    } else if (err.name === 'ValidationError') {
      const message = Object.values(err.errors || {})
        .map((e) => e.message)
        .join(', ');
      error = ApiError.badRequest(message || 'Validation failed');
    } else if (err.code === 11000) {
      error = ApiError.conflict('Duplicate value for a unique field');
    } else if (err.name === 'MulterError') {
      error = new ApiError(err.code === 'LIMIT_FILE_SIZE' ? 413 : 400, err.message);
    } else if (err.type === 'entity.parse.failed') {
      error = ApiError.badRequest('Malformed JSON body');
    } else {
      const statusCode = err.statusCode || 500;
      const message =
        statusCode >= 500 ? 'Internal server error' : err.message || 'Request failed';
      error = new ApiError(statusCode, message);
    }
  }

  const response = {
    success: false,
    message: error.message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  };

  res.status(error.statusCode || 500).json(response);
};

export const notFound = (req, res, next) => {
  next(ApiError.notFound(`Route ${req.originalUrl} not found`));
};
