import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { getImageUrl } from "../utils/image";
import { useSelector, useDispatch } from "react-redux";
import { selectCartItems, addToCart as reduxAddToCart, removeFromCart as reduxRemoveFromCart, setCart } from "../redux/slices/cartSlice";
import { fetchProducts, selectAllProducts, selectProductsStatus } from "../redux/slices/productsSlice";
import { toggleWishlist } from "../redux/slices/wishlistSlice";
import { formatPrice, parsePrice } from "../utils/currency";

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
    return parsePrice(product.price);
};

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



const CartPage = ({ onClose }) => {
    const dispatch = useDispatch();
    const reduxCartItems = useSelector(selectCartItems);
    const cartItems = useMemo(() => {
        const items = Array.isArray(reduxCartItems) ? reduxCartItems : [];
        return mergeCartItems(items);
    }, [reduxCartItems]);
    const [coupon, setCoupon] = useState("");
    const [removedItem, setRemovedItem] = useState(null);
    const [suggestedProducts, setSuggestedProducts] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();

    const allProducts = useSelector(selectAllProducts);
    const productsStatus = useSelector(selectProductsStatus);

    useEffect(() => {
        if (productsStatus === 'idle') {
            dispatch(fetchProducts());
        }
    }, [productsStatus, dispatch]);

    useEffect(() => {
        if (allProducts && allProducts.length > 0) {
            setSuggestedProducts(allProducts.slice(0, 6));
        }
    }, [allProducts]);

    useEffect(() => {
        if (location.state?.cartItem) {
            dispatch(reduxAddToCart({ product: location.state.cartItem, qty: 1 }));
        }
    }, [location.key]);

    const removeItem = (item) => {
        const id = getItemId(item);
        setRemovedItem(normalizeCartItem(item));
        dispatch(reduxRemoveFromCart(id));
    };

    const undoRemove = () => {
        if (!removedItem) return;
        dispatch(reduxAddToCart({ product: removedItem, qty: removedItem.qty || 1 }));
        setRemovedItem(null);
    };

    const updateQuantity = (item, nextQty) => {
        const qty = Math.max(1, Number(nextQty || 1));
        const updatedItems = cartItems.map((cartItem) => (getItemId(cartItem) === getItemId(item) ? { ...cartItem, qty, quantity: qty } : cartItem));
        dispatch(setCart(updatedItems));
    };

    const addSuggestedToCart = (product) => {
        dispatch(reduxAddToCart({ product, qty: 1 }));
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
                                            <img src={getImageUrl(product.image || product.images?.[0])} alt={product.name} className="h-full w-full object-contain" />
                                        </Link>
                                        <div>
                                            <Link to={`/product/${id}`} state={{ product }} className="text-lg font-bold leading-6 text-gray-800 hover:text-pink-600">
                                                {product.name}
                                            </Link>
                                            {product.color && <p className="mt-1 text-sm text-gray-500">Color: {product.color}</p>}
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
            <section className="relative min-h-[420px] overflow-hidden">
                <img
                    src="/images/banner.jpg"
                    alt="Cart"
                    className="absolute inset-0 h-full w-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-black/35" />
                <div className="relative z-10 mx-auto flex min-h-[420px] max-w-[1540px] flex-col items-center justify-center px-6 py-16 text-center text-white">
                    <h1 className="text-6xl font-bold uppercase tracking-tight md:text-7xl">
                        Cart
                    </h1>
                    <div className="mt-6 flex items-center gap-3 text-base font-medium">
                        <Link to="/" className="text-white/85 transition hover:text-white">
                            Home
                        </Link>
                        <span>/</span>
                        <span className="font-bold">Cart</span>
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-6 py-20">
                {removedItem && (
                    <div className="mx-auto mb-10 flex items-center gap-6 bg-[#439447] px-8 py-6 text-white">
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

                {cartItems.length === 0 ? (
                    <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
                        <ShoppingCart
                            aria-hidden="true"
                            className="mb-8 h-36 w-36 stroke-[1.5] text-gray-200"
                        />
                        <h2 className="text-4xl font-bold text-stone-900 sm:text-5xl">
                            Your cart is empty.
                        </h2>
                        <p className="mt-4 max-w-xl text-base leading-relaxed text-stone-600">
                            You haven&apos;t added any products to your cart yet. Find something
                            you love in our Shop.
                        </p>
                        <Link
                            to="/products"
                            className="mt-7 inline-flex items-center justify-center bg-[#2b2b2b] px-8 py-3 text-sm font-bold uppercase tracking-[0.08em] text-white transition hover:bg-pink-600"
                        >
                            Return to Shop
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="mb-8 border-b border-gray-200 pb-5">
                            <p className="mb-2 text-sm font-bold uppercase tracking-widest text-rose-600">
                                Your Beauty Picks
                            </p>
                            <h2 className="text-3xl font-bold text-stone-900 sm:text-4xl">
                                Your Shopping Cart
                            </h2>
                        </div>

                        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px]">
                            <section className="min-w-0">
                                <div className="hidden grid-cols-[minmax(0,1fr)_100px_110px_110px] gap-4 border-b border-gray-200 pb-4 text-sm font-extrabold uppercase tracking-wide text-stone-700 md:grid">
                                    <span>Product</span>
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
                                        <article
                                            key={id}
                                            className="grid gap-4 border-b border-gray-200 py-6 md:grid-cols-[minmax(0,1fr)_100px_110px_110px] md:items-center"
                                        >
                                            <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4">
                                                <Link
                                                    to={`/product/${id}`}
                                                    state={{ product }}
                                                    className="flex h-20 w-20 items-center justify-center border border-gray-100 bg-white p-2"
                                                >
                                                    <img
                                                        src={getImageUrl(product.image || product.images?.[0])}
                                                        alt={product.name}
                                                        className="h-full w-full object-contain"
                                                    />
                                                </Link>
                                                <Link
                                                    to={`/product/${id}`}
                                                    state={{ product }}
                                                    className="text-base font-bold leading-6 text-stone-900 transition hover:text-pink-600"
                                                >
                                                    {product.name}
                                                </Link>
                                                <button
                                                    type="button"
                                                    onClick={() => removeItem(item)}
                                                    className="flex h-9 w-9 items-center justify-center text-gray-500 transition hover:bg-red-50 hover:text-red-600"
                                                    aria-label={`Remove ${product.name} from cart`}
                                                >
                                                    <Icon name="close" className="h-4 w-4" />
                                                </button>
                                            </div>

                                            <span className="text-sm text-stone-600">
                                                {typeof product.price === "string"
                                                    ? product.price
                                                    : formatPrice(getItemPrice(item))}
                                            </span>

                                            <div className="inline-flex h-11 w-28 items-center border border-gray-200">
                                                <button
                                                    type="button"
                                                    onClick={() => updateQuantity(item, qty - 1)}
                                                    className="h-full w-8 text-gray-500 transition hover:text-pink-600"
                                                    aria-label={`Decrease ${product.name} quantity`}
                                                >
                                                    -
                                                </button>
                                                <span className="flex-1 text-center text-base">{qty}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => updateQuantity(item, qty + 1)}
                                                    className="h-full w-8 text-gray-500 transition hover:text-pink-600"
                                                    aria-label={`Increase ${product.name} quantity`}
                                                >
                                                    +
                                                </button>
                                            </div>

                                            <span className="text-left text-sm font-bold text-stone-900 md:text-right">
                                                {formatPrice(lineTotal)}
                                            </span>
                                        </article>
                                    );
                                })}
                            </section>

                            <aside className="h-fit border border-gray-200 bg-white p-6 sm:p-8">
                                <h2 className="mb-7 text-2xl font-bold text-stone-900">
                                    Cart Totals
                                </h2>
                                <div className="space-y-5 text-base">
                                    <div className="flex justify-between border-b border-gray-200 pb-4">
                                        <span className="font-bold text-stone-900">Subtotal</span>
                                        <span className="text-stone-600">{formatPrice(subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-gray-200 pb-4">
                                        <span className="font-bold text-stone-900">Shipping</span>
                                        <span className="text-stone-600">Free Shipping</span>
                                    </div>
                                    <div className="flex justify-between text-lg">
                                        <span className="font-bold text-stone-900">Total</span>
                                        <span className="font-bold text-stone-900">{formatPrice(subtotal)}</span>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => navigate("/checkout")}
                                    className="mt-8 h-12 w-full bg-[#2b2b2b] text-sm font-bold uppercase tracking-[0.08em] text-white transition hover:bg-pink-600"
                                >
                                    Proceed to Checkout
                                </button>
                            </aside>
                        </div>

                        <section className="mt-20">
                    <div className="mb-8 border-b border-gray-200 pb-5">
                        <p className="mb-2 text-sm font-bold uppercase tracking-widest text-rose-600">
                            More to Love
                        </p>
                        <h2 className="text-3xl font-bold text-stone-900 sm:text-4xl">
                            You may be interested in
                        </h2>
                    </div>

                    <div className="grid gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
                        {suggestedProducts.map((product) => {
                            const productSlug = product._id || getSlug(product);
                            const productImage = getImageUrl(product.image || product.images?.[0] || '');
                            const categoryName = typeof product.category === 'object' ? product.category?.name : product.category || '';
                            const discountPercent = product.compareAtPrice && product.compareAtPrice > product.price
                                ? `-${Math.round((1 - product.price / product.compareAtPrice) * 100)}%`
                                : '';
                            const label = product.isNewArrival ? 'NEW' : product.isHotDeal ? 'HOT' : product.isBestSeller ? 'BEST' : '';

                            return (
                            <article key={product._id || product.name} className="group relative text-center">
                                <div className="relative mx-auto mb-4 flex h-[430px] w-full items-center justify-center overflow-hidden bg-white">
                                    {discountPercent && (
                                        <span className="absolute left-2 top-2 z-10 rounded-full bg-black px-4 py-1.5 text-sm font-bold text-white">
                                            {discountPercent}
                                        </span>
                                    )}
                                    {label && (
                                        <span className="absolute left-2 top-12 z-10 rounded-full bg-red-500 px-4 py-1.5 text-sm font-bold text-white">
                                            {label}
                                        </span>
                                    )}
                                    <img
                                        src={productImage}
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
                                            <ShoppingCart aria-hidden="true" className="h-6 w-6" strokeWidth={1.7} />
                                        </button>
                                        <button
                                            type="button"
                                            aria-label="Add to wishlist"
                                            onClick={() => dispatch(toggleWishlist(product))}
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
                                <p className="mt-2 text-base text-gray-400">{categoryName}</p>
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
                                <div className="mt-3 flex items-center justify-center gap-2">
                                    <p className="text-lg font-bold text-gray-950">{formatPrice(product.price)}</p>
                                    {product.compareAtPrice && product.compareAtPrice > product.price && (
                                        <p className="text-sm text-gray-400 line-through">{formatPrice(product.compareAtPrice)}</p>
                                    )}
                                </div>
                            </article>
                            );
                        })}
                    </div>
                </section>
                    </>
                )}
            </section>
        </main>
    );
};

export default CartPage;
