import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  CheckCircle,
  Clock,
  LayoutDashboard,
  LogOut,
  Package,
  ShoppingBag,
  Trash2,
  Truck,
  User,
  Users,
} from "lucide-react";
import api from "../../services/api";
import { formatPrice, parsePrice } from "../../utils/currency";
import AdminSidebar from "./components/AdminSidebar";

const formatDate = (date) => {
  if (!date) return "Pending";
  return new Date(date).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getOrderNumber = (order, index) => {
  if (order.orderNo || order.orderNumber) {
    return String(order.orderNo || order.orderNumber).toUpperCase();
  }

  return `C${String(52 + index).padStart(4, "0")}`;
};

const getOrderItems = (order) => {
  if (Array.isArray(order.orderItems) && order.orderItems.length) {
    return order.orderItems;
  }
  if (Array.isArray(order.items) && order.items.length) return order.items;
  return [
    {
      name: "BeautyBliss order",
      qty: 1,
      price: Number(order.totalPrice || order.total || order.amount || 0),
      image: "",
    },
  ];
};

const getItemQty = (item) => Number(item.qty || item.quantity || 1);

const getItemPrice = (item) => {
  return parsePrice(item.price);
};

const getItemLineTotal = (item) => {
  if (typeof item.lineTotal === "number") return item.lineTotal;
  return getItemPrice(item) * getItemQty(item);
};

const getItemImage = (item) =>
  item.image ||
  item.images?.[0] ||
  item.product?.image ||
  item.product?.images?.[0] ||
  "";

const getOrderTotal = (order) => {
  const orderItems = getOrderItems(order);
  const itemsTotal = orderItems.reduce(
    (total, item) => total + getItemLineTotal(item),
    0
  );

  return itemsTotal || Number(order.totalPrice || order.total || order.amount || 0);
};

const getCheckoutOrders = () => {
  try {
    const orders = JSON.parse(localStorage.getItem("checkoutOrders") || "[]");
    return Array.isArray(orders) ? orders : [];
  } catch {
    return [];
  }
};

const getOrderKey = (order, index) =>
  order._id || order.id || order.orderNo || order.orderNumber || `checkout-${index}`;

const isObjectId = (value) => /^[a-f\d]{24}$/i.test(value || "");

const mergeOrders = (primaryOrders, secondaryOrders) => {
  const orderMap = new Map();

  [...primaryOrders, ...secondaryOrders].forEach((order, index) => {
    if (!order) return;
    orderMap.set(getOrderKey(order, index), order);
  });

  return [...orderMap.values()];
};

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("userInfo")) || null;
  } catch {
    return null;
  }
};

