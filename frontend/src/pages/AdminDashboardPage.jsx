import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { selectUser, logoutUserThunk } from "../redux/slices/authSlice";
import {
  fetchAdminDashboardData,
  selectAdminDashboardStats,
} from "../redux/slices/adminDashboardSlice";
import { formatPrice } from "../utils/currency";

const Icon = ({ name, className = "w-5 h-5" }) => {
  const paths = {
    dashboard: "M4 13h6V4H4v9zm10 7h6V4h-6v16zM4 20h6v-5H4v5z",
    users:
      "M17 21a5 5 0 0 0-10 0M12 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 21a4.5 4.5 0 0 0-6-4.2M16 5.2a3.5 3.5 0 0 1 0 6.6",
    products:
      "M21 16V8a2 2 0 0 0-1-1.7l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.7l7 4a2 2 0 0 0 2 0l7-4a2 2 0 0 0 1-1.7zM3.3 7 12 12l8.7-5M12 22V12",
    orders: "M7 3h10v18l-2-1-2 1-2-1-2 1-2-1V3zM9 7h6M9 11h6M9 15h4",
    sales: "M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7H14a3.5 3.5 0 0 1 0 7H6",
    logout: "M10 17l5-5-5-5M15 12H3M21 3v18",
    arrow: "M5 12h14m-6-6 6 6-6 6",
    plus: "M12 5v14M5 12h14",
    sparkle: "M12 2l1.7 5.3L19 9l-5.3 1.7L12 16l-1.7-5.3L5 9l5.3-1.7L12 2z",
    shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
    trend: "M3 17l6-6 4 4 8-8M14 7h7v7",
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

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const stats = useSelector(selectAdminDashboardStats);
  const dashboardError = useSelector((state) => state.adminDashboard.error);
  const dashboardLoading = useSelector((state) => state.adminDashboard.loading);
  const [dateRange, setDateRange] = useState(() => {
    const today = new Date();
    const from = new Date(today);
    from.setDate(from.getDate() - 29);
    return { from: from.toISOString().slice(0, 10), to: today.toISOString().slice(0, 10) };
  });

  useEffect(() => {
    if (!user?.isAdmin) {
      navigate("/login");
      return;
    }

    dispatch(fetchAdminDashboardData(dateRange));
  }, [dispatch, navigate, user?.isAdmin, dateRange]);

  const logoutHandler = () => {
    dispatch(logoutUserThunk());
    navigate("/login");
  };

  const sidebarItems = [
    { name: "Dashboard", icon: "dashboard", link: "/admin-dashboard", active: true },
    { name: "Customers", icon: "users", link: "/admin/userlist" },
    { name: "Products", icon: "products", link: "/admin/productlist" },
    { name: "Inventory", icon: "products", link: "/admin/inventory" },
    { name: "Orders", icon: "orders", link: "/admin/orderlist" },
    { name: "Sales", icon: "sales", link: "/admin/sales" },
    { name: "Appointments", icon: "orders", link: "/admin/appointments" },
    { name: "Audit Log", icon: "shield", link: "/admin/audit-logs" },
    { name: "Blogs", icon: "dashboard", link: "/admin/bloglist" },
    { name: "Messages", icon: "dashboard", link: "/admin/messages" },
  ];

  return (
    <main className="min-h-screen bg-white text-gray-950">
      <section className="relative min-h-[260px] overflow-hidden sm:min-h-[320px]">
        <img
          src="/images/admin_banner.png"
          alt="Beauty products arranged for admin dashboard"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/35" />
        <div className="relative z-10 mx-auto flex min-h-[260px] max-w-[1460px] flex-col items-center justify-center px-6 text-center text-white sm:min-h-[320px]">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl">
            Dashboard
          </h1>
          <div className="mt-6 flex items-center gap-3 text-lg font-medium">
            <Link to="/" className="text-white/85 transition hover:text-white">
              Home
            </Link>
            <span>/</span>
            <span className="font-bold">Admin dashboard</span>
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
              {sidebarItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.link}
                  className={`flex items-center gap-3 px-5 py-3 transition hover:bg-[#f2f2f2] hover:text-pink-600 ${
                    item.active ? "bg-[#f2f2f2]" : ""
                  }`}
                >
                  <Icon name={item.icon} className="h-5 w-5" />
                  {item.name}
                </Link>
              ))}
              <button
                type="button"
                onClick={logoutHandler}
                className="flex w-full items-center gap-3 px-5 py-3 text-left transition hover:bg-[#f2f2f2] hover:text-pink-600"
              >
                <Icon name="logout" className="h-5 w-5" />
                Logout
              </button>
            </nav>

            <div className="mt-8 border border-gray-200 bg-white p-5">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center bg-[#2b2b2b] text-lg font-extrabold text-white">
                  {user?.name?.charAt(0)?.toUpperCase() || "A"}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-base font-extrabold">
                    {user?.name || "Admin"}
                  </p>
                  <p className="mt-1 truncate text-sm text-gray-500">
                    {user?.email || "admin@beautybliss.com"}
                  </p>
                </div>
              </div>
            </div>
          </aside>

          <section className="lg:pl-1">
            <p className="text-lg leading-8 text-gray-600">
              Hello <strong>{user?.name || "Admin"}</strong>. From your admin dashboard you can review customer accounts,
              manage products, track orders, and monitor sales performance.
            </p>

            {dashboardError && (
              <div className="mt-7 border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {dashboardError}
              </div>
            )}

            <div className="mt-9 flex flex-col gap-4 border border-gray-200 bg-white p-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-xl font-bold">Business overview</h2>
                <p className="mt-1 text-sm text-gray-500">Revenue includes paid orders in the selected period.</p>
              </div>
              <div className="flex flex-wrap items-end gap-3">
                <label className="grid gap-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  From
                  <input type="date" value={dateRange.from} max={dateRange.to} onChange={(event) => setDateRange((range) => ({ ...range, from: event.target.value }))} className="h-10 border border-gray-300 px-3 text-sm text-gray-900" />
                </label>
                <label className="grid gap-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  To
                  <input type="date" value={dateRange.to} min={dateRange.from} max={new Date().toISOString().slice(0, 10)} onChange={(event) => setDateRange((range) => ({ ...range, to: event.target.value }))} className="h-10 border border-gray-300 px-3 text-sm text-gray-900" />
                </label>
              </div>
            </div>

            {dashboardLoading && !stats.totalOrders && !dashboardError ? (
              <div className="mt-6 border border-gray-200 px-6 py-12 text-center text-sm text-gray-500">Loading live business records…</div>
            ) : stats.period ? (
              <>
                <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                  {[
                    { title: "Customers", value: stats.totalCustomers, detail: "Registered customer accounts", icon: "users", link: "/admin/userlist" },
                    { title: "Products", value: stats.totalProducts, detail: `${stats.lowStockCount} at or below stock thresholds`, icon: "products", link: "/admin/inventory" },
                    { title: "Orders", value: stats.totalOrders, detail: `${stats.pendingOrders} awaiting payment`, icon: "orders", link: "/admin/orderlist" },
                    { title: "Paid revenue", value: formatPrice(stats.revenue), detail: `Average order ${formatPrice(stats.averageOrderValue)} · ${stats.paidOrders} paid`, icon: "sales", link: "/admin/sales" },
                  ].map((stat) => (
                    <Link key={stat.title} to={stat.link} className="group border border-gray-200 bg-white p-6 shadow-sm transition hover:border-pink-300 hover:shadow-md">
                      <div className="flex items-center justify-between">
                        <Icon name={stat.icon} className="h-9 w-9 text-gray-300 group-hover:text-pink-600" />
                        <Icon name="arrow" className="h-5 w-5 text-gray-300 group-hover:text-pink-600" />
                      </div>
                      <p className="mt-5 text-sm font-semibold text-gray-600">{stat.title}</p>
                      <p className="mt-1 text-3xl font-extrabold text-gray-950">{stat.value}</p>
                      <p className="mt-2 text-xs text-gray-500">{stat.detail}</p>
                    </Link>
                  ))}
                </div>

                <div className="mt-8 grid gap-6 xl:grid-cols-2">
                  <section className="border border-gray-200 bg-white p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div><h2 className="text-xl font-bold">Low stock</h2><p className="mt-1 text-sm text-gray-500">Products at or below their individual stock thresholds.</p></div>
                      <Link to="/admin/inventory" className="text-sm font-bold text-pink-700 hover:underline">Manage inventory</Link>
                    </div>
                    {stats.lowStockProducts?.length ? <div className="mt-5 divide-y divide-gray-100">
                      {stats.lowStockProducts.map((product) => <div key={product._id} className="flex items-center justify-between gap-3 py-3 text-sm"><span className="min-w-0 truncate font-medium">{product.name}</span><span className={`shrink-0 font-bold ${product.countInStock === 0 ? "text-red-700" : "text-amber-700"}`}>{product.countInStock} left</span></div>)}
                    </div> : <p className="mt-5 text-sm text-gray-500">No products are below the low-stock threshold.</p>}
                  </section>
                  <section className="border border-gray-200 bg-white p-6">
                    <div className="flex items-start justify-between gap-4"><div><h2 className="text-xl font-bold">Recent orders</h2><p className="mt-1 text-sm text-gray-500">Latest orders recorded in the store.</p></div><Link to="/admin/orderlist" className="text-sm font-bold text-pink-700 hover:underline">All orders</Link></div>
                    {stats.recentOrders?.length ? <div className="mt-5 divide-y divide-gray-100">
                      {stats.recentOrders.map((order) => <div key={order._id} className="flex items-center justify-between gap-3 py-3 text-sm"><div className="min-w-0"><p className="truncate font-semibold">{order.orderNo || "Order"} · {order.customer?.name || order.shippingAddress?.fullName || "Customer"}</p><p className="mt-1 text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()} · {order.isPaid ? "Paid" : "Payment pending"} · {order.isDelivered ? "Delivered" : "Processing"}</p></div><span className="shrink-0 font-bold">{formatPrice(order.totalPrice)}</span></div>)}
                    </div> : <p className="mt-5 text-sm text-gray-500">No orders have been recorded.</p>}
                  </section>
                </div>

                <div className="mt-6 grid gap-6 xl:grid-cols-2">
                  <section className="border border-gray-200 bg-white p-6">
                    <h2 className="text-xl font-bold">Product performance</h2>
                    <p className="mt-1 text-sm text-gray-500">Top products by units sold in the selected period (paid orders).</p>
                    {stats.topProducts?.length ? <div className="mt-5 space-y-4">
                      {stats.topProducts.map((product) => {
                        const maxUnits = Math.max(...stats.topProducts.map((item) => item.unitsSold), 1);
                        return <div key={product._id || product.name}>
                          <div className="mb-1 flex justify-between gap-3 text-sm"><span className="truncate font-medium">{product.name}</span><span className="shrink-0 text-gray-500">{product.unitsSold} sold · {formatPrice(product.revenue)}</span></div>
                          <div className="h-2 bg-gray-100"><div className="h-full bg-rose-400" style={{ width: `${Math.max(4, (product.unitsSold / maxUnits) * 100)}%` }} /></div>
                        </div>;
                      })}
                    </div> : <p className="mt-5 text-sm text-gray-500">No paid product sales in this period.</p>}
                  </section>
                  <section className="border border-gray-200 bg-white p-6">
                    <h2 className="text-xl font-bold">Daily paid revenue</h2>
                    <p className="mt-1 text-sm text-gray-500">Revenue by order date for the selected period.</p>
                    {stats.salesByDay?.length ? <div className="mt-5 space-y-3">
                      {stats.salesByDay.slice(-10).map((day) => {
                        const maxRevenue = Math.max(...stats.salesByDay.map((item) => item.revenue), 1);
                        return <div key={day.date || day._id} className="grid grid-cols-[82px_1fr_auto] items-center gap-3 text-xs">
                          <span className="text-gray-500">{new Date(`${day.date || day._id}T00:00:00`).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</span>
                          <div className="h-2 bg-gray-100"><div className="h-full bg-[#37302e]" style={{ width: `${Math.max(3, (day.revenue / maxRevenue) * 100)}%` }} /></div>
                          <span className="font-semibold">{formatPrice(day.revenue)}</span>
                        </div>;
                      })}
                    </div> : <p className="mt-5 text-sm text-gray-500">No paid revenue in this period.</p>}
                  </section>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <Link to="/admin/appointments" className="flex items-center justify-between border border-gray-200 bg-white p-5 hover:border-pink-300"><span><span className="block font-bold">Appointment requests</span><span className="mt-1 block text-sm text-gray-500">Review, confirm, or cancel pending requests.</span></span><span className="ml-3 rounded-full bg-rose-50 px-3 py-1 text-sm font-bold text-rose-700">{stats.pendingAppointments || 0} pending</span></Link>
                  <Link to="/admin/messages" className="flex items-center justify-between border border-gray-200 bg-white p-5 hover:border-pink-300"><span><span className="block font-bold">Customer messages</span><span className="mt-1 block text-sm text-gray-500">Open the support inbox.</span></span><span className="ml-3 rounded-full bg-rose-50 px-3 py-1 text-sm font-bold text-rose-700">{stats.unreadMessages || 0} unread</span></Link>
                </div>
              </>
            ) : null}

            <div className="mt-12 grid gap-12 xl:grid-cols-[1fr_360px]">
              <section>
                <h2 className="text-3xl font-extrabold uppercase">
                  Admin Shortcuts
                </h2>
                <div className="mt-7 grid gap-6 md:grid-cols-2">
                  {[
                    {
                      to: "/admin/product/create",
                      label: "Add New Product",
                      icon: "plus",
                    },
                    {
                      to: "/admin/homepage-merchandising",
                      label: "Homepage Merchandising",
                      icon: "sparkle",
                    },
                    {
                      to: "/admin/reviews",
                      label: "Review Accounts",
                      icon: "users",
                    },
                  ].map((item) => (
                    <Link
                      key={item.label}
                      to={item.to}
                      state={item.state}
                      className="group flex min-h-[132px] items-center gap-5 border border-gray-200 bg-white px-6 py-7 shadow-[0_1px_10px_rgba(0,0,0,0.08)] transition hover:border-gray-300 hover:shadow-[0_6px_20px_rgba(0,0,0,0.12)]"
                    >
                      <Icon
                        name={item.icon}
                        className="h-12 w-12 text-gray-300 transition group-hover:text-gray-950"
                      />
                      <span className="text-lg font-bold">{item.label}</span>
                      <Icon
                        name="arrow"
                        className="ml-auto h-5 w-5 text-gray-300 transition group-hover:translate-x-1 group-hover:text-pink-600"
                      />
                    </Link>
                  ))}
                </div>
              </section>

              <aside>
                <h2 className="text-3xl font-extrabold uppercase">Admin Note</h2>
                <p className="mt-7 text-lg italic leading-8 text-gray-600">
                  Keep product records updated, review new orders first, and make sure
                  every BeautyBliss customer has a smooth shopping experience.
                </p>

                <div className="mt-8 space-y-4">
                  <div className="border border-gray-200 px-5 py-4">
                    <div className="mb-2 flex items-center gap-3 font-bold text-gray-950">
                      <Icon name="shield" className="h-5 w-5 text-gray-400" />
                      Secure Access
                    </div>
                    <p className="text-sm leading-6 text-gray-600">
                      Admin controls are available only for authorized BeautyBliss users.
                    </p>
                  </div>

                  <div className="border border-gray-200 px-5 py-4">
                    <div className="mb-2 flex items-center gap-3 font-bold text-gray-950">
                      <Icon name="trend" className="h-5 w-5 text-gray-400" />
                      Daily Flow
                    </div>
                    <p className="text-sm leading-6 text-gray-600">
                      Review orders first, then update product and inventory records.
                    </p>
                  </div>
                </div>
              </aside>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
};

export default AdminDashboardPage;
