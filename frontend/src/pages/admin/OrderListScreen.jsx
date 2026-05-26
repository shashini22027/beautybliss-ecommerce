import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, XCircle, CheckCircle, ArrowLeft } from "lucide-react";
import api from "../../services/api";

const OrderListScreen = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
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
                        <ShoppingBag size={32} className="text-pink-500" />
                        Customer Orders
                    </h1>
                    <p className="text-stone-500 uppercase tracking-widest text-[10px] font-bold mt-2">Manage and track all customer orders</p>
                </div>
            </div>

            {loading ? (
                <div className="py-20 text-center animate-pulse tracking-widest uppercase text-stone-400">Loading orders...</div>
            ) : error ? (
                <div className="py-20 text-center text-red-500 font-medium">{error}</div>
            ) : (
                <div className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-stone-50 border-b border-stone-200">
                                    <th className="px-6 py-5 text-[10px] uppercase tracking-[0.2em] font-bold text-stone-500">Order ID</th>
                                    <th className="px-6 py-5 text-[10px] uppercase tracking-[0.2em] font-bold text-stone-500">Customer</th>
                                    <th className="px-6 py-5 text-[10px] uppercase tracking-[0.2em] font-bold text-stone-500">Date</th>
                                    <th className="px-6 py-5 text-[10px] uppercase tracking-[0.2em] font-bold text-stone-500">Total Amount</th>
                                    <th className="px-6 py-5 text-[10px] uppercase tracking-[0.2em] font-bold text-stone-500">Payment</th>
                                    <th className="px-6 py-5 text-[10px] uppercase tracking-[0.2em] font-bold text-stone-500">Delivery</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100">
                                {orders.map((order) => (
                                    <tr key={order._id} className="hover:bg-stone-50/50 transition-colors group">
                                        <td className="px-6 py-5 font-mono text-[10px] text-stone-400">{order._id.substring(0, 10)}...</td>
                                        <td className="px-6 py-5 text-sm font-medium text-stone-700">{order.user && order.user.name}</td>
                                        <td className="px-6 py-5 text-sm text-stone-500">{order.createdAt.substring(0, 10)}</td>
                                        <td className="px-6 py-5 text-sm font-bold text-stone-900">${order.totalPrice}</td>
                                        <td className="px-6 py-5">
                                            {order.isPaid ? (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 text-green-700 text-[10px] font-bold uppercase tracking-widest">
                                                    <CheckCircle size={12} /> Paid
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 text-red-700 text-[10px] font-bold uppercase tracking-widest">
                                                    <XCircle size={12} /> Pending
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-5">
                                            {order.isDelivered ? (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 text-green-700 text-[10px] font-bold uppercase tracking-widest">
                                                    <CheckCircle size={12} /> Delivered
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold uppercase tracking-widest">
                                                    <XCircle size={12} /> In Transit
                                                </span>
                                            )}
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

export default OrderListScreen;
