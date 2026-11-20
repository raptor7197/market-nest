import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import {
  Compass,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  ShoppingBag,
  User,
  X,
} from "lucide-react";

const navLinkClass =
  "text-sm font-medium text-gray-600 transition-colors hover:text-charcoal";

const actionLinkClass =
  "inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition-colors";

const CartButton = ({ count, onClick }) => (
  <Link
    to="/checkout"
    onClick={onClick}
    className="relative rounded-full border border-gray-200 p-2.5 text-charcoal transition-colors hover:bg-gray-100"
    aria-label={`Cart with ${count} items`}
  >
    <ShoppingBag className="h-5 w-5" />
    {count > 0 && (
      <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-burnt px-1 text-[10px] font-bold text-white">
        {count}
      </span>
    )}
  </Link>
);

const Navbar = () => {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const showCart = !user || user.role === "customer";

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 text-charcoal backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-charcoal text-white">
              <Compass className="h-5 w-5" />
            </div>
            <div className="leading-tight">
              <span className="block text-sm font-extrabold tracking-tight sm:text-base">
                MarketNest
              </span>
              <span className="block text-[11px] font-medium text-gray-500">
                product marketplace
              </span>
            </div>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <Link to="/products" className={navLinkClass}>
              Marketplace
            </Link>

            {user && user.role === "brand" && (
              <>
                <Link to="/dashboard" className={navLinkClass}>
                  Dashboard
                </Link>
                <Link to="/dashboard/orders" className={navLinkClass}>
                  Orders
                </Link>
              </>
            )}

            {user && user.role === "customer" && (
              <Link to="/orders" className={navLinkClass}>
                My Orders
              </Link>
            )}
          </div>

          <div className="flex items-center gap-2">
            {showCart && <CartButton count={itemCount} />}

            {user ? (
              <div className="hidden items-center gap-3 md:flex">
                <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-burnt-50 text-burnt">
                    <User className="h-4 w-4" />
                  </div>
                  <span className="max-w-[160px] truncate text-sm font-semibold text-gray-700">
                    {user.name}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-charcoal"
                  title="Logout"
                  aria-label="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="hidden items-center gap-2 md:flex">
                <Link to="/login" className={`${actionLinkClass} text-gray-600 hover:bg-gray-100 hover:text-charcoal`}>
                  Login
                </Link>
                <Link
                  to="/signup"
                  className={`${actionLinkClass} bg-burnt text-white shadow-[0_12px_28px_rgba(201,79,36,0.18)] hover:bg-burnt-600`}
                >
                  Sign up
                </Link>
              </div>
            )}

            <button
              className="rounded-full border border-gray-200 p-2 text-charcoal transition-colors hover:bg-gray-100 md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-gray-200 bg-white md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4 sm:px-6">
            <Link
              to="/products"
              className="rounded-2xl px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-charcoal"
              onClick={() => setMobileMenuOpen(false)}
            >
              Marketplace
            </Link>
            {user && user.role === "brand" && (
              <>
                <Link
                  to="/dashboard"
                  className="rounded-2xl px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-charcoal"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/dashboard/orders"
                  className="rounded-2xl px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-charcoal"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Orders
                </Link>
              </>
            )}
            {user && user.role === "customer" && (
              <Link
                to="/orders"
                className="rounded-2xl px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-charcoal"
                onClick={() => setMobileMenuOpen(false)}
              >
                My Orders
              </Link>
            )}
            {showCart && (
              <Link
                to="/checkout"
                className="flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-charcoal"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Cart
                </span>
                <span className="rounded-full bg-burnt px-2 py-0.5 text-xs font-bold text-white">
                  {itemCount}
                </span>
              </Link>
            )}

            {user ? (
              <div className="mt-2 flex items-center justify-between rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-burnt-50 text-burnt">
                    <User className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-semibold text-charcoal">
                    {user.name}
                  </span>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-sm font-semibold text-gray-600 hover:text-charcoal"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="mt-2 grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  className="rounded-full border border-gray-200 px-4 py-3 text-center text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100 hover:text-charcoal"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="rounded-full bg-burnt px-4 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-burnt-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
