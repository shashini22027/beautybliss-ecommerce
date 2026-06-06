import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { formatPrice, parsePrice } from "../utils/currency";

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

const getOrderNumber = (order, index) => {
    if (order.orderNo || order.orderNumber) {
        return String(order.orderNo || order.orderNumber).toUpperCase();
    }

    return `C${String(52 + index).padStart(4, "0")}`;
};

const getOrderItems = (order) => {
    if (Array.isArray(order.orderItems) && order.orderItems.length) return order.orderItems;
    if (Array.isArray(order.items) && order.items.length) return order.items;
    return [
        {
            name: "BeautyBliss order",
            qty: 1,
            price: Number(order.totalPrice || order.total || order.amount || 0),
            image: "",
        },
    ];
};

const getItemQty = (item) => Number(item.qty || item.quantity || 1);

const getItemPrice = (item) => {
    return parsePrice(item.price);
};

const getItemLineTotal = (item) => {
    if (typeof item.lineTotal === "number") return item.lineTotal;
    return getItemPrice(item) * getItemQty(item);
};

const getItemImage = (item) => item.image || item.images?.[0] || item.product?.image || item.product?.images?.[0] || "";

const getOrderTotal = (order) => {
    const orderItems = getOrderItems(order);
    const itemsTotal = orderItems.reduce((total, item) => total + getItemLineTotal(item), 0);

    return itemsTotal || Number(order.totalPrice || order.total || order.amount || 0);
};

const getCheckoutOrders = () => {
    try {
        const orders = JSON.parse(localStorage.getItem("checkoutOrders") || "[]");
        return Array.isArray(orders) ? orders : [];
    } catch {
        return [];
    }
};

