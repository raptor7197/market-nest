import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  Compass,
  Package,
  Search,
  Shield,
  Sparkles,
  Store,
  Users,
} from "lucide-react";

const categories = ["Clothing", "Shoes", "Accessories", "Bags", "Jewelry"];

const Landing = () => {
  return (
    <div className="min-h-screen overflow-hidden bg-offwhite text-charcoal">
      <header className="border-b border-gray-200/80 bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-charcoal text-white">
              <Compass className="h-5 w-5" />
            </div>
            <span className="text-xl font-extrabold tracking-tight">
              MarketNest
            </span>
          </Link>

          <nav className="hidden items-center gap-2 md:flex">
            <Link
              to="/products"
              className="rounded-full px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100"
            >
              Marketplace
            </Link>
            <Link
              to="/login"
              className="rounded-full px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="rounded-full bg-burnt px-5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(201,79,36,0.24)] transition-all hover:-translate-y-0.5 hover:bg-burnt-600"
            >
              Join as brand
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="relative">
          <div className="absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_20%_20%,rgba(201,79,36,0.14),transparent_34%),radial-gradient(circle_at_80%_0%,rgba(22,128,122,0.12),transparent_28%)]" />
          <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:px-8 lg:py-24">
            <div className="flex flex-col justify-center">
              <h1 className="max-w-4xl text-5xl font-extrabold tracking-tight text-charcoal sm:text-6xl lg:text-7xl">
                Discover products built by emerging brands.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-600">
                MarketNest gives customers a polished place to browse and gives
                brands a focused dashboard for listing, editing, and managing
                products.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-burnt px-6 py-3 text-sm font-semibold text-white shadow-[0_16px_34px_rgba(201,79,36,0.25)] transition-all hover:-translate-y-0.5 hover:bg-burnt-600"
                >
                  Browse marketplace
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-charcoal shadow-sm transition-all hover:-translate-y-0.5 hover:border-burnt/30"
                >
                  Join as brand
                </Link>
              </div>

              <div className="mt-10 grid max-w-2xl grid-cols-3 gap-3">
                {[
                  ["500+", "Brands"],
                  ["10K+", "Products"],
                  ["50K+", "Users"],
                ].map(([value, label]) => (
                  <div
                    key={label}
                    className="rounded-3xl border border-gray-200 bg-white/80 p-4 shadow-sm backdrop-blur"
                  >
                    <p className="text-2xl font-extrabold tracking-tight text-charcoal">
                      {value}
                    </p>
                    <p className="mt-1 text-sm font-medium text-gray-500">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="rounded-[2rem] border border-gray-200 bg-white p-4 shadow-soft">
                <div className="rounded-[1.5rem] bg-charcoal p-4 text-white">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-white/60">
                        Live marketplace
                      </p>
                      <h2 className="mt-1 text-2xl font-extrabold">
                        Curated drop
                      </h2>
                    </div>
                    <div className="rounded-full bg-white/10 p-3">
                      <Sparkles className="h-5 w-5 text-white" />
                    </div>
                  </div>

                  <div className="mt-5 rounded-2xl bg-white p-3 text-charcoal">
                    <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3">
                      <Search className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-500">
                        Search products
                      </span>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      {[
                        ["Studio Jacket", "$88.00"],
                        ["Daily Tote", "$42.00"],
                        ["Runner Low", "$120.00"],
                        ["Pearl Hoops", "$35.00"],
                      ].map(([name, price], index) => (
                        <div
                          key={name}
                          className="overflow-hidden rounded-2xl border border-gray-200 bg-white"
                        >
                          <div
                            className={`aspect-[4/3] ${
                              index === 0
                                ? "bg-burnt-100"
                                : index === 1
                                  ? "bg-slate-100"
                                  : index === 2
                                    ? "bg-[#dcefeb]"
                                    : "bg-gray-100"
                            }`}
                          />
                          <div className="p-3">
                            <p className="truncate text-sm font-bold">{name}</p>
                            <p className="mt-1 text-sm font-semibold text-burnt">
                              {price}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-6 -left-3 hidden rounded-3xl border border-gray-200 bg-white p-4 shadow-card sm:block">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-[#e7f5f2] p-3 text-[#16807a]">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-charcoal">
                      Brand dashboard ready
                    </p>
                    <p className="text-xs font-medium text-gray-500">
                      Publish, draft, archive
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-gray-200 bg-white py-8">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-3 px-4 sm:px-6 lg:px-8">
            {categories.map((cat) => (
              <Link
                key={cat}
                to={`/products?category=${cat.toLowerCase()}`}
                className="rounded-full border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 transition-all hover:-translate-y-0.5 hover:border-burnt/30 hover:text-burnt"
              >
                {cat}
              </Link>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {[
              [
                Store,
                "For brands",
                "Create listings, upload images, set status, and manage the full product table from one focused dashboard.",
              ],
              [
                Users,
                "For customers",
                "Browse categories, search the catalog, inspect product details, and move through a polished shopping surface.",
              ],
              [
                Shield,
                "Built cleanly",
                "Authentication, protected brand routes, and ownership controls stay behind the scenes while the UI feels simple.",
              ],
            ].map(([Icon, title, copy]) => (
              <div
                key={title}
                className="rounded-[1.75rem] border border-gray-200 bg-white p-6 shadow-card"
              >
                <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-burnt-50 text-burnt">
                  <Icon className="h-6 w-6" />
                </div>
                <h2 className="text-xl font-extrabold tracking-tight text-charcoal">
                  {title}
                </h2>
                <p className="mt-3 text-sm leading-6 text-gray-600">{copy}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
          <div className="grid overflow-hidden rounded-[2rem] border border-gray-200 bg-white shadow-soft md:grid-cols-[0.95fr_1.05fr]">
            <div className="bg-charcoal p-8 text-white sm:p-10">
              <Package className="h-9 w-9 text-white/80" />
              <h2 className="mt-8 max-w-md text-3xl font-extrabold tracking-tight sm:text-4xl">
                Bring your product catalog into a sharper storefront.
              </h2>
              <p className="mt-4 max-w-md text-sm leading-6 text-white/60">
                Keep products organized as drafts or published listings, then
                let buyers discover them through a clean marketplace.
              </p>
            </div>
            <div className="p-8 sm:p-10">
              <div className="grid gap-4 sm:grid-cols-2">
                {["Upload images", "Set category", "Update price", "Archive old products"].map(
                  (item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4"
                    >
                      <CheckCircle2 className="h-5 w-5 text-[#16807a]" />
                      <span className="text-sm font-semibold text-charcoal">
                        {item}
                      </span>
                    </div>
                  ),
                )}
              </div>
              <Link
                to="/signup"
                className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-burnt px-6 py-3 text-sm font-semibold text-white shadow-[0_16px_34px_rgba(201,79,36,0.25)] transition-all hover:-translate-y-0.5 hover:bg-burnt-600"
              >
                Create account
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Landing;
