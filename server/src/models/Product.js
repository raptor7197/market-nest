import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
      default: '',
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    category: {
      type: String,
      enum: ['clothing', 'shoes', 'accessories', 'bags', 'jewelry'],
      required: [true, 'Category is required'],
      index: true,
    },
    images: {
      type: [String],
      validate: [
        (val) => val.length <= 5,
        'Maximum 5 images allowed per product',
      ],
      default: [],
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Brand is required'],
      index: true,
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

productSchema.index({ name: 'text' });
productSchema.index({ brand: 1, status: 1 });
productSchema.index({ category: 1, status: 1 });

const Product = mongoose.model('Product', productSchema);

export default Product;
