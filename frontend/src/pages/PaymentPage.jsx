import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { formatPrice } from "../utils/currency";

const PaymentPage = () => {
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [cardNumber, setCardNumber] = useState("");
    const [cardName, setCardName] = useState("");
    const [expiryDate, setExpiryDate] = useState("");
    const [cvv, setCvv] = useState("");
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        try {
            const pendingOrder = JSON.parse(localStorage.getItem("pendingPaymentOrder"));
            if (!pendingOrder) {
                navigate("/checkout");
                return;
            }
            setOrder(pendingOrder);
        } catch {
            navigate("/checkout");
        }
    }, [navigate]);

    const formatCardNumber = (value) => {
        const digits = value.replace(/\D/g, "").slice(0, 16);
        return digits.replace(/(.{4})/g, "$1 ").trim();
    };

    const formatExpiry = (value) => {
        const digits = value.replace(/\D/g, "").slice(0, 4);
        if (digits.length >= 3) {
            return `${digits.slice(0, 2)}/${digits.slice(2)}`;
        }
        return digits;
    };

    const validate = () => {
        const nextErrors = {};
        const rawCard = cardNumber.replace(/\s/g, "");

        if (!rawCard || rawCard.length < 13) nextErrors.cardNumber = "Enter a valid card number.";
        if (!cardName.trim()) nextErrors.cardName = "Cardholder name is required.";
        if (!expiryDate || expiryDate.length < 5) nextErrors.expiryDate = "Enter a valid expiry date (MM/YY).";
        if (!cvv || cvv.length < 3) nextErrors.cvv = "Enter a valid CVV.";

        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const handlePayment = () => {
        if (!validate()) return;

        setProcessing(true);

        setTimeout(() => {
            // Mark order as paid
            const updatedOrder = { ...order, isPaid: true, paidAt: new Date().toISOString() };

            // Save to checkout orders
            try {
                const savedOrders = JSON.parse(localStorage.getItem("checkoutOrders") || "[]");
                savedOrders.unshift(updatedOrder);
                localStorage.setItem("checkoutOrders", JSON.stringify(savedOrders));
            } catch {
                localStorage.setItem("checkoutOrders", JSON.stringify([updatedOrder]));
            }

            // Clear pending order and cart
            localStorage.removeItem("pendingPaymentOrder");
            localStorage.setItem("cartItems", JSON.stringify([]));
            localStorage.setItem("cart", JSON.stringify([]));

            setProcessing(false);
            navigate("/order-complete", { state: { order: updatedOrder } });
        }, 2000);
    };

    const getCardType = () => {
        const raw = cardNumber.replace(/\s/g, "");
        if (raw.startsWith("4")) return "visa";
        if (/^5[1-5]/.test(raw) || /^2[2-7]/.test(raw)) return "mastercard";
        if (raw.startsWith("3")) return "amex";
        return null;
    };

    const cardType = getCardType();

    if (!order) return null;

    return (
        <main className="min-h-screen bg-white text-gray-950">
            <section className="relative min-h-[420px] overflow-hidden">
                <img
                    src="/images/banner.jpg"
                    alt="Payment"
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
                        <span className="border-b-4 border-black pb-2">Payment</span>
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-[1460px] px-6 py-12">
                <div className="grid gap-20 lg:grid-cols-[1fr_0.85fr]">
                    {/* Payment Form */}
                    <section>
                        <h1 className="mb-8 text-3xl font-extrabold uppercase">Payment Details</h1>

                        <div className="mb-8 flex items-center gap-4">
                            <div className={`flex h-10 w-16 items-center justify-center rounded border-2 text-xs font-bold transition ${cardType === "visa" ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-400"}`}>
                                VISA
                            </div>
                            <div className={`flex h-10 w-16 items-center justify-center rounded border-2 text-xs font-bold transition ${cardType === "mastercard" ? "border-red-500 bg-red-50 text-red-600" : "border-gray-200 text-gray-400"}`}>
                                MC
                            </div>
                            <div className={`flex h-10 w-16 items-center justify-center rounded border-2 text-xs font-bold transition ${cardType === "amex" ? "border-green-500 bg-green-50 text-green-700" : "border-gray-200 text-gray-400"}`}>
                                AMEX
                            </div>
                        </div>

                        <form className="space-y-7" onSubmit={(e) => e.preventDefault()}>
                            <label className="block text-lg">
                                Card Number <span className="text-red-500">*</span>
                                <input
                                    value={cardNumber}
                                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                                    placeholder="1234 5678 9012 3456"
                                    maxLength={19}
                                    className={`mt-3 h-[52px] w-full border ${errors.cardNumber ? "border-red-400" : "border-gray-200"} px-4 outline-none focus:border-pink-300`}
                                />
                                {errors.cardNumber && <p className="mt-2 text-sm font-semibold text-red-600">{errors.cardNumber}</p>}
                            </label>

                            <label className="block text-lg">
                                Cardholder Name <span className="text-red-500">*</span>
                                <input
                                    value={cardName}
                                    onChange={(e) => setCardName(e.target.value)}
                                    placeholder="Name on card"
                                    className={`mt-3 h-[52px] w-full border ${errors.cardName ? "border-red-400" : "border-gray-200"} px-4 outline-none focus:border-pink-300`}
                                />
                                {errors.cardName && <p className="mt-2 text-sm font-semibold text-red-600">{errors.cardName}</p>}
                            </label>

                            <div className="grid gap-7 md:grid-cols-2">
                                <label className="block text-lg">
                                    Expiry Date <span className="text-red-500">*</span>
                                    <input
                                        value={expiryDate}
                                        onChange={(e) => setExpiryDate(formatExpiry(e.target.value))}
                                        placeholder="MM/YY"
                                        maxLength={5}
                                        className={`mt-3 h-[52px] w-full border ${errors.expiryDate ? "border-red-400" : "border-gray-200"} px-4 outline-none focus:border-pink-300`}
                                    />
                                    {errors.expiryDate && <p className="mt-2 text-sm font-semibold text-red-600">{errors.expiryDate}</p>}
                                </label>
                                <label className="block text-lg">
                                    CVV <span className="text-red-500">*</span>
                                    <input
                                        type="password"
                                        value={cvv}
                                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                                        placeholder="•••"
                                        maxLength={4}
                                        className={`mt-3 h-[52px] w-full border ${errors.cvv ? "border-red-400" : "border-gray-200"} px-4 outline-none focus:border-pink-300`}
                                    />
                                    {errors.cvv && <p className="mt-2 text-sm font-semibold text-red-600">{errors.cvv}</p>}
                                </label>
                            </div>

                            <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800">
                                <strong>🔒 Secure Payment:</strong> Your card details are encrypted and processed securely. We do not store your card information.
                            </div>
                        </form>
                    </section>

                    {/* Order Summary */}
                    <aside className="bg-[#f6f6f6] px-9 pb-10 pt-12">
                        <h2 className="mb-8 text-center text-3xl font-extrabold uppercase">Order Summary</h2>

                        <div className="rounded-xl bg-white px-8 py-7 shadow-sm">
                            <div className="grid grid-cols-[1fr_140px] border-b border-gray-200 pb-5 text-xl font-extrabold uppercase">
                                <span>Product</span>
                                <span className="text-right">Subtotal</span>
                            </div>

                            {order.orderItems.map((item) => (
                                <div key={item._id} className="border-b border-gray-200 py-5">
                                    <div className="grid grid-cols-[1fr_140px] gap-4">
                                        <p className="text-lg leading-6 text-gray-600">
                                            {item.name} <span className="text-gray-400">× {item.qty}</span>
                                        </p>
                                        <p className="text-right text-lg text-gray-600">{formatPrice(item.lineTotal)}</p>
                                    </div>
                                </div>
                            ))}

                            <div className="grid grid-cols-[1fr_140px] border-b border-gray-200 py-5 text-lg">
                                <span className="font-bold">Subtotal</span>
                                <span className="text-right">{formatPrice(order.subtotal)}</span>
                            </div>
                            <div className="grid grid-cols-[1fr_140px] border-b border-gray-200 py-5 text-lg">
                                <span className="font-bold">Shipping</span>
                                <span className="text-right">Free Shipping</span>
                            </div>
                            <div className="grid grid-cols-[1fr_140px] py-5 text-xl font-bold">
                                <span>Total</span>
                                <span className="text-right">{formatPrice(order.totalPrice)}</span>
                            </div>
                        </div>

                        <div className="mt-6 rounded-xl bg-white px-8 py-7 shadow-sm">
                            <h3 className="mb-4 text-lg font-extrabold">Billing Details</h3>
                            <div className="space-y-1 text-base text-gray-600">
                                <p className="font-semibold text-gray-950">{order.customer.name}</p>
                                <p>{order.customer.email}</p>
                                <p>{order.customer.phone}</p>
                            </div>

                            {order.shippingAddress && (
                                <>
                                    <h3 className="mb-4 mt-6 text-lg font-extrabold">Shipping Address</h3>
                                    <div className="space-y-1 text-base text-gray-600">
                                        <p className="font-semibold text-gray-950">{order.shippingAddress.fullName}</p>
                                        <p>{order.shippingAddress.address}</p>
                                        <p>{order.shippingAddress.city}{order.shippingAddress.district ? `, ${order.shippingAddress.district}` : ""}</p>
                                        <p>{order.shippingAddress.country}</p>
                                        <p>{order.shippingAddress.phone}</p>
                                    </div>
                                </>
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={handlePayment}
                            disabled={processing}
                            className="mt-7 h-[60px] w-full bg-[#2b2b2b] text-lg font-bold uppercase text-white transition hover:bg-pink-600 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {processing ? (
                                <span className="flex items-center justify-center gap-3">
                                    <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Processing Payment...
                                </span>
                            ) : (
                                `Pay ${formatPrice(order.totalPrice)}`
                            )}
                        </button>
                    </aside>
                </div>
            </section>
        </main>
    );
};

export default PaymentPage;
