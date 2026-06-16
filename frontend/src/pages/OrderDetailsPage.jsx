import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiFetch } from "../utils/api";
import { formatPrice } from "../utils/currency";

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

const getSavedCheckoutOrder = (orderId) => {
  try {
    const savedOrders = JSON.parse(localStorage.getItem("checkoutOrders") || "[]");
    if (!Array.isArray(savedOrders)) return null;

    return (
      savedOrders.find((savedOrder) => {
        const savedOrderId = savedOrder._id || savedOrder.id;
        return String(savedOrderId) === String(orderId);
      }) || null
    );
  } catch {
    return null;
  }
};

const getOrderItems = (order) => {
  if (Array.isArray(order.orderItems)) return order.orderItems;
  if (Array.isArray(order.items)) return order.items;
  return [];
};

const getItemQty = (item) => Number(item.qty || item.quantity || 0);

const getItemPrice = (item) => Number(item.price || 0);

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

        const savedCheckoutOrder = getSavedCheckoutOrder(id);
        if (savedCheckoutOrder) {
          setOrder(savedCheckoutOrder);
          return;
        }

        const res = await apiFetch(`/api/orders/${id}`, {
          method: "GET",
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(
            data?.message === "Not authorized, no token"
              ? "Please log in to view this order."
              : data?.message || "Unable to load order details"
          );
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

    const items = getOrderItems(order).reduce(
      (sum, item) => sum + getItemPrice(item) * getItemQty(item),
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
      <main className="min-h-screen bg-white px-4 py-16 text-center text-sm font-bold uppercase tracking-widest text-gray-400">
        Loading order details...
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-white px-4 py-16 text-center">
        <div className="mx-auto max-w-lg border border-red-100 bg-red-50 p-6 text-base font-medium text-red-700">
          {error}
        </div>
        <Link
          to="/orders"
          className="mt-6 inline-flex h-12 items-center justify-center gap-3 bg-[#2b2b2b] px-6 text-sm font-bold uppercase text-white transition hover:bg-pink-600"
        >
          <Icon name="arrow" className="h-5 w-5" />
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
    <main className="min-h-screen bg-white text-gray-950">
      <section className="relative min-h-[420px] overflow-hidden">
        <img
          src="/images/banner.jpg"
          alt="Order Details"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/35" />
        <div className="relative z-10 mx-auto flex min-h-[420px] max-w-[1540px] items-center justify-center px-6 text-white">
          <div className="flex flex-wrap items-center justify-center gap-4 text-3xl font-extrabold uppercase">
            <Link to="/orders" className="text-white/80 transition hover:text-white">
              My Orders
            </Link>
            <span className="text-white/80">→</span>
            <span className="border-b-4 border-black pb-2">Order Details</span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1460px] px-6 py-12">
        <div className="mb-8 flex flex-col gap-5 border-b border-gray-200 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="break-all text-3xl font-extrabold uppercase text-gray-950">
              Order #{order.orderNo || order._id || order.id}
            </h1>
            <p className="mt-3 text-lg leading-7 text-gray-600">
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>

          <Link
            to="/orders"
            className="inline-flex h-12 items-center justify-center gap-3 bg-[#2b2b2b] px-6 text-sm font-bold uppercase text-white transition hover:bg-pink-600"
          >
            <Icon name="arrow" className="h-5 w-5" />
            Back to Orders
          </Link>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.35fr_0.65fr]">
          <div className="space-y-10">
            <section className="bg-[#f6f6f6] p-6">
              <h2 className="mb-6 text-[21px] font-extrabold uppercase leading-none text-gray-950">
                Order Items
              </h2>

              <div className="divide-y divide-[#e5e5e5]">
                {getOrderItems(order).map((item) => (
                  <article
                    key={item.product || item.name}
                    className="grid gap-4 py-5 sm:grid-cols-[5rem_1fr_auto] sm:items-center"
                  >
                    <img
                      src={
                        item.image ||
                        "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=500&q=80"
                      }
                      alt={item.name}
                      className="h-20 w-20 object-cover"
                    />
                    <div>
                      <p className="text-base font-bold text-gray-950">{item.name}</p>
                      {item.color && <p className="mt-1 text-sm text-gray-500">Color: {item.color}</p>}
                      <p className="mt-1 text-base text-gray-500">
                        Qty {getItemQty(item)} x {formatPrice(getItemPrice(item))}
                      </p>
                    </div>
                    <p className="text-lg font-bold text-gray-950">
                      {formatPrice(getItemQty(item) * getItemPrice(item))}
                    </p>
                  </article>
                ))}
              </div>
            </section>

            <section className="bg-[#f6f6f6] p-6">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center bg-white text-gray-950 shadow-sm">
                  <Icon name="map" className="h-6 w-6" />
                </div>
                <h2 className="text-[21px] font-extrabold uppercase leading-none text-gray-950">
                  Shipping Address
                </h2>
              </div>
              <p className="text-lg font-medium leading-7 text-gray-600">
                {shippingAddress.fullName && (
                  <>
                    <span className="font-bold text-gray-950">{shippingAddress.fullName}</span>
                    <br />
                  </>
                )}
                {shippingAddress.address}
                <br />
                {[shippingAddress.city, shippingAddress.postalCode].filter(Boolean).join(", ")}
                <br />
                {shippingAddress.country}
                {shippingAddress.phone && (
                  <>
                    <br />
                    {shippingAddress.phone}
                  </>
                )}
              </p>
            </section>
          </div>

          <aside className="space-y-10">
            <section className="bg-[#f6f6f6] p-6">
              <h2 className="mb-6 text-[21px] font-extrabold uppercase leading-none text-gray-950">
                Status
              </h2>
              <div className="space-y-4">
                <span
                  className={`flex items-center gap-3 border px-4 py-3 text-sm font-extrabold uppercase tracking-[0.08em] ${
                    isPaid
                      ? "border-emerald-200 bg-white text-emerald-700"
                      : "border-[#f0c36d] bg-white text-[#9a6500]"
                  }`}
                >
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full ${
                      isPaid ? "bg-emerald-100" : "bg-[#fff6e5]"
                    }`}
                  >
                    <Icon name={isPaid ? "check" : "clock"} className="h-3 w-3" />
                  </span>
                  {isPaid ? `Paid on ${formatDate(order.paidAt)}` : "Payment Pending"}
                </span>
                <span
                  className={`flex items-center gap-3 border px-4 py-3 text-sm font-extrabold uppercase tracking-[0.08em] ${
                    isDelivered
                      ? "border-emerald-200 bg-white text-emerald-700"
                      : "border-pink-200 bg-white text-pink-700"
                  }`}
                >
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full ${
                      isDelivered ? "bg-emerald-100" : "bg-pink-100"
                    }`}
                  >
                    <Icon name={isDelivered ? "check" : "bag"} className="h-3 w-3" />
                  </span>
                  {isDelivered ? `Delivered on ${formatDate(order.deliveredAt)}` : "Processing"}
                </span>
              </div>
            </section>

            <section className="bg-[#f6f6f6] p-6">
              <h2 className="mb-6 text-[21px] font-extrabold uppercase leading-none text-gray-950">
                Order Summary
              </h2>
              <div className="space-y-4 text-base font-medium">
                <div className="flex justify-between gap-4 text-gray-600">
                  <span>Items</span>
                  <span className="font-bold text-gray-950">{formatPrice(totals.items)}</span>
                </div>
                <div className="flex justify-between gap-4 text-gray-600">
                  <span>Shipping</span>
                  <span className="font-bold text-gray-950">{formatPrice(totals.shipping)}</span>
                </div>
                <div className="flex justify-between gap-4 text-gray-600">
                  <span>Tax</span>
                  <span className="font-bold text-gray-950">{formatPrice(totals.tax)}</span>
                </div>
                <div className="flex justify-between gap-4 border-t border-[#e5e5e5] pt-5 text-xl font-extrabold uppercase text-gray-950">
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
