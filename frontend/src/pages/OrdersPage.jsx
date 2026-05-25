import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Icon = ({ name, className = "w-5 h-5" }) => {
    const paths = {
        receipt: "M7 3h10v18l-2-1-2 1-2-1-2 1-2-1V3zM9 7h6M9 11h6M9 15h4",
        arrow: "M5 12h14m-6-6 6 6-6 6",
        check: "M20 6 9 17l-5-5",
        clock: "M12 8v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z",
        bag: "M6 8h12l-1 13H7L6 8zm3 0a3 3 0 0 1 6 0",
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

const formatDate = (date) => {
    if (!date) {
        return "Pending";
    }

    return new Date(date).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadOrders = async () => {
            try {
                const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};
                const token = userInfo.token;
                const res = await fetch("/api/orders/myorders", {
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                });
                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data?.message || "Unable to load orders");
                }

                setOrders(Array.isArray(data) ? data : data.orders || []);
            } catch (err) {
                setError(err.message || "Unable to load orders");
            } finally {
                setLoading(false);
            }
        };

        loadOrders();
    }, []);

    return (
        <main
            className="min-h-screen px-4 py-8 text-gray-950 sm:px-6 lg:px-8"
            style={{
                background:
                    "linear-gradient(135deg, #fff1f4 0%, #faf0ea 48%, #f8e7ee 100%)",
            }}
        >
            <section className="mx-auto max-w-7xl">
                <div className="mb-8 flex flex-col gap-5 border-b border-pink-200/70 pb-6 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="mb-3 text-xs font-bold uppercase tracking-[0.28em] text-pink-500">
                            BeautyBliss Orders
                        </p>
                        <h1 className="text-4xl font-serif font-bold tracking-tight text-gray-950 sm:text-5xl">
                            My Orders
                        </h1>
                        <p className="mt-3 text-sm leading-6 text-gray-500">
                            Track your purchases, payment status, and delivery progress.
                        </p>
                    </div>

                    <Link
                        to="/products"
                        className="inline-flex h-12 items-center justify-center gap-3 rounded-lg bg-gray-950 px-5 text-sm font-bold uppercase tracking-[0.16em] text-white transition hover:bg-pink-600"
                    >
                        Shop More
                        <Icon name="arrow" className="h-5 w-5" />
                    </Link>
                </div>

                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map((item) => (
                            <div
                                key={item}
                                className="h-28 animate-pulse rounded-lg border border-pink-200 bg-[#fff4f6]/90"
                            />
                        ))}
                    </div>
                ) : error ? (
                    <div className="rounded-lg border border-red-100 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
                        {error}
                    </div>
                ) : orders.length === 0 ? (
                    <div className="rounded-lg border border-pink-200 bg-[#fff4f6]/90 px-6 py-16 text-center shadow-sm">
                        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-lg bg-pink-100 text-pink-600">
                            <Icon name="receipt" className="h-7 w-7" />
                        </div>
                        <h2 className="text-2xl font-serif font-bold text-gray-950">
                            No orders yet
                        </h2>
                        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-500">
                            Your BeautyBliss orders will appear here after checkout.
                        </p>
                        <Link
                            to="/products"
                            className="mt-7 inline-flex h-12 items-center justify-center gap-3 rounded-lg bg-gray-950 px-6 text-sm font-bold uppercase tracking-[0.16em] text-white transition hover:bg-pink-600"
                        >
                            Start Shopping
                            <Icon name="arrow" className="h-5 w-5" />
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-lg border border-pink-200 bg-[#fff4f6]/90 shadow-sm">
                        <div className="hidden grid-cols-[1.2fr_1fr_1fr_1fr_auto] gap-4 border-b border-pink-200 px-5 py-4 text-xs font-bold uppercase tracking-[0.16em] text-gray-500 lg:grid">
                            <span>Order</span>
                            <span>Date</span>
                            <span>Total</span>
                            <span>Status</span>
                            <span>Details</span>
                        </div>

                        <div className="divide-y divide-pink-200">
                            {orders.map((order) => {
                                const id = order._id || order.id;
                                const isPaid = Boolean(order.isPaid || order.paidAt);
                                const isDelivered = Boolean(
                                    order.isDelivered || order.deliveredAt
                                );
                                const total = Number(
                                    order.totalPrice || order.total || order.amount || 0
                                );

                                return (
                                    <article
                                        key={id}
                                        className="grid gap-4 px-5 py-5 lg:grid-cols-[1.2fr_1fr_1fr_1fr_auto] lg:items-center"
                                    >
                                        <div>
                                            <p className="text-xs font-bold uppercase tracking-[0.18em] text-pink-500">
                                                Order
                                            </p>
                                            <p className="mt-1 break-all text-sm font-bold text-gray-950">
                                                #{id}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-400 lg:hidden">
                                                Date
                                            </p>
                                            <p className="text-sm font-medium text-gray-600">
                                                {formatDate(order.createdAt)}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-400 lg:hidden">
                                                Total
                                            </p>
                                            <p className="text-sm font-bold text-gray-950">
                                                ${total.toFixed(2)}
                                            </p>
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            <span
                                                className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-[0.12em] ${
                                                    isPaid
                                                        ? "bg-emerald-50 text-emerald-700"
                                                        : "bg-amber-50 text-amber-700"
                                                }`}
                                            >
                                                <Icon
                                                    name={isPaid ? "check" : "clock"}
                                                    className="h-4 w-4"
                                                />
                                                {isPaid ? "Paid" : "Pending"}
                                            </span>
                                            <span
                                                className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-[0.12em] ${
                                                    isDelivered
                                                        ? "bg-emerald-50 text-emerald-700"
                                                        : "bg-pink-50 text-pink-700"
                                                }`}
                                            >
                                                <Icon
                                                    name={isDelivered ? "check" : "bag"}
                                                    className="h-4 w-4"
                                                />
                                                {isDelivered ? "Delivered" : "Processing"}
                                            </span>
                                        </div>

                                        <Link
                                            to={id ? `/order/${id}` : "#"}
                                            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-gray-950 px-4 text-xs font-bold uppercase tracking-[0.14em] text-white transition hover:bg-pink-600"
                                        >
                                            View
                                            <Icon name="arrow" className="h-4 w-4" />
                                        </Link>
                                    </article>
                                );
                            })}
                        </div>
                    </div>
                )}
            </section>
        </main>
    );
};

export default OrdersPage;
