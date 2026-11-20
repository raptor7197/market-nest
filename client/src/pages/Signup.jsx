import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ArrowRight, Lock, Mail, Store, User, UserPlus } from "lucide-react";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from;
  const redirectTo = from
    ? `${from.pathname || "/products"}${from.search || ""}${from.hash || ""}`
    : "/products";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signup(
        formData.email,
        formData.password,
        formData.name,
        formData.role,
      );
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-offwhite px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-[2rem] border border-gray-200 bg-white shadow-soft lg:grid-cols-[1.05fr_0.95fr]">
        <div className="flex items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-md">
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-burnt-50 text-burnt">
                <UserPlus className="h-6 w-6" />
              </div>
              <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-charcoal">
                Sign up
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                Create a customer or brand account.
              </p>
            </div>

            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
              {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
                  {error}
                </div>
              )}

              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-semibold text-charcoal"
                >
                  Full name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 pl-12 text-sm text-charcoal outline-none transition-all placeholder:text-gray-400 focus:border-burnt focus:ring-4 focus:ring-burnt/10"
                    placeholder="Jane Cooper"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-charcoal"
                >
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 pl-12 text-sm text-charcoal outline-none transition-all placeholder:text-gray-400 focus:border-burnt focus:ring-4 focus:ring-burnt/10"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-charcoal"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 pl-12 text-sm text-charcoal outline-none transition-all placeholder:text-gray-400 focus:border-burnt focus:ring-4 focus:ring-burnt/10"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="role"
                  className="mb-2 block text-sm font-semibold text-charcoal"
                >
                  Account type
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-charcoal outline-none transition-all focus:border-burnt focus:ring-4 focus:ring-burnt/10"
                >
                  <option value="customer">Customer</option>
                  <option value="brand">Brand seller</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-burnt px-6 py-3 text-sm font-semibold text-white shadow-[0_16px_34px_rgba(201,79,36,0.25)] transition-all hover:-translate-y-0.5 hover:bg-burnt-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <span className="spinner h-4 w-4 border-2" />
                    Creating account
                  </>
                ) : (
                  <>
                    Sign up
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              <p className="text-center text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  state={location.state}
                  className="font-semibold text-burnt hover:text-burnt-600"
                >
                  Login
                </Link>
              </p>
            </form>
          </div>
        </div>

        <div className="hidden bg-charcoal p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-charcoal">
              <Store className="h-6 w-6" />
            </div>
            <h1 className="mt-10 max-w-sm text-4xl font-extrabold tracking-tight">
              Build a storefront or shop the catalog.
            </h1>
            <p className="mt-4 max-w-sm text-sm leading-6 text-white/60">
              The same registration flow supports customer browsing and brand
              dashboard access.
            </p>
          </div>
          <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
            <p className="text-sm font-semibold text-white/70">
              Brand accounts can create products, upload up to five images, and
              publish or draft listings from the dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
