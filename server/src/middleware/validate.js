import ApiError from '../utils/ApiError.js';

export const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errorMessage = error.details.map((detail) => detail.message).join(', ');
      return next(ApiError.badRequest(errorMessage));
    }

    // Apply sanitized values (trim/lowercase/defaults/stripped unknown keys).
    req.body = value;
    next();
  };
};

export const validateQuery = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.query, { abortEarly: false });

    if (error) {
      const errorMessage = error.details.map((detail) => detail.message).join(', ');
      return next(ApiError.badRequest(errorMessage));
    }

    req.query = value;
    next();
  };
};
