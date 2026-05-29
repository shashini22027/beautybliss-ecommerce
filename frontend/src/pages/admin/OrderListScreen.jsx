import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  CheckCircle,
  Clock,
  LayoutDashboard,
  LogOut,
  Package,
  ShoppingBag,
  Truck,
  User,
  Users,
} from "lucide-react";
import api from "../../services/api";

const formatDate = (date) => {
  if (!date) return "Pending";
  return new Date(date).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatPrice = (value) =>
  `රු${Number(value || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

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
  if (typeof item.price === "number") return item.price;

  const price = String(item.price || "0")
    .replace(/From/gi, "")
    .replace(/[^\d.]/g, "");

  return Number(price || 0);
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
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const sidebarItems = [
    { name: "Dashboard", icon: LayoutDashboard, link: "/admin-dashboard" },
    { name: "Customers", icon: Users, link: "/admin/userlist" },
    { name: "Products", icon: Package, link: "/admin/productlist" },
    { name: "Orders", icon: ShoppingBag, link: "/admin/orderlist", active: true },
  ];

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await api.get("/orders");
        setOrders(Array.isArray(data) ? data : data.orders || []);
      } catch (err) {
        setError(err?.response?.data?.message || err.message);
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
      (sum, order) => sum + Number(order.totalPrice || 0),
      0
    );

    return { total: orders.length, paid, delivered, revenue };
  }, [orders]);

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  return (
    <main className="min-h-screen bg-white text-gray-950">
      <section className="relative min-h-[260px] overflow-hidden sm:min-h-[320px]">
        <img
          src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1800&q=85"
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
          <aside className="border-gray-200 lg:border-r lg:pr-9">
            <h2 className="border-b border-gray-200 pb-5 text-2xl font-extrabold uppercase">
              Admin Panel
            </h2>

            <nav className="mt-5 space-y-1 text-lg font-bold">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.link}
                    className={`flex items-center gap-3 px-5 py-3 transition hover:bg-[#f2f2f2] hover:text-pink-600 ${
                      item.active ? "bg-[#f2f2f2]" : ""
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}
              <Link
                to="/profile"
                className="flex items-center gap-3 px-5 py-3 transition hover:bg-[#f2f2f2] hover:text-pink-600"
              >
                <User className="h-5 w-5" />
                Profile
              </Link>
              <button
                type="button"
                onClick={logoutHandler}
                className="flex w-full items-center gap-3 px-5 py-3 text-left transition hover:bg-[#f2f2f2] hover:text-pink-600"
              >
                <LogOut className="h-5 w-5" />
                Logout
              </button>
            </nav>

            <div className="mt-8 border border-gray-200 bg-white p-5">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center bg-[#2b2b2b] text-lg font-extrabold text-white">
                  {userInfo?.name?.charAt(0)?.toUpperCase() || "A"}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-base font-extrabold">
                    {userInfo?.name || "Admin"}
                  </p>
                  <p className="mt-1 truncate text-sm text-gray-500">
                    {userInfo?.email || "admin@beautybliss.com"}
                  </p>
                </div>
              </div>
            </div>
          </aside>

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
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="border border-gray-200 bg-white px-6 py-7 shadow-[0_1px_10px_rgba(0,0,0,0.08)]"
                >
                  <p className="text-3xl font-extrabold text-gray-950">{value}</p>
                  <p className="mt-2 text-sm font-bold uppercase tracking-widest text-gray-500">
                    {label}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-12">
              <h2 className="text-3xl font-extrabold uppercase">
                Order Records
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
              ) : (
                <div className="mt-7 space-y-10">
                  {orders.map((order, index) => {
                    const id = order._id || order.id;
                    const orderNumber = getOrderNumber(order, index);
                    const orderItems = getOrderItems(order);
                    const isPaid = Boolean(order.isPaid || order.paidAt);
                    const isDelivered = Boolean(order.isDelivered || order.deliveredAt);
                    const total = getOrderTotal(order);
                    const customerName =
                      order.user?.name || order.customer?.name || "Customer";

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