const OrdersPage = () => {
    const [orders, setOrders] = useState(getCheckoutOrders);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadOrders = async () => {
            const checkoutOrders = getCheckoutOrders();

            if (checkoutOrders.length) {
                setOrders(checkoutOrders);
                setLoading(false);
                return;
            }

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
        <main className="min-h-screen bg-white text-gray-950">
            <section className="relative min-h-[420px] overflow-hidden">
                <img
                    src="/images/banner.jpg"
                    alt="Beauty order history"
                    className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-black/35" />
                <div className="relative z-10 mx-auto flex min-h-[420px] max-w-[1540px] items-center justify-center px-6 text-white">
                    <div className="flex flex-wrap items-center justify-center gap-4 text-3xl font-extrabold uppercase">
                        <Link to="/cart" className="text-white/80 transition hover:text-white">
                            Shopping Cart
                        </Link>
                        <span className="text-white/80">→</span>
                        <Link to="/checkout" className="text-white/80 transition hover:text-white">
                            Checkout
                        </Link>
                        <span className="text-white/80">→</span>
                        <span className="border-b-4 border-black pb-2">Order Complete</span>
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-[1460px] px-6 py-12">
                <div className="mb-8 flex flex-col gap-5 border-b border-gray-200 pb-6 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <h1 className="text-3xl font-extrabold uppercase">My Orders</h1>
                        <p className="mt-3 text-lg leading-7 text-gray-600">
                            Track your purchases, payment status, and delivery progress.
                        </p>
                    </div>

                    <Link
                        to="/products"
                        className="inline-flex h-12 items-center justify-center gap-3 bg-[#2b2b2b] px-6 text-sm font-bold uppercase text-white transition hover:bg-pink-600"
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
                                className="h-28 animate-pulse border border-gray-200 bg-[#f6f6f6]"
                            />
                        ))}
                    </div>
                ) : error ? (
                    <div className="border border-red-100 bg-red-50 px-5 py-4 text-base font-medium text-red-700">
                        {error}
                    </div>
                ) : orders.length === 0 ? (
                    <div className="bg-[#f6f6f6] px-6 py-16 text-center">
                        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center bg-white text-pink-600 shadow-sm">
                            <Icon name="receipt" className="h-7 w-7" />
                        </div>
                        <h2 className="text-3xl font-extrabold uppercase text-gray-950">
                            No orders yet
                        </h2>
                        <p className="mx-auto mt-3 max-w-md text-lg leading-7 text-gray-600">
                            Your BeautyBliss orders will appear here after checkout.
                        </p>
                        <Link
                            to="/products"
                            className="mt-7 inline-flex h-12 items-center justify-center gap-3 bg-[#2b2b2b] px-6 text-sm font-bold uppercase text-white transition hover:bg-pink-600"
                        >
                            Start Shopping
                            <Icon name="arrow" className="h-5 w-5" />
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-10">
                        {orders.map((order, index) => {
                                const id = order._id || order.id;
                                const orderNumber = getOrderNumber(order, index);
                                const orderItems = getOrderItems(order);
                                const isPaid = Boolean(order.isPaid || order.paidAt);
                                const isDelivered = Boolean(
                                    order.isDelivered || order.deliveredAt
                                );
                                const total = getOrderTotal(order);

                                return (
                                    <article key={id || orderNumber} className="bg-white">
                                        <div className="flex flex-col gap-5 border-b border-[#e5e5e5] bg-[#f6f6f6] px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
                                            <div>
                                                <p className="text-[21px] font-extrabold uppercase leading-none text-gray-950">
                                                    Order ID: {orderNumber}
                                                </p>
                                                <p className="mt-3 text-base font-medium text-gray-500">
                                                    {formatDate(order.createdAt)}
                                                    {order.customer?.name ? ` • ${order.customer.name}` : ""}
                                                </p>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-3">
                                                <span
                                                    className={`inline-flex h-10 items-center gap-2 border px-4 text-xs font-extrabold uppercase tracking-[0.08em] ${
                                                        isPaid
                                                            ? "border-emerald-200 bg-white text-emerald-700"
                                                            : "border-[#f0c36d] bg-white text-[#9a6500]"
                                                    }`}
                                                >
                                                    <span
                                                        className={`h-2 w-2 rounded-full ${
                                                            isPaid ? "bg-emerald-500" : "bg-[#d88a00]"
                                                        }`}
                                                    />
                                                    {isPaid ? "Paid" : "Pending"}
                                                </span>
                                                <span
                                                    className={`inline-flex h-10 items-center gap-2 border px-4 text-xs font-extrabold uppercase tracking-[0.08em] ${
                                                        isDelivered
                                                            ? "border-emerald-200 bg-white text-emerald-700"
                                                            : "border-pink-200 bg-white text-pink-700"
                                                    }`}
                                                >
                                                    <span
                                                        className={`h-2 w-2 rounded-full ${
                                                            isDelivered ? "bg-emerald-500" : "bg-pink-500"
                                                        }`}
                                                    />
                                                    {isDelivered ? "Delivered" : "Processing"}
                                                </span>
                                                <Link
                                                    to={id ? `/order/${id}` : "#"}
                                                    className="inline-flex h-10 items-center justify-center gap-2 bg-[#2b2b2b] px-4 text-xs font-bold uppercase text-white transition hover:bg-pink-600"
                                                >
                                                    View
                                                    <Icon name="arrow" className="h-4 w-4" />
                                                </Link>
                                            </div>
                                        </div>

                                        <div className="bg-[#f6f6f6] px-6 pb-7 pt-6">
                                            <div className="bg-white px-8 py-7 shadow-sm">
                                            <div className="grid grid-cols-[1fr_140px] border-b border-gray-200 pb-5 text-xl font-extrabold uppercase">
                                                <span>Product</span>
                                                <span className="text-right">Subtotal</span>
                                            </div>

                                            {orderItems.map((item, itemIndex) => {
                                                const qty = getItemQty(item);
                                                const price = getItemPrice(item);
                                                const lineTotal = getItemLineTotal(item);
                                                const productId = item.product?._id || item.product || item._id || item.id;
                                                const image = getItemImage(item);

                                                return (
                                                    <div
                                                        key={`${id || orderNumber}-${item.name || "item"}-${itemIndex}`}
                                                        className="grid gap-5 border-b border-gray-200 py-5 sm:grid-cols-[1fr_140px] sm:items-center"
                                                    >
                                                        <div className="grid grid-cols-[78px_1fr] items-center gap-5">
                                                            <Link to={productId ? `/product/${productId}` : "#"} state={{ product: item }} className="flex h-[78px] w-[78px] items-center justify-center bg-white">
                                                                {image ? (
                                                                    <img src={image} alt={item.name || "Order item"} className="h-full w-full object-contain" />
                                                                ) : (
                                                                    <div className="flex h-full w-full items-center justify-center bg-[#f6f6f6] text-pink-600">
                                                                        <Icon name="bag" className="h-7 w-7" />
                                                                    </div>
                                                                )}
                                                            </Link>
                                                            <div>
                                                                <Link
                                                                    to={productId ? `/product/${productId}` : "#"}
                                                                    state={{ product: item }}
                                                                    className="text-[18px] font-bold leading-6 text-gray-950 hover:text-pink-600"
                                                                >
                                                                    {item.name || "BeautyBliss order item"}
                                                                </Link>
                                                                <p className="mt-2 text-base text-gray-500">
                                                                    {formatPrice(price)} <span className="text-gray-400">x</span> Qty: {qty}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <span className="text-[18px] font-bold sm:text-right">
                                                            {formatPrice(lineTotal)}
                                                        </span>
                                                    </div>
                                                );
                                            })}

                                            <div className="flex justify-end py-5 text-[20px] font-bold">
                                                <span className="mr-8">Total</span>
                                                <span>{formatPrice(total)}</span>
                                            </div>
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                    </div>
                )}
            </section>
        </main>
    );
};

export default OrdersPage;
