import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Icon = ({ name, className = "w-5 h-5" }) => {
  const paths = {
    dashboard: "M4 13h6V4H4v9zm10 7h6V4h-6v16zM4 20h6v-5H4v5z",
    users:
      "M17 21a5 5 0 0 0-10 0M12 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 21a4.5 4.5 0 0 0-6-4.2M16 5.2a3.5 3.5 0 0 1 0 6.6",
    products:
      "M21 16V8a2 2 0 0 0-1-1.7l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.7l7 4a2 2 0 0 0 2 0l7-4a2 2 0 0 0 1-1.7zM3.3 7 12 12l8.7-5M12 22V12",
    orders: "M7 3h10v18l-2-1-2 1-2-1-2 1-2-1V3zM9 7h6M9 11h6M9 15h4",
    sales: "M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7H14a3.5 3.5 0 0 1 0 7H6",
    profile: "M20 21a8 8 0 0 0-16 0M12 13a5 5 0 1 0 0-10 5 5 0 0 0 0 10z",
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

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("userInfo")) || null;
  } catch {
    return null;
  }
};

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const [userInfo] = useState(getStoredUser);
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    orders: 0,
    sales: 0,
  });
  const [loading, setLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState("");

  useEffect(() => {
    if (!userInfo?.isAdmin) {
      navigate("/login");
      return;
    }

    const loadStats = async () => {
      try {
        const headers = userInfo?.token
          ? { Authorization: `Bearer ${userInfo.token}` }
          : {};
        const statsRes = await fetch("/api/admin/stats", { headers });
        const statsData = await statsRes.json();

        if (!statsRes.ok) {
          throw new Error(statsData.message || "Unable to load dashboard statistics");
        }

        setStats({
          users: statsData.totalUsers || 0,
          products: statsData.totalProducts || 0,
          orders: statsData.totalOrders || 0,
          sales: statsData.totalSales || 0,
        });
      } catch (err) {
        setDashboardError(err.message || "Unable to load dashboard statistics");
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [navigate, userInfo]);

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
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
        value: `$${Number(stats.sales || 0).toFixed(2)}`,
        detail: "Paid revenue",
        icon: "sales",
        link: "/admin/orderlist",
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
  ];

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fff7f8] px-4 text-gray-950">
        <div className="rounded-2xl border border-pink-200 bg-white px-10 py-12 text-center shadow-[0_24px_70px_rgba(190,24,93,0.12)]">
          <div className="mx-auto mb-5 h-12 w-12 animate-spin rounded-full border-2 border-pink-100 border-t-pink-600" />
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-gray-500">
            Loading BeautyBliss Admin
          </p>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6edf1] text-gray-950 lg:flex">
      <aside className="border-b border-pink-200 bg-white text-gray-950 shadow-sm lg:sticky lg:top-0 lg:min-h-screen lg:w-72 lg:border-b-0 lg:border-r lg:border-pink-200">
        <div className="border-b border-pink-100 p-6">
          <Link to="/" className="flex items-center gap-3">
            <span>
              <span className="block font-serif text-2xl font-bold tracking-[0.12em]">
                BEAUTYBLISS
              </span>
              <span className="mt-1 block text-[10px] font-bold uppercase tracking-[0.26em] text-gray-500">
                Admin Studio
              </span>
            </span>
          </Link>
        </div>

        <nav className="flex gap-2 overflow-x-auto p-4 lg:block lg:space-y-2 lg:overflow-visible">
          {sidebarItems.map((item) => (
            <Link
              key={item.name}
              to={item.link}
              className={`flex min-w-fit items-center gap-3 rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-[0.16em] transition ${
                item.active
                  ? "bg-[#9f234f] text-white shadow-lg shadow-pink-900/20"
                  : "text-gray-600 hover:bg-[#fff0f4] hover:text-[#9f234f]"
              }`}
            >
              <Icon name={item.icon} className="h-5 w-5" />
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="hidden border-t border-pink-100 p-4 lg:block">
          <Link
            to="/profile"
            className="mb-2 flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-[0.16em] text-gray-600 transition hover:bg-[#fff0f4] hover:text-[#9f234f]"
          >
            <Icon name="profile" className="h-5 w-5" />
            Profile
          </Link>
          <button
            type="button"
            onClick={logoutHandler}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-[0.16em] text-gray-600 transition hover:bg-red-50 hover:text-red-600"
          >
            <Icon name="logout" className="h-5 w-5" />
            Logout
          </button>
        </div>

        <div className="hidden p-4 lg:block">
          <div className="rounded-2xl border border-pink-100 bg-[#fff7f8] p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#9f234f] font-bold text-white">
                {userInfo?.name?.charAt(0)?.toUpperCase() || "A"}
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs font-bold uppercase tracking-[0.16em]">
                  {userInfo?.name || "Admin"}
                </p>
                <p className="mt-1 truncate text-xs text-gray-500">
                  {userInfo?.email || "admin@beautybliss.com"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-10">
        <header className="mb-8 overflow-hidden rounded-2xl border border-[#d9a1b3] bg-white shadow-[0_18px_55px_rgba(86,28,52,0.12)]">
          <div className="bg-white px-6 py-8 sm:px-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.32em] text-[#9f234f]">
                  BeautyBliss Control Center
                </p>
                <h1 className="font-serif text-4xl font-bold tracking-tight text-gray-950 sm:text-5xl">
                  Dashboard
                </h1>
                <p className="mt-4 max-w-2xl text-sm font-medium leading-7 text-gray-600">
                  Monitor customers, product inventory, orders, and sales performance
                  from one polished admin workspace.
                </p>
              </div>
            </div>
          </div>
        </header>

        {dashboardError && (
          <div className="mb-6 rounded-xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
            {dashboardError}
          </div>
        )}

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {statCards.map((stat) => (
            <Link
              key={stat.title}
              to={stat.link}
              className="group rounded-2xl border border-[#d9a1b3] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-[#9f234f] hover:shadow-[0_18px_45px_rgba(190,24,93,0.16)]"
            >
              <div className="mb-6 flex items-center justify-between">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bg} ${stat.color}`}
                >
                  <Icon name={stat.icon} className="h-6 w-6" />
                </div>
                <Icon
                  name="arrow"
                  className="h-5 w-5 text-gray-300 transition group-hover:translate-x-1 group-hover:text-pink-600"
                />
              </div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-500">
                {stat.title}
              </p>
              <p className="mt-2 font-serif text-3xl font-bold text-gray-950">
                {stat.value}
              </p>
              <p className="mt-4 text-sm font-medium text-gray-500">{stat.detail}</p>
            </Link>
          ))}
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_380px]">
          <section className="rounded-2xl border border-[#d9a1b3] bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-pink-500">
                  Quick Management
                </p>
                <h2 className="font-serif text-3xl font-bold text-gray-950">
                  Admin Shortcuts
                </h2>
              </div>
              <span className="rounded-full bg-[#fff0f4] px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[#9f234f]">
                Beauty operations
              </span>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {[
                {
                  to: "/admin/product/create",
                  label: "Inventory",
                  title: "Add New Product",
                  icon: "plus",
                  tone: "bg-pink-100 text-pink-600",
                },
                {
                  to: "/admin/orderlist",
                  label: "Orders",
                  title: "Process Purchases",
                  icon: "orders",
                  tone: "bg-amber-50 text-amber-600",
                },
                {
                  to: "/admin/userlist",
                  label: "Customers",
                  title: "Review Accounts",
                  icon: "users",
                  tone: "bg-sky-50 text-sky-600",
                },
                {
                  to: "/admin/productlist",
                  label: "Catalog",
                  title: "Manage Products",
                  icon: "products",
                  tone: "bg-emerald-50 text-emerald-600",
                },
              ].map((item) => (
                <Link
                  key={item.title}
                  to={item.to}
                  className="group flex items-center gap-4 rounded-2xl border border-pink-200 bg-[#fff7f8] p-5 transition hover:border-[#9f234f] hover:bg-[#fff0f4]"
                >
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${item.tone}`}>
                    <Icon name={item.icon} className="h-6 w-6" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-pink-500">
                      {item.label}
                    </p>
                    <p className="mt-1 font-bold text-gray-950">{item.title}</p>
                  </div>
                  <Icon
                    name="arrow"
                    className="ml-auto h-5 w-5 text-gray-300 transition group-hover:translate-x-1 group-hover:text-pink-600"
                  />
                </Link>
              ))}
            </div>
          </section>

          <aside className="rounded-2xl border border-[#d9a1b3] bg-white p-6 text-gray-950 shadow-sm sm:p-8">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-[#9f234f] text-white">
              <Icon name="sparkle" className="h-6 w-6" />
            </div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-[#9f234f]">
              Admin Note
            </p>
            <h2 className="font-serif text-3xl font-bold">
              Keep BeautyBliss polished.
            </h2>
            <p className="mt-4 text-sm font-medium leading-7 text-gray-600">
              Watch stock levels, keep product images fresh, and process customer
              orders quickly for a smooth beauty shopping experience.
            </p>

            <div className="mt-8 grid gap-3">
              <div className="rounded-xl border border-pink-100 bg-[#fff7f8] p-4">
                <div className="mb-2 flex items-center gap-2 text-[#9f234f]">
                  <Icon name="shield" className="h-4 w-4" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">
                    Secure Access
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  Admin controls are available only for authorized BeautyBliss users.
                </p>
              </div>

              <div className="rounded-xl border border-pink-100 bg-[#fff7f8] p-4">
                <div className="mb-2 flex items-center gap-2 text-[#9f234f]">
                  <Icon name="trend" className="h-4 w-4" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">
                    Daily Flow
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  Review orders first, then update low-stock product records.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboardPage;
