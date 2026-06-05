import { useEffect, useMemo, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  fetchAdminDashboardData,
  selectAdminDashboardStats,
} from "../store/adminDashboardSlice";
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
  const { user, logout } = useContext(AuthContext);
  const stats = useSelector(selectAdminDashboardStats);
  const dashboardError = useSelector((state) => state.adminDashboard.error);

  useEffect(() => {
    if (!user?.isAdmin) {
      navigate("/login");
      return;
    }

    dispatch(fetchAdminDashboardData());
  }, [dispatch, navigate, user]);

  const logoutHandler = () => {
    logout();
    navigate("/login");
  };

  const statCards = useMemo(
    () => [
      {
        title: "Customers",
        value: stats.users,
        detail: "BeautyBliss accounts",
        icon: "users",
        link: "/admin/userlist",
        color: "text-sky-700",
        bg: "bg-sky-50",
      },
      {
        title: "Products",
        value: stats.products,
        detail: "Catalog items",
        icon: "products",
        link: "/admin/productlist",
        color: "text-emerald-700",
        bg: "bg-emerald-50",
      },
      {
        title: "Orders",
        value: stats.orders,
        detail: "Customer purchases",
        icon: "orders",
        link: "/admin/orderlist",
        color: "text-amber-700",
        bg: "bg-amber-50",
      },
      {
        title: "Sales",
        value: formatPrice(stats.sales),
        detail: `${stats.soldItems} sold items`,
        highlights: [
          ["Profit", formatPrice(stats.profit)],
          ["Paid", formatPrice(stats.paidIncome)],
          ["Delivered", formatPrice(stats.deliveredIncome)],
        ],
        icon: "sales",
        link: "/admin/sales",
        color: "text-pink-700",
        bg: "bg-pink-50",
      },
    ],
    [stats]
  );

  const sidebarItems = [
    { name: "Dashboard", icon: "dashboard", link: "/admin-dashboard", active: true },
    { name: "Customers", icon: "users", link: "/admin/userlist" },
    { name: "Products", icon: "products", link: "/admin/productlist" },
    { name: "Orders", icon: "orders", link: "/admin/orderlist" },
    { name: "Sales", icon: "sales", link: "/admin/sales" },
  ];

  return (
    <main className="min-h-screen bg-white text-gray-950">
      <section className="relative min-h-[260px] overflow-hidden sm:min-h-[320px]">
        <img
          src="/images/banner.jpg"
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

            <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {statCards.map((stat) => (
                <Link
                  key={stat.title}
                  to={stat.link}
                  className="group flex min-h-[176px] flex-col justify-between border border-gray-200 bg-white px-6 py-7 shadow-[0_1px_10px_rgba(0,0,0,0.08)] transition hover:border-gray-300 hover:shadow-[0_6px_20px_rgba(0,0,0,0.12)]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <Icon
                      name={stat.icon}
                      className="h-12 w-12 text-gray-300 transition group-hover:text-gray-950"
                    />
                    <Icon
                      name="arrow"
                      className="h-5 w-5 text-gray-300 transition group-hover:translate-x-1 group-hover:text-pink-600"
                    />
                  </div>
                  <div>
                    <p className="text-lg font-bold">{stat.title}</p>
                    <p className="mt-2 text-3xl font-extrabold text-gray-950">
                      {stat.value}
                    </p>
                    <p className="mt-2 text-sm text-gray-500">{stat.detail}</p>
                    {stat.highlights && (
                      <div className="mt-4 grid gap-2 text-xs font-bold uppercase tracking-wide text-gray-500">
                        {stat.highlights.map(([label, value]) => (
                          <p key={label} className="flex items-center justify-between gap-3">
                            <span>{label}</span>
                            <span className="text-gray-950">{value}</span>
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>

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
                      to: "/admin/reviews",
                      label: "Review Accounts",
                      icon: "users",
                    },
                  ].map((item) => (
                    <Link
                      key={item.label}
                      to={item.to}
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
