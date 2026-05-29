import { useContext, useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";

const Icon = ({ name, className = "w-5 h-5" }) => {
    const paths = {
        search: "M21 21l-4.3-4.3M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z",
        heart: "M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z",
        bag: "M6 8h12l-1 13H7L6 8zm3 0a3 3 0 0 1 6 0",
        star: "M12 2l3 6.2 6.8 1-4.9 4.8 1.2 6.8L12 17.6l-6.1 3.2 1.2-6.8-4.9-4.8 6.8-1L12 2z",
        bottle: "M9 2h6v4l-1 1v13a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2V7L9 6V2zM8 12h6",
        hair: "M4 14c3-8 13-9 16-2-4-2-8 0-10 4-1.5 2.5-5 2-6-2zM7 16c1 3 5 5 9 2",
        lips: "M3 12c3-3 5-3 8 0 3-3 6-3 10 0-4 4-14 4-18 0zM3 12c4 2 14 2 18 0",
        makeup: "M12 3v9m-4 9h8m-6-9h4l2 6H8l2-6zM8 3h8",
        oil: "M12 2c3 4 5 7 5 11a5 5 0 0 1-10 0c0-4 2-7 5-11z",
        tooth: "M8 3c1.5 0 2.2 1 4 1s2.5-1 4-1c2 0 3 1.7 3 4 0 3-2 12-4 12-1.2 0-1.2-4-3-4-1.8 0-1.8 4-3 4-2 0-4-9-4-12 0-2.3 1-4 3-4z",
        face: "M12 3a7 7 0 0 1 7 7v2a7 7 0 0 1-14 0v-2a7 7 0 0 1 7-7zM9 10h.01M15 10h.01M9 15c2 1.3 4 1.3 6 0",
        gift: "M20 12v9H4v-9m16 0H4m16 0v-2H4v2m8-2v11M12 10c-4-1-5-6-1-6 2 0 1 4 1 6zm0 0c4-1 5-6 1-6-2 0-1 4-1 6z",
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

const getTextValue = (value, fallback = "") => {
    if (!value) {
        return fallback;
    }

    if (typeof value === "string" || typeof value === "number") {
        return String(value);
    }

    return value.name || value.title || value._id || fallback;
};

const ProductsPage = () => {
    const { addToCart } = useContext(CartContext);
    const { toggleWishlist } = useContext(WishlistContext);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");

    const location = useLocation();
    const categoryQuery = useMemo(
        () => new URLSearchParams(location.search).get("category") || "",
        [location.search]
    );

    const getCategoryId = (value) => {
        if (!value) return "";
        if (typeof value === "string" || typeof value === "number") return String(value);
        return value._id || value.id || String(value.name || value.title || "");
    };

    const categoryAliases = useMemo(() => ({
        skincare: ["skincare", "skin"],
        cosmetics: ["cosmetics", "cosmetic", "makeup"],
        haircare: ["haircare", "hair"],
        fragrances: ["fragrances", "fragrance", "perfume"],
    }), []);

    useEffect(() => {
        if (categoryQuery) {
            setActiveCategory(categoryQuery);
        }
    }, [categoryQuery]);

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const res = await fetch("/api/products");
                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data?.message || "Unable to load products");
                }

                setProducts(Array.isArray(data) ? data : data.products || []);
            } catch (err) {
                setError(err.message || "Unable to load products");
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, []);

    const categories = useMemo(() => {
        const productCategories = products
            .map((product) => getTextValue(product.category))
            .filter(Boolean);

        return ["All", ...new Set(productCategories)];
    }, [products]);

    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            const category = getTextValue(product.category);
            const categoryId = getCategoryId(product.category);
            const normalizedActiveCategory = activeCategory.toLowerCase().replace(/\s+/g, "");
            const normalizedCategory = category.toLowerCase().replace(/\s+/g, "");
            const normalizedCategoryId = categoryId.toLowerCase().replace(/\s+/g, "");
            const aliases = categoryAliases[normalizedActiveCategory] || [
                normalizedActiveCategory,
            ];
            const matchesCategory =
                activeCategory === "All" ||
                category === activeCategory ||
                categoryId === activeCategory ||
                aliases.some(
                    (alias) =>
                        normalizedCategory === alias ||
                        normalizedCategoryId === alias ||
                        normalizedCategory.includes(alias) ||
                        normalizedCategoryId.includes(alias)
                );

            return matchesCategory;
        });
    }, [activeCategory, categoryAliases, products]);

    const categoryHeroItems = useMemo(() => {
        const featuredCategories = [
            { name: "SKINCARE", value: "skincare"},
            { name: "COSMETICS", value: "cosmetics"},
            { name: "HAIRCARE", value: "haircare" },
            { name: "FRAGRANCES", value: "fragrances" },
        ];

        return featuredCategories.map((category) => ({
            ...category,
            count: products.filter((product) => {
                const productCategory = getTextValue(product.category);
                const productCategoryId = getCategoryId(product.category);
                const normalizedName = productCategory.toLowerCase().replace(/\s+/g, "");
                const normalizedId = productCategoryId.toLowerCase().replace(/\s+/g, "");
                const aliases = categoryAliases[category.value] || [category.value];

                return aliases.some(
                    (alias) =>
                        normalizedName === alias ||
                        normalizedId === alias ||
                        normalizedName.includes(alias) ||
                        normalizedId.includes(alias)
                );
            }).length,
        }));
    }, [categoryAliases, products]);

    return (
        <main className="bb-products-page min-h-screen bg-white text-gray-950">
            <section className="relative min-h-[420px] overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1800&q=85"
                    alt="Beauty products"
                    className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-black/35" />

                <div className="relative z-10 mx-auto flex min-h-[420px] max-w-[1540px] flex-col items-center justify-center px-6 py-16 text-white">
                    <h1 className="mb-10 text-6xl font-bold tracking-tight md:text-7xl">
                        Shop
                    </h1>

                    <div className="flex max-w-7xl flex-wrap items-center justify-center gap-x-10 gap-y-8">
                        {categoryHeroItems.map((category) => (
                            <button
                                key={category.name}
                                type="button"
                                onClick={() => setActiveCategory(category.value)}
                                className={`group flex items-center gap-4 text-left transition ${
                                    activeCategory === category.value
                                        ? "opacity-100"
                                        : "opacity-90 hover:opacity-100"
                                }`}
                            >
                                <Icon
                                    name={category.icon}
                                    className="h-9 w-9 shrink-0 text-white"
                                />
                                <span>
                                    <span className="block text-xl font-extrabold uppercase leading-6 text-white md:text-2xl">
                                        {category.name}
                                    </span>
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-[1540px] px-6 py-16 lg:py-20">
                <div className="mb-12 text-center">


                </div>

                {loading ? (
                    <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                            <div
                                key={item}
                                className="h-[470px] animate-pulse bg-gray-50"
                            />
                        ))}
                    </div>
                ) : error ? (
                    <div className="mx-auto max-w-3xl rounded-lg border border-red-100 bg-red-50 px-5 py-4 text-center text-sm font-medium text-red-700">
                        {error}
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="mx-auto max-w-3xl rounded-lg border border-gray-200 bg-gray-50 px-5 py-16 text-center">
                        <p className="text-sm font-bold uppercase tracking-[0.18em] text-gray-400">
                            No products found
                        </p>
                        <p className="mt-3 text-sm text-gray-500">
                            Try a different search term or category.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {filteredProducts.map((product) => {
                            const id = product._id || product.id;

                            return (
                                <article
                                    key={id || product.name}
                                    className="group relative text-center transition hover:-translate-y-1"
                                >
                                    {id ? (
                                        <Link to={`/product/${id}`} className="relative z-0 block">
                                            <div className="relative mx-auto mb-5 flex h-[330px] w-full max-w-[330px] items-center justify-center overflow-hidden bg-white">
                                                <img
                                                    src={
                                                        product.image ||
                                                        product.images?.[0] ||
                                                        "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80"
                                                    }
                                                    alt={product.name || "Beauty product"}
                                                    className="h-[300px] w-[300px] object-contain transition duration-500 group-hover:scale-105"
                                                />
                                            </div>
                                        </Link>
                                    ) : (
                                        <div className="relative mx-auto mb-5 flex h-[330px] w-full max-w-[330px] items-center justify-center overflow-hidden bg-white">
                                            <img
                                                src={
                                                    product.image ||
                                                    product.images?.[0] ||
                                                    "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80"
                                                }
                                                alt={product.name || "Beauty product"}
                                                className="h-[300px] w-[300px] object-contain transition duration-500 group-hover:scale-105"
                                            />
                                        </div>
                                    )}
                                    <button
                                        type="button"
                                        aria-label="Add to wishlist"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            toggleWishlist(product);
                                        }}
                                        className="absolute right-3 top-3 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white/90 text-gray-600 shadow-sm backdrop-blur transition hover:border-pink-200 hover:text-pink-600"
                                    >
                                        <Icon name="heart" className="h-5 w-5" />
                                    </button>

                                    <div>
                                        <div className="mb-2 flex flex-col items-center justify-center gap-2">
                                            <p className="min-h-[20px] text-base text-gray-400">
                                                {getTextValue(
                                                    product.brand,
                                                    getTextValue(
                                                        product.category,
                                                        "BeautyBliss"
                                                    )
                                                )}
                                            </p>
                                            <div className="flex items-center gap-1 text-sm font-bold text-gray-500">
                                                <Icon
                                                    name="star"
                                                    className="h-4 w-4 text-amber-400"
                                                />
                                                {product.rating || "4.8"}
                                            </div>
                                        </div>

                                        <Link to={id ? `/product/${id}` : "#"}>
                                            <h3 className="mx-auto min-h-[48px] max-w-[320px] text-lg font-bold leading-snug text-gray-800 transition group-hover:text-pink-600">
                                                {product.name || "Beauty Essential"}
                                            </h3>
                                        </Link>

                                        <div className="mt-4 flex items-center justify-center gap-4">
                                            <p className="text-lg font-bold text-gray-950">
                                                ${Number(product.price || 0).toFixed(2)}
                                            </p>
                                            <button
                                                type="button"
                                                onClick={() => addToCart(product, 1)}
                                                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gray-950 text-white transition hover:bg-pink-600"
                                                aria-label="Add to cart"
                                            >
                                                <Icon name="bag" className="h-5 w-5" />
                                            </button>
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

export default ProductsPage;
