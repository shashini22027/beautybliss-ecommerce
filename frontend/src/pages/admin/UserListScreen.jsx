import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Users, Edit, Trash2, CheckCircle, XCircle, ArrowLeft } from "lucide-react";
import api from "../../services/api";

const UserListScreen = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchUsers = async () => {
        try {
            setLoading(true);
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
        <div className="max-w-7xl mx-auto px-6 py-16">
            <Link
                to="/admin/dashboard"
                className="inline-flex items-center gap-3 px-5 py-2.5 bg-white border border-stone-200 rounded-full text-[10px] uppercase tracking-[0.2em] font-black text-stone-500 hover:text-stone-900 hover:bg-stone-50 hover:shadow-lg hover:shadow-stone-200/50 transition-all mb-10 group"
            >
                <div className="w-6 h-6 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-500 group-hover:scale-110 transition-transform">
                    <ArrowLeft size={12} strokeWidth={3} />
                </div>
                <span>Back to Dashboard</span>
            </Link>

            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-4xl font-serif font-bold text-stone-900 flex items-center gap-3">
                        <Users size={32} className="text-pink-500" />
                        Customers
                    </h1>
                    <p className="text-stone-500 uppercase tracking-widest text-[10px] font-bold mt-2">Manage customer accounts and permissions</p>
                </div>
            </div>

            {loading ? (
                <div className="py-20 text-center animate-pulse tracking-widest uppercase text-stone-400">Loading customers...</div>
            ) : error ? (
                <div className="py-20 text-center text-red-500 font-medium">{error}</div>
            ) : (
                <div className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-stone-50 border-b border-stone-200">
                                    <th className="px-6 py-5 text-[10px] uppercase tracking-[0.2em] font-bold text-stone-500">User ID</th>
                                    <th className="px-6 py-5 text-[10px] uppercase tracking-[0.2em] font-bold text-stone-500">Name</th>
                                    <th className="px-6 py-5 text-[10px] uppercase tracking-[0.2em] font-bold text-stone-500">Email</th>
                                    <th className="px-6 py-5 text-[10px] uppercase tracking-[0.2em] font-bold text-stone-500">Admin</th>
                                    <th className="px-6 py-5 text-[10px] uppercase tracking-[0.2em] font-bold text-stone-500 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100">
                                {users.map((user) => (
                                    <tr key={user._id} className="hover:bg-stone-50/50 transition-colors group">
                                        <td className="px-6 py-5 font-mono text-[10px] text-stone-400">{user._id.substring(0, 10)}...</td>
                                        <td className="px-6 py-5 text-sm font-medium text-stone-700">{user.name}</td>
                                        <td className="px-6 py-5 text-sm text-stone-500">
                                            <a href={`mailto:${user.email}`} className="hover:text-black transition-colors">{user.email}</a>
                                        </td>
                                        <td className="px-6 py-5">
                                            {user.isAdmin ? (
                                                <CheckCircle size={18} className="text-green-500" />
                                            ) : (
                                                <XCircle size={18} className="text-stone-300" />
                                            )}
                                        </td>
                                        <td className="px-6 py-5 text-right space-x-3">
                                            <Link
                                                to={`/admin/user/${user._id}/edit`}
                                                className="inline-flex items-center justify-center p-2 bg-stone-100 text-stone-600 rounded-lg hover:bg-stone-200 hover:text-black transition-colors"
                                            >
                                                <Edit size={16} />
                                            </Link>
                                            <button
                                                onClick={() => deleteHandler(user._id)}
                                                className="inline-flex items-center justify-center p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 hover:text-red-800 transition-colors"
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
    );
};

export default UserListScreen;
