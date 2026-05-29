import { useContext, useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";

const Icon = ({ name, className = "w-5 h-5" }) => {
    const paths = {
        bag: "M6 8h12l-1 13H7L6 8zm3 0a3 3 0 0 1 6 0",
        close: "M6 6l12 12M18 6 6 18",
        minus: "M5 12h14",
        plus: "M12 5v14M5 12h14",
        arrow: "M5 12h14m-6-6 6 6-6 6",
        heart: "M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z",
    };

    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d={paths[name]} />
        </svg>
    );
};

const getCartItems = () => {
    try {
        const storedCartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
        const storedCart = JSON.parse(localStorage.getItem("cart")) || [];

        if (Array.isArray(storedCartItems) && storedCartItems.length) return storedCartItems;
        if (Array.isArray(storedCartItems?.cartItems) && storedCartItems.cartItems.length) return storedCartItems.cartItems;
        if (Array.isArray(storedCart) && storedCart.length) return storedCart;
        if (Array.isArray(storedCart?.cartItems)) return storedCart.cartItems;
        return [];
    } catch {
        return [];
    }
};

const hasStoredCart = () =>
    localStorage.getItem("cartItems") !== null || localStorage.getItem("cart") !== null;

const getProductData = (item) => {
    if (item?.product && typeof item.product === "object") {
        return { ...item.product, qty: item.qty || item.quantity, quantity: item.quantity || item.qty };
    }
    return item || {};
};

const getSlug = (item) =>
    String(item.name || "product")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

const getItemId = (item) => {
    const product = getProductData(item);
    const productId = item?.product && typeof item.product !== "object" ? item.product : "";
    return product._id || product.id || item?._id || item?.id || productId || item?.productId || getSlug(product);
};

const getItemQty = (item) => Number(item.qty || item.quantity || 1);

const getItemPrice = (item) => {
    const product = getProductData(item);
    if (typeof product.price === "number") return product.price;
    const price = String(product.price || "0").replace(/From/gi, "").replace(/[^\d.]/g, "");
    return Number(price || 0);
};

