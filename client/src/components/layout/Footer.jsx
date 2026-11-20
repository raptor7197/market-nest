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
    <footer className="border-t border-gray-200 bg-charcoal text-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-charcoal">
                <Compass className="h-6 w-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold tracking-tight">
                  MarketNest
                </span>
                <span className="text-xs font-medium text-white/50">
                  Trizen Ventures
                </span>
              </div>
            </div>
            <p className="max-w-[230px] text-sm leading-relaxed text-white/60">
              A calmer marketplace for discovering products from emerging
              brands and managing every listing in one place.
            </p>
          </div>

          <div>
            <h3 className="mb-6 text-sm font-semibold text-white">
              Navigation
            </h3>
            <ul className="space-y-3 text-sm text-white/60">
              {[
                ["Browse Products", "/products"],
                ["Start Selling", "/signup"],
                ["Login", "/login"],
              ].map(([label, href]) => (
                <li key={label}>
                  <a
                    href={href}
                    className="group flex items-center gap-1 transition-colors hover:text-white"
                  >
                    {label}
                    <ArrowUpRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-6 text-sm font-semibold text-white">
              Categories
            </h3>
            <ul className="space-y-3 text-sm text-white/60">
              {["Clothing", "Shoes", "Accessories", "Bags", "Jewelry"].map(
                (cat) => (
                  <li key={cat}>
                    <a
                      href={`/products?category=${cat.toLowerCase()}`}
                      className="group flex items-center gap-1 transition-colors hover:text-white"
                    >
                      {cat}
                      <ArrowUpRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                    </a>
                  </li>
                ),
              )}
            </ul>
          </div>

          <div>
            <h3 className="mb-6 text-sm font-semibold text-white">Contact</h3>
            <div className="space-y-4 text-sm text-white/60">
              <div className="flex items-center gap-3">
                <div className="rounded-full border border-white/10 p-2 text-white">
                  <Mail className="h-4 w-4" />
                </div>
                <span>support@trizen.com</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="rounded-full border border-white/10 p-2 text-white">
                  <MapPin className="h-4 w-4" />
                </div>
                <span>Building with Trizen Ventures</span>
              </div>

              <div className="mt-6 flex gap-4">
                {[Instagram, Twitter, Facebook].map((Icon, idx) => (
                  <a
                    key={idx}
                    href="#"
                    className="rounded-full bg-white/10 p-2 text-white transition-all hover:-translate-y-0.5 hover:bg-white hover:text-charcoal"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-white/50 md:flex-row">
          <p>&copy; {new Date().getFullYear()} MarketNest. Trizen Ventures.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white">
              Privacy
            </a>
            <a href="#" className="hover:text-white">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
