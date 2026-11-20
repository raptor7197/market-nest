import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { productApi } from "../../api/productApi";
import { useAuth } from "../../context/AuthContext";
import Spinner from "../../components/common/Spinner";
import {
  Archive,
  CheckCircle,
  Edit,
  Package,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react";

const statusStyles = {
  published: "bg-[#e7f5f2] text-[#16807a]",
  draft: "bg-burnt-50 text-burnt",
  archived: "bg-gray-100 text-gray-700",
};

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashboardRes, productsRes] = await Promise.all([
          productApi.getBrandDashboard(),
          productApi.getBrandProducts({
            status: filter === "all" ? undefined : filter,
          }),
        ]);
        setStats(dashboardRes.data.stats);
        setProducts(productsRes.data.products);
      } catch (error) {
        console.error("Error fetching dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filter]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to archive this product?")) return;
    try {
      await productApi.deleteProduct(id);
      setProducts(products.filter((p) => p._id !== id));
    } catch (error) {
      alert("Failed to delete product");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-offwhite">
        <Spinner size="lg" />
      </div>
    );
  }

  const statCards = [
    ["Total Products", stats?.total || 0, Package, "bg-gray-100 text-charcoal"],
    [
      "Published",
      stats?.published || 0,
      CheckCircle,
      "bg-[#e7f5f2] text-[#16807a]",
    ],
    ["Archived", stats?.archived || 0, Archive, "bg-gray-100 text-gray-700"],
    ["Drafts", stats?.draft || 0, Package, "bg-burnt-50 text-burnt"],
  ];

  return (
    <div className="min-h-screen bg-offwhite">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-charcoal">
              Brand Dashboard
            </h1>
            <p className="mt-2 text-base text-gray-600">
              Welcome back, {user?.name}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/dashboard/orders"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-charcoal shadow-sm transition-all hover:-translate-y-0.5 hover:border-burnt/30"
            >
              <ShoppingBag className="h-5 w-5" />
              View orders
            </Link>
            <Link
              to="/dashboard/product/new"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-burnt px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(201,79,36,0.24)] transition-all hover:-translate-y-0.5 hover:bg-burnt-600"
            >
              <Plus className="h-5 w-5" />
              Add product
            </Link>
          </div>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map(([label, value, Icon, tone]) => (
            <div
              key={label}
              className="rounded-[1.5rem] border border-gray-200 bg-white p-5 shadow-card"
            >
              <div className="flex items-center gap-4">
                <div className={`rounded-2xl p-3 ${tone}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">{label}</p>
                  <p className="text-2xl font-extrabold tracking-tight text-charcoal">
                    {value}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="overflow-hidden rounded-[2rem] border border-gray-200 bg-white shadow-card">
          <div className="border-b border-gray-200 p-4">
            <div className="flex gap-2 overflow-x-auto">
              {["all", "published", "draft", "archived"].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold capitalize transition-colors ${
                    filter === status
                      ? "bg-charcoal text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px]">
              <thead className="bg-gray-50">
                <tr>
                  {["Product", "Category", "Price", "Status", "Actions"].map(
                    (heading) => (
                      <th
                        key={heading}
                        className={`px-6 py-4 text-xs font-bold uppercase tracking-wide text-gray-500 ${
                          heading === "Actions" ? "text-right" : "text-left"
                        }`}
                      >
                        {heading}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-12 text-center text-sm font-medium text-gray-500"
                    >
                      No products found
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50/80">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-2xl bg-gray-100">
                            {product.images?.[0] ? (
                              <img
                                src={product.images[0]}
                                alt=""
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-xs font-medium text-gray-400">
                                No img
                              </div>
                            )}
                          </div>
                          <span className="font-semibold text-charcoal">
                            {product.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm capitalize text-gray-600">
                        {product.category}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-charcoal">
                        ₹{product.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                            statusStyles[product.status] ||
                            "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {product.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Link
                            to={`/dashboard/product/${product._id}/edit`}
                            className="rounded-full p-2 text-gray-500 transition-colors hover:bg-burnt-50 hover:text-burnt"
                            aria-label={`Edit ${product.name}`}
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(product._id)}
                            className="rounded-full p-2 text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600"
                            aria-label={`Archive ${product.name}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
