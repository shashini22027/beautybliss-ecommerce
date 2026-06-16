import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { formatPrice } from "../utils/currency";
import API from "../services/api";

let stripePromise = null;

const getStripePromise = async () => {
    if (!stripePromise) {
        try {
            const { data } = await API.get("/payment/config");
            stripePromise = loadStripe(data.publishableKey);
        } catch {
            console.error("Failed to load Stripe config");
            throw new Error("Config load failed");
        }
    }
    return stripePromise;
};

/* ─── Checkout Form (inside Elements) ─── */
const StripeCheckoutForm = ({ order, onSuccess }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [processing, setProcessing] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) return;

        setProcessing(true);
        setErrorMessage("");

        // confirmPayment uses the PaymentElement's built-in validation
        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: window.location.origin + "/order-complete",
            },
            // We use 'if_required' so we can handle the success right here without a page reload 
            // for standard cards (most common scenario).
            redirect: "if_required",
        });

        if (error) {
            setErrorMessage(error.message);
            setProcessing(false);
        } else if (paymentIntent && paymentIntent.status === "succeeded") {
            onSuccess(paymentIntent.id);
        } else {
            setErrorMessage("Payment failed. Please try again.");
            setProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <PaymentElement 
                id="payment-element" 
                options={{
                    layout: "tabs", // Creates the modern tabbed layout
                }}
            />
            
            {errorMessage && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-600">
                    <div className="flex items-center gap-2">
                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errorMessage}
                    </div>
                </div>
            )}
            
            <button
                type="submit"
                disabled={!stripe || processing}
                className="mt-6 flex h-[54px] w-full items-center justify-center gap-2 rounded bg-[#1f2937] text-[15px] font-bold uppercase tracking-wider text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
            >
                {processing ? (
                    <>
                        <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Processing...
                    </>
                ) : (
                    <>
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        Pay {formatPrice(order.totalPrice)}
                    </>
                )}
            </button>
        </form>
    );
};

