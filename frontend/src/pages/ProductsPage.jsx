import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Icon = ({ name, className = "w-5 h-5" }) => {
    const paths = {
        search: "M21 21l-4.3-4.3M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z",
        heart: "M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z",
        bag: "M6 8h12l-1 13H7L6 8zm3 0a3 3 0 0 1 6 0",
        star: "M12 2l3 6.2 6.8 1-4.9 4.8 1.2 6.8L12 17.6l-6.1 3.2 1.2-6.8-4.9-4.8 6.8-1L12 2z",
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
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
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
            const brand = getTextValue(product.brand);
            const categoryId = getCategoryId(product.category);
            const matchesCategory =
                activeCategory === "All" ||
                category === activeCategory ||
                categoryId === activeCategory;
            const searchableText = `${product.name || ""} ${brand} ${
                category
            }`.toLowerCase();

            return (
                matchesCategory &&
                searchableText.includes(searchTerm.trim().toLowerCase())
            );
        });
    }, [activeCategory, products, searchTerm]);

    return (
        <main
            className="bb-products-page min-h-screen px-4 py-8 text-gray-950 sm:px-6 lg:px-8"
            style={{
                background:
                    "linear-gradient(135deg, #fff1f4 0%, #faf0ea 48%, #f8e7ee 100%)",
            }}
        >
            <section className="mx-auto max-w-7xl">
                <div className="mb-8 border-b border-pink-200/70 pb-6">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                        <div className="max-w-2xl">
                            <p className="mb-3 text-xs font-bold uppercase tracking-[0.28em] text-pink-500">
                                BeautyBliss Shop
                            </p>
                            <h1 className="text-4xl font-serif font-bold tracking-tight text-gray-950 sm:text-5xl">
                                Products
                            </h1>
                            <p className="mt-3 text-sm leading-6 text-gray-500">
                                Browse skincare, makeup, fragrance, and everyday glow essentials.
                            </p>
                        </div>

                        <div className="w-full max-w-md">
                            <label className="relative block">
                                <Icon
                                    name="search"
                                    className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
                                />
                                <input
                                    type="search"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search products"
                                    className="h-12 w-full rounded-lg border border-pink-200 bg-[#fff7f8]/90 pl-12 pr-4 text-sm font-medium text-gray-950 outline-none transition placeholder:text-gray-400 focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
                                />
                            </label>
                        </div>
                    </div>

                    <div className="mt-6 flex gap-2 overflow-x-auto pb-1">
                        {categories.map((category) => (
                            <button
                                key={category}
                                type="button"
                                onClick={() => setActiveCategory(category)}
                                className={`whitespace-nowrap rounded-lg border px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] transition ${
                                    activeCategory === category
                                        ? "border-pink-500 bg-pink-500 text-white"
                                        : "border-pink-200 bg-[#fff7f8]/80 text-gray-500 hover:border-pink-300 hover:text-pink-600"
                                }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                            <div
                                key={item}
                                className="h-96 animate-pulse rounded-lg border border-pink-200 bg-[#fff4f6]/80"
                            />
                        ))}
                    </div>
                ) : error ? (
                    <div className="rounded-lg border border-red-100 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
                        {error}
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="rounded-lg border border-pink-200 bg-[#fff4f6]/80 px-5 py-12 text-center">
                        <p className="text-sm font-bold uppercase tracking-[0.18em] text-gray-400">
                            No products found
                        </p>
                        <p className="mt-3 text-sm text-gray-500">
                            Try a different search term or category.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {filteredProducts.map((product) => {
                            const id = product._id || product.id;

                            return (
                                <article
                                    key={id || product.name}
                                    className="group overflow-hidden rounded-lg border border-pink-200 shadow-sm transition hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(190,24,93,0.12)]"
                                    style={{ backgroundColor: "#fff4f6" }}
                                >
                                    <Link to={id ? `/product/${id}` : "#"} className="block">
                                        <div className="relative aspect-[4/5] overflow-hidden bg-[#f3dfe6]">
                                            <img
                                                src={
                                                    product.image ||
                                                    product.images?.[0] ||
                                                    "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80"
                                                }
                                                alt={product.name || "Beauty product"}
                                                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                            />
                                            <button
                                                type="button"
                                                aria-label="Add to wishlist"
                                                className="absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-pink-100 bg-[#fff7f8]/90 text-gray-600 backdrop-blur transition hover:text-pink-600"
                                            >
                                                <Icon name="heart" className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </Link>

                                    <div className="p-5">
                                        <div className="mb-3 flex items-center justify-between gap-3">
                                            <p className="truncate text-xs font-bold uppercase tracking-[0.18em] text-pink-500">
                                                {getTextValue(
                                                    product.brand,
                                                    getTextValue(
                                                        product.category,
                                                        "BeautyBliss"
                                                    )
                                                )}
                                            </p>
                                            <div className="flex items-center gap-1 text-xs font-bold text-gray-500">
                                                <Icon
                                                    name="star"
                                                    className="h-4 w-4 text-amber-400"
                                                />
                                                {product.rating || "4.8"}
                                            </div>
                                        </div>

                                        <Link to={id ? `/product/${id}` : "#"}>
                                            <h3 className="line-clamp-2 min-h-[3rem] text-base font-bold leading-6 text-gray-950 transition group-hover:text-pink-600">
                                                {product.name || "Beauty Essential"}
                                            </h3>
                                        </Link>

                                        <div className="mt-5 flex items-center justify-between gap-4">
                                            <p className="text-lg font-bold text-gray-950">
                                                ${Number(product.price || 0).toFixed(2)}
                                            </p>
                                            <button
                                                type="button"
                                                className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gray-950 text-white transition hover:bg-pink-600"
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

            <style
                dangerouslySetInnerHTML={{
                    __html: `
                    .bb-products-page,
                    .bb-products-page * {
                        box-sizing: border-box;
                    }

                    .bb-products-page {
                        background: linear-gradient(135deg, #fff1f4 0%, #faf0ea 48%, #f8e7ee 100%) !important;
                    }

                    .bb-products-page article {
                        background-color: #fff4f6 !important;
                    }
                `,
                }}
            />
        </main>
    );
};

export default ProductsPage;
