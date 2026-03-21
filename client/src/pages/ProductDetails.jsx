import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { productApi } from "../api/productApi";
import {
  ArrowLeft,
  ShoppingBag,
  Zap,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await productApi.getProductById(id);
        setProduct(response.data.product);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#E3E1DC] flex flex-col items-center justify-center font-mono">
        <div className="w-16 h-16 border-4 border-[#1A1A1A] border-t-[#39FF14] rounded-full animate-spin"></div>
        <p className="mt-6 font-bold uppercase tracking-widest animate-pulse">
          Loading_Data...
        </p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#E3E1DC] flex flex-col items-center justify-center font-mono">
        <h2 className="text-4xl font-black uppercase mb-4">
          Product Not Found
        </h2>
        <Link
          to="/products"
          className="px-8 py-3 bg-[#1A1A1A] text-[#39FF14] font-bold uppercase hover:bg-[#39FF14] hover:text-[#1A1A1A] transition-colors"
        >
          Return to Base
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E3E1DC] text-[#1A1A1A] font-mono selection:bg-[#39FF14] selection:text-black pb-20">
      {/* Header / Breadcrumb */}
      <div className="border-b-2 border-[#1A1A1A] bg-[#E3E1DC] sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link
            to="/products"
            className="flex items-center gap-2 font-bold uppercase tracking-widest hover:text-[#C94F24] transition-colors text-xs md:text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back_To_Market
          </Link>
          <span className="text-[#1A1A1A]/40">/</span>
          <span className="text-xs md:text-sm uppercase truncate font-bold opacity-60">
            {product.name}
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column: Images */}
          <div className="space-y-6">
            <div className="relative aspect-square border-2 border-[#1A1A1A] bg-white p-2 shadow-[8px_8px_0px_0px_#1A1A1A]">
              {/* Sticker overlay */}
              <div className="absolute top-4 right-4 z-10 bg-[#39FF14] px-3 py-1 border border-[#1A1A1A] -rotate-2">
                <span className="text-xs font-black uppercase">
                  {product.category}
                </span>
              </div>

              {product.images && product.images.length > 0 ? (
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500 cursor-crosshair"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#E3E1DC]">
                  <span className="font-bold uppercase opacity-40">
                    [No_Image_Data]
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`aspect-square border-2 ${
                      selectedImage === idx
                        ? "border-[#39FF14] shadow-[4px_4px_0px_0px_#1A1A1A]"
                        : "border-[#1A1A1A] opacity-60 hover:opacity-100"
                    } transition-all p-1 bg-white`}
                  >
                    <img
                      src={img}
                      alt={`View ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Info */}
          <div className="flex flex-col h-full">
            <div className="border-b-2 border-[#1A1A1A] pb-6 mb-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="px-3 py-1 bg-[#1A1A1A] text-[#E3E1DC] text-xs font-bold uppercase tracking-widest">
                  Brand: {product.brand?.name || "Unknown"}
                </div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#1A1A1A]">
                  <span className="w-2 h-2 bg-[#39FF14] rounded-full animate-pulse"></span>
                  Marketplace Ready
                </div>
              </div>

              <h1 className="text-4xl md:text-6xl font-black uppercase leading-none tracking-tighter mb-6 text-[#1A1A1A]">
                {product.name}
              </h1>

              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold tracking-tighter">
                  ${product.price.toFixed(2)}
                </span>
                <span className="text-sm opacity-60 uppercase">USD / Unit</span>
              </div>
            </div>

            <div className="space-y-8 flex-grow">
              <div>
                <h3 className="text-sm font-bold uppercase mb-2 border-l-4 border-[#39FF14] pl-2">
                  Specs_&_Details
                </h3>
                <p className="text-sm leading-relaxed opacity-80 whitespace-pre-line border-2 border-[#1A1A1A] p-4 bg-white/50">
                  {product.description || "No description available."}
                </p>
              </div>

              {/* Guarantees */}
              <div className="grid grid-cols-2 gap-4">
                <div className="border border-[#1A1A1A] p-4 flex flex-col items-center text-center gap-2 hover:bg-[#1A1A1A] hover:text-[#39FF14] transition-colors group">
                  <ShieldCheck className="w-6 h-6" />
                  <span className="text-xs font-bold uppercase">
                    Auth_Verified
                  </span>
                </div>
                <div className="border border-[#1A1A1A] p-4 flex flex-col items-center text-center gap-2 hover:bg-[#1A1A1A] hover:text-[#39FF14] transition-colors group">
                  <RotateCcw className="w-6 h-6" />
                  <span className="text-xs font-bold uppercase">
                    30_Day_Return
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button className="flex-1 py-4 bg-[#E3E1DC] border-2 border-[#1A1A1A] text-[#1A1A1A] font-bold uppercase tracking-widest hover:bg-[#1A1A1A] hover:text-[#E3E1DC] transition-all flex items-center justify-center gap-2 group">
                <ShoppingBag className="w-5 h-5 group-hover:text-[#39FF14] transition-colors" />
                Add to Cart
              </button>
              <button className="flex-1 py-4 bg-[#39FF14] border-2 border-[#1A1A1A] text-[#1A1A1A] font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_#1A1A1A] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all flex items-center justify-center gap-2">
                <Zap className="w-5 h-5 fill-current" />
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
