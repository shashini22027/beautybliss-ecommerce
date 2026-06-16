import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Edit,
  LayoutDashboard,
  LogOut,
  Package,
  ShoppingBag,
  ShieldCheck,
  Trash2,
  User,
  Users,
  XCircle,
} from "lucide-react";
import api from "../../services/api";

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("userInfo")) || null;
  } catch {
    return null;
  }
};

const UserListScreen = () => {
  const navigate = useNavigate();
  const [userInfo] = useState(getStoredUser);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterType, setFilterType] = useState("Total");

  const sidebarItems = [
    { name: "Dashboard", icon: LayoutDashboard, link: "/admin-dashboard" },
    { name: "Customers", icon: Users, link: "/admin/userlist", active: true },
    { name: "Products", icon: Package, link: "/admin/productlist" },
    { name: "Orders", icon: ShoppingBag, link: "/admin/orderlist" },
  ];

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.get("/users");
      setUsers(Array.isArray(data) ? data : data.users || []);
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const stats = useMemo(() => {
    const admins = users.filter((user) => user.isAdmin).length;
    return {
      total: users.length,
      admins,
      customers: users.length - admins,
    };
  }, [users]);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      if (filterType === "Admins") return user.isAdmin;
      if (filterType === "Customers") return !user.isAdmin;
      return true;
    });
  }, [users, filterType]);

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await api.delete(`/users/${id}`);
        fetchUsers();
      } catch (err) {
        console.error(err?.response?.data?.message || err.message);
      }
    }
  };

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  return (
    <main className="min-h-screen bg-white text-gray-950">
      <section className="relative min-h-[260px] overflow-hidden sm:min-h-[320px]">
        <img
          src="/images/banner.jpg"
          alt="Beauty products arranged for customer management"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/35" />
        <div className="relative z-10 mx-auto flex min-h-[260px] max-w-[1460px] flex-col items-center justify-center px-6 text-center text-white sm:min-h-[320px]">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl">
            Customers
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
            <span className="font-bold">Customers</span>
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
              Manage customer accounts, administrator access, and user records for
              BeautyBliss.
            </p>

            <div className="mt-10 grid gap-6 sm:grid-cols-3">
              {[
                ["Total", stats.total],
                ["Admins", stats.admins],
                ["Customers", stats.customers],
              ].map(([label, value]) => (
                <button
                  key={label}
                  onClick={() => setFilterType(label)}
                  className={`border border-gray-200 px-6 py-7 shadow-[0_1px_10px_rgba(0,0,0,0.08)] transition-all text-left ${
                    filterType === label
                      ? "bg-[#2b2b2b] text-white"
                      : "bg-white hover:bg-[#f2f2f2]"
                  }`}
                >
                  <p className={`text-3xl font-extrabold ${filterType === label ? "text-white" : "text-gray-950"}`}>{value}</p>
                  <p className={`mt-2 text-sm font-bold uppercase tracking-widest ${filterType === label ? "text-gray-300" : "text-gray-500"}`}>
                    {label}
                  </p>
                </button>
              ))}
            </div>

            <div className="mt-12">
              <h2 className="text-3xl font-extrabold uppercase">
                Customer Records
              </h2>

              {loading ? (
                <div className="mt-7 border border-gray-200 bg-white py-20 text-center text-sm font-bold uppercase tracking-widest text-gray-400 shadow-[0_1px_10px_rgba(0,0,0,0.08)]">
                  Loading customers...
                </div>
              ) : error ? (
                <div className="mt-7 border border-red-100 bg-red-50 px-6 py-5 text-sm font-medium text-red-700">
                  {error}
                </div>
              ) : (
                <div className="mt-7 overflow-hidden border border-gray-200 bg-white shadow-[0_1px_10px_rgba(0,0,0,0.08)]">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-gray-200 bg-[#f2f2f2]">
                          {["User ID", "Name", "Email", "Role", "Actions"].map((head) => (
                            <th
                              key={head}
                              className={`px-6 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 ${
                                head === "Actions" ? "text-right" : ""
                              }`}
                            >
                              {head}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {filteredUsers.map((user, index) => (
                          <tr key={user._id} className="transition hover:bg-[#f8f8f8]">
                            <td className="px-6 py-5 font-mono text-[10px] text-gray-400">
                              {`U${String(index + 1).padStart(4, "0")}`}
                            </td>
                            <td className="px-6 py-5 text-sm font-bold text-gray-800">
                              {user.name}
                            </td>
                            <td className="px-6 py-5 text-sm text-gray-500">
                              <a
                                href={`mailto:${user.email}`}
                                className="transition hover:text-pink-600"
                              >
                                {user.email}
                              </a>
                            </td>
                            <td className="px-6 py-5">
                              {user.isAdmin ? (
                                <span className="inline-flex items-center gap-2 border border-emerald-100 bg-emerald-50 px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-emerald-700">
                                  <ShieldCheck size={14} /> Admin
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-2 border border-gray-200 bg-gray-100 px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                                  <XCircle size={14} /> Customer
                                </span>
                              )}
                            </td>
                            <td className="space-x-3 px-6 py-5 text-right">
                              <Link
                                to={`/admin/user/${user._id}/edit`}
                                className="inline-flex h-9 w-9 items-center justify-center bg-gray-100 text-gray-600 transition hover:bg-pink-100 hover:text-pink-700"
                                aria-label="Edit user"
                              >
                                <Edit size={16} />
                              </Link>
                              <button
                                type="button"
                                onClick={() => deleteHandler(user._id)}
                                className="inline-flex h-9 w-9 items-center justify-center bg-red-50 text-red-600 transition hover:bg-red-100 hover:text-red-800"
                                aria-label="Delete user"
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
};

export default UserListScreen;
