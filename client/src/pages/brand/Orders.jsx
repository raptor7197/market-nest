import { useEffect, useState } from "react";
import { orderApi } from "../../api/orderApi";
import { formatINR } from "../../utils/format";
import Spinner from "../../components/common/Spinner";
import {
  CheckCircle2,
  IndianRupee,
  Package,
  ShoppingBag,
} from "lucide-react";

const statusStyles = {
  pending: "bg-burnt-50 text-burnt",
  confirmed: "bg-blue-50 text-blue-700",
  shipped: "bg-indigo-50 text-indigo-700",
  delivered: "bg-[#e7f5f2] text-[#16807a]",
  cancelled: "bg-gray-100 text-gray-600",
};

const NEXT_ACTIONS = {
  pending: [
    { label: "Confirm", status: "confirmed", tone: "bg-blue-600 hover:bg-blue-700" },
    { label: "Cancel", status: "cancelled", tone: "bg-red-600 hover:bg-red-700" },
  ],
  confirmed: [
    { label: "Ship", status: "shipped", tone: "bg-indigo-600 hover:bg-indigo-700" },
    { label: "Cancel", status: "cancelled", tone: "bg-red-600 hover:bg-red-700" },
  ],
  shipped: [
    { label: "Mark delivered", status: "delivered", tone: "bg-[#16807a] hover:bg-[#126b66]" },
  ],
};

const FILTERS = ["all", "pending", "confirmed", "shipped", "delivered", "cancelled"];

const BrandOrders = () => {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [updating, setUpdating] = useState(null);
  const [error, setError] = useState("");

  const loadOrders = async (statusFilter = filter) => {
    setError("");
    setLoading(true);
    try {
      const [ordersRes, statsRes] = await Promise.all([
        orderApi.getBrandOrders({
          limit: 50,
          status: statusFilter === "all" ? undefined : statusFilter,
        }),
        orderApi.getBrandOrderStats(),
      ]);
      setOrders(ordersRes.data.orders);
      setStats(statsRes.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders(filter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const handleStatusUpdate = async (orderId, status) => {
    setUpdating(orderId);
    try {
      // Refetch instead of patching locally so filtered views and stats stay
      // consistent after the transition.
      await orderApi.updateOrderStatus(orderId, status);
      await loadOrders();
    } catch (err) {
      alert(err.response?.data?.message || "Could not update order");
    } finally {
      setUpdating(null);
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
    ["Total orders", stats?.totalOrders || 0, ShoppingBag, "bg-gray-100 text-charcoal"],
    [
      "Revenue",
      formatINR(stats?.revenue || 0),
      IndianRupee,
      "bg-[#e7f5f2] text-[#16807a]",
    ],
    [
      "Pending",
      stats?.byStatus?.pending || 0,
      Package,
      "bg-burnt-50 text-burnt",
    ],
    [
      "Delivered",
      stats?.byStatus?.delivered || 0,
      CheckCircle2,
      "bg-[#e7f5f2] text-[#16807a]",
    ],
  ];

  return (
    <div className="min-h-screen bg-offwhite">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-charcoal">
            Orders
          </h1>
          <p className="mt-2 text-base text-gray-600">
            Manage customer orders for your products.
          </p>
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

        {error && (
          <p className="mb-6 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
            {error}
          </p>
        )}

        <div className="overflow-hidden rounded-[2rem] border border-gray-200 bg-white shadow-card">
          <div className="border-b border-gray-200 p-4">
            <div className="flex gap-2 overflow-x-auto">
              {FILTERS.map((status) => (
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

          {orders.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-500">
                <Package className="h-7 w-7" />
              </div>
              <p className="mt-4 text-lg font-bold text-charcoal">
                No orders in this view
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Orders containing your products will appear here.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {orders.map((order) => (
                <li key={order._id} className="px-6 py-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                        Order #{order._id.slice(-8).toUpperCase()}
                      </p>
                      <p className="mt-1 font-semibold text-charcoal">
                        {order.customer?.name || "Customer"}
                        <span className="ml-2 text-xs font-medium text-gray-500">
                          {order.customer?.email}
                        </span>
                      </p>
                      <p className="mt-1 text-xs font-medium text-gray-500">
                        {new Date(order.createdAt).toLocaleString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${
                          statusStyles[order.status] ||
                          "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {order.status}
                      </span>
                      <span className="text-lg font-extrabold tracking-tight text-charcoal">
                        {formatINR(order.brandTotal)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    {order.items.map((item) => (
                      <div
                        key={`${order._id}-${item.product}`}
                        className="flex items-center gap-3 rounded-2xl bg-gray-50 px-3 py-2"
                      >
                        <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-gray-200">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-[9px] text-gray-400">
                              No img
                            </div>
                          )}
                        </div>
                        <p className="flex-1 text-sm font-medium text-charcoal">
                          {item.name}
                        </p>
                        <p className="text-sm font-medium text-gray-500">
                          Qty {item.quantity} × {formatINR(item.price)}
                        </p>
                      </div>
                    ))}
                  </div>

                  {order.shippingAddress && (
                    <p className="mt-3 text-xs font-medium text-gray-500">
                      Ship to: {order.shippingAddress.fullName},{" "}
                      {order.shippingAddress.street},{" "}
                      {order.shippingAddress.city},{" "}
                      {order.shippingAddress.state}{" "}
                      {order.shippingAddress.postalCode} ·{" "}
                      {order.shippingAddress.phone}
                    </p>
                  )}

                  {(NEXT_ACTIONS[order.status] || []).length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {NEXT_ACTIONS[order.status].map((action) => (
                        <button
                          key={action.status}
                          onClick={() =>
                            handleStatusUpdate(order._id, action.status)
                          }
                          disabled={updating === order._id}
                          className={`rounded-full px-4 py-2 text-sm font-semibold text-white transition-colors disabled:opacity-60 ${action.tone}`}
                        >
                          {updating === order._id ? "Updating..." : action.label}
                        </button>
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrandOrders;
