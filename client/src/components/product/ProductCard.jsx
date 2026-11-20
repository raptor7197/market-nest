import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { formatINR } from "../../utils/format";

const ProductCard = ({ product }) => {
  return (
    <Link
      to={`/products/${product._id}`}
      className="group block h-full overflow-hidden rounded-[1.75rem] border border-gray-200 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-burnt/30 hover:shadow-soft"
    >
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-xs font-semibold text-gray-400">
              No image
            </span>
          </div>
        )}

        <div className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-charcoal shadow-sm backdrop-blur">
          {product.brand?.name || "Unknown"}
        </div>
        <div className="absolute bottom-3 right-3 rounded-full bg-charcoal/90 px-3 py-1 text-xs font-semibold capitalize text-white backdrop-blur">
          {product.category}
        </div>
        {typeof product.stock === "number" && product.stock <= 0 && (
          <div className="absolute inset-x-3 top-1/2 -translate-y-1/2 rounded-full bg-charcoal/85 px-4 py-2 text-center text-xs font-bold uppercase tracking-wide text-white backdrop-blur">
            Out of stock
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="truncate text-lg font-bold leading-tight text-charcoal transition-colors group-hover:text-burnt">
            {product.name}
          </h3>
          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-burnt-50 text-burnt transition-colors group-hover:bg-burnt group-hover:text-white">
            <ArrowUpRight className="h-4 w-4" />
          </div>
        </div>

        <div className="mt-4 flex items-end justify-between">
          <div>
            <p className="text-xs font-medium text-gray-500">Starting at</p>
            <p className="text-xl font-extrabold tracking-tight text-charcoal">
              {formatINR(product.price)}
            </p>
          </div>
          <span
            className={`h-2 w-2 rounded-full ${
              typeof product.stock === "number" && product.stock <= 0
                ? "bg-red-500"
                : "bg-[#16807a]"
            }`}
          />
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
