import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Edit,
  ShieldCheck,
  Trash2,
  Users,
  XCircle,
} from "lucide-react";
import api from "../../services/api";

const UserListScreen = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  return (
    <main className="min-h-screen bg-[#fff7f8] px-4 py-10 text-gray-950 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-7xl">
        <Link
          to="/admin/dashboard"
          className="mb-8 inline-flex items-center gap-3 rounded-full border border-pink-200 bg-white px-5 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 shadow-sm transition hover:border-pink-300 hover:text-gray-950"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-pink-100 text-pink-600">
            <ArrowLeft size={12} strokeWidth={3} />
          </span>
          Back to Dashboard
        </Link>

        <div className="mb-8 rounded-2xl border border-pink-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-pink-500">
                Admin Customers
              </p>
              <h1 className="flex items-center gap-3 font-serif text-4xl font-bold tracking-tight text-gray-950 sm:text-5xl">
                <Users size={34} className="text-pink-500" />
                Customers
              </h1>
              <p className="mt-3 text-sm font-medium leading-6 text-gray-500">
                Manage customer accounts, administrator access, and user records.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              {[
                ["Total", stats.total],
                ["Admins", stats.admins],
                ["Customers", stats.customers],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl bg-[#fff0f4] px-5 py-4">
                  <p className="text-2xl font-bold text-gray-950">{value}</p>
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-pink-200 bg-white py-20 text-center text-sm font-bold uppercase tracking-widest text-gray-400 shadow-sm">
            Loading customers...
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-100 bg-red-50 px-6 py-5 text-sm font-medium text-red-700">
            {error}
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-pink-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-pink-100 bg-[#fff0f4]">
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
                <tbody className="divide-y divide-pink-100">
                  {users.map((user) => (
                    <tr key={user._id} className="transition hover:bg-[#fff7f8]">
                      <td className="px-6 py-5 font-mono text-[10px] text-gray-400">
                        {user._id?.substring(0, 10)}...
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
                          <span className="inline-flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-emerald-700">
                            <ShieldCheck size={14} /> Admin
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                            <XCircle size={14} /> Customer
                          </span>
                        )}
                      </td>
                      <td className="space-x-3 px-6 py-5 text-right">
                        <Link
                          to={`/admin/user/${user._id}/edit`}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-600 transition hover:bg-pink-100 hover:text-pink-700"
                          aria-label="Edit user"
                        >
                          <Edit size={16} />
                        </Link>
                        <button
                          type="button"
                          onClick={() => deleteHandler(user._id)}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-600 transition hover:bg-red-100 hover:text-red-800"
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
      </section>
    </main>
  );
};

export default UserListScreen;
