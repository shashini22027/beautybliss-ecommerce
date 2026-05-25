import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Icon = ({ name, className = "w-5 h-5" }) => {
    const paths = {
        bag: "M6 8h12l-1 13H7L6 8zm3 0a3 3 0 0 1 6 0",
        trash: "M3 6h18M8 6V4h8v2m-9 0 1 15h8l1-15M10 11v6M14 11v6",
        minus: "M5 12h14",
        plus: "M12 5v14M5 12h14",
        arrow: "M5 12h14m-6-6 6 6-6 6",
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

const getCartItems = () => {
    try {
        return JSON.parse(localStorage.getItem("cartItems")) || [];
    } catch {
        return [];
    }
};

const getItemId = (item) => item._id || item.id || item.product || item.productId;
const getItemQty = (item) => Number(item.qty || item.quantity || 1);
const getItemPrice = (item) => Number(item.price || 0);

const CartPage = () => {
    const [cartItems, setCartItems] = useState(getCartItems);
    const navigate = useNavigate();

    const saveCart = (items) => {
        setCartItems(items);
        localStorage.setItem("cartItems", JSON.stringify(items));
    };

    const updateQuantity = (item, nextQty) => {
        const qty = Math.max(1, nextQty);
        const id = getItemId(item);
        const updatedItems = cartItems.map((cartItem) =>
            getItemId(cartItem) === id
                ? { ...cartItem, qty, quantity: qty }
                : cartItem
        );

        saveCart(updatedItems);
    };

    const removeItem = (item) => {
        const id = getItemId(item);
        saveCart(cartItems.filter((cartItem) => getItemId(cartItem) !== id));
    };

    const subtotal = useMemo(
        () =>
            cartItems.reduce(
                (total, item) => total + getItemPrice(item) * getItemQty(item),
                0
            ),
        [cartItems]
    );

    const shipping = subtotal > 0 && subtotal < 75 ? 6.99 : 0;
    const total = subtotal + shipping;

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
                            BeautyBliss Bag
                        </p>
                        <h1 className="text-4xl font-serif font-bold tracking-tight text-gray-950 sm:text-5xl">
                            Your Cart
                        </h1>
                        <p className="mt-3 text-sm leading-6 text-gray-500">
                            Review your beauty picks before checkout.
                        </p>
                    </div>

                    <Link
                        to="/products"
                        className="inline-flex h-12 items-center justify-center gap-3 rounded-lg bg-gray-950 px-5 text-sm font-bold uppercase tracking-[0.16em] text-white transition hover:bg-pink-600"
                    >
                        Continue Shopping
                        <Icon name="arrow" className="h-5 w-5" />
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
                            Add skincare, makeup, or fragrance favorites to start building your BeautyBliss order.
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
                    <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
                        <div className="space-y-4">
                            {cartItems.map((item) => {
                                const id = getItemId(item);
                                const qty = getItemQty(item);

                                return (
                                    <article
                                        key={id || item.name}
                                        className="grid gap-4 rounded-lg border border-pink-200 bg-[#fff4f6]/90 p-4 shadow-sm sm:grid-cols-[112px_1fr_auto]"
                                    >
                                        <Link
                                            to={id ? `/product/${id}` : "/products"}
                                            className="aspect-square overflow-hidden rounded-lg bg-[#f3dfe6]"
                                        >
                                            <img
                                                src={
                                                    item.image ||
                                                    item.images?.[0] ||
                                                    "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80"
                                                }
                                                alt={item.name || "Beauty product"}
                                                className="h-full w-full object-cover"
                                            />
                                        </Link>

                                        <div className="min-w-0">
                                            <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-pink-500">
                                                {item.brand || item.category || "BeautyBliss"}
                                            </p>
                                            <Link to={id ? `/product/${id}` : "/products"}>
                                                <h2 className="text-lg font-bold leading-6 text-gray-950 hover:text-pink-600">
                                                    {item.name || "Beauty Essential"}
                                                </h2>
                                            </Link>
                                            <p className="mt-3 text-sm font-bold text-gray-950">
                                                ${getItemPrice(item).toFixed(2)}
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                                            <div className="flex h-10 items-center rounded-lg border border-pink-200 bg-[#fff7f8]">
                                                <button
                                                    type="button"
                                                    onClick={() => updateQuantity(item, qty - 1)}
                                                    className="flex h-10 w-10 items-center justify-center text-gray-500 transition hover:text-pink-600"
                                                    aria-label="Decrease quantity"
                                                >
                                                    <Icon name="minus" className="h-4 w-4" />
                                                </button>
                                                <span className="min-w-8 text-center text-sm font-bold">
                                                    {qty}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => updateQuantity(item, qty + 1)}
                                                    className="flex h-10 w-10 items-center justify-center text-gray-500 transition hover:text-pink-600"
                                                    aria-label="Increase quantity"
                                                >
                                                    <Icon name="plus" className="h-4 w-4" />
                                                </button>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => removeItem(item)}
                                                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-pink-200 text-gray-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                                                aria-label="Remove product"
                                            >
                                                <Icon name="trash" className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>

                        <aside className="h-fit rounded-lg border border-pink-200 bg-[#fff4f6]/90 p-6 shadow-sm">
                            <div className="mb-6 flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-pink-100 text-pink-600">
                                    <Icon name="sparkle" className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-pink-500">
                                        Summary
                                    </p>
                                    <h2 className="text-xl font-serif font-bold">
                                        Order Details
                                    </h2>
                                </div>
                            </div>

                            <div className="space-y-4 border-y border-pink-200 py-5 text-sm">
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
                            </div>

                            <div className="mt-5 flex items-center justify-between text-lg font-bold">
                                <span>Total</span>
                                <span>${total.toFixed(2)}</span>
                            </div>

                            <button
                                type="button"
                                onClick={() => navigate("/checkout")}
                                className="mt-6 inline-flex h-12 w-full items-center justify-center gap-3 rounded-lg bg-gray-950 px-5 text-sm font-bold uppercase tracking-[0.16em] text-white transition hover:bg-pink-600"
                            >
                                Checkout
                                <Icon name="arrow" className="h-5 w-5" />
                            </button>
                        </aside>
                    </div>
                )}
            </section>
        </main>
    );
};

export default CartPage;
