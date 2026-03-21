import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ArrowRight, UserPlus, User, Mail, Lock } from "lucide-react";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer", // Default role
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await register(formData);
      navigate("/products");
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#E3E1DC] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-mono relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-5">
        <div className="absolute top-10 right-10 text-9xl font-black">JOIN</div>
        <div className="absolute bottom-10 left-10 text-9xl font-black">US</div>
      </div>

      <div className="max-w-md w-full space-y-8 bg-white p-8 border-2 border-[#1A1A1A] shadow-[8px_8px_0px_0px_#1A1A1A] relative z-10">
        <div>
          <div className="mx-auto h-12 w-12 bg-[#39FF14] border-2 border-[#1A1A1A] flex items-center justify-center">
            <UserPlus className="h-6 w-6 text-[#1A1A1A]" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-black text-[#1A1A1A] uppercase tracking-tighter">
            Create_User
          </h2>
          <p className="mt-2 text-center text-sm text-[#1A1A1A]/60 font-bold uppercase tracking-widest">
            // Register to access grid
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-[#FF3939]/10 border-2 border-[#FF3939] text-[#FF3939] p-3 text-sm font-bold uppercase flex items-center gap-2">
              <span className="text-xl">!</span> {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="group">
              <label
                htmlFor="name"
                className="block text-xs font-bold uppercase mb-1"
              >
                Full_Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-[#1A1A1A]/40" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-3 pl-10 border-2 border-[#1A1A1A] placeholder-[#1A1A1A]/30 text-[#1A1A1A] focus:outline-none focus:ring-0 focus:border-[#39FF14] focus:bg-[#39FF14]/5 transition-colors sm:text-sm font-bold"
                  placeholder="JOHN DOE"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="group">
              <label
                htmlFor="email"
                className="block text-xs font-bold uppercase mb-1"
              >
                Email_Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-[#1A1A1A]/40" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-3 pl-10 border-2 border-[#1A1A1A] placeholder-[#1A1A1A]/30 text-[#1A1A1A] focus:outline-none focus:ring-0 focus:border-[#39FF14] focus:bg-[#39FF14]/5 transition-colors sm:text-sm font-bold"
                  placeholder="USER@DOMAIN.COM"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="group">
              <label
                htmlFor="password"
                className="block text-xs font-bold uppercase mb-1"
              >
                Password_Key
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-[#1A1A1A]/40" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-3 pl-10 border-2 border-[#1A1A1A] placeholder-[#1A1A1A]/30 text-[#1A1A1A] focus:outline-none focus:ring-0 focus:border-[#39FF14] focus:bg-[#39FF14]/5 transition-colors sm:text-sm font-bold"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="group">
              <label
                htmlFor="role"
                className="block text-xs font-bold uppercase mb-1"
              >
                User_Role
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="appearance-none rounded-none relative block w-full px-3 py-3 border-2 border-[#1A1A1A] bg-white text-[#1A1A1A] focus:outline-none focus:ring-0 focus:border-[#39FF14] sm:text-sm font-bold uppercase"
              >
                <option value="customer">Customer</option>
                <option value="brand">Brand_Seller</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-3 px-4 border-2 border-[#1A1A1A] text-sm font-black uppercase tracking-widest text-[#1A1A1A] bg-[#39FF14] hover:bg-[#32d710] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#39FF14] disabled:opacity-50 disabled:cursor-not-allowed shadow-[4px_4px_0px_0px_#1A1A1A] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-[#1A1A1A] border-t-transparent rounded-full animate-spin"></span>
                Processing...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Initialize_User <ArrowRight className="h-4 w-4" />
              </span>
            )}
          </button>

          <div className="text-center mt-4">
            <p className="text-xs font-bold uppercase">
              Already_Registered?{" "}
              <Link
                to="/login"
                className="text-[#1A1A1A] underline decoration-2 decoration-[#39FF14] hover:bg-[#39FF14] transition-colors"
              >
                Access_Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
