import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { orderApi } from "../api/orderApi";
import {
  ArrowLeft,
  Minus,
  PackageOpen,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react";

const EMPTY_ADDRESS = {
  fullName: "",
  phone: "",
  street: "",
  city: "",
  state: "",
  postalCode: "",
  country: "India",
};

const Checkout = () => {
  const { items, subtotal, updateQuantity, removeItem, clearCart } = useCart();
  const navigate = useNavigate();
  const [address, setAddress] = useState(EMPTY_ADDRESS);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setAddress((current) => ({ ...current, [e.target.name]: e.target.value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError("");
    if (items.length === 0) return;

    setPlacing(true);
    try {
      await orderApi.createOrder({
        items: items.map((item) => ({
          product: item.product,
          quantity: item.quantity,
        })),
        shippingAddress: address,
        paymentMethod: "cod",
      });

      clearCart();
      navigate("/orders", { state: { placed: true } });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not place your order. Please try again."
      );
    } finally {
      setPlacing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-offwhite px-4 py-20">
        <div className="mx-auto max-w-xl rounded-[2rem] border border-dashed border-gray-300 bg-white p-12 text-center shadow-card">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-500">
            <PackageOpen className="h-7 w-7" />
          </div>
          <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-charcoal">
            Your cart is empty
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Browse the marketplace and add products to continue.
          </p>
          <Link
            to="/products"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-burnt px-6 py-3 text-sm font-semibold text-white shadow-[0_16px_34px_rgba(201,79,36,0.25)] transition-all hover:-translate-y-0.5 hover:bg-burnt-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to marketplace
          </Link>
        </div>
      </div>
    );
  }

  const inputClass =
    "w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-charcoal outline-none transition-all placeholder:text-gray-400 focus:border-burnt focus:bg-white focus:ring-4 focus:ring-burnt/10";
  const labelClass = "mb-2 block text-sm font-semibold text-charcoal";

  return (
    <div className="min-h-screen bg-offwhite">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="rounded-full border border-gray-200 bg-white p-3 text-charcoal shadow-sm transition-colors hover:bg-gray-100"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-charcoal">
              Checkout
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Review your items and add a shipping address.
            </p>
          </div>
        </div>

        <form
          onSubmit={handlePlaceOrder}
          className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]"
        >
          <section className="overflow-hidden rounded-[2rem] border border-gray-200 bg-white shadow-card">
            <div className="border-b border-gray-200 px-6 py-5">
              <h2 className="flex items-center gap-2 text-lg font-extrabold text-charcoal">
                <ShoppingBag className="h-5 w-5" />
                Cart items
              </h2>
            </div>

            <ul className="divide-y divide-gray-100">
              {items.map((item) => (
                <li key={item.product} className="flex gap-4 px-6 py-5">
                  <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl bg-gray-100">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs font-medium text-gray-400">
                        No img
                      </div>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col justify-between gap-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-charcoal">
                          {item.name}
                        </p>
                        {item.brandName && (
                          <p className="text-xs font-medium text-gray-500">
                            {item.brandName}
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.product)}
                        className="rounded-full p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                        aria-label={`Remove ${item.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-2 py-1">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.product, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                          className="rounded-full p-1 text-gray-600 transition-colors hover:bg-gray-100 disabled:opacity-40"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-6 text-center text-sm font-semibold text-charcoal">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.product, item.quantity + 1)
                          }
                          disabled={item.quantity >= 99}
                          className="rounded-full p-1 text-gray-600 transition-colors hover:bg-gray-100 disabled:opacity-40"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      <span className="font-extrabold tracking-tight text-charcoal">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="h-fit rounded-[2rem] border border-gray-200 bg-white p-6 shadow-card">
            <h2 className="text-lg font-extrabold text-charcoal">
              Shipping address
            </h2>

            <div className="mt-5 space-y-4">
              <div>
                <label className={labelClass} htmlFor="fullName">
                  Full name
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  value={address.fullName}
                  onChange={handleChange}
                  required
                  className={inputClass}
                  placeholder="Aarav Sharma"
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="phone">
                  Phone
                </label>
                <input
                  id="phone"
                  name="phone"
                  value={address.phone}
                  onChange={handleChange}
                  required
                  className={inputClass}
                  placeholder="9876543210"
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="street">
                  Street address
                </label>
                <input
                  id="street"
                  name="street"
                  value={address.street}
                  onChange={handleChange}
                  required
                  className={inputClass}
                  placeholder="12 MG Road"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass} htmlFor="city">
                    City
                  </label>
                  <input
                    id="city"
                    name="city"
                    value={address.city}
                    onChange={handleChange}
                    required
                    className={inputClass}
                    placeholder="Bengaluru"
                  />
                </div>
                <div>
                  <label className={labelClass} htmlFor="state">
                    State
                  </label>
                  <input
                    id="state"
                    name="state"
                    value={address.state}
                    onChange={handleChange}
                    required
                    className={inputClass}
                    placeholder="Karnataka"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass} htmlFor="postalCode">
                    Postal code
                  </label>
                  <input
                    id="postalCode"
                    name="postalCode"
                    value={address.postalCode}
                    onChange={handleChange}
                    required
                    className={inputClass}
                    placeholder="560001"
                  />
                </div>
                <div>
                  <label className={labelClass} htmlFor="country">
                    Country
                  </label>
                  <input
                    id="country"
                    name="country"
                    value={address.country}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-2 border-t border-gray-200 pt-5">
              <div className="flex items-center justify-between text-sm font-medium text-gray-500">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-sm font-medium text-gray-500">
                <span>Shipping</span>
                <span className="font-semibold text-[#16807a]">Free</span>
              </div>
              <div className="flex items-center justify-between text-lg font-extrabold text-charcoal">
                <span>Total</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <p className="pt-1 text-xs font-medium text-gray-500">
                Payment method: Cash on delivery
              </p>
            </div>

            {error && (
              <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={placing}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-burnt px-6 py-3 text-sm font-semibold text-white shadow-[0_16px_34px_rgba(201,79,36,0.25)] transition-all hover:-translate-y-0.5 hover:bg-burnt-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {placing ? "Placing order..." : "Place order"}
            </button>
          </section>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
