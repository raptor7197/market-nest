import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { productApi } from "../api/productApi";
import ProductCard from "../components/product/ProductCard";
import { Search, Filter, ArrowLeft, ArrowRight } from "lucide-react";

const CATEGORIES = ["clothing", "shoes", "accessories", "bags", "jewelry"];

const Marketplace = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [page, setPage] = useState(parseInt(searchParams.get("page")) || 1);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = { page, limit: 12 };
        if (search) params.search = search;
        if (category) params.category = category;

        const response = await productApi.getProducts(params);
        setProducts(response.data.products);
        setPagination(response.data.pagination);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchProducts, 300);
    return () => clearTimeout(debounce);
  }, [page, search, category]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (category) params.set("category", category);
    if (page > 1) params.set("page", page.toString());
    setSearchParams(params);
  }, [search, category, page, setSearchParams]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleCategory = (cat) => {
    setCategory(cat === category ? "" : cat);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-[#E3E1DC] text-[#1A1A1A] font-mono selection:bg-[#39FF14] selection:text-black">
      {/* Header Section */}
      <div className="border-b-2 border-[#1A1A1A] bg-[#E3E1DC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4">
            Marketplace<span className="text-[#39FF14]">_</span>
          </h1>
          <p className="text-sm md:text-base font-bold tracking-widest uppercase opacity-60">
            // CURATED_ITEMS_FOR_THE_MODERN_ERA
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls Section */}
        <div className="flex flex-col lg:flex-row gap-6 mb-12 border-2 border-[#1A1A1A] p-6 bg-white shadow-[8px_8px_0px_0px_#1A1A1A]">
          {/* Search */}
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#1A1A1A]" />
            <input
              type="text"
              placeholder="SEARCH_DATABASE..."
              value={search}
              onChange={handleSearch}
              className="w-full pl-12 pr-4 py-3 bg-[#E3E1DC] border-2 border-transparent focus:border-[#1A1A1A] outline-none text-sm font-bold uppercase placeholder:text-[#1A1A1A]/40 transition-all"
            />
            <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-[#39FF14] transition-all group-focus-within:w-full"></div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-4 overflow-x-auto pb-2 lg:pb-0">
            <div className="flex items-center gap-2 px-3 border-r-2 border-[#1A1A1A]">
              <Filter className="h-5 w-5" />
              <span className="text-xs font-bold uppercase hidden sm:inline">
                Filter:
              </span>
            </div>
            <div className="flex gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategory(cat)}
                  className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border-2 border-[#1A1A1A] transition-all hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_#1A1A1A] whitespace-nowrap ${
                    category === cat
                      ? "bg-[#1A1A1A] text-[#39FF14]"
                      : "bg-[#E3E1DC] text-[#1A1A1A] hover:bg-[#39FF14]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="w-16 h-16 border-4 border-[#1A1A1A] border-t-[#39FF14] rounded-full animate-spin"></div>
            <p className="mt-6 font-bold uppercase tracking-widest animate-pulse">
              Loading_Assets...
            </p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-32 border-2 border-dashed border-[#1A1A1A] bg-[#1A1A1A]/5">
            <p className="text-2xl font-bold uppercase text-[#1A1A1A]">
              No items found
            </p>
            <p className="text-sm font-mono mt-2 opacity-60">
              // TRY_DIFFERENT_PARAMETERS
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products.map((product) => (
                <div key={product._id} className="group">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-16 pb-12">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={!pagination.hasPrevPage}
                  className="p-3 border-2 border-[#1A1A1A] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#1A1A1A] hover:text-[#39FF14] transition-all disabled:hover:bg-transparent disabled:hover:text-inherit"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>

                <span className="font-bold font-mono px-4">
                  PAGE {pagination.currentPage} / {pagination.totalPages}
                </span>

                <button
                  onClick={() => setPage(page + 1)}
                  disabled={!pagination.hasNextPage}
                  className="p-3 border-2 border-[#1A1A1A] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#1A1A1A] hover:text-[#39FF14] transition-all disabled:hover:bg-transparent disabled:hover:text-inherit"
                >
                  <ArrowRight className="w-5 h-5" />
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
