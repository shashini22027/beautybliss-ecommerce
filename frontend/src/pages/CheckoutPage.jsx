import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Icon = ({ name, className = "w-5 h-5" }) => {
    const paths = {
        user: "M20 21a8 8 0 0 0-16 0M12 13a5 5 0 1 0 0-10 5 5 0 0 0 0 10z",
        mail: "M4 6h16v12H4V6zm0 0 8 7 8-7",
        phone: "M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7l.5 2.8a2 2 0 0 1-.6 1.8L7.7 9.6a16 16 0 0 0 6.7 6.7l1.3-1.3a2 2 0 0 1 1.8-.6l2.8.5a2 2 0 0 1 1.7 2z",
        map: "M21 10c0 7-9 12-9 12S3 17 3 10a9 9 0 1 1 18 0zM12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
        card: "M3 6h18v12H3V6zm0 4h18",
        bag: "M6 8h12l-1 13H7L6 8zm3 0a3 3 0 0 1 6 0",
        arrow: "M5 12h14m-6-6 6 6-6 6",
        check: "M20 6 9 17l-5-5",
        sparkle: "M12 2l1.7 5.3L19 9l-5.3 1.7L12 16l-1.7-5.3L5 9l5.3-1.7L12 2z",
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

const getStoredJson = (key, fallback) => {
    try {
        return JSON.parse(localStorage.getItem(key)) || fallback;
    } catch {
        return fallback;
    }
};

const getItemId = (item) => item._id || item.id || item.product || item.productId;
const getItemQty = (item) => Number(item.qty || item.quantity || 1);
const getItemPrice = (item) => Number(item.price || 0);

const CheckoutPage = () => {
    const navigate = useNavigate();
    const userInfo = getStoredJson("userInfo", {});
    const [cartItems] = useState(() => getStoredJson("cartItems", []));
    const [fullName, setFullName] = useState(userInfo.name || "");
    const [email, setEmail] = useState(userInfo.email || "");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
    const [loading, setLoading] = useState(false);
    const [checkoutError, setCheckoutError] = useState("");

    const subtotal = useMemo(
        () =>
            cartItems.reduce(
                (total, item) => total + getItemPrice(item) * getItemQty(item),
                0
            ),
        [cartItems]
    );

    const shipping = subtotal > 0 && subtotal < 75 ? 6.99 : 0;
    const tax = subtotal * 0.05;
    const total = subtotal + shipping + tax;

    const placeOrderHandler = async (e) => {
        e.preventDefault();
        setCheckoutError("");

        if (cartItems.length === 0) {
            setCheckoutError("Your cart is empty");
            return;
        }

        setLoading(true);

        try {
            const orderPayload = {
                orderItems: cartItems.map((item) => ({
                    product: getItemId(item),
                    name: item.name,
                    image: item.image || item.images?.[0],
                    price: getItemPrice(item),
                    qty: getItemQty(item),
                })),
                shippingAddress: {
                    fullName,
                    email,
                    phone,
                    address,
                    city,
                    postalCode,
                },
                paymentMethod,
                itemsPrice: subtotal,
                shippingPrice: shipping,
                taxPrice: tax,
                totalPrice: total,
            };

            const res = await fetch("/api/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(userInfo?.token
                        ? { Authorization: `Bearer ${userInfo.token}` }
                        : {}),
                },
                body: JSON.stringify(orderPayload),
            });
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data?.message || "Unable to place order");
            }

            localStorage.removeItem("cartItems");
            navigate(data?._id ? `/order/${data._id}` : "/orders");
        } catch (err) {
            setCheckoutError(err.message || "Unable to place order");
        } finally {
            setLoading(false);
        }
    };

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
                            BeautyBliss Checkout
                        </p>
                        <h1 className="text-4xl font-serif font-bold tracking-tight text-gray-950 sm:text-5xl">
                            Checkout
                        </h1>
                        <p className="mt-3 text-sm leading-6 text-gray-500">
                            Confirm your details and complete your beauty order.
                        </p>
                    </div>

                    <Link
                        to="/cart"
                        className="inline-flex h-12 items-center justify-center gap-3 rounded-lg border border-pink-200 bg-[#fff4f6]/90 px-5 text-sm font-bold uppercase tracking-[0.16em] text-gray-700 transition hover:border-pink-300 hover:text-pink-600"
                    >
                        Back to Cart
                        <Icon name="bag" className="h-5 w-5" />
                    </Link>
                </div>

                {cartItems.length === 0 ? (
                    <div className="rounded-lg border border-pink-200 bg-[#fff4f6]/90 px-6 py-16 text-center shadow-sm">
                        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-lg bg-pink-100 text-pink-600">
                            <Icon name="bag" className="h-7 w-7" />
                        </div>
                        <h2 className="text-2xl font-serif font-bold text-gray-950">
                            Your cart is empty
                        </h2>
                        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-500">
                            Add your skincare and makeup favorites before checking out.
                        </p>
                        <Link
                            to="/products"
                            className="mt-7 inline-flex h-12 items-center justify-center gap-3 rounded-lg bg-gray-950 px-6 text-sm font-bold uppercase tracking-[0.16em] text-white transition hover:bg-pink-600"
                        >
                            Shop Products
                            <Icon name="arrow" className="h-5 w-5" />
                        </Link>
                    </div>
                ) : (
                    <form
                        onSubmit={placeOrderHandler}
                        className="grid gap-6 lg:grid-cols-[1fr_390px]"
                    >
                        <div className="space-y-6">
                            <section className="rounded-lg border border-pink-200 bg-[#fff4f6]/90 p-6 shadow-sm sm:p-8">
                                <div className="mb-7">
                                    <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-pink-500">
                                        Shipping Details
                                    </p>
                                    <h2 className="text-2xl font-serif font-bold text-gray-950">
                                        Where should we send it?
                                    </h2>
                                </div>

                                {checkoutError && (
                                    <div className="mb-6 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                                        {checkoutError}
                                    </div>
                                )}

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <label className="block">
                                        <span className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-gray-600">
                                            Full Name
                                        </span>
                                        <span className="relative block">
                                            <Icon
                                                name="user"
                                                className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
                                            />
                                            <input
                                                type="text"
                                                value={fullName}
                                                required
                                                onChange={(e) =>
                                                    setFullName(e.target.value)
                                                }
                                                className="h-12 w-full rounded-lg border border-pink-200 bg-[#fff7f8] pl-12 pr-4 text-sm font-medium text-gray-950 outline-none transition focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
                                            />
                                        </span>
                                    </label>

                                    <label className="block">
                                        <span className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-gray-600">
                                            Email
                                        </span>
                                        <span className="relative block">
                                            <Icon
                                                name="mail"
                                                className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
                                            />
                                            <input
                                                type="email"
                                                value={email}
                                                required
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="h-12 w-full rounded-lg border border-pink-200 bg-[#fff7f8] pl-12 pr-4 text-sm font-medium text-gray-950 outline-none transition focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
                                            />
                                        </span>
                                    </label>

                                    <label className="block">
                                        <span className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-gray-600">
                                            Phone
                                        </span>
                                        <span className="relative block">
                                            <Icon
                                                name="phone"
                                                className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
                                            />
                                            <input
                                                type="tel"
                                                value={phone}
                                                required
                                                onChange={(e) => setPhone(e.target.value)}
                                                className="h-12 w-full rounded-lg border border-pink-200 bg-[#fff7f8] pl-12 pr-4 text-sm font-medium text-gray-950 outline-none transition focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
                                            />
                                        </span>
                                    </label>

                                    <label className="block">
                                        <span className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-gray-600">
                                            City
                                        </span>
                                        <input
                                            type="text"
                                            value={city}
                                            required
                                            onChange={(e) => setCity(e.target.value)}
                                            className="h-12 w-full rounded-lg border border-pink-200 bg-[#fff7f8] px-4 text-sm font-medium text-gray-950 outline-none transition focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
                                        />
                                    </label>

                                    <label className="block sm:col-span-2">
                                        <span className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-gray-600">
                                            Address
                                        </span>
                                        <span className="relative block">
                                            <Icon
                                                name="map"
                                                className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
                                            />
                                            <input
                                                type="text"
                                                value={address}
                                                required
                                                onChange={(e) =>
                                                    setAddress(e.target.value)
                                                }
                                                className="h-12 w-full rounded-lg border border-pink-200 bg-[#fff7f8] pl-12 pr-4 text-sm font-medium text-gray-950 outline-none transition focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
                                            />
                                        </span>
                                    </label>

                                    <label className="block">
                                        <span className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-gray-600">
                                            Postal Code
                                        </span>
                                        <input
                                            type="text"
                                            value={postalCode}
                                            required
                                            onChange={(e) =>
                                                setPostalCode(e.target.value)
                                            }
                                            className="h-12 w-full rounded-lg border border-pink-200 bg-[#fff7f8] px-4 text-sm font-medium text-gray-950 outline-none transition focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
                                        />
                                    </label>
                                </div>
                            </section>

                            <section className="rounded-lg border border-pink-200 bg-[#fff4f6]/90 p-6 shadow-sm sm:p-8">
                                <div className="mb-5 flex items-center gap-3">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-pink-100 text-pink-600">
                                        <Icon name="card" className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-pink-500">
                                            Payment
                                        </p>
                                        <h2 className="text-xl font-serif font-bold">
                                            Choose payment method
                                        </h2>
                                    </div>
                                </div>

                                <div className="grid gap-3 sm:grid-cols-2">
                                    {["Cash on Delivery", "Card Payment"].map(
                                        (method) => (
                                            <label
                                                key={method}
                                                className={`flex cursor-pointer items-center justify-between rounded-lg border px-4 py-4 transition ${
                                                    paymentMethod === method
                                                        ? "border-pink-500 bg-pink-50 text-pink-700"
                                                        : "border-pink-200 bg-[#fff7f8] text-gray-600 hover:border-pink-300"
                                                }`}
                                            >
                                                <span className="text-sm font-bold">
                                                    {method}
                                                </span>
                                                <input
                                                    type="radio"
                                                    name="paymentMethod"
                                                    value={method}
                                                    checked={paymentMethod === method}
                                                    onChange={(e) =>
                                                        setPaymentMethod(e.target.value)
                                                    }
                                                    className="h-4 w-4 accent-pink-500"
                                                />
                                            </label>
                                        )
                                    )}
                                </div>
                            </section>
                        </div>

                        <aside className="h-fit rounded-lg border border-pink-200 bg-[#fff4f6]/90 p-6 shadow-sm">
                            <div className="mb-6 flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-pink-100 text-pink-600">
                                    <Icon name="sparkle" className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-pink-500">
                                        Order Summary
                                    </p>
                                    <h2 className="text-xl font-serif font-bold">
                                        Beauty Bag
                                    </h2>
                                </div>
                            </div>

                            <div className="max-h-72 space-y-4 overflow-auto pr-1">
                                {cartItems.map((item) => {
                                    const id = getItemId(item);
                                    const qty = getItemQty(item);

                                    return (
                                        <div key={id || item.name} className="flex gap-3">
                                            <div className="h-16 w-16 overflow-hidden rounded-lg bg-[#f3dfe6]">
                                                <img
                                                    src={
                                                        item.image ||
                                                        item.images?.[0] ||
                                                        "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80"
                                                    }
                                                    alt={item.name || "Beauty product"}
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="line-clamp-2 text-sm font-bold text-gray-950">
                                                    {item.name || "Beauty Essential"}
                                                </p>
                                                <p className="mt-1 text-xs font-medium text-gray-500">
                                                    Qty {qty}
                                                </p>
                                            </div>
                                            <p className="text-sm font-bold text-gray-950">
                                                ${(getItemPrice(item) * qty).toFixed(2)}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="mt-6 space-y-4 border-y border-pink-200 py-5 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Subtotal</span>
                                    <span className="font-bold">${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Shipping</span>
                                    <span className="font-bold">
                                        {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Tax</span>
                                    <span className="font-bold">${tax.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="mt-5 flex items-center justify-between text-lg font-bold">
                                <span>Total</span>
                                <span>${total.toFixed(2)}</span>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="mt-6 inline-flex h-12 w-full items-center justify-center gap-3 rounded-lg bg-gray-950 px-5 text-sm font-bold uppercase tracking-[0.16em] text-white transition hover:bg-pink-600 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading ? "Placing Order..." : "Place Order"}
                                <Icon name="check" className="h-5 w-5" />
                            </button>
                        </aside>
                    </form>
                )}
            </section>
        </main>
    );
};

export default CheckoutPage;
