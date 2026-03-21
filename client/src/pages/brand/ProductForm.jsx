import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { productApi } from '../../api/productApi';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import { ArrowLeft, Upload, X } from 'lucide-react';

const CATEGORIES = ['clothing', 'shoes', 'accessories', 'bags', 'jewelry'];
const STATUSES = ['draft', 'published'];

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'clothing',
    images: [],
    status: 'draft',
  });

  useEffect(() => {
    if (isEdit) {
      const fetchProduct = async () => {
        try {
          const response = await productApi.getProductById(id);
          const product = response.data.product;
          setFormData({
            name: product.name,
            description: product.description || '',
            price: product.price.toString(),
            category: product.category,
            images: product.images || [],
            status: product.status,
          });
        } catch (err) {
          setError('Failed to fetch product');
        } finally {
          setFetching(false);
        }
      };
      fetchProduct();
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    if (formData.images.length + files.length > 5) {
      setError('Maximum 5 images allowed');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const formDataUpload = new FormData();
      files.forEach((file) => formDataUpload.append('images', file));

      const response = await productApi.uploadImages(formDataUpload);
      const newImages = response.data.images;
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...newImages],
      }));
    } catch (err) {
      setError('Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = {
        ...formData,
        price: parseFloat(formData.price),
      };

      if (isEdit) {
        await productApi.updateProduct(id, data);
      } else {
        await productApi.createProduct(data);
      }

      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        {isEdit ? 'Edit Product' : 'Create Product'}
      </h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Product Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter product name"
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            placeholder="Enter product description"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Price"
            name="price"
            type="number"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={handleChange}
            placeholder="0.00"
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <div className="flex gap-4">
            {STATUSES.map((status) => (
              <label key={status} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value={status}
                  checked={formData.status === status}
                  onChange={handleChange}
                  className="text-primary-600 focus:ring-primary-500"
                />
                <span className="capitalize">{status}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Images (max 5)
          </label>
          <div className="flex flex-wrap gap-3 mb-3">
            {formData.images.map((img, idx) => (
              <div key={idx} className="relative w-20 h-20">
                <img
                  src={img}
                  alt=""
                  className="w-full h-full object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            
            {formData.images.length < 5 && (
              <label className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-primary-500 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploading}
                />
                {uploading ? (
                  <Spinner size="sm" />
                ) : (
                  <Upload className="h-6 w-6 text-gray-400" />
                )}
              </label>
            )}
          </div>
        </div>

        <div className="flex gap-4">
          <Button type="submit" loading={loading}>
            {isEdit ? 'Update Product' : 'Create Product'}
          </Button>
          <Link
            to="/dashboard"
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
