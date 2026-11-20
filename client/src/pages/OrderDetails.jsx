import { useEffect, useState } from "react";
import { Link, useLocation, useParams, useNavigate } from "react-router-dom";
import { orderApi } from "../api/orderApi";
import { formatINR, formatDate } from "../utils/format";
import Spinner from "../components/common/Spinner";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  MapPin,
  Package,
  PackageCheck,
  Truck,
  XCircle,
} from "lucide-react";

const STATUS_ICONS = {
  pending: Clock,
  confirmed: CheckCircle2,
  shipped: Truck,
  delivered: PackageCheck,
  cancelled: XCircle,
};

const STATUS_STYLES = {
  pending: "bg-burnt-50 text-burnt",
  confirmed: "bg-blue-50 text-blue-700",
  shipped: "bg-indigo-50 text-indigo-700",
  delivered: "bg-[#e7f5f2] text-[#16807a]",
  cancelled: "bg-gray-100 text-gray-600",
};

const OrderDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelling, setCancelling] = useState(false);
  const [showBanner, setShowBanner] = useState(Boolean(location.state?.placed));

  const loadOrder = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await orderApi.getOrderById(id);
      setOrder(response.data.order);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load order");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleCancel = async () => {
    if (!window.confirm("Cancel this order?")) return;
    setCancelling(true);
    try {
      await orderApi.cancelOrder(order._id);
      await loadOrder();
    } catch (err) {
      alert(err.response?.data?.message || "Could not cancel order");
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-offwhite">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-offwhite px-4 text-center">
        <h2 className="text-3xl font-extrabold text-charcoal">
          {error || "Order not found"}
        </h2>
        <Link
          to="/orders"
          className="mt-6 rounded-full bg-burnt px-6 py-3 text-sm font-semibold text-white"
        >
          Back to orders
        </Link>
      </div>
    );
  }

  const StatusIcon = STATUS_ICONS[order.status] || Package;
  const canCancel = ["pending", "confirmed"].includes(order.status);
  const history =
    order.statusHistory?.length > 0
      ? order.statusHistory
      : [{ status: order.status, at: order.createdAt }];

  return (
    <div className="min-h-screen bg-offwhite">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center gap-4">
          <button
            onClick={() => navigate("/orders")}
            className="rounded-full border border-gray-200 bg-white p-3 text-charcoal shadow-sm transition-colors hover:bg-gray-100"
            aria-label="Back to orders"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Order #{order._id.slice(-8).toUpperCase()}
            </p>
            <h1 className="text-3xl font-extrabold tracking-tight text-charcoal">
              Order details
            </h1>
          </div>
        </div>

        {showBanner && (
          <div className="mb-6 flex items-start justify-between gap-4 rounded-2xl border border-[#bfe6df] bg-[#e7f5f2] px-5 py-4">
            <div>
              <p className="flex items-center gap-2 text-sm font-bold text-[#16807a]">
                <CheckCircle2 className="h-5 w-5" />
                Order placed successfully!
              </p>
              {location.state?.ordersCount > 1 && (
                <p className="mt-1 text-xs font-medium text-[#16807a]">
                  Your cart contained items from multiple brands, so{" "}
                  {location.state.ordersCount} separate orders were created.{" "}
                  <Link to="/orders" className="underline">
                    View all orders
                  </Link>
                </p>
              )}
            </div>
            <button
              onClick={() => setShowBanner(false)}
              className="text-sm font-semibold text-[#16807a] hover:underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {error && (
          <p className="mb-6 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
            {error}
          </p>
        )}

        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <section className="overflow-hidden rounded-[2rem] border border-gray-200 bg-white shadow-card">
            <header className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-6 py-4">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Placed on {formatDate(order.createdAt)}
                </p>
                <p className="mt-1 text-xs font-medium text-gray-400">
                  {order.items.reduce((sum, i) => sum + i.quantity, 0)} item(s)
                  · Cash on delivery
                </p>
              </div>
              <span
                className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold capitalize ${
                  STATUS_STYLES[order.status] || "bg-gray-100 text-gray-700"
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
                    <p className="font-semibold text-charcoal">{item.name}</p>
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
              <span className="text-sm font-medium text-gray-500">Total</span>
              <div className="flex items-center gap-4">
                <span className="text-xl font-extrabold tracking-tight text-charcoal">
                  {formatINR(order.totalAmount)}
                </span>
                {canCancel && (
                  <button
                    onClick={handleCancel}
                    disabled={cancelling}
                    className="rounded-full border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-60"
                  >
                    {cancelling ? "Cancelling..." : "Cancel order"}
                  </button>
                )}
              </div>
            </footer>
          </section>

          <div className="space-y-6">
            <section className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-card">
              <h2 className="flex items-center gap-2 text-lg font-extrabold text-charcoal">
                <MapPin className="h-5 w-5" />
                Shipping address
              </h2>
              <address className="mt-4 space-y-1 text-sm font-medium not-italic text-gray-600">
                <p className="font-semibold text-charcoal">
                  {order.shippingAddress?.fullName}
                </p>
                <p>{order.shippingAddress?.street}</p>
                <p>
                  {order.shippingAddress?.city},{" "}
                  {order.shippingAddress?.state}{" "}
                  {order.shippingAddress?.postalCode}
                </p>
                <p>{order.shippingAddress?.country}</p>
                <p className="pt-1">{order.shippingAddress?.phone}</p>
              </address>
            </section>

            <section className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-card">
              <h2 className="text-lg font-extrabold text-charcoal">
                Status timeline
              </h2>
              <ol className="mt-4 space-y-4">
                {history.map((entry, index) => {
                  const Icon = STATUS_ICONS[entry.status] || Package;
                  const isLast = index === history.length - 1;
                  return (
                    <li key={`${entry.status}-${index}`} className="flex gap-3">
                      <div
                        className={`mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${
                          isLast
                            ? STATUS_STYLES[entry.status]
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold capitalize text-charcoal">
                          {entry.status}
                        </p>
                        <p className="text-xs font-medium text-gray-400">
                          {formatDate(entry.at)}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
