import {
  Compass,
  Mail,
  MapPin,
  Instagram,
  Twitter,
  Facebook,
  ArrowUpRight,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#1A1A1A] text-[#E3E1DC] border-t-2 border-[#39FF14] font-mono">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1 space-y-6">
            <div className="flex items-center gap-2 group cursor-default">
              <div className="w-10 h-10 border border-[#39FF14] flex items-center justify-center rotate-45 group-hover:bg-[#39FF14] transition-colors duration-300">
                <Compass className="h-6 w-6 text-[#E3E1DC] group-hover:text-[#1A1A1A] -rotate-45 transition-colors duration-300" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black uppercase tracking-tighter">
                  MarketNest
                </span>
                <span className="text-[10px] text-[#39FF14] tracking-widest">
                  EST. 2024
                </span>
              </div>
            </div>
            <p className="text-xs leading-relaxed opacity-60 max-w-[200px]">
              // PREMIER DESTINATION FOR DIGITAL COMMERCE.
              <br />
              CONNECT. TRANSACT. EVOLVE.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-[#39FF14] font-bold uppercase tracking-widest mb-6 text-sm flex items-center gap-2">
              <span className="w-2 h-2 bg-[#39FF14]"></span>
              Navigation
            </h3>
            <ul className="space-y-3 text-xs uppercase tracking-wider">
              <li>
                <a
                  href="/products"
                  className="hover:text-[#39FF14] hover:pl-2 transition-all flex items-center gap-1 group"
                >
                  Browse Products
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
              <li>
                <a
                  href="/signup"
                  className="hover:text-[#39FF14] hover:pl-2 transition-all flex items-center gap-1 group"
                >
                  Start Selling
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
              <li>
                <a
                  href="/login"
                  className="hover:text-[#39FF14] hover:pl-2 transition-all flex items-center gap-1 group"
                >
                  Login
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-[#39FF14] font-bold uppercase tracking-widest mb-6 text-sm flex items-center gap-2">
              <span className="w-2 h-2 bg-[#39FF14]"></span>
              Index
            </h3>
            <ul className="space-y-3 text-xs uppercase tracking-wider">
              {["Clothing", "Shoes", "Accessories", "Bags", "Jewelry"].map(
                (cat) => (
                  <li key={cat}>
                    <a
                      href={`/products?category=${cat.toLowerCase()}`}
                      className="hover:text-[#39FF14] hover:pl-2 transition-all flex items-center gap-1 group"
                    >
                      {cat}
                      <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </li>
                ),
              )}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-[#39FF14] font-bold uppercase tracking-widest mb-6 text-sm flex items-center gap-2">
              <span className="w-2 h-2 bg-[#39FF14]"></span>
              Comms
            </h3>
            <div className="space-y-4 text-xs">
              <div className="flex items-center gap-3 group">
                <div className="p-2 border border-[#E3E1DC] group-hover:border-[#39FF14] transition-colors">
                  <Mail className="h-4 w-4 text-[#E3E1DC] group-hover:text-[#39FF14]" />
                </div>
                <span className="uppercase tracking-wide">
                  support@trizen.com
                </span>
              </div>
              <div className="flex items-center gap-3 group">
                <div className="p-2 border border-[#E3E1DC] group-hover:border-[#39FF14] transition-colors">
                  <MapPin className="h-4 w-4 text-[#E3E1DC] group-hover:text-[#39FF14]" />
                </div>
                <span className="uppercase tracking-wide">
                  Metaverse, Grid 7
                </span>
              </div>

              <div className="flex gap-4 mt-6">
                {[Instagram, Twitter, Facebook].map((Icon, idx) => (
                  <a
                    key={idx}
                    href="#"
                    className="p-2 bg-[#E3E1DC] text-[#1A1A1A] hover:bg-[#39FF14] hover:text-[#1A1A1A] hover:-translate-y-1 transition-all"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-[#39FF14]/30 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-widest opacity-60">
          <p>
            &copy; {new Date().getFullYear()} MarketNest // Trizen Ventures.
          </p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-[#39FF14]">
              Privacy_Protocol
            </a>
            <a href="#" className="hover:text-[#39FF14]">
              Terms_Of_Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
