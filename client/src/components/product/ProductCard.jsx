import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  return (
    <Link
      to={`/products/${product._id}`}
      className="block h-full border-2 border-[#1A1A1A] bg-white transition-all duration-200 hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[4px_4px_0px_0px_#1A1A1A] group relative"
    >
      {/* Brand Badge */}
      <div className="absolute top-2 left-2 z-10">
        <span className="bg-[#39FF14] text-[#1A1A1A] px-2 py-1 text-xs font-bold uppercase border border-[#1A1A1A]">
          {product.brand?.name || "Unknown"}
        </span>
      </div>

      {/* Image Container */}
      <div className="aspect-square bg-[#E3E1DC] relative overflow-hidden border-b-2 border-[#1A1A1A]">
        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 grayscale group-hover:grayscale-0"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="font-mono text-xs text-[#1A1A1A]/40 uppercase tracking-widest">
              [No_Signal]
            </span>
          </div>
        )}

        {/* Category Tag */}
        <div className="absolute bottom-0 right-0 border-t-2 border-l-2 border-[#1A1A1A] bg-white px-3 py-1">
          <span className="text-xs font-bold uppercase tracking-widest">
            {product.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-2">
        <h3 className="font-bold text-lg leading-tight uppercase truncate group-hover:text-[#C94F24] transition-colors">
          {product.name}
        </h3>

        <div className="flex items-end justify-between mt-2">
          <div className="flex flex-col">
            <span className="text-[10px] font-mono opacity-60 uppercase">
              Price_Unit
            </span>
            <span className="text-xl font-black tracking-tighter">
              ${product.price.toFixed(2)}
            </span>
          </div>

          <div className="w-8 h-8 bg-[#1A1A1A] flex items-center justify-center group-hover:bg-[#39FF14] transition-colors">
            <span className="text-white group-hover:text-[#1A1A1A] text-xl font-light">
              +
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
