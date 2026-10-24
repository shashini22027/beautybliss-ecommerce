import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BarChart3,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Package,
  Receipt,
  ShoppingBag,
  TrendingUp,
  Truck,
  User,
  Users,
  Wallet,
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

const getOrderItems = (order) => {
  if (Array.isArray(order.orderItems) && order.orderItems.length) return order.orderItems;
  if (Array.isArray(order.items) && order.items.length) return order.items;
  return [];
};

const getItemQty = (item) => Number(item.qty || item.quantity || 1);

const getItemPrice = (item) => parsePrice(item.price);

const getOrderTotal = (order) => {
  const itemsTotal = getOrderItems(order).reduce(
    (total, item) => total + getItemPrice(item) * getItemQty(item),
    0
  );

  return itemsTotal || Number(order.totalPrice || order.total || order.amount || 0);
};

const getOrderNumber = (order, index) => {
  if (order.orderNo || order.orderNumber) {
    return String(order.orderNo || order.orderNumber).toUpperCase();
  }

  return `C${String(52 + index).padStart(4, "0")}`;
};

const getOrderKey = (order, index) =>
  order._id || order.id || order.orderNo || order.orderNumber || `checkout-${index}`;

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("userInfo")) || null;
  } catch {
    return null;
  }
};

const SalesReportScreen = () => {
  const navigate = useNavigate();
  const [userInfo] = useState(getStoredUser);
  const [orders, setOrders] = useState([]);
  const [summary, setSummary] = useState(null);
  const [dateRange, setDateRange] = useState(() => {
    const today = new Date();
    const from = new Date(today);
    from.setDate(from.getDate() - 29);
    return { from: from.toISOString().slice(0, 10), to: today.toISOString().slice(0, 10) };
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);



  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const [ordersResponse, summaryResponse] = await Promise.all([
          api.get("/orders"),
          api.get("/admin/stats", { params: dateRange }),
        ]);
        const data = ordersResponse.data;
        setOrders(Array.isArray(data) ? data : data.orders || []);
        setSummary(summaryResponse.data);
      } catch (err) {
        setError(err?.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [dateRange]);

  const stats = useMemo(() => {
    return {
      totalIncome: summary?.revenue || 0,
      paidIncome: summary?.revenue || 0,
      deliveredIncome: summary?.deliveredRevenue || 0,
      soldItems: summary?.soldItems || 0,
      averageOrderValue: summary?.averageOrderValue || 0,
      paidOrders: summary?.paidOrders || 0,
    };
  }, [summary]);

  const recentOrders = useMemo(
    () =>
      orders.filter((order) => order.isPaid || order.paidAt)
        .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
        .slice(0, 6),
    [orders]
  );

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  return (
    <main className="min-h-screen bg-white text-gray-950">
      <section className="relative min-h-[260px] overflow-hidden sm:min-h-[320px]">
        <img
          src="/images/admin_banner.png"
          alt="Beauty products arranged for sales reporting"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/35" />
        <div className="relative z-10 mx-auto flex min-h-[260px] max-w-[1460px] flex-col items-center justify-center px-6 text-center text-white sm:min-h-[320px]">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl">
            Sales
          </h1>
          <div className="mt-6 flex items-center gap-3 text-lg font-medium">
            <Link to="/" className="text-white/85 transition hover:text-white">Home</Link>
            <span>/</span>
            <Link to="/admin-dashboard" className="text-white/85 transition hover:text-white">
              Admin dashboard
            </Link>
            <span>/</span>
            <span className="font-bold">Sales</span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1460px] px-6 py-12 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[315px_1fr]">
          <AdminSidebar />

          <section className="min-w-0 lg:pl-1">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <p className="max-w-3xl text-lg leading-8 text-gray-600">
                Review paid revenue and product sales from database orders. Select a date range to filter the sales metrics.
              </p>
              <Link
                to="/admin/orderlist"
                className="inline-flex h-12 items-center justify-center gap-3 bg-[#2b2b2b] px-6 text-sm font-bold uppercase text-white transition hover:bg-pink-600"
              >
                View Orders
                <Receipt size={18} />
              </Link>
            </div>

            {error && (
              <div className="mt-7 border border-red-100 bg-red-50 px-6 py-5 text-sm font-medium text-red-700">
                {error}
              </div>
            )}

            <div className="mt-7 flex flex-wrap items-end gap-3 border border-gray-200 p-5">
              <label className="grid gap-1 text-xs font-semibold uppercase tracking-wide text-gray-500">From<input type="date" value={dateRange.from} max={dateRange.to} onChange={(event) => setDateRange((range) => ({ ...range, from: event.target.value }))} className="h-10 border border-gray-300 px-3 text-sm text-gray-900" /></label>
              <label className="grid gap-1 text-xs font-semibold uppercase tracking-wide text-gray-500">To<input type="date" value={dateRange.to} min={dateRange.from} max={new Date().toISOString().slice(0, 10)} onChange={(event) => setDateRange((range) => ({ ...range, to: event.target.value }))} className="h-10 border border-gray-300 px-3 text-sm text-gray-900" /></label>
              <span className="text-sm text-gray-500">Metrics include paid orders from {summary?.period?.from || dateRange.from} to {summary?.period?.to || dateRange.to}.</span>
            </div>

            {loading ? (
              <div className="mt-10 border border-gray-200 bg-white py-20 text-center text-sm font-bold uppercase tracking-widest text-gray-400 shadow-[0_1px_10px_rgba(0,0,0,0.08)]">
                Loading sales report...
              </div>
            ) : error && !summary ? (
              <div className="mt-7 border border-gray-200 bg-gray-50 px-6 py-12 text-center text-sm text-gray-600">Sales metrics are unavailable until the database request succeeds.</div>
            ) : (
              <>
                <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                  {[
                    ["Paid Revenue", formatPrice(stats.totalIncome), Wallet],
                    ["Average Paid Order", formatPrice(stats.averageOrderValue), TrendingUp],
                    ["Paid Income", formatPrice(stats.paidIncome), CreditCard],
                    ["Sold Items", stats.soldItems, Package],
                  ].map(([label, value, Icon]) => (
                    <div key={label} className="border border-gray-200 bg-white px-6 py-7 shadow-[0_1px_10px_rgba(0,0,0,0.08)]">
                      <Icon className="mb-5 h-11 w-11 text-gray-300" />
                      <p className="break-words text-3xl font-extrabold text-gray-950">{value}</p>
                      <p className="mt-2 text-sm font-bold uppercase tracking-widest text-gray-500">{label}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-8 grid gap-6 lg:grid-cols-3">
                  {[
                    ["Paid Orders", stats.paidOrders],
                    ["Unpaid Orders", summary?.pendingOrders || 0],
                    ["Delivered Revenue", formatPrice(stats.deliveredIncome)],
                    ["Average Order", formatPrice(stats.averageOrderValue)],
                    ["Orders in Period", summary?.paidOrders || 0],
                  ].map(([label, value]) => (
                    <div key={label} className="border border-gray-200 bg-[#f8f8f8] px-6 py-5">
                      <p className="text-2xl font-extrabold text-gray-950">{value}</p>
                      <p className="mt-2 text-xs font-bold uppercase tracking-widest text-gray-500">{label}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-12">
                  <h2 className="text-3xl font-extrabold uppercase">Recent Paid Orders</h2>

                  {recentOrders.length === 0 ? (
                    <div className="mt-7 bg-[#f6f6f6] px-6 py-16 text-center">
                      <h3 className="text-2xl font-extrabold uppercase text-gray-950">No sales yet</h3>
                      <p className="mt-3 text-lg text-gray-600">Order income will appear here after checkout.</p>
                    </div>
                  ) : (
                    <div className="mt-7 overflow-hidden border border-gray-200 bg-white shadow-[0_1px_10px_rgba(0,0,0,0.08)]">
                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[720px] table-fixed text-left">
                          <thead>
                            <tr className="border-b border-gray-200 bg-[#f2f2f2]">
                              <th className="w-[150px] px-5 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Order</th>
                              <th className="w-[160px] px-5 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Date</th>
                              <th className="w-[130px] px-5 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Items</th>
                              <th className="w-[150px] px-5 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Status</th>
                              <th className="w-[150px] px-5 py-5 text-right text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Income</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {recentOrders.map((order, index) => {
                              const itemCount = getOrderItems(order).reduce((sum, item) => sum + getItemQty(item), 0);
                              const isDelivered = Boolean(order.isDelivered || order.deliveredAt);

                              return (
                                <tr key={getOrderKey(order, index)} className="transition hover:bg-[#f8f8f8]">
                                  <td className="px-5 py-4 text-sm font-bold text-gray-950">{getOrderNumber(order, index)}</td>
                                  <td className="px-5 py-4 text-sm text-gray-500">{formatDate(order.createdAt)}</td>
                                  <td className="px-5 py-4 text-sm font-bold text-gray-950">{itemCount}</td>
                                  <td className="px-5 py-4">
                                    <span className={`inline-flex items-center gap-2 border px-3 py-2 text-[10px] font-bold uppercase tracking-wide ${
                                      isDelivered
                                        ? "border-emerald-100 bg-emerald-50 text-emerald-700"
                                        : "border-pink-100 bg-pink-50 text-pink-700"
                                    }`}>
                                      <Truck className="h-3.5 w-3.5" />
                                      {isDelivered ? "Delivered" : "Processing"}
                                    </span>
                                  </td>
                                  <td className="px-5 py-4 text-right text-sm font-extrabold text-gray-950">
                                    {formatPrice(getOrderTotal(order))}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </section>
        </div>
      </section>
    </main>
  );
};

export default SalesReportScreen;
