import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

const Icon = ({ name, className = "w-5 h-5" }) => {
  const paths = {
    arrow: "M19 12H5m6-6-6 6 6 6",
    bag: "M6 8h12l-1 13H7L6 8zm3 0a3 3 0 0 1 6 0",
    check: "M20 6 9 17l-5-5",
    clock: "M12 8v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z",
    map: "M9 18l-6 3V6l6-3 6 3 6-3v15l-6 3-6-3zM9 3v15M15 6v15",
  };

  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={paths[name]} />
    </svg>
  );
};

const formatDate = (date) => {
  if (!date) return "Pending";

  return new Date(date).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatPrice = (value) => `$${Number(value || 0).toFixed(2)}`;

const OrderDetailsPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOrder = async () => {
      try {
        setLoading(true);
        setError("");

        const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};
        const token = userInfo.token;

        const res = await fetch(`/api/orders/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.message || "Unable to load order details");
        }

        setOrder(data.order || data);
      } catch (err) {
        setError(err.message || "Unable to load order details");
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [id]);

  const totals = useMemo(() => {
    if (!order) {
      return { items: 0, shipping: 0, tax: 0, total: 0 };
    }

    const items = (order.orderItems || []).reduce(
      (sum, item) => sum + Number(item.price || 0) * Number(item.qty || 0),
      0
    );

    return {
      items,
      shipping: Number(order.shippingPrice || 0),
      tax: Number(order.taxPrice || 0),
      total: Number(order.totalPrice || order.total || items || 0),
    };
  }, [order]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#fff1f4] px-4 py-16 text-center text-sm font-bold uppercase tracking-widest text-gray-400">
        Loading order details...
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#fff1f4] px-4 py-16 text-center">
        <div className="mx-auto max-w-lg rounded-lg border border-red-100 bg-red-50 p-6 text-sm font-medium text-red-700">
          {error}
        </div>
        <Link
          to="/orders"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-gray-950 px-6 py-3 text-sm font-bold uppercase tracking-widest text-white transition hover:bg-pink-600"
        >
          <Icon name="arrow" className="h-4 w-4" />
          Back to Orders
        </Link>
      </main>
    );
  }

  if (!order) return null;

  const isPaid = Boolean(order.isPaid || order.paidAt);
  const isDelivered = Boolean(order.isDelivered || order.deliveredAt);
  const shippingAddress = order.shippingAddress || {};

  return (
    <main
      className="min-h-screen px-4 py-8 text-gray-950 sm:px-6 lg:px-8"
      style={{
        background:
          "linear-gradient(135deg, #fff1f4 0%, #faf0ea 48%, #f8e7ee 100%)",
      }}
    >
      <section className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-5 border-b border-pink-200/70 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.28em] text-pink-500">
              BeautyBliss Order
            </p>
            <h1 className="break-all font-serif text-4xl font-bold tracking-tight text-gray-950 sm:text-5xl">
              #{order._id || order.id}
            </h1>
            <p className="mt-3 text-sm leading-6 text-gray-500">
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>

          <Link
            to="/orders"
            className="inline-flex h-12 items-center justify-center gap-3 rounded-lg bg-gray-950 px-5 text-sm font-bold uppercase tracking-[0.16em] text-white transition hover:bg-pink-600"
          >
            <Icon name="arrow" className="h-5 w-5" />
            My Orders
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
          <div className="space-y-6">
            <section className="overflow-hidden rounded-lg border border-pink-200 bg-[#fff4f6]/90 shadow-sm">
              <div className="border-b border-pink-200 px-5 py-4">
                <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-gray-600">
                  Order Items
                </h2>
              </div>

              <div className="divide-y divide-pink-200">
                {(order.orderItems || []).map((item) => (
                  <article
                    key={item.product || item.name}
                    className="grid gap-4 px-5 py-5 sm:grid-cols-[5rem_1fr_auto] sm:items-center"
                  >
                    <img
                      src={
                        item.image ||
                        "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=500&q=80"
                      }
                      alt={item.name}
                      className="h-20 w-20 rounded-lg object-cover"
                    />
                    <div>
                      <p className="font-bold text-gray-950">{item.name}</p>
                      <p className="mt-1 text-sm text-gray-500">
                        Qty {item.qty} x {formatPrice(item.price)}
                      </p>
                    </div>
                    <p className="text-sm font-bold text-gray-950">
                      {formatPrice(Number(item.qty || 0) * Number(item.price || 0))}
                    </p>
                  </article>
                ))}
              </div>
            </section>

            <section className="rounded-lg border border-pink-200 bg-[#fff4f6]/90 p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-pink-100 text-pink-600">
                  <Icon name="map" className="h-5 w-5" />
                </span>
                <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-gray-600">
                  Shipping Address
                </h2>
              </div>
              <p className="text-sm font-medium leading-7 text-gray-600">
                {shippingAddress.address}
                <br />
                {[shippingAddress.city, shippingAddress.postalCode]
                  .filter(Boolean)
                  .join(", ")}
                <br />
                {shippingAddress.country}
              </p>
            </section>
          </div>

          <aside className="space-y-6">
            <section className="rounded-lg border border-pink-200 bg-[#fff4f6]/90 p-5 shadow-sm">
              <h2 className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-gray-600">
                Status
              </h2>
              <div className="space-y-3">
                <span
                  className={`flex items-center gap-2 rounded-lg px-3 py-3 text-xs font-bold uppercase tracking-[0.12em] ${
                    isPaid
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  <Icon name={isPaid ? "check" : "clock"} className="h-4 w-4" />
                  {isPaid ? `Paid ${formatDate(order.paidAt)}` : "Payment Pending"}
                </span>
                <span
                  className={`flex items-center gap-2 rounded-lg px-3 py-3 text-xs font-bold uppercase tracking-[0.12em] ${
                    isDelivered
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-pink-50 text-pink-700"
                  }`}
                >
                  <Icon name={isDelivered ? "check" : "bag"} className="h-4 w-4" />
                  {isDelivered
                    ? `Delivered ${formatDate(order.deliveredAt)}`
                    : "Processing"}
                </span>
              </div>
            </section>

            <section className="rounded-lg border border-pink-200 bg-white p-5 shadow-sm">
              <h2 className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-gray-600">
                Order Summary
              </h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between gap-4 text-gray-600">
                  <span>Items</span>
                  <span className="font-bold text-gray-950">{formatPrice(totals.items)}</span>
                </div>
                <div className="flex justify-between gap-4 text-gray-600">
                  <span>Shipping</span>
                  <span className="font-bold text-gray-950">
                    {formatPrice(totals.shipping)}
                  </span>
                </div>
                <div className="flex justify-between gap-4 text-gray-600">
                  <span>Tax</span>
                  <span className="font-bold text-gray-950">{formatPrice(totals.tax)}</span>
                </div>
                <div className="flex justify-between gap-4 border-t border-pink-100 pt-4 text-lg font-bold text-gray-950">
                  <span>Total</span>
                  <span>{formatPrice(totals.total)}</span>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </section>
    </main>
  );
};

export default OrderDetailsPage;
