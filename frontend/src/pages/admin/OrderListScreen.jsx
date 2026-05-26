import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  ShoppingBag,
  Truck,
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

const OrderListScreen = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-pink-500">
                Admin Orders
              </p>
              <h1 className="flex items-center gap-3 font-serif text-4xl font-bold tracking-tight text-gray-950 sm:text-5xl">
                <ShoppingBag size={34} className="text-pink-500" />
                Customer Orders
              </h1>
              <p className="mt-3 text-sm font-medium leading-6 text-gray-500">
                Monitor order payments, customer details, and delivery progress.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center sm:grid-cols-4">
              {[
                ["Orders", stats.total],
                ["Paid", stats.paid],
                ["Delivered", stats.delivered],
                ["Revenue", `$${stats.revenue.toFixed(0)}`],
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
            Loading orders...
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
                    {["Order", "Customer", "Date", "Total", "Payment", "Delivery"].map(
                      (head) => (
                        <th
                          key={head}
                          className="px-6 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500"
                        >
                          {head}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-pink-100">
                  {orders.map((order) => (
                    <tr key={order._id} className="transition hover:bg-[#fff7f8]">
                      <td className="px-6 py-5">
                        <Link
                          to={`/order/${order._id}`}
                          className="font-mono text-[11px] font-bold text-pink-600 transition hover:text-pink-800"
                        >
                          #{order._id?.substring(0, 12)}...
                        </Link>
                      </td>
                      <td className="px-6 py-5 text-sm font-bold text-gray-800">
                        {order.user?.name || "Customer"}
                      </td>
                      <td className="px-6 py-5 text-sm text-gray-500">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-6 py-5 text-sm font-bold text-gray-950">
                        ${Number(order.totalPrice || 0).toFixed(2)}
                      </td>
                      <td className="px-6 py-5">
                        {order.isPaid ? (
                          <span className="inline-flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-emerald-700">
                            <CheckCircle size={14} /> Paid
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-amber-700">
                            <Clock size={14} /> Pending
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-5">
                        {order.isDelivered ? (
                          <span className="inline-flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-emerald-700">
                            <CheckCircle size={14} /> Delivered
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-2 rounded-lg bg-pink-50 px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-pink-700">
                            <Truck size={14} /> Processing
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
      </section>
    </main>
  );
};

export default OrderListScreen;
