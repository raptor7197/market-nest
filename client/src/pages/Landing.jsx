import { Link } from "react-router-dom";
import {
  Store,
  Users,
  Shield,
  ArrowRight,
  Compass,
  MapPin,
} from "lucide-react";

const Landing = () => {
  return (
    <div className="min-h-screen bg-[#E3E1DC] text-[#1A1A1A] font-mono selection:bg-[#39FF14] selection:text-black overflow-x-hidden relative flex flex-col">
      {/* Global Noise Overlay */}
      <div
        className="fixed inset-0 opacity-[0.08] pointer-events-none z-50 mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Decorative Green Strokes (Hero) */}
      <div className="absolute top-[20%] left-[15%] w-2 h-24 bg-[#39FF14] rotate-[-15deg] blur-[1px] mix-blend-multiply opacity-80 pointer-events-none" />
      <div className="absolute top-[25%] left-[25%] w-1 h-16 bg-[#39FF14] rotate-[-25deg] blur-[1px] mix-blend-multiply opacity-60 pointer-events-none" />

      {/* ================= HERO SECTION ================= */}
      <section className="relative h-screen flex flex-col w-full border-b-2 border-[#1A1A1A]">
        {/* Top Header Marquee */}
        <header className="py-6 flex justify-between items-center px-6 border-b-2 border-[#1A1A1A] bg-[#E3E1DC] z-20">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-[#39FF14] rounded-full animate-pulse" />
            <span className="text-xs md:text-sm font-bold tracking-[0.2em] uppercase">
              MarketNest_V1.0
            </span>
          </div>
          <div className="hidden md:flex gap-8 text-xs font-bold uppercase tracking-widest">
            <Link
              to="/products"
              className="hover:bg-[#1A1A1A] hover:text-[#39FF14] px-2 py-1 transition-all"
            >
              Shop
            </Link>
            <Link
              to="/login"
              className="hover:bg-[#1A1A1A] hover:text-[#39FF14] px-2 py-1 transition-all"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="hover:bg-[#1A1A1A] hover:text-[#39FF14] px-2 py-1 transition-all"
            >
              Sell
            </Link>
          </div>
        </header>

        {/* Center Content */}
        <main className="flex-grow flex flex-col items-center justify-center relative z-10">
          {/* NOISE */}
          <div className="relative mb-2 group">
            <h1 className="text-7xl md:text-9xl lg:text-[11rem] leading-[0.8] font-black tracking-tighter text-[#1A1A1A] scale-y-90 transform">
              NOISE
            </h1>
            <div
              className="absolute top-[40%] left-[-10%] w-[120%] h-2 bg-[#1A1A1A] rotate-[-2deg]"
              style={{ clipPath: "polygon(0 0, 100% 40%, 95% 100%, 5% 60%)" }}
            ></div>
          </div>

          {/* AND MAKE (Pill) */}
          <div className="relative z-20 -my-4 md:-my-8">
            <div className="border-[1.5px] border-[#1A1A1A] bg-[#E3E1DC] rounded-[100%] px-10 py-3 md:px-16 md:py-5 hover:bg-[#39FF14] transition-colors duration-300 cursor-pointer">
              <span className="text-lg md:text-2xl font-sans font-bold uppercase tracking-widest">
                And Make
              </span>
            </div>
          </div>

          {/* Color (Script) */}
          <div className="relative z-10 -mt-2">
            <h2 className="text-6xl md:text-9xl font-serif italic text-[#1A1A1A] rotate-[-5deg] mix-blend-difference opacity-90">
              Color
            </h2>
          </div>

          {/* SHIFT */}
          <div className="relative mt-2 group">
            <h1 className="text-7xl md:text-9xl lg:text-[11rem] leading-[0.8] font-black tracking-tighter text-[#1A1A1A] scale-y-90 transform">
              SHIFT
            </h1>
            <div className="absolute -right-8 bottom-4 w-1 h-24 bg-[#39FF14] rotate-[15deg] group-hover:rotate-[45deg] transition-transform duration-500"></div>
          </div>

          {/* Absolute patterns */}
          <div
            className="absolute top-10 left-10 w-24 h-24 border border-[#1A1A1A] opacity-50 flex items-center justify-center rounded-full animate-[spin_10s_linear_infinite]"
            style={{ borderStyle: "dashed" }}
          >
            <div className="w-2 h-2 bg-[#1A1A1A] rounded-full" />
          </div>
        </main>

        {/* Hero Footer */}
        <div className="border-t-2 border-[#1A1A1A] grid grid-cols-2 md:grid-cols-4 divide-x-2 divide-[#1A1A1A]">
          <div className="p-4 flex flex-col justify-between h-32 hover:bg-[#1A1A1A] hover:text-[#E3E1DC] transition-colors group cursor-default">
            <span className="text-xs uppercase tracking-widest">Brands</span>
            <span className="text-4xl font-bold">500+</span>
          </div>
          <div className="p-4 flex flex-col justify-between h-32 hover:bg-[#1A1A1A] hover:text-[#E3E1DC] transition-colors group cursor-default">
            <span className="text-xs uppercase tracking-widest">Products</span>
            <span className="text-4xl font-bold">10K+</span>
          </div>
          <div className="p-4 flex flex-col justify-between h-32 hover:bg-[#1A1A1A] hover:text-[#E3E1DC] transition-colors group cursor-default">
            <span className="text-xs uppercase tracking-widest">Users</span>
            <span className="text-4xl font-bold">50K+</span>
          </div>
          <Link
            to="/products"
            className="p-4 flex flex-col justify-between h-32 bg-[#39FF14] hover:bg-[#32d710] transition-colors cursor-pointer text-black"
          >
            <span className="text-xs uppercase tracking-widest flex justify-between">
              Enter <ArrowRight size={16} />
            </span>
            <span className="text-4xl font-bold">SHOP</span>
          </Link>
        </div>
      </section>

      {/* ================= MARQUEE STRIP ================= */}
      <div className="bg-[#1A1A1A] text-[#E3E1DC] overflow-hidden py-3 border-b-2 border-[#1A1A1A]">
        <div className="animate-[slide_20s_linear_infinite] whitespace-nowrap">
          {Array(10)
            .fill(" DISCOVER YOUR NEXT LOOK — TRIZEN VENTURES — ")
            .map((text, i) => (
              <span
                key={i}
                className="text-sm font-bold tracking-[0.3em] inline-block mx-4"
              >
                {text}
              </span>
            ))}
        </div>
      </div>

      {/* ================= FEATURES SECTION ================= */}
      <section className="py-24 px-6 md:px-12 bg-[#E3E1DC] relative">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 border-l-4 border-[#39FF14] pl-6">
            <h2 className="text-5xl md:text-7xl font-black text-[#1A1A1A] mb-4 uppercase tracking-tighter">
              Why
              <br />
              Choose Us
            </h2>
            <p className="text-lg md:text-xl font-bold text-[#1A1A1A]/60 max-w-xl">
              BUILT FOR THE BOLD. DESIGNED FOR COMMERCE.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group border-2 border-[#1A1A1A] p-8 hover:bg-[#1A1A1A] hover:text-[#E3E1DC] transition-all duration-300 relative">
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <Store className="w-8 h-8 text-[#39FF14]" />
              </div>
              <h3 className="text-2xl font-bold uppercase mb-4 group-hover:text-[#39FF14]">
                For Brands
              </h3>
              <p className="text-sm leading-relaxed opacity-80">
                Create your online store. Manage products effortlessly. Reach
                thousands. No compromise.
              </p>
              <div className="mt-8 h-1 w-full bg-[#1A1A1A] group-hover:bg-[#39FF14]" />
            </div>

            {/* Feature 2 */}
            <div className="group border-2 border-[#1A1A1A] p-8 bg-[#1A1A1A] text-[#E3E1DC] relative top-0 md:-top-8 shadow-[8px_8px_0px_0px_#39FF14]">
              <div className="absolute top-4 right-4">
                <Users className="w-8 h-8 text-[#39FF14]" />
              </div>
              <h3 className="text-2xl font-bold uppercase mb-4 text-[#39FF14]">
                For Users
              </h3>
              <p className="text-sm leading-relaxed opacity-80">
                Curated fashion from top brands. Powerful search. Filter the
                noise. Find the signal.
              </p>
              <div className="mt-8 h-1 w-full bg-[#39FF14]" />
            </div>

            {/* Feature 3 */}
            <div className="group border-2 border-[#1A1A1A] p-8 hover:bg-[#1A1A1A] hover:text-[#E3E1DC] transition-all duration-300 relative">
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <Shield className="w-8 h-8 text-[#39FF14]" />
              </div>
              <h3 className="text-2xl font-bold uppercase mb-4 group-hover:text-[#39FF14]">
                Secure
              </h3>
              <p className="text-sm leading-relaxed opacity-80">
                Enterprise-grade security. Seamless authentication.
                Lightning-fast. Rock solid.
              </p>
              <div className="mt-8 h-1 w-full bg-[#1A1A1A] group-hover:bg-[#39FF14]" />
            </div>
          </div>
        </div>
      </section>

      {/* ================= CATEGORIES SECTION ================= */}
      <section className="bg-[#1A1A1A] text-[#E3E1DC] py-24 border-y-2 border-[#39FF14]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-[#E3E1DC]/20 pb-8">
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">
              Category<span className="text-[#39FF14]">.Idx</span>
            </h2>
            <span className="text-[#39FF14] font-mono mt-4 md:mt-0">
              // SELECT_FILTER_MODE
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-px bg-[#39FF14] border border-[#39FF14]">
            {[
              { name: "Clothing", count: "2.4K" },
              { name: "Shoes", count: "1.8K" },
              { name: "Accessories", count: "3.2K" },
              { name: "Bags", count: "1.5K" },
              { name: "Jewelry", count: "2.1K" },
            ].map((cat, idx) => (
              <Link
                key={cat.name}
                to={`/products?category=${cat.name.toLowerCase()}`}
                className="bg-[#1A1A1A] p-6 hover:bg-[#E3E1DC] hover:text-[#1A1A1A] transition-colors group aspect-square flex flex-col justify-between"
              >
                <span className="text-xs font-mono text-[#39FF14] group-hover:text-[#1A1A1A]">
                  0{idx + 1}
                </span>
                <div>
                  <div className="text-2xl font-bold uppercase mb-1">
                    {cat.name}
                  </div>
                  <div className="text-xs opacity-60 font-mono">
                    {cat.count} ITEMS
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA SECTION ================= */}
      <section className="py-32 px-6 bg-[#E3E1DC] flex flex-col items-center text-center relative overflow-hidden">
        {/* Background Grid */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(#1A1A1A 1px, transparent 1px), linear-gradient(90deg, #1A1A1A 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        ></div>

        <div className="relative z-10 max-w-4xl">
          <h2 className="text-5xl md:text-8xl font-black text-[#1A1A1A] mb-8 uppercase leading-[0.9]">
            Start Your
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#39FF14] to-[#1A1A1A]">
              Journey
            </span>
          </h2>

          <div className="flex flex-col md:flex-row gap-6 justify-center mt-12">
            <Link
              to="/signup"
              className="px-12 py-4 bg-[#1A1A1A] text-[#39FF14] text-xl font-bold uppercase tracking-widest hover:bg-[#39FF14] hover:text-[#1A1A1A] transition-all border-2 border-[#1A1A1A] shadow-[4px_4px_0px_0px_#1A1A1A] hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
            >
              Create Account
            </Link>
            <Link
              to="/products"
              className="px-12 py-4 bg-transparent text-[#1A1A1A] text-xl font-bold uppercase tracking-widest hover:bg-[#1A1A1A] hover:text-[#E3E1DC] transition-all border-2 border-[#1A1A1A]"
            >
              Browse All
            </Link>
          </div>
        </div>
      </section>

      {/* ================= FOOTER PROMO ================= */}
      <footer className="bg-[#1A1A1A] text-[#E3E1DC] py-8 border-t border-[#39FF14]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 border border-[#39FF14] flex items-center justify-center rotate-45">
              <div className="w-6 h-6 bg-[#39FF14] -rotate-45" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold tracking-widest uppercase text-lg">
                MarketNest
              </span>
              <span className="text-[10px] text-[#39FF14] font-mono">
                POWERED BY TRIZEN VENTURES
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono opacity-60">
            <MapPin size={12} />
            <span>BUILDING_THE_FUTURE_OF_FASHION</span>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes slide {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};

export default Landing;