/* ─── Main Payment Page ─── */
const PaymentPage = () => {
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [stripe, setStripe] = useState(null);
    const [clientSecret, setClientSecret] = useState("");
    const [loadError, setLoadError] = useState("");

    useEffect(() => {
        // Load pending order
        let pendingOrder;
        try {
            pendingOrder = JSON.parse(localStorage.getItem("pendingPaymentOrder"));
            if (!pendingOrder) {
                navigate("/checkout");
                return;
            }
            setOrder(pendingOrder);
        } catch {
            navigate("/checkout");
            return;
        }

        // Initialize Stripe and create PaymentIntent
        const initializePayment = async () => {
            try {
                // 1. Get stripe promise
                const sp = await getStripePromise();
                setStripe(sp);

                // 2. Create Payment Intent
                const { data } = await API.post("/payment/create-payment-intent", {
                    amount: pendingOrder.totalPrice,
                    currency: "lkr",
                    metadata: {
                        orderId: pendingOrder._id,
                        orderNo: pendingOrder.orderNo,
                        customerEmail: pendingOrder.customer?.email || "",
                    },
                });

                setClientSecret(data.clientSecret);
            } catch (err) {
                console.error(err);
                setLoadError("Failed to initialize payment. Please refresh the page and try again.");
            }
        };

        initializePayment();
    }, [navigate]);

    const handlePaymentSuccess = async (paymentIntentId) => {
        const updatedOrder = {
            ...order,
            isPaid: true,
            paidAt: new Date().toISOString(),
            paymentResult: {
                id: paymentIntentId,
                status: "succeeded",
                provider: "stripe",
            },
        };

        try {
            // Remove the temporary _id from frontend so backend generates a real one
            const { _id, ...orderPayload } = updatedOrder;
            const { data } = await API.post("/orders", orderPayload);

            // Save to checkout orders
            try {
                const savedOrders = JSON.parse(localStorage.getItem("checkoutOrders") || "[]");
                savedOrders.unshift(data);
                localStorage.setItem("checkoutOrders", JSON.stringify(savedOrders));
            } catch {
                localStorage.setItem("checkoutOrders", JSON.stringify([data]));
            }

            // Clear pending order and cart
            localStorage.removeItem("pendingPaymentOrder");
            localStorage.setItem("cartItems", JSON.stringify([]));
            localStorage.setItem("cart", JSON.stringify([]));

            navigate("/order-complete", { state: { order: data } });
        } catch (error) {
            console.error("Failed to save order to backend:", error);
            // Fallback: still navigate to complete page but maybe show error or just use updatedOrder
            navigate("/order-complete", { state: { order: updatedOrder } });
        }
    };

    if (!order) return null;

    // Optional customization for the Elements provider
    const appearance = {
        theme: 'stripe',
        variables: {
            colorPrimary: '#000000',
            colorBackground: '#ffffff',
            colorText: '#30313d',
            colorDanger: '#df1b41',
            fontFamily: 'Inter, system-ui, sans-serif',
            spacingUnit: '4px',
            borderRadius: '6px',
        },
    };

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

            <section className="mx-auto max-w-[1200px] px-6 py-16">
                <div className="grid gap-16 lg:grid-cols-2">
                    {/* Left: Payment Form */}
                    <section>
                        <h1 className="mb-2 text-3xl font-extrabold uppercase">Payment Details</h1>
                        <p className="mb-8 text-gray-500">Pay securely with your credit or debit card</p>

                        {loadError ? (
                            <div className="rounded-lg border border-red-200 bg-red-50 px-6 py-5 text-red-700">
                                <strong>Error:</strong> {loadError}
                            </div>
                        ) : (!stripe || !clientSecret) ? (
                            <div className="flex flex-col items-center justify-center py-20">
                                <svg className="h-10 w-10 animate-spin text-gray-400" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                <p className="mt-4 text-sm text-gray-500 font-medium">Loading secure checkout...</p>
                            </div>
                        ) : (
                            <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                                <Elements stripe={stripe} options={{ clientSecret, appearance }}>
                                    <StripeCheckoutForm order={order} onSuccess={handlePaymentSuccess} />
                                </Elements>
                            </div>
                        )}
                    </section>

                    {/* Right: Order Summary */}
                    <aside className="lg:pl-8">
                        <div className="rounded-xl bg-[#f8f9fa] px-8 py-8">
                            <h2 className="mb-6 text-2xl font-extrabold uppercase tracking-tight">Order Summary</h2>

                            <div className="grid grid-cols-[1fr_auto] border-b border-gray-200 pb-4 text-sm font-bold uppercase tracking-wider text-gray-500">
                                <span>Product</span>
                                <span>Subtotal</span>
                            </div>

                            <div className="py-2">
                                {order.orderItems.map((item) => (
                                    <div key={item._id} className="border-b border-gray-100 py-4">
                                        <div className="grid grid-cols-[1fr_auto] gap-4">
                                            <div>
                                                <p className="text-base text-gray-700">
                                                    {item.name} <span className="text-gray-400">× {item.qty}</span>
                                                </p>
                                                {item.color && <p className="mt-1 text-sm text-gray-500">Color: {item.color}</p>}
                                            </div>
                                            <p className="text-base font-medium text-gray-900">{formatPrice(item.lineTotal)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4 space-y-3 text-base">
                                <div className="flex justify-between">
                                    <span className="font-semibold text-gray-600">Subtotal</span>
                                    <span className="font-medium">{formatPrice(order.subtotal)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-semibold text-gray-600">Shipping</span>
                                    <span className="font-medium">Free Shipping</span>
                                </div>
                                <div className="mt-4 flex justify-between border-t border-gray-200 pt-4 text-xl font-extrabold">
                                    <span>Total</span>
                                    <span>{formatPrice(order.totalPrice)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 rounded-xl border border-gray-100 bg-white px-8 py-6 shadow-sm">
                            <h3 className="mb-3 text-base font-extrabold uppercase tracking-tight text-gray-900">Billing Information</h3>
                            <div className="space-y-1 text-sm text-gray-600">
                                <p className="font-medium text-gray-900">{order.customer.name}</p>
                                <p>{order.customer.email}</p>
                            </div>

                            {order.shippingAddress && (
                                <>
                                    <h3 className="mb-3 mt-6 text-base font-extrabold uppercase tracking-tight text-gray-900">Shipping Address</h3>
                                    <div className="space-y-1 text-sm text-gray-600">
                                        <p className="font-medium text-gray-900">{order.shippingAddress.fullName}</p>
                                        <p>{order.shippingAddress.address}, {order.shippingAddress.city}</p>
                                    </div>
                                </>
                            )}
                        </div>
                    </aside>
                </div>
            </section>
        </main>
    );
};

export default PaymentPage;