const OrderListScreen = () => {
  const navigate = useNavigate();
  const [userInfo] = useState(getStoredUser);
  const [orders, setOrders] = useState(getCheckoutOrders);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deliveringId, setDeliveringId] = useState("");
  const [filter, setFilter] = useState("All");

  const filteredOrders = useMemo(() => {
    if (filter === "Paid") {
      return orders.filter((order) => Boolean(order.isPaid || order.paidAt));
    }
    if (filter === "Delivered") {
      return orders.filter((order) => Boolean(order.isDelivered || order.deliveredAt));
    }
    return orders;
  }, [orders, filter]);



  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await api.get("/orders");
        const apiOrders = Array.isArray(data) ? data : data.orders || [];
        setOrders(mergeOrders(apiOrders, getCheckoutOrders()));
      } catch (err) {
        const checkoutOrders = getCheckoutOrders();
        if (checkoutOrders.length) {
          setOrders(checkoutOrders);
          setError(null);
        } else {
          setError(err?.response?.data?.message || err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const stats = useMemo(() => {
    const paid = orders.filter((order) => order.isPaid).length;
    const delivered = orders.filter((order) => order.isDelivered).length;
    const revenue = orders.reduce(
      (sum, order) => sum + getOrderTotal(order),
      0
    );

    return { total: orders.length, paid, delivered, revenue };
  }, [orders]);

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  const markOrderDelivered = async (order, index) => {
    const orderId = order._id || order.id;
    const orderKey = getOrderKey(order, index);

    try {
      setDeliveringId(orderKey);
      setError(null);

      let updatedOrder;
      if (isObjectId(orderId)) {
        const { data } = await api.put(`/orders/${orderId}/deliver`);
        updatedOrder = data;
      } else {
        updatedOrder = {
          ...order,
          isDelivered: true,
          deliveredAt: new Date().toISOString(),
        };
      }

      setOrders((currentOrders) =>
        currentOrders.map((currentOrder, currentIndex) =>
          getOrderKey(currentOrder, currentIndex) === orderKey
            ? { ...currentOrder, ...updatedOrder }
            : currentOrder
        )
      );

      const checkoutOrders = getCheckoutOrders();
      if (checkoutOrders.length) {
        const nextCheckoutOrders = checkoutOrders.map((checkoutOrder, checkoutIndex) =>
          getOrderKey(checkoutOrder, checkoutIndex) === orderKey
            ? { ...checkoutOrder, ...updatedOrder }
            : checkoutOrder
        );
        localStorage.setItem("checkoutOrders", JSON.stringify(nextCheckoutOrders));
      }
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Unable to update delivery status");
    } finally {
      setDeliveringId("");
    }
  };

  const deleteHandler = async (order, index) => {
    const orderId = order._id || order.id;
    const orderKey = getOrderKey(order, index);

    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        setError(null);
        if (isObjectId(orderId)) {
          await api.delete(`/orders/${orderId}`);
        }

        setOrders((currentOrders) =>
          currentOrders.filter((o, idx) => getOrderKey(o, idx) !== orderKey)
        );

        const checkoutOrders = getCheckoutOrders();
        if (checkoutOrders.length) {
          const nextCheckoutOrders = checkoutOrders.filter(
            (o, idx) => getOrderKey(o, idx) !== orderKey
          );
          localStorage.setItem("checkoutOrders", JSON.stringify(nextCheckoutOrders));
        }
      } catch (err) {
        setError(err?.response?.data?.message || err.message || "Unable to delete order");
      }
    }
  };

  return (
    <main className="min-h-screen bg-white text-gray-950">
      <section className="relative min-h-[260px] overflow-hidden sm:min-h-[320px]">
        <img
          src="/images/admin_banner.png"
          alt="Beauty products arranged for order management"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/35" />
        <div className="relative z-10 mx-auto flex min-h-[260px] max-w-[1460px] flex-col items-center justify-center px-6 text-center text-white sm:min-h-[320px]">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl">
            Orders
          </h1>
          <div className="mt-6 flex items-center gap-3 text-lg font-medium">
            <Link to="/" className="text-white/85 transition hover:text-white">
              Home
            </Link>
            <span>/</span>
            <Link
              to="/admin-dashboard"
              className="text-white/85 transition hover:text-white"
            >
              Admin dashboard
            </Link>
            <span>/</span>
            <span className="font-bold">Orders</span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1460px] px-6 py-12 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[315px_1fr]">
          <AdminSidebar />

          <section className="lg:pl-1">
            <p className="text-lg leading-8 text-gray-600">
              Monitor order payments, customer details, and delivery progress for
              BeautyBliss purchases.
            </p>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {[
                ["Orders", stats.total],
                ["Paid", stats.paid],
                ["Delivered", stats.delivered],
                ["Revenue", formatPrice(stats.revenue)],
              ].map(([label, value]) => {
                const isFilterable = ["Orders", "Paid", "Delivered"].includes(label);
                const filterKey = label === "Orders" ? "All" : label;
                const isActive = isFilterable && filter === filterKey;

                return (
                  <div
                    key={label}
                    onClick={() => isFilterable && setFilter(filterKey)}
                    className={`border px-6 py-7 shadow-[0_1px_10px_rgba(0,0,0,0.08)] select-none ${
                      isFilterable ? "cursor-pointer transition-all hover:border-pink-400 hover:shadow-md" : ""
                    } ${
                      isActive ? "border-pink-600 ring-2 ring-pink-600 ring-offset-2 bg-pink-50/5" : "border-gray-200 bg-white"
                    }`}
                  >
                    <p className={`text-3xl font-extrabold ${isActive ? "text-pink-600" : "text-gray-950"}`}>{value}</p>
                    <p className="mt-2 text-sm font-bold uppercase tracking-widest text-gray-500">
                      {label}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="mt-12">
              <h2 className="text-3xl font-extrabold uppercase">
                Order Records {filter !== "All" && <span className="text-pink-600 text-lg font-bold normal-case ml-2">({filter})</span>}
              </h2>

              {loading ? (
                <div className="mt-7 border border-gray-200 bg-white py-20 text-center text-sm font-bold uppercase tracking-widest text-gray-400 shadow-[0_1px_10px_rgba(0,0,0,0.08)]">
                  Loading orders...
                </div>
              ) : error ? (
                <div className="mt-7 border border-red-100 bg-red-50 px-6 py-5 text-sm font-medium text-red-700">
                  {error}
                </div>
              ) : orders.length === 0 ? (
                <div className="mt-7 bg-[#f6f6f6] px-6 py-16 text-center">
                  <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center bg-white text-pink-600 shadow-sm">
                    <ShoppingBag className="h-7 w-7" />
                  </div>
                  <h3 className="text-3xl font-extrabold uppercase text-gray-950">
                    No orders yet
                  </h3>
                  <p className="mx-auto mt-3 max-w-md text-lg leading-7 text-gray-600">
                    Customer orders will appear here after checkout.
                  </p>
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="mt-7 bg-[#f6f6f6] px-6 py-16 text-center">
                  <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center bg-white text-pink-600 shadow-sm">
                    <ShoppingBag className="h-7 w-7" />
                  </div>
                  <h3 className="text-3xl font-extrabold uppercase text-gray-950">
                    No orders match filter
                  </h3>
                  <p className="mx-auto mt-3 max-w-md text-lg leading-7 text-gray-600">
                    No orders match the selected filter ({filter}).
                  </p>
                  <button
                    type="button"
                    onClick={() => setFilter("All")}
                    className="mt-7 inline-flex h-12 items-center justify-center gap-3 bg-[#2b2b2b] px-6 text-sm font-bold uppercase text-white transition hover:bg-pink-600"
                  >
                    Clear Filter
                  </button>
                </div>
              ) : (
                <div className="mt-7 space-y-10">
                  {filteredOrders.map((order, index) => {
                    const id = order._id || order.id;
                    const orderNumber = getOrderNumber(order, index);
                    const orderItems = getOrderItems(order);
                    const isPaid = Boolean(order.isPaid || order.paidAt);
                    const isDelivered = Boolean(order.isDelivered || order.deliveredAt);
                    const total = getOrderTotal(order);
                    const customerName =
                      order.user?.name ||
                      order.customer?.name ||
                      order.shippingAddress?.name ||
                      order.shippingAddress?.fullName ||
                      "Customer";
                    const orderKey = getOrderKey(order, index);

                    return (
                      <article key={id || orderNumber} className="bg-white">
                        <div className="flex flex-col gap-5 border-b border-[#e5e5e5] bg-[#f6f6f6] px-6 py-5 xl:flex-row xl:items-center xl:justify-between">
                          <div>
                            <p className="text-[21px] font-extrabold uppercase leading-none text-gray-950">
                              Order ID: {orderNumber}
                            </p>
                            <p className="mt-3 text-base font-medium text-gray-500">
                              {formatDate(order.createdAt)} • {customerName}
                            </p>
                          </div>

                          <div className="flex flex-wrap items-center gap-3">
                            <span
                              className={`inline-flex h-10 items-center gap-2 border px-4 text-xs font-extrabold uppercase tracking-[0.08em] ${
                                isPaid
                                  ? "border-emerald-200 bg-white text-emerald-700"
                                  : "border-[#f0c36d] bg-white text-[#9a6500]"
                              }`}
                            >
                              {isPaid ? (
                                <CheckCircle size={14} />
                              ) : (
                                <Clock size={14} />
                              )}
                              {isPaid ? "Paid" : "Pending"}
                            </span>
                            <span
                              className={`inline-flex h-10 items-center gap-2 border px-4 text-xs font-extrabold uppercase tracking-[0.08em] ${
                                isDelivered
                                  ? "border-emerald-200 bg-white text-emerald-700"
                                  : "border-pink-200 bg-white text-pink-700"
                              }`}
                            >
                              {isDelivered ? (
                                <CheckCircle size={14} />
                              ) : (
                                <Truck size={14} />
                              )}
                              {isDelivered ? "Delivered" : "Processing"}
                            </span>
                            <Link
                              to={id ? `/order/${id}` : "#"}
                              className="inline-flex h-10 items-center justify-center bg-[#2b2b2b] px-4 text-xs font-bold uppercase text-white transition hover:bg-pink-600"
                            >
                              View
                            </Link>
                            {!isDelivered && (
                              <button
                                type="button"
                                onClick={() => markOrderDelivered(order, index)}
                                disabled={deliveringId === orderKey}
                                className="inline-flex h-10 items-center justify-center gap-2 border border-emerald-200 bg-emerald-50 px-4 text-xs font-bold uppercase text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                <Truck size={14} />
                                {deliveringId === orderKey ? "Updating" : "Mark Delivered"}
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => deleteHandler(order, index)}
                              className="inline-flex h-10 w-10 items-center justify-center bg-red-50 text-red-600 transition hover:bg-red-100 hover:text-red-800"
                              aria-label="Delete order"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>

                        <div className="bg-[#f6f6f6] px-6 pb-7 pt-6">
                          <div className="bg-white px-8 py-7 shadow-sm">
                            <div className="grid grid-cols-[1fr_140px] border-b border-gray-200 pb-5 text-xl font-extrabold uppercase">
                              <span>Product</span>
                              <span className="text-right">Subtotal</span>
                            </div>

                            {orderItems.map((item, itemIndex) => {
                              const qty = getItemQty(item);
                              const price = getItemPrice(item);
                              const lineTotal = getItemLineTotal(item);
                              const productId =
                                item.product?._id ||
                                item.product ||
                                item._id ||
                                item.id;
                              const image = getItemImage(item);

                              return (
                                <div
                                  key={`${id || orderNumber}-${item.name || "item"}-${itemIndex}`}
                                  className="grid gap-5 border-b border-gray-200 py-5 sm:grid-cols-[1fr_140px] sm:items-center"
                                >
                                  <div className="grid grid-cols-[78px_1fr] items-center gap-5">
                                    <Link
                                      to={productId ? `/product/${productId}` : "#"}
                                      state={{ product: item }}
                                      className="flex h-[78px] w-[78px] items-center justify-center bg-white"
                                    >
                                      {image ? (
                                        <img
                                          src={image}
                                          alt={item.name || "Order item"}
                                          className="h-full w-full object-contain"
                                        />
                                      ) : (
                                        <div className="flex h-full w-full items-center justify-center bg-[#f6f6f6] text-pink-600">
                                          <ShoppingBag className="h-7 w-7" />
                                        </div>
                                      )}
                                    </Link>
                                    <div>
                                      <Link
                                        to={productId ? `/product/${productId}` : "#"}
                                        state={{ product: item }}
                                        className="text-[18px] font-bold leading-6 text-gray-950 hover:text-pink-600"
                                      >
                                        {item.name || "BeautyBliss order item"}
                                      </Link>
                                      <p className="mt-2 text-base text-gray-500">
                                        {formatPrice(price)}{" "}
                                        <span className="text-gray-400">x</span> Qty: {qty}
                                      </p>
                                    </div>
                                  </div>

                                  <span className="text-[18px] font-bold sm:text-right">
                                    {formatPrice(lineTotal)}
                                  </span>
                                </div>
                              );
                            })}

                            <div className="flex justify-end py-5 text-[20px] font-bold">
                              <span className="mr-8">Total</span>
                              <span>{formatPrice(total)}</span>
                            </div>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
};

export default OrderListScreen;