const formatPrice = (value) =>
    `රු${Number(value || 0).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;

const normalizeCartItem = (item) => {
    const product = getProductData(item);
    const id = getItemId(item);
    const qty = getItemQty(item);

    return {
        ...product,
        _id: product._id || id,
        id: product.id || id,
        product: id,
        qty,
        quantity: qty,
    };
};

const mergeCartItems = (items) => {
    const itemMap = new Map();

    items.filter(Boolean).forEach((item) => {
        const normalizedItem = normalizeCartItem(item);
        const id = getItemId(normalizedItem);
        const hasRealProduct = normalizedItem.name || normalizedItem.image || normalizedItem.price;
        if (!hasRealProduct) return;

        const existingItem = itemMap.get(id);
        if (existingItem) {
            const qty = getItemQty(existingItem) + getItemQty(normalizedItem);
            itemMap.set(id, { ...existingItem, qty, quantity: qty });
            return;
        }
        itemMap.set(id, normalizedItem);
    });

    return [...itemMap.values()];
};

const suggestedProducts = [
    {
        name: "Aliver Rosemary Oil for Hair Growth",
        category: "Hair Care, Nourishing Oils",
        price: "From රු2,350.00",
        rating: 5,
        discount: "-11%",
        label: "HOT",
        image:
            "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=900&q=85",
    },
    {
        name: "Wine Lip Tint, 06 Colors (Stock Clearance Sale)",
        category: "Lips, Lip glow",
        price: "From රු490.00",
        rating: 4,
        discount: "-51%",
        label: "",
        image:
            "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=900&q=85",
    },
    {
        name: "Aliver Face Cream Liquid Blush (Stock Clearance Sale)",
        category: "Makeup",
        price: "From රු890.00",
        rating: 5,
        discount: "-44%",
        label: "",
        image:
            "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=85",
    },
    {
        name: "Aliver Amla Oil 60ml",
        category: "Hair Care, Nourishing Oils",
        price: "රු2,250.00",
        rating: 5,
        discount: "",
        label: "",
        image:
            "https://images.unsplash.com/photo-1615396899839-c99c121888b0?auto=format&fit=crop&w=900&q=85",
    },
    {
        name: "Aliver Argan Oil 60ml",
        category: "Hair Care, Nourishing Oils",
        price: "රු1,650.00",
        rating: 5,
        discount: "-20%",
        label: "",
        image:
            "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=900&q=85",
    },
    {
        name: "Aliver Batana Oil",
        category: "Hair Care, Nourishing Oils",
        price: "From රු2,850.00",
        rating: 5,
        discount: "",
        label: "NEW",
        image:
            "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=900&q=85",
    },
];

const CartPage = ({ onClose }) => {
    const cartContext = useContext(CartContext);
    const { toggleWishlist } = useContext(WishlistContext);
    const rawContextCartItems = cartContext?.cartItems || cartContext?.cart;
    const contextCartItems = useMemo(() => {
        if (Array.isArray(rawContextCartItems)) return rawContextCartItems;
        if (Array.isArray(rawContextCartItems?.cartItems)) return rawContextCartItems.cartItems;
        return [];
    }, [rawContextCartItems]);

    const [cartItems, setCartItems] = useState(() => mergeCartItems(getCartItems()));
    const [coupon, setCoupon] = useState("");
    const [removedItem, setRemovedItem] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    const saveCart = (items) => {
        const nextItems = mergeCartItems(items);
        setCartItems(nextItems);
        localStorage.setItem("cartItems", JSON.stringify(nextItems));
        localStorage.setItem("cart", JSON.stringify(nextItems));
    };

    useEffect(() => {
        if (onClose) {
            setCartItems(mergeCartItems(getCartItems()));
            return;
        }

        if (location.state?.cartItem) {
            saveCart([...getCartItems(), location.state.cartItem]);
            return;
        }

        const storedItems = mergeCartItems(getCartItems());
        const contextItems = mergeCartItems(contextCartItems);
        const nextItems = hasStoredCart() ? storedItems : contextItems;
        setCartItems(nextItems);
    }, [contextCartItems, location.key, onClose]);

    const removeItem = (item) => {
        const id = getItemId(item);
        setRemovedItem(normalizeCartItem(item));
        saveCart(cartItems.filter((cartItem) => getItemId(cartItem) !== id));
    };

    const undoRemove = () => {
        if (!removedItem) return;
        saveCart([...cartItems, removedItem]);
        setRemovedItem(null);
    };

    const updateQuantity = (item, nextQty) => {
        const id = getItemId(item);
        const qty = Math.max(1, Number(nextQty || 1));
        saveCart(cartItems.map((cartItem) => (getItemId(cartItem) === id ? { ...cartItem, qty, quantity: qty } : cartItem)));
    };

    const addSuggestedToCart = (product) => {
        const id = getSlug(product);
        const savedItems = mergeCartItems(getCartItems());
        const baseItems = savedItems.length ? savedItems : cartItems;
        const existingItem = baseItems.find((item) => getItemId(item) === id);
        const nextItems = existingItem
            ? baseItems.map((item) => {
                if (getItemId(item) !== id) return item;
                const qty = getItemQty(item) + 1;
                return { ...item, qty, quantity: qty };
            })
            : [
                ...baseItems,
                {
                    ...product,
                    _id: id,
                    id,
                    product: id,
                    qty: 1,
                    quantity: 1,
                },
            ];

        setCartItems(nextItems);
        localStorage.setItem("cartItems", JSON.stringify(nextItems));
        localStorage.setItem("cart", JSON.stringify(nextItems));
    };

    const subtotal = useMemo(
        () => cartItems.reduce((total, item) => total + getItemPrice(item) * getItemQty(item), 0),
        [cartItems]
    );

    const closeCart = onClose || (() => navigate(-1));

    if (onClose) {
        return (
            <main className="fixed inset-0 z-50 bg-black/70 text-gray-950">
                <button type="button" aria-label="Close cart overlay" onClick={closeCart} className="absolute inset-0 cursor-default" />
                <aside className="absolute right-0 top-0 z-10 flex h-full w-full max-w-[430px] animate-[cartSlideIn_0.28s_ease-out] flex-col bg-white shadow-2xl">
                    <header className="flex items-center justify-between border-b border-gray-200 px-5 py-6">
                        <h1 className="text-2xl font-bold tracking-tight">Shopping cart</h1>
                        <button type="button" onClick={closeCart} className="inline-flex items-center gap-2 text-base font-semibold transition hover:text-pink-600">
                            <Icon name="close" className="h-5 w-5" />
                            Close
                        </button>
                    </header>

                    <div className="flex-1 overflow-y-auto">
                        {cartItems.length === 0 ? (
                            <div className="px-6 py-16 text-center">
                                <Icon name="bag" className="mx-auto h-10 w-10 text-pink-600" />
                                <h2 className="mt-5 text-xl font-bold">Your cart is empty</h2>
                            </div>
                        ) : (
                            cartItems.map((item) => {
                                const product = getProductData(item);
                                const id = getItemId(item);
                                const qty = getItemQty(item);
                                return (
                                    <article key={id} className="grid grid-cols-[86px_1fr_28px] gap-4 border-b border-gray-200 px-5 py-5">
                                        <Link to={`/product/${id}`} state={{ product }} className="flex h-20 w-20 items-center justify-center bg-white">
                                            <img src={product.image || product.images?.[0]} alt={product.name} className="h-full w-full object-contain" />
                                        </Link>
                                        <div>
                                            <Link to={`/product/${id}`} state={{ product }} className="text-lg font-bold leading-6 text-gray-800 hover:text-pink-600">
                                                {product.name}
                                            </Link>
                                            <p className="mt-3 text-base text-gray-500">
                                                {qty} x <span className="font-bold text-gray-950">{typeof product.price === "string" ? product.price : formatPrice(getItemPrice(item))}</span>
                                            </p>
                                        </div>
                                        <button type="button" onClick={() => removeItem(item)} className="mt-1 text-gray-500 hover:text-red-600" aria-label="Remove product">
                                            <Icon name="close" className="h-4 w-4" />
                                        </button>
                                    </article>
                                );
                            })
                        )}
                    </div>

                    <footer className="border-t border-gray-200 px-5 py-6">
                        <div className="mb-6 flex items-center justify-between text-2xl font-bold">
                            <span>Subtotal:</span>
                            <span>{formatPrice(subtotal)}</span>
                        </div>
                        <button type="button" onClick={() => navigate("/cart")} className="mb-3 w-full rounded-full bg-gray-100 px-8 py-4 text-sm font-bold uppercase tracking-[0.16em] transition hover:bg-pink-50">
                            View Cart
                        </button>
                        <button type="button" onClick={() => navigate("/checkout")} disabled={!cartItems.length} className="w-full bg-gray-950 px-8 py-4 text-sm font-bold uppercase tracking-[0.16em] text-white transition hover:bg-pink-600 disabled:bg-gray-300">
                            Checkout
                        </button>
                    </footer>
                </aside>
                <style>{`@keyframes cartSlideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }`}</style>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-white text-gray-950">
            <section className="relative h-[62px] overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=1800&q=85"
                    alt="Beauty care"
                    className="absolute inset-0 h-full w-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-black/20" />
            </section>

            <section className="mx-auto max-w-[1535px] px-6 pt-[76px] pb-16">
                {removedItem && (
                    <div className="mx-auto mb-14 flex max-w-[1490px] items-center gap-6 rounded-xl bg-[#439447] px-8 py-7 text-white">
                        <span className="text-4xl font-light leading-none">✓</span>
                        <p className="text-lg">
                            “{removedItem.name || "Product"}” removed.
                            <button
                                type="button"
                                onClick={undoRemove}
                                className="ml-3 underline underline-offset-4 transition hover:text-white/80"
                            >
                                Undo?
                            </button>
                        </p>
                    </div>
                )}

                <div className="lg:pt-[24px]">
                    {cartItems.length === 0 ? (
                        <div className="border border-gray-200 px-8 py-16 text-center">
                            <Icon name="bag" className="mx-auto h-10 w-10 text-pink-600" />
                            <h1 className="mt-5 text-3xl font-bold">Your cart is empty</h1>
                            <Link to="/products" className="mt-8 inline-flex bg-gray-950 px-8 py-4 text-sm font-bold uppercase tracking-[0.16em] text-white hover:bg-pink-600">
                                Shop Products
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div className="hidden grid-cols-[60px_570px_112px_130px_96px] border-b border-[#e5e5e5] pb-[22px] text-[21px] font-extrabold uppercase leading-none lg:grid">
                                <span />
                                <span className="text-center">Product</span>
                                <span>Price</span>
                                <span>Quantity</span>
                                <span className="text-right">Subtotal</span>
                            </div>

                            {cartItems.map((item) => {
                                const product = getProductData(item);
                                const id = getItemId(item);
                                const qty = getItemQty(item);
                                const lineTotal = getItemPrice(item) * qty;

                                return (
                                    <article key={id} className="grid gap-5 border-b border-[#e5e5e5] py-[32px] lg:grid-cols-[60px_570px_112px_130px_96px] lg:items-center">
                                        <button type="button" onClick={() => removeItem(item)} className="text-2xl font-light text-gray-800 hover:text-red-600" aria-label="Remove item">
                                            ×
                                        </button>

                                        <div className="grid grid-cols-[120px_1fr] items-center gap-[20px]">
                                            <Link to={`/product/${id}`} state={{ product }} className="flex h-[78px] w-[78px] items-center justify-center bg-white">
                                                <img src={product.image || product.images?.[0]} alt={product.name} className="h-full w-full object-contain" />
                                            </Link>
                                            <Link to={`/product/${id}`} state={{ product }} className="max-w-[360px] text-[18px] font-bold leading-6 text-gray-950 hover:text-pink-600">
                                                {product.name}
                                            </Link>
                                        </div>

                                        <span className="text-[18px] text-gray-500 lg:text-left">{typeof product.price === "string" ? product.price : formatPrice(getItemPrice(item))}</span>

                                        <div className="inline-flex h-[52px] w-[100px] items-center border border-[#e6e6e6]">
                                            <button type="button" onClick={() => updateQuantity(item, qty - 1)} className="h-full w-8 text-gray-500 hover:text-pink-600">-</button>
                                            <span className="flex-1 text-center text-lg">{qty}</span>
                                            <button type="button" onClick={() => updateQuantity(item, qty + 1)} className="h-full w-8 text-gray-500 hover:text-pink-600">+</button>
                                        </div>

                                        <span className="text-right text-[18px] font-bold">{formatPrice(lineTotal)}</span>
                                    </article>
                                );
                            })}

                            <div className="mt-[37px] flex flex-col gap-3 sm:flex-row">
                            </div>
                        </>
                    )}
                </div>

                <aside className="mx-auto mt-12 h-fit w-full max-w-[760px] rounded-xl border-2 border-[#e5e5e5] px-[42px] py-[40px]">
                    <h2 className="mb-[42px] text-[30px] font-extrabold uppercase leading-none">Cart Totals</h2>
                    <div className="space-y-6 text-[18px]">
                        <div className="flex justify-between border-b border-[#e5e5e5] pb-[21px]">
                            <span className="font-bold">Subtotal</span>
                            <span className="text-gray-500">{formatPrice(subtotal)}</span>
                        </div>
                        <div className="grid grid-cols-[110px_1fr] gap-5 border-b border-[#e5e5e5] pb-[22px]">
                            <span className="font-bold">Shipping</span>
                            <div className="text-right text-gray-600">
                                <p className="text-gray-950">Free Shipping</p>
                                <p className="mt-4 text-left">Shipping options will be updated during checkout.</p>
                                <button type="button" className="mt-4 font-bold text-gray-950 hover:text-pink-600">
                                    Calculate shipping
                                </button>
                            </div>
                        </div>
                        <div className="flex justify-between text-[20px]">
                            <span className="font-bold">Total</span>
                            <span className="font-bold">{formatPrice(subtotal)}</span>
                        </div>
                    </div>
                    <button type="button" onClick={() => navigate("/checkout")} disabled={!cartItems.length} className="mt-[38px] h-[54px] w-full bg-[#2b2b2b] text-[15px] font-bold uppercase tracking-[0.02em] text-white hover:bg-pink-600 disabled:bg-gray-300">
                        Proceed to Checkout
                    </button>
                </aside>

                <section className="mt-14">
                    <h2 className="mb-8 text-2xl font-bold uppercase tracking-tight text-gray-950">
                        You may be interested in
                    </h2>

                    <div className="grid gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
                        {suggestedProducts.map((product) => (
                            <article key={product.name} className="group relative text-center">
                                {/*
                                  Suggested products are local products, so use the same slug pattern
                                  as the product/detail pages.
                                */}
                                {(() => {
                                    const productSlug = getSlug(product);

                                    return (
                                        <>
                                <div className="relative mx-auto mb-4 flex h-[430px] w-full items-center justify-center overflow-hidden bg-white">
                                    {product.discount && (
                                        <span className="absolute left-2 top-2 z-10 rounded-full bg-black px-4 py-1.5 text-sm font-bold text-white">
                                            {product.discount}
                                        </span>
                                    )}
                                    {product.label && (
                                        <span className="absolute left-2 top-12 z-10 rounded-full bg-red-500 px-4 py-1.5 text-sm font-bold text-white">
                                            {product.label}
                                        </span>
                                    )}
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="h-full w-full object-contain transition duration-500 group-hover:scale-105"
                                    />

                                    <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 overflow-hidden rounded-lg bg-white opacity-0 shadow-[0_12px_32px_rgba(0,0,0,0.16)] transition duration-300 group-hover:opacity-100">
                                        <button
                                            type="button"
                                            aria-label="Add to cart"
                                            onClick={(event) => {
                                                event.preventDefault();
                                                event.stopPropagation();
                                                addSuggestedToCart(product);
                                            }}
                                            className="inline-flex h-14 w-14 items-center justify-center text-gray-700 transition hover:bg-pink-50 hover:text-pink-600"
                                        >
                                            <Icon name="bag" className="h-6 w-6" />
                                        </button>
                                        <button
                                            type="button"
                                            aria-label="Add to wishlist"
                                            onClick={() => toggleWishlist(product)}
                                            className="inline-flex h-14 w-14 items-center justify-center text-gray-700 transition hover:bg-pink-50 hover:text-pink-600"
                                        >
                                            <Icon name="heart" className="h-6 w-6" />
                                        </button>
                                    </div>
                                </div>

                                <Link to={`/product/${productSlug}`} state={{ product }}>
                                    <h3 className="text-lg font-bold leading-snug text-gray-800 transition group-hover:text-pink-600">
                                        {product.name}
                                    </h3>
                                </Link>
                                <p className="mt-2 text-base text-gray-400">{product.category}</p>
                                <div className="mt-3 flex justify-center text-xl leading-none">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <span
                                            key={star}
                                            className={star <= product.rating ? "text-yellow-400" : "text-gray-300"}
                                        >
                                            ★
                                        </span>
                                    ))}
                                </div>
                                <p className="mt-3 text-lg font-bold text-gray-950">{product.price}</p>
                                        </>
                                    );
                                })()}
                            </article>
                        ))}
                    </div>
                </section>
            </section>
        </main>
    );
};

export default CartPage;
