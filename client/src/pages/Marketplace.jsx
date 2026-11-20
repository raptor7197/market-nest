import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { productApi } from "../api/productApi";
import ProductCard from "../components/product/ProductCard";
import {
  ArrowLeft,
  ArrowRight,
  Filter,
  PackageOpen,
  Search,
} from "lucide-react";

const CATEGORIES = ["clothing", "shoes", "accessories", "bags", "jewelry"];

const Marketplace = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [page, setPage] = useState(parseInt(searchParams.get("page")) || 1);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError("");
      try {
        const params = { page, limit: 12 };
        if (search) params.search = search;
        if (category) params.category = category;

        const response = await productApi.getProducts(params);
        setProducts(response.data.products);
        setPagination(response.data.pagination);
      } catch (err) {
        setProducts([]);
        setPagination(null);
        setError(
          err.response?.data?.message ||
            "Failed to load products. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchProducts, 300);
    return () => clearTimeout(debounce);
  }, [page, search, category, refreshKey]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (category) params.set("category", category);
    if (page > 1) params.set("page", page.toString());
    setSearchParams(params, { replace: true });
  }, [search, category, page, setSearchParams]);

  // Keep local state in sync with browser back/forward or manual URL edits.
  useEffect(() => {
    const urlSearch = searchParams.get("search") || "";
    const urlCategory = searchParams.get("category") || "";
    const urlPage = parseInt(searchParams.get("page"), 10) || 1;
    setSearch((current) => (current === urlSearch ? current : urlSearch));
    setCategory((current) =>
      current === urlCategory ? current : urlCategory
    );
    setPage((current) => (current === urlPage ? current : urlPage));
  }, [searchParams]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleCategory = (cat) => {
    setCategory(cat === category ? "" : cat);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-offwhite text-charcoal">
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-charcoal sm:text-5xl">
                Marketplace
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-gray-600">
                Browse products from emerging brands with quick category
                filters and responsive search.
              </p>
            </div>
            <div className="rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-semibold text-gray-600">
              {pagination?.totalItems || products.length || 0} products
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-10 rounded-[2rem] border border-gray-200 bg-white p-4 shadow-card">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search products"
                value={search}
                onChange={handleSearch}
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-3 pl-12 pr-4 text-sm font-medium text-charcoal outline-none transition-all placeholder:text-gray-400 focus:border-burnt focus:bg-white focus:ring-4 focus:ring-burnt/10"
              />
            </div>

            <div className="flex items-center gap-3 overflow-x-auto pb-1 lg:pb-0">
              <div className="flex shrink-0 items-center gap-2 text-sm font-semibold text-gray-500">
                <Filter className="h-4 w-4" />
                Filter
              </div>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategory(cat)}
                  className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold capitalize transition-all ${
                    category === cat
                      ? "bg-charcoal text-white shadow-[0_12px_28px_rgba(23,23,23,0.18)]"
                      : "border border-gray-200 bg-white text-gray-700 hover:border-burnt/30 hover:text-burnt"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {error && !loading && (
          <div className="mb-6 flex flex-col items-center gap-3 rounded-[2rem] border border-red-200 bg-red-50 p-8 text-center">
            <p className="text-sm font-semibold text-red-600">{error}</p>
            <button
              onClick={() => setRefreshKey((k) => k + 1)}
              className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-red-600 shadow-sm"
            >
              Retry
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-28">
            <div className="spinner h-12 w-12" />
            <p className="mt-5 text-sm font-semibold text-gray-500">
              Loading products
            </p>
          </div>
        ) : products.length === 0 && !error ? (
          <div className="rounded-[2rem] border border-dashed border-gray-300 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-500">
              <PackageOpen className="h-7 w-7" />
            </div>
            <p className="mt-5 text-2xl font-extrabold text-charcoal">
              No products found
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Try a different search term or category.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            {pagination && pagination.totalPages > 1 && (
              <div className="mt-14 flex items-center justify-center gap-4 pb-10">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={!pagination.hasPrevPage}
                  className="rounded-full border border-gray-200 bg-white p-3 text-charcoal shadow-sm transition-all hover:-translate-y-0.5 hover:border-burnt/30 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
                  aria-label="Previous page"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>

                <span className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-gray-700 shadow-sm">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>

                <button
                  onClick={() => setPage(page + 1)}
                  disabled={!pagination.hasNextPage}
                  className="rounded-full border border-gray-200 bg-white p-3 text-charcoal shadow-sm transition-all hover:-translate-y-0.5 hover:border-burnt/30 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
                  aria-label="Next page"
                >
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Marketplace;
