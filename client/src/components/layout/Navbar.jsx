import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Compass, User, LogOut, LayoutDashboard, Menu, X } from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <nav className="bg-[#E3E1DC] border-b-2 border-[#1A1A1A] sticky top-0 z-50 font-mono text-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-[#1A1A1A] flex items-center justify-center group-hover:bg-[#39FF14] transition-colors border border-[#1A1A1A]">
              <Compass className="h-5 w-5 text-[#39FF14] group-hover:text-[#1A1A1A] transition-colors" />
            </div>
            <span className="text-xl font-black uppercase tracking-tighter">
              MarketNest
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/products"
              className="px-3 py-1 font-bold uppercase tracking-widest hover:bg-[#1A1A1A] hover:text-[#39FF14] transition-all"
            >
              Marketplace
            </Link>

            {user ? (
              <div className="flex items-center gap-6">
                {user.role === "brand" && (
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-2 px-3 py-1 font-bold uppercase tracking-widest hover:bg-[#1A1A1A] hover:text-[#39FF14] transition-all"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>
                )}
                <div className="flex items-center gap-4 pl-6 border-l-2 border-[#1A1A1A]">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 border border-[#1A1A1A] flex items-center justify-center bg-[#39FF14]">
                      <User className="h-4 w-4 text-[#1A1A1A]" />
                    </div>
                    <span className="text-xs font-bold uppercase">
                      {user.name}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-1 hover:bg-[#FF3939] hover:text-white transition-colors border border-transparent hover:border-[#1A1A1A]"
                    title="Logout"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  to="/login"
                  className="px-4 py-2 font-bold uppercase tracking-widest hover:bg-[#1A1A1A] hover:text-[#39FF14] transition-all"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-6 py-2 bg-[#1A1A1A] text-[#39FF14] font-bold uppercase tracking-widest border-2 border-[#1A1A1A] hover:bg-[#39FF14] hover:text-[#1A1A1A] transition-all shadow-[4px_4px_0px_0px_rgba(26,26,26,0.3)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 border-2 border-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-[#39FF14] transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t-2 border-[#1A1A1A] bg-[#E3E1DC]">
          <div className="flex flex-col p-4 gap-4">
            <Link
              to="/products"
              className="py-2 px-4 font-bold uppercase tracking-widest hover:bg-[#1A1A1A] hover:text-[#39FF14] border border-transparent hover:border-[#1A1A1A] transition-all"
              onClick={() => setMobileMenuOpen(false)}
            >
              Marketplace
            </Link>
            {user ? (
              <>
                {user.role === "brand" && (
                  <Link
                    to="/dashboard"
                    className="py-2 px-4 font-bold uppercase tracking-widest hover:bg-[#1A1A1A] hover:text-[#39FF14] border border-transparent hover:border-[#1A1A1A] transition-all"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                )}
                <div className="py-2 px-4 flex items-center justify-between border-t border-[#1A1A1A] mt-2 pt-4">
                  <span className="font-bold uppercase">{user.name}</span>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="text-[#FF3939] font-bold uppercase hover:underline"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-3 mt-2 border-t border-[#1A1A1A] pt-4">
                <Link
                  to="/login"
                  className="py-2 px-4 font-bold uppercase tracking-widest text-center hover:bg-[#1A1A1A] hover:text-[#39FF14] border border-transparent hover:border-[#1A1A1A] transition-all"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="py-3 px-4 bg-[#1A1A1A] text-[#39FF14] font-bold uppercase tracking-widest text-center border-2 border-[#1A1A1A] hover:bg-[#39FF14] hover:text-[#1A1A1A] transition-all"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
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
