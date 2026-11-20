import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { productApi } from "../api/productApi";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { formatINR } from "../utils/format";
import {
  ArrowLeft,
  CheckCircle2,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Minus,
  Plus,
  Zap,
} from "lucide-react";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem, items } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedMessage, setAddedMessage] = useState("");
  const stock = product?.stock ?? 0;
  const maxQty = Math.min(stock, 99);
  const inCart =
    items.find((item) => item.product === product?._id)?.quantity ?? 0;

  useEffect(() => {
    let active = true;
    const fetchProduct = async () => {
      setLoading(true);
      setLoadError(null);
      setProduct(null);
      setSelectedImage(0);
      setQuantity(1);
      setAddedMessage("");
      try {
        const response = await productApi.getProductById(id);
        if (active) setProduct(response.data.product);
      } catch (error) {
        if (active) setLoadError(error);
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchProduct();
    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-offwhite">
        <div className="spinner h-12 w-12" />
        <p className="mt-5 text-sm font-semibold text-gray-500">
          Loading product
        </p>
      </div>
    );
  }

  if (!product) {
    const isNotFound = loadError?.response?.status === 404;
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-offwhite px-4 text-center">
        <h2 className="text-4xl font-extrabold tracking-tight text-charcoal">
          {isNotFound ? "Product not found" : "Could not load product"}
        </h2>
        {!isNotFound && (
          <p className="mt-3 text-sm text-gray-500">
            Please check your connection and try again.
          </p>
        )}
        <Link
          to="/products"
          className="mt-6 rounded-full bg-burnt px-6 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(201,79,36,0.24)] transition-all hover:-translate-y-0.5 hover:bg-burnt-600"
        >
          Return to marketplace
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-offwhite pb-20 text-charcoal">
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-4 sm:px-6 lg:px-8">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-100 hover:text-charcoal"
          >
            <ArrowLeft className="h-4 w-4" />
            Marketplace
          </Link>
          <span className="text-gray-300">/</span>
          <span className="truncate text-sm font-medium text-gray-500">
            {product.name}
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="space-y-5">
            <div className="relative overflow-hidden rounded-[2rem] border border-gray-200 bg-white p-3 shadow-soft">
              <div className="absolute right-6 top-6 z-10 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold capitalize text-charcoal shadow-sm backdrop-blur">
                {product.category}
              </div>
              <div className="aspect-square overflow-hidden rounded-[1.5rem] bg-gray-100">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[selectedImage]}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <span className="text-sm font-semibold text-gray-400">
                      No image available
                    </span>
                  </div>
                )}
              </div>
            </div>

            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`aspect-square overflow-hidden rounded-2xl border bg-white p-1 transition-all ${
                      selectedImage === idx
                        ? "border-burnt shadow-[0_12px_26px_rgba(201,79,36,0.18)]"
                        : "border-gray-200 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`View ${idx + 1}`}
                      className="h-full w-full rounded-xl object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <div className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-card sm:p-8">
              <div className="flex flex-wrap items-center gap-3">
                <div className="rounded-full bg-burnt-50 px-3 py-1 text-xs font-semibold text-burnt">
                  {product.brand?.name || "Unknown brand"}
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-[#16807a]">
                  <CheckCircle2 className="h-4 w-4" />
                  Marketplace ready
                </div>
              </div>

              <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-charcoal sm:text-5xl">
                {product.name}
              </h1>

              <div className="mt-6 flex items-end gap-2">
                <span className="text-4xl font-extrabold tracking-tight text-charcoal">
                  {formatINR(product.price)}
                </span>
                <span className="pb-1 text-sm font-medium text-gray-500">
                  ₹ INR
                </span>
              </div>

              <div className="mt-3 flex items-center gap-2 text-sm font-semibold">
                {stock > 0 ? (
                  <>
                    <span
                      className={`h-2 w-2 rounded-full ${
                        stock <= 5 ? "bg-burnt" : "bg-[#16807a]"
                      }`}
                    />
                    <span
                      className={
                        stock <= 5 ? "text-burnt" : "text-[#16807a]"
                      }
                    >
                      {stock <= 5
                        ? `Only ${stock} left in stock`
                        : `In stock (${stock} available)`}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="h-2 w-2 rounded-full bg-red-500" />
                    <span className="text-red-600">Out of stock</span>
                  </>
                )}
              </div>

              <div className="mt-8">
                <h2 className="text-sm font-bold text-charcoal">
                  Product details
                </h2>
                <p className="mt-3 whitespace-pre-line rounded-3xl bg-gray-50 p-5 text-sm leading-7 text-gray-600">
                  {product.description || "No description available."}
                </p>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4">
                  <div className="rounded-full bg-[#e7f5f2] p-2 text-[#16807a]">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-semibold text-charcoal">
                    Auth verified
                  </span>
                </div>
                <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4">
                  <div className="rounded-full bg-burnt-50 p-2 text-burnt">
                    <RotateCcw className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-semibold text-charcoal">
                    30 day return
                  </span>
                </div>
              </div>

              <div className="mt-8">
                {user?.role === "brand" ? (
                  <p className="rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 text-sm font-medium text-gray-500">
                    You are signed in as a brand. Switch to a customer account to
                    place orders.
                  </p>
                ) : (
                  <>
                    {addedMessage && (
                      <p className="mb-3 rounded-2xl bg-[#e7f5f2] px-4 py-3 text-sm font-semibold text-[#16807a]">
                        {addedMessage}
                      </p>
                    )}
                    <div className="mb-4 flex items-center gap-4">
                      <span className="text-sm font-semibold text-charcoal">
                        Quantity
                      </span>
                      <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-2 py-1">
                        <button
                          type="button"
                          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                          disabled={quantity <= 1 || maxQty <= 0}
                          className="rounded-full p-1.5 text-gray-600 transition-colors hover:bg-gray-100 disabled:opacity-40"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center text-sm font-semibold text-charcoal">
                          {Math.min(quantity, Math.max(maxQty, 1))}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setQuantity((q) => Math.min(maxQty, q + 1))
                          }
                          disabled={quantity >= maxQty || maxQty <= 0}
                          className="rounded-full p-1.5 text-gray-600 transition-colors hover:bg-gray-100 disabled:opacity-40"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      {inCart > 0 && (
                        <span className="text-xs font-medium text-gray-500">
                          {inCart} already in cart
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                      <button
                        onClick={() => {
                          const requested = Math.min(quantity, maxQty);
                          if (inCart >= maxQty || requested < 1) {
                            setAddedMessage("Stock limit reached for this item.");
                          } else {
                            addItem(product, requested);
                            setAddedMessage("Added to cart!");
                          }
                          setTimeout(() => setAddedMessage(""), 2500);
                        }}
                        disabled={maxQty <= 0 || inCart >= maxQty}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-charcoal shadow-sm transition-all hover:-translate-y-0.5 hover:border-burnt/30 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                      >
                        <ShoppingBag className="h-5 w-5" />
                        {inCart >= maxQty && maxQty > 0
                          ? "Max in cart"
                          : "Add to cart"}
                      </button>
                      <button
                        onClick={() => {
                          addItem(product, Math.min(quantity, maxQty));
                          navigate("/checkout");
                        }}
                        disabled={maxQty <= 0}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-burnt px-6 py-3 text-sm font-semibold text-white shadow-[0_16px_34px_rgba(201,79,36,0.25)] transition-all hover:-translate-y-0.5 hover:bg-burnt-600 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                      >
                        <Zap className="h-5 w-5" />
                        {maxQty > 0 ? "Buy now" : "Out of stock"}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
