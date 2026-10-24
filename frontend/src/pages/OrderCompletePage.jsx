import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { formatPrice } from "../utils/currency";
import API from "../services/api";

const OrderCompletePage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [order, setOrder] = useState(null);
    const [confirmationError, setConfirmationError] = useState("");

    useEffect(() => {
        const stateOrder = location.state?.order;
        const params = new URLSearchParams(location.search);
        const paymentIntentId = params.get("payment_intent");
        let pendingOrder = null;
        try { pendingOrder = JSON.parse(localStorage.getItem("pendingPaymentOrder") || "null"); } catch { pendingOrder = null; }
        if (paymentIntentId && pendingOrder?._id) {
            API.post("/payment/verify", { orderId: pendingOrder._id, paymentIntentId })
                .then(({ data }) => {
                    if (!data.isPaid) throw new Error("Payment confirmation is pending.");
                    setOrder(data);
                    localStorage.removeItem("pendingPaymentOrder");
                    localStorage.setItem("checkoutOrders", JSON.stringify([data, ...JSON.parse(localStorage.getItem("checkoutOrders") || "[]")]));
                })
                .catch((error) => setConfirmationError(error?.response?.data?.message || error.message || "We could not confirm the payment yet."));
        } else if (stateOrder?.isPaid || stateOrder?.paymentMethod === 'cod') {
            setOrder(stateOrder);
        } else {
            setConfirmationError("We could not confirm this order. Please check your order history or contact support.");
        }
    }, [location, navigate]);

    const retryPaymentConfirmation = async () => {
        try {
            const params = new URLSearchParams(location.search);
            const pendingOrder = JSON.parse(localStorage.getItem("pendingPaymentOrder") || "null");
            const { data } = await API.post("/payment/verify", { orderId: pendingOrder?._id, paymentIntentId: params.get("payment_intent") });
            if (!data.isPaid) throw new Error("Payment confirmation is still pending.");
            setOrder(data);
            setConfirmationError("");
            localStorage.removeItem("pendingPaymentOrder");
            localStorage.setItem("checkoutOrders", JSON.stringify([data, ...JSON.parse(localStorage.getItem("checkoutOrders") || "[]")]));
        } catch (error) {
            setConfirmationError(error?.response?.data?.message || error.message || "We could not confirm the payment yet.");
        }
    };

    if (!order) return <main className="mx-auto min-h-[50vh] max-w-2xl px-5 py-20 text-center">{confirmationError ? <div className="rounded border border-amber-200 bg-amber-50 p-6 text-amber-900">{confirmationError}<div className="mt-4 flex justify-center gap-4"><button type="button" onClick={retryPaymentConfirmation} className="font-semibold underline">Retry confirmation</button><Link to="/track-order" className="font-semibold underline">Track an order</Link></div></div> : <p className="text-gray-600" role="status">Confirming your order with the payment provider…</p>}</main>;

    return (
        <main className="min-h-screen bg-white text-gray-950">
            <section className="relative min-h-[420px] overflow-hidden">
                <img
                    src="/images/banner.jpg"
                    alt="Order complete"
                    className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-black/35" />
                <div className="relative z-10 mx-auto flex min-h-[420px] max-w-[1540px] items-center justify-center px-6 text-white">
                    <div className="flex flex-wrap items-center justify-center gap-4 text-3xl font-extrabold uppercase">
                        <span className="text-white/80">Shopping Cart</span>
                        <span className="text-white/80">→</span>
                        <span className="text-white/80">Checkout</span>
                        <span className="text-white/80">→</span>
                        <span className="border-b-4 border-black pb-2">Order Complete</span>
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-[900px] px-6 py-16">
                {/* Success Banner */}
                <div className="mb-10 flex items-center gap-4 rounded-lg bg-[#54a155] px-8 py-5 text-lg font-medium text-white shadow-sm">
                    <svg className="h-6 w-6 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Thank you. Your order has been received.
                </div>

                {/* Order Info Grid */}
                <div className="grid gap-6 border border-gray-200 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="border-b border-gray-200 px-6 py-5 sm:border-b-0 sm:border-r">
                        <p className="text-sm font-medium uppercase tracking-wider text-gray-400">Order Number</p>
                        <p className="mt-2 text-lg font-bold">
                            {order.orderNo || order.orderNumber || "C0052"}
                        </p>
                    </div>
                    <div className="border-b border-gray-200 px-6 py-5 sm:border-b-0 sm:border-r">
                        <p className="text-sm font-medium uppercase tracking-wider text-gray-400">Date</p>
                        <p className="mt-2 text-lg font-bold">
                            {new Date(order.createdAt).toLocaleDateString("en-GB", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                            })}
                        </p>
                    </div>
                    <div className="border-b border-gray-200 px-6 py-5 sm:border-b-0 sm:border-r">
                        <p className="text-sm font-medium uppercase tracking-wider text-gray-400">Total</p>
                        <p className="mt-2 text-lg font-bold">{formatPrice(order.totalPrice)}</p>
                    </div>
                    <div className="px-6 py-5">
                        <p className="text-sm font-medium uppercase tracking-wider text-gray-400">Payment Method</p>
                        <p className="mt-2 text-lg font-bold">
                            {order.paymentMethod === "card" ? "Card Payment" : "Cash on Delivery"}
                        </p>
                    </div>
                </div>

                {/* Order Details */}
                <div className="mt-12">
                    <h2 className="mb-6 text-2xl font-extrabold uppercase">Order Details</h2>

                    <div className="rounded-xl border border-gray-200 bg-white">
                        <div className="grid grid-cols-[1fr_140px] border-b border-gray-200 px-8 py-5 text-lg font-extrabold uppercase">
                            <span>Product</span>
                            <span className="text-right">Total</span>
                        </div>

                        {order.orderItems.map((item) => (
                            <div key={item._id} className="grid grid-cols-[1fr_140px] border-b border-gray-200 px-8 py-5">
                                <p className="text-lg text-gray-600">
                                    {item.name} <span className="text-gray-400">× {item.qty}</span>
                                </p>
                                <p className="text-right text-lg text-gray-600">{formatPrice(item.lineTotal)}</p>
                            </div>
                        ))}

                        <div className="grid grid-cols-[1fr_140px] border-b border-gray-200 px-8 py-5 text-lg">
                            <span className="font-bold">Subtotal</span>
                            <span className="text-right">{formatPrice(order.subtotal)}</span>
                        </div>
                        <div className="grid grid-cols-[1fr_140px] border-b border-gray-200 px-8 py-5 text-lg">
                            <span className="font-bold">Shipping</span>
                            <span className="text-right">Free Shipping</span>
                        </div>
                        <div className="grid grid-cols-[1fr_140px] border-b border-gray-200 px-8 py-5 text-lg">
                            <span className="font-bold">Payment Method</span>
                            <span className="text-right">
                                {order.paymentMethod === "card" ? "Card Payment" : "Cash on Delivery"}
                            </span>
                        </div>
                        <div className="grid grid-cols-[1fr_140px] px-8 py-5 text-xl font-bold">
                            <span>Total</span>
                            <span className="text-right">{formatPrice(order.totalPrice)}</span>
                        </div>
                    </div>
                </div>

                {/* Billing & Shipping */}
                <div className="mt-12 grid gap-12 lg:grid-cols-2">
                    <div>
                        <h2 className="mb-6 text-2xl font-extrabold uppercase">Billing Address</h2>
                        <div className="space-y-1 text-lg text-gray-600">
                            <p className="font-semibold text-gray-950">{order.customer.name}</p>
                            <p>{order.customer.email}</p>
                            <p>{order.customer.phone}</p>
                            <p>Sri Lanka</p>
                        </div>
                    </div>
                    {order.shippingAddress && (
                        <div>
                            <h2 className="mb-6 text-2xl font-extrabold uppercase">Shipping Address</h2>
                            <div className="space-y-1 text-lg text-gray-600">
                                <p className="font-semibold text-gray-950">{order.shippingAddress.fullName}</p>
                                <p>{order.shippingAddress.address}</p>
                                <p>
                                    {order.shippingAddress.city}
                                    {order.shippingAddress.district ? `, ${order.shippingAddress.district}` : ""}
                                </p>
                                <p>{order.shippingAddress.country}</p>
                                <p>{order.shippingAddress.phone}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* CTA */}
                <div className="mt-16 flex flex-wrap gap-4">
                    <Link
                        to="/orders"
                        className="flex h-[52px] items-center justify-center bg-[#2b2b2b] px-9 text-base font-extrabold uppercase text-white transition hover:bg-pink-600"
                    >
                        View Orders
                    </Link>
                    <Link
                        to="/products"
                        className="flex h-[52px] items-center justify-center border-2 border-gray-950 px-9 text-base font-extrabold uppercase text-gray-950 transition hover:bg-gray-950 hover:text-white"
                    >
                        Continue Shopping
                    </Link>
                </div>
            </section>
        </main>
    );
};

export default OrderCompletePage;
