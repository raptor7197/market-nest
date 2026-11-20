import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { productApi } from "../../api/productApi";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import Spinner from "../../components/common/Spinner";
import { ArrowLeft, ImagePlus, Upload, X } from "lucide-react";

const CATEGORIES = ["clothing", "shoes", "accessories", "bags", "jewelry"];
const STATUSES = ["draft", "published", "archived"];

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "0",
    category: "clothing",
    images: [],
    status: "draft",
  });

  useEffect(() => {
    if (isEdit) {
      const fetchProduct = async () => {
        try {
          const response = await productApi.getProductById(id);
          const product = response.data.product;
          setFormData({
            name: product.name,
            description: product.description || "",
            price: product.price.toString(),
            stock: (product.stock ?? 0).toString(),
            category: product.category,
            images: product.images || [],
            status: product.status,
          });
        } catch (err) {
          setError("Failed to fetch product");
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
      setError("Maximum 5 images allowed");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const formDataUpload = new FormData();
      files.forEach((file) => formDataUpload.append("images", file));

      const response = await productApi.uploadImages(formDataUpload);
      const newImages = response.data.images;
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...newImages],
      }));
    } catch (err) {
      setError("Failed to upload images");
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
    setError("");
    setLoading(true);

    try {
      const data = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock || "0", 10),
      };

      if (isEdit) {
        await productApi.updateProduct(id, data);
      } else {
        await productApi.createProduct(data);
      }

      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-offwhite">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-offwhite">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          to="/dashboard"
          className="mb-6 inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-gray-600 transition-colors hover:bg-white hover:text-charcoal"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to dashboard
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-charcoal">
            {isEdit ? "Edit product" : "Create product"}
          </h1>
          <p className="mt-2 text-base text-gray-600">
            Keep product information clear, image-led, and ready for the
            marketplace.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]"
        >
          <div className="space-y-6 rounded-[2rem] border border-gray-200 bg-white p-6 shadow-card sm:p-8">
            <Input
              label="Product name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter product name"
              required
            />

            <div>
              <label className="mb-2 block text-sm font-semibold text-charcoal">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                placeholder="Enter product description"
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-charcoal shadow-sm outline-none transition-all placeholder:text-gray-400 focus:border-burnt focus:ring-4 focus:ring-burnt/10"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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

              <Input
                label="Stock"
                name="stock"
                type="number"
                step="1"
                min="0"
                value={formData.stock}
                onChange={handleChange}
                placeholder="0"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-charcoal">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-charcoal shadow-sm outline-none transition-all focus:border-burnt focus:ring-4 focus:ring-burnt/10"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-3 block text-sm font-semibold text-charcoal">
                Status
              </label>
              <div className="flex flex-wrap gap-3">
                {STATUSES.map((status) => (
                  <label
                    key={status}
                    className={`flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold capitalize transition-colors ${
                      formData.status === status
                        ? "border-charcoal bg-charcoal text-white"
                        : "border-gray-200 bg-white text-gray-600 hover:border-burnt/30"
                    }`}
                  >
                    <input
                      type="radio"
                      name="status"
                      value={status}
                      checked={formData.status === status}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    {status}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-card">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-extrabold text-charcoal">
                    Images
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">Maximum 5 images</p>
                </div>
                <div className="rounded-2xl bg-burnt-50 p-3 text-burnt">
                  <ImagePlus className="h-6 w-6" />
                </div>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-3">
                {formData.images.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-square overflow-hidden rounded-2xl bg-gray-100"
                  >
                    <img
                      src={img}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute right-2 top-2 rounded-full bg-white p-1.5 text-red-600 shadow-sm transition-colors hover:bg-red-50"
                      aria-label="Remove image"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}

                {formData.images.length < 5 && (
                  <label className="flex aspect-square cursor-pointer items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50 text-gray-400 transition-colors hover:border-burnt/50 hover:text-burnt">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                    {uploading ? <Spinner size="sm" /> : <Upload className="h-6 w-6" />}
                  </label>
                )}
              </div>
            </div>

            <div className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-card">
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Button type="submit" loading={loading} className="w-full">
                  {isEdit ? "Update product" : "Create product"}
                </Button>
                <Link
                  to="/dashboard"
                  className="inline-flex w-full items-center justify-center rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition-all hover:-translate-y-0.5 hover:border-burnt/30 hover:text-burnt"
                >
                  Cancel
                </Link>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
