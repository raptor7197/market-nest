import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { orderApi } from "../api/orderApi";
import { formatINR } from "../utils/format";
import Spinner from "../components/common/Spinner";
import {
  CheckCircle2,
  Clock,
  Package,
  PackageCheck,
  Truck,
  XCircle,
} from "lucide-react";

export const orderStatusStyles = {
  pending: "bg-burnt-50 text-burnt",
  confirmed: "bg-blue-50 text-blue-700",
  shipped: "bg-indigo-50 text-indigo-700",
  delivered: "bg-[#e7f5f2] text-[#16807a]",
  cancelled: "bg-gray-100 text-gray-600",
};

export const orderStatusIcons = {
  pending: Clock,
  confirmed: CheckCircle2,
  shipped: Truck,
  delivered: PackageCheck,
  cancelled: XCircle,
};

const Orders = () => {
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [cancelling, setCancelling] = useState(null);
  const [showBanner, setShowBanner] = useState(Boolean(location.state?.placed));

  const fetchOrders = async (page = 1, append = false) => {
    if (append) setLoadingMore(true);
    else setLoading(true);
    setError("");
    try {
      const response = await orderApi.getMyOrders({ page, limit: 10 });
      const nextOrders = response.data.orders;
      setOrders((current) =>
        append ? [...current, ...nextOrders] : nextOrders
      );
      setPagination(response.data.pagination);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load orders");
      if (!append) setOrders([]);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchOrders(1);
  }, []);

  const handleLoadMore = () => {
    if (!pagination?.hasNextPage || loadingMore) return;
    fetchOrders(pagination.currentPage + 1, true);
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Cancel this order?")) return;
    setCancelling(id);
    try {
      await orderApi.cancelOrder(id);
      setOrders((current) =>
        current.map((order) =>
          order._id === id ? { ...order, status: "cancelled" } : order
        )
      );
    } catch (err) {
      alert(err.response?.data?.message || "Could not cancel order");
    } finally {
      setCancelling(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-offwhite">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-offwhite">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-charcoal">
          My Orders
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Track your purchases and delivery status.
        </p>

        {showBanner && (
          <div className="mt-6 flex items-center justify-between gap-4 rounded-2xl border border-[#bfe6df] bg-[#e7f5f2] px-5 py-4">
            <p className="flex items-center gap-2 text-sm font-semibold text-[#16807a]">
              <CheckCircle2 className="h-5 w-5" />
              Order placed successfully!
            </p>
            <button
              onClick={() => setShowBanner(false)}
              className="text-sm font-semibold text-[#16807a] hover:underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {error && (
          <p className="mt-6 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
            {error}
          </p>
        )}

        {orders.length === 0 && !error ? (
          <div className="mt-8 rounded-[2rem] border border-dashed border-gray-300 bg-white p-12 text-center shadow-card">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-500">
              <Package className="h-7 w-7" />
            </div>
            <p className="mt-5 text-2xl font-extrabold text-charcoal">
              No orders yet
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Products you order will show up here.
            </p>
            <Link
              to="/products"
              className="mt-6 inline-flex rounded-full bg-burnt px-6 py-3 text-sm font-semibold text-white shadow-[0_16px_34px_rgba(201,79,36,0.25)] transition-all hover:-translate-y-0.5 hover:bg-burnt-600"
            >
              Start shopping
            </Link>
          </div>
        ) : (
          <div className="mt-8 space-y-5">
            {orders.map((order) => {
              const StatusIcon =
                orderStatusIcons[order.status] || Package;
              const canCancel = ["pending", "confirmed"].includes(
                order.status
              );

              return (
                <article
                  key={order._id}
                  className="overflow-hidden rounded-[1.75rem] border border-gray-200 bg-white shadow-card"
                >
                  <header className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 px-6 py-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                        Order #{order._id.slice(-8).toUpperCase()}
                      </p>
                      <p className="mt-1 text-sm font-medium text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold capitalize ${
                        orderStatusStyles[order.status] ||
                        "bg-gray-100 text-gray-700"
                      }`}
                    >
                      <StatusIcon className="h-4 w-4" />
                      {order.status}
                    </span>
                  </header>

                  <ul className="divide-y divide-gray-100">
                    {order.items.map((item) => (
                      <li
                        key={`${order._id}-${item.product}`}
                        className="flex items-center gap-4 px-6 py-4"
                      >
                        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-[10px] font-medium text-gray-400">
                              No img
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-charcoal">
                            {item.name}
                          </p>
                          <p className="text-xs font-medium text-gray-500">
                            {item.brand?.name ? `${item.brand.name} · ` : ""}
                            Qty {item.quantity} × {formatINR(item.price)}
                          </p>
                        </div>
                        <span className="font-bold text-charcoal">
                          {formatINR(item.price * item.quantity)}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-gray-100 bg-gray-50/70 px-6 py-4">
                    <p className="text-sm font-medium text-gray-500">
                      {order.items.reduce(
                        (sum, item) => sum + item.quantity,
                        0
                      )}{" "}
                      item(s) · Cash on delivery
                    </p>
                    <div className="flex items-center gap-4">
                      <Link
                        to={`/orders/${order._id}`}
                        className="text-sm font-semibold text-burnt hover:text-burnt-600"
                      >
                        View details
                      </Link>
                      <span className="text-lg font-extrabold tracking-tight text-charcoal">
                        {formatINR(order.totalAmount)}
                      </span>
                      {canCancel && (
                        <button
                          onClick={() => handleCancel(order._id)}
                          disabled={cancelling === order._id}
                          className="rounded-full border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-60"
                        >
                          {cancelling === order._id ? "Cancelling..." : "Cancel"}
                        </button>
                      )}
                    </div>
                  </footer>
                </article>
              );
            })}
          </div>
        )}

        {pagination?.hasNextPage && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="rounded-full border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-charcoal shadow-sm transition-all hover:-translate-y-0.5 hover:border-burnt/30 disabled:opacity-60"
            >
              {loadingMore ? "Loading..." : "Load more orders"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
