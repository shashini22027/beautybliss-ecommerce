import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getImageUrl } from "../utils/image";
import { useDispatch } from "react-redux";
import { ShoppingCart } from "lucide-react";
import { addToCart as reduxAddToCart } from "../redux/slices/cartSlice";
import { toggleWishlist as reduxToggleWishlist } from "../redux/slices/wishlistSlice";
import { formatPrice, parsePrice } from "../utils/currency";
import api from "../services/api";

const Icon = ({ name, className = "w-5 h-5" }) => {
    const paths = {
        search: "M21 21l-4.3-4.3M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z",
        heart: "M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z",
        shuffle: "M16 3h5v5M4 20l17-17M21 16v5h-5M15 15l6 6M4 4l5 5",
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
    if (!value) return fallback;
    if (typeof value === "string" || typeof value === "number") return String(value);
    return value.name || value.title || value._id || fallback;
};

const getProductImageValue = (image) => {
    if (!image) return "";
    return typeof image === "string" ? image : image.url || image.src || "";
};

const getProductImages = (product) => {
    const images = [
        getProductImageValue(product.image),
        ...(Array.isArray(product.images) ? product.images.map(getProductImageValue) : []),
    ].filter(Boolean);

    return [...new Set(images)];
};

const getComparePrice = (product) => {
    if (product.oldPrice) {
        return product.oldPrice;
    }

    const price = parsePrice(product.price);
    const compareAtPrice = parsePrice(product.compareAtPrice);

    return compareAtPrice > price ? product.compareAtPrice : "";
};

const isSpecialOffer = (product) =>
    Boolean(product.isSpecialOffer) ||
    getTextValue(product.category).trim().toLowerCase() === "special offers";

const skinConcernKeywords = {
    acne: [
        "acne",
        "pimple",
        "breakout",
        "blemish",
        "salicylic",
        "tea tree",
        "pore",
        "oil-free",
    ],
    dryness: [
        "dry skin",
        "hydrating",
        "hydration",
        "moistur",
        "hyaluronic",
        "ceramide",
        "barrier",
        "nourishing",
    ],
    "dark-spots": [
        "dark spot",
        "pigmentation",
        "brightening",
        "vitamin c",
        "uneven tone",
        "spot correct",
        "turmeric",
    ],
    sensitive: [
        "sensitive",
        "soothing",
        "gentle",
        "calming",
        "aloe",
        "irritation",
        "redness",
        "fragrance-free",
        "barrier repair",
    ],
};

const getProductId = (product) => {
    if (product._id || product.id || product.slug) {
        return product._id || product.id || product.slug;
    }

    return String(product.name || "product")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
};

const getCartProduct = (product) => {
    const id = getProductId(product);

    return {
        ...product,
        id,
        _id: product._id || id,
    };
};

const MAX_PRODUCT_PRICE = 9490;

const ProductsPage = () => {
    const dispatch = useDispatch();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [loadAttempt, setLoadAttempt] = useState(0);
    const [activeCategory, setActiveCategory] = useState("All");
    const [currentPage, setCurrentPage] = useState(0);
    const [sortOrder, setSortOrder] = useState("default");
    const [brandFilter, setBrandFilter] = useState("All");
    const [undertoneFilter, setUndertoneFilter] = useState("");
    const [finishFilter, setFinishFilter] = useState("");
    const [ratingFilter, setRatingFilter] = useState(0);
    const [inStockOnly, setInStockOnly] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [priceMin, setPriceMin] = useState(0);
    const [priceMax, setPriceMax] = useState(MAX_PRODUCT_PRICE);
    const [appliedPriceRange, setAppliedPriceRange] = useState([0, MAX_PRODUCT_PRICE]);
    const productsPerPage = 6;

    const location = useLocation();
    const navigate = useNavigate();
    const categoryQuery = useMemo(
        () => new URLSearchParams(location.search).get("category") || "",
        [location.search]
    );
    const skinConcernQuery = useMemo(
        () => new URLSearchParams(location.search).get("skinConcern") || "",
        [location.search]
    );
    const searchQuery = useMemo(
        () => new URLSearchParams(location.search).get("q") || "",
        [location.search]
    );
    const undertoneQuery = useMemo(
        () => new URLSearchParams(location.search).get("undertone") || "",
        [location.search]
    );
    const finishQuery = useMemo(
        () => new URLSearchParams(location.search).get("finish") || "",
        [location.search]
    );

    useEffect(() => {
        setSearchText(searchQuery);
        setUndertoneFilter(undertoneQuery);
        setFinishFilter(finishQuery);
    }, [finishQuery, searchQuery, undertoneQuery]);

    const getCategoryId = (value) => {
        if (!value) return "";
        if (typeof value === "string" || typeof value === "number") return String(value);
        return value._id || value.id || String(value.name || value.title || "");
    };

    const categoryAliases = useMemo(() => ({
        skincare: ["skincare", "skin", "cleansers", "suncare", "moisturizers"],
        haircare: ["haircare", "hair"],
        makeup: ["cosmetics", "cosmetic", "makeup", "lips", "lipglow"],
        fragrances: ["fragrances", "fragrance", "perfume"],
        "bath&body": ["bath&body", "bath", "body", "bodycare", "oralcare", "foot&hand", "nourishingoils"],
        beautytools: ["beautytools", "tools", "brush", "roller", "beautysets"],
    }), []);

    useEffect(() => {
        if (categoryQuery) {
            setActiveCategory(categoryQuery);
        }
    }, [categoryQuery]);

    useEffect(() => {
        setCurrentPage(0);
    }, [activeCategory, appliedPriceRange]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError("");
                const { data } = await api.get("/products");
                if (Array.isArray(data)) {
                    setProducts(data);
                } else {
                    setProducts([]);
                }
            } catch (err) {
                setError(err?.response?.data?.message || err.message || "Failed to load products");
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [loadAttempt]);

    const resetFilters = () => {
        setActiveCategory("All");
        setBrandFilter("All");
        setUndertoneFilter("");
        setFinishFilter("");
        setRatingFilter(0);
        setInStockOnly(false);
        setSearchText("");
        setPriceMin(0);
        setPriceMax(MAX_PRODUCT_PRICE);
        setAppliedPriceRange([0, MAX_PRODUCT_PRICE]);
        setSortOrder("default");
        setCurrentPage(0);
        if (categoryQuery || searchQuery || skinConcernQuery || undertoneQuery || finishQuery) navigate("/products");
    };

    // Scroll to top whenever the page changes
    useEffect(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [currentPage]);

    const filteredProducts = useMemo(() => {
        const filtered = products.filter((product) => {
            const isSpecialOffersCategory =
                activeCategory.toLowerCase().replace(/[^a-z]/g, "") === "specialoffers";
            const category = getTextValue(product.category);
            const categoryId = getCategoryId(product.category);
            const normalizedActiveCategory = activeCategory.toLowerCase().replace(/\s+/g, "");
            const normalizedCategory = category.toLowerCase().replace(/\s+/g, "");
            const normalizedCategoryId = categoryId.toLowerCase().replace(/\s+/g, "");
            const aliases = categoryAliases[normalizedActiveCategory] || [
                normalizedActiveCategory,
            ];
            const matchesCategory = isSpecialOffersCategory
                ? isSpecialOffer(product)
                : (
                activeCategory === "All" ||
                category === activeCategory ||
                categoryId === activeCategory ||
                aliases.some(
                    (alias) =>
                        normalizedCategory === alias ||
                        normalizedCategoryId === alias ||
                        normalizedCategory.includes(alias) ||
                        normalizedCategoryId.includes(alias)
                ));
            const concernKeywords = skinConcernKeywords[skinConcernQuery];
            const productSearchText = [
                product.name,
                product.description,
                getTextValue(product.category),
                product.subcategory,
                product.brand,
                getTextValue(product.color),
                ...(Array.isArray(product.variants) ? product.variants.flatMap((variant) => [getTextValue(variant?.name), getTextValue(variant?.undertone), getTextValue(variant?.finish)]) : []),
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();
            const matchesConcern =
                !concernKeywords ||
                concernKeywords.some((keyword) => productSearchText.includes(keyword));
            const queryTerms = searchText.trim().toLowerCase().split(/\s+/).filter(Boolean);
            const matchesSearch = queryTerms.every((term) => productSearchText.includes(term));
            const price = parsePrice(product.price);
            const matchesPrice =
                price >= appliedPriceRange[0] && price <= appliedPriceRange[1];
            const brandName = getTextValue(product.brand, "");
            const matchesBrand = brandFilter === "All" || brandName === brandFilter;
            const matchesRating = Number(product.rating || 0) >= ratingFilter;
            const stockCount = Number(product.countInStock ?? product.stock ?? 0);
            const matchesAvailability = !inStockOnly || stockCount > 0;
            const variants = Array.isArray(product.variants) ? product.variants : [];
            const matchesShade = (!undertoneFilter && !finishFilter) || variants.some((variant) =>
                (!undertoneFilter || variant.undertone?.toLowerCase() === undertoneFilter.toLowerCase()) &&
                (!finishFilter || variant.finish?.toLowerCase() === finishFilter.toLowerCase())
            );

            return matchesCategory && matchesConcern && matchesSearch && matchesPrice && matchesBrand && matchesRating && matchesAvailability && matchesShade;
        });

        switch (sortOrder) {
            case "rating":
                filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
                break;
            case "price-low":
                filtered.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
                break;
            case "price-high":
                filtered.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
                break;
            case "latest":
                filtered.sort((a, b) => new Date(b.createdAt || b.updatedAt || 0) - new Date(a.createdAt || a.updatedAt || 0));
                break;
            case "popular":
                filtered.sort((a, b) => (Number(b.numReviews || 0) + (b.isBestSeller ? 1000 : 0)) - (Number(a.numReviews || 0) + (a.isBestSeller ? 1000 : 0)));
                break;
            default:
                break;
        }

        return filtered;
    }, [activeCategory, appliedPriceRange, brandFilter, categoryAliases, finishFilter, inStockOnly, products, ratingFilter, searchText, skinConcernQuery, sortOrder, undertoneFilter]);

    const pageCount = Math.max(1, Math.ceil(filteredProducts.length / productsPerPage));
    const visibleProducts = filteredProducts.slice(
        currentPage * productsPerPage,
        currentPage * productsPerPage + productsPerPage
    );

    const goToPrevPage = () => {
        setCurrentPage((page) => (page === 0 ? pageCount - 1 : page - 1));
    };

    const goToNextPage = () => {
        setCurrentPage((page) => (page === pageCount - 1 ? 0 : page + 1));
    };

    const categoryHeroItems = useMemo(() => {
        const featuredCategories = [
            { name: "SKINCARE", value: "skincare", icon: "bottle" },
            { name: "HAIRCARE", value: "haircare", icon: "hair" },
            { name: "MAKEUP", value: "makeup", icon: "makeup" },
            { name: "FRAGRANCES", value: "fragrances", icon: "oil" },
            { name: "BATH & BODY", value: "bath & body", icon: "face" },
            { name: "BEAUTY TOOLS", value: "beauty tools", icon: "star" },
            { name: "SPECIAL OFFERS", value: "special offers", icon: "gift" },
        ];

        return featuredCategories.map((category) => ({
            ...category,
            count: category.value === "special offers"
                ? products.filter(isSpecialOffer).length
                : products.filter((product) => {
                const productCategory = getTextValue(product.category);
                const productCategoryId = getCategoryId(product.category);
                const normalizedName = productCategory.toLowerCase().replace(/\s+/g, "");
                const normalizedId = productCategoryId.toLowerCase().replace(/\s+/g, "");
                const normalizedValue = category.value.toLowerCase().replace(/\s+/g, "");
                const aliases = categoryAliases[normalizedValue] || [normalizedValue];

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

    const formatRangePrice = (price) =>
        `₨${price.toLocaleString("en-US")}`;
    const availableBrands = useMemo(() => [...new Set(products.map((product) => getTextValue(product.brand, "")).filter(Boolean))].sort((a, b) => a.localeCompare(b)), [products]);
    const availableFinishes = useMemo(() => [...new Set(products.flatMap((product) => (product.variants || []).map((variant) => variant.finish).filter(Boolean)))].sort((a, b) => a.localeCompare(b)), [products]);
    const priceMinPosition = (priceMin / MAX_PRODUCT_PRICE) * 100;
    const priceMaxPosition = (priceMax / MAX_PRODUCT_PRICE) * 100;

    return (
        <main className="bb-products-page min-h-screen bg-white text-gray-950">
            <section className="relative min-h-[140px] overflow-hidden sm:min-h-[150px]">
                <img
                    src="/images/banner.jpg"
                    alt="Beauty products"
                    className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-black/35" />

                <div className="relative z-10 mx-auto flex min-h-[140px] max-w-[1540px] flex-col items-center justify-center px-5 py-4 text-white sm:min-h-[150px] sm:px-6">
                    <h1 className="text-6xl font-semibold leading-none tracking-tight sm:text-7xl">
                        Shop
                    </h1>
                </div>
            </section>

            <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 border-b border-gray-100 px-5 py-4 sm:gap-x-10" aria-label="Shop categories">
                {categoryHeroItems.map((category) => (
                    <button
                        key={category.name}
                        type="button"
                        onClick={() => {
                            setActiveCategory(category.value);
                            navigate(`/products?category=${encodeURIComponent(category.value)}`);
                        }}
                        className={`group flex items-center gap-2 text-left transition ${
                            activeCategory === category.value
                                ? "text-rose-700"
                                : "text-gray-700 hover:text-rose-700"
                        }`}
                    >
                        <Icon name={category.icon} className="h-5 w-5 shrink-0" />
                        <span className="text-xs font-semibold uppercase leading-5 sm:text-sm">{category.name}</span>
                    </button>
                ))}
            </nav>

            <section className="mx-auto grid max-w-[1540px] gap-6 px-4 py-8 sm:px-6 sm:py-12 lg:grid-cols-[300px_1fr] lg:gap-10 lg:py-16">
                <aside className="h-fit border border-gray-200 bg-[#fbf8f5] px-4 py-5 sm:px-6 sm:py-7 lg:sticky lg:top-24">
                    <h2 className="text-base font-semibold tracking-tight sm:text-lg">
                        Filter by Price
                    </h2>
                    <div className="relative mt-7 h-5" aria-label="Price range">
                        <div
                            className="absolute top-1/2 h-[2px] -translate-y-1/2 bg-gray-200"
                            style={{
                                left: `${priceMinPosition}%`,
                                width: `${priceMaxPosition - priceMinPosition}%`,
                                backgroundColor: "#111827",
                            }}
                        />
                        <input
                            type="range"
                            min="0"
                            max={MAX_PRODUCT_PRICE}
                            step="1"
                            value={priceMin}
                            onChange={(event) =>
                                setPriceMin(Math.min(Number(event.target.value), priceMax - 1))
                            }
                            className="price-range-input"
                            style={{ zIndex: priceMin > MAX_PRODUCT_PRICE / 2 ? 5 : 3 }}
                            aria-label="Minimum price"
                            aria-valuetext={formatRangePrice(priceMin)}
                        />
                        <input
                            type="range"
                            min="0"
                            max={MAX_PRODUCT_PRICE}
                            step="1"
                            value={priceMax}
                            onChange={(event) =>
                                setPriceMax(Math.max(Number(event.target.value), priceMin + 1))
                            }
                            className="price-range-input"
                            style={{ zIndex: priceMin > MAX_PRODUCT_PRICE / 2 ? 3 : 5 }}
                            aria-label="Maximum price"
                            aria-valuetext={formatRangePrice(priceMax)}
                        />
                    </div>
                    <div className="mt-8 flex items-center justify-between gap-3">
                        <p className="text-sm text-gray-600">
                            Price: <span className="font-serif italic text-gray-950">
                                {formatRangePrice(priceMin)} — {formatRangePrice(priceMax)}
                            </span>
                        </p>
                        <button
                            type="button"
                            onClick={() => setAppliedPriceRange([priceMin, priceMax])}
                            className="shrink-0 rounded-full bg-gray-100 px-5 py-3 text-xs font-bold uppercase tracking-wide text-gray-950 transition hover:bg-gray-200"
                        >
                            Filter
                        </button>
                    </div>
                </aside>

                <div>
                <div className="mb-7 flex flex-col gap-4 border-b border-gray-200 pb-5 sm:mb-10 sm:pb-6">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-gray-600" aria-live="polite">Showing {visibleProducts.length} of {filteredProducts.length} products</p>
                    <label className="w-full sm:max-w-sm">
                      <span className="sr-only">Search products by name, brand, category, or keyword</span>
                      <input value={searchText} onChange={(event) => { setSearchText(event.target.value); setCurrentPage(0); }} placeholder="Search products" aria-label="Search products" className="h-11 w-full border border-gray-300 bg-white px-4 text-sm" />
                    </label>
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                    <select value={brandFilter} onChange={(event) => { setBrandFilter(event.target.value); setCurrentPage(0); }} aria-label="Filter by brand" className="h-10 w-full border border-gray-300 bg-white px-3 text-sm sm:w-auto"><option value="All">All brands</option>{availableBrands.map((brand) => <option key={brand} value={brand}>{brand}</option>)}</select>
                    <select value={undertoneFilter} onChange={(event) => { setUndertoneFilter(event.target.value); setCurrentPage(0); }} aria-label="Filter by shade undertone" className="h-10 w-full border border-gray-300 bg-white px-3 text-sm sm:w-auto"><option value="">Any undertone</option>{['Warm', 'Cool', 'Neutral'].map((tone) => <option key={tone} value={tone}>{tone} undertone</option>)}</select>
                    <select value={finishFilter} onChange={(event) => { setFinishFilter(event.target.value); setCurrentPage(0); }} aria-label="Filter by shade finish" className="h-10 w-full border border-gray-300 bg-white px-3 text-sm sm:w-auto"><option value="">Any finish</option>{availableFinishes.map((finish) => <option key={finish} value={finish}>{finish}</option>)}</select>
                    <select value={ratingFilter} onChange={(event) => { setRatingFilter(Number(event.target.value)); setCurrentPage(0); }} aria-label="Minimum rating" className="h-10 w-full border border-gray-300 bg-white px-3 text-sm sm:w-auto"><option value={0}>Any rating</option><option value={4}>4 stars & up</option><option value={3}>3 stars & up</option></select>
                    <label className="inline-flex min-h-10 items-center gap-2 border border-gray-300 px-3 text-sm"><input type="checkbox" checked={inStockOnly} onChange={(event) => setInStockOnly(event.target.checked)} />In stock</label>
                    <select
                        className="h-10 w-full border border-gray-300 bg-white px-3 text-sm font-medium text-gray-700 outline-none focus:border-gray-950 sm:w-auto"
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        aria-label="Sort products"
                    >
                        <option value="default">Default sorting</option>
                        <option value="rating">Sort by average rating</option>
                        <option value="popular">Most popular</option>
                        <option value="latest">Sort by latest</option>
                        <option value="price-low">Sort by price: low to high</option>
                        <option value="price-high">Sort by price: high to low</option>
                    </select>
                    <button type="button" onClick={resetFilters} className="h-10 px-3 text-left text-sm font-medium text-[#8f4656] underline-offset-4 hover:underline sm:ml-auto sm:text-center">Clear filters</button>
                    </div>
                </div>
                {loading ? (
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                            <div
                                key={item}
                                className="aspect-[4/5] animate-pulse rounded-sm bg-[#fbf3f1]"
                            />
                        ))}
                    </div>
                ) : error ? (
                    <div className="mx-auto max-w-3xl rounded-lg border border-red-200 bg-red-50 px-5 py-6 text-center" role="alert">
                        <p className="text-sm font-medium text-red-800">{error}</p>
                        <button type="button" onClick={() => setLoadAttempt((attempt) => attempt + 1)} className="mt-4 rounded-sm bg-[#292526] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#a94f61]">Try again</button>
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="mx-auto max-w-3xl rounded-lg border border-gray-200 bg-gray-50 px-5 py-16 text-center">
                        <p className="text-sm font-bold uppercase tracking-[0.18em] text-gray-400">
                            No products found
                        </p>
                        <p className="mt-3 text-sm text-gray-500">
                            Try a different search term or category.
                        </p>
                        <button type="button" onClick={resetFilters} className="mt-5 rounded-sm border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-800 transition hover:border-[#a94f61] hover:text-[#8f4656]">Clear filters</button>
                    </div>
                ) : (
                    <>
                    <div className="grid items-stretch gap-x-5 gap-y-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {visibleProducts.map((product) => {
                            const id = getProductId(product);
                            const productPath = `/product/${id}`;
                            const comparePrice = getComparePrice(product);
                            const productImages = getProductImages(product);
                            const primaryImage =
                                productImages[0] ||
                                "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80";
                            const hoverImage = productImages[1];

                            return (
                                <article
                                    key={id || product.name}
                                    className="group relative flex h-full flex-col text-left"
                                >
                                    <div className="relative mb-4 flex aspect-[4/4.2] w-full items-center justify-center overflow-hidden rounded-sm bg-[#fbf8f5]">
                                        <Link to={productPath} state={{ product }} className="flex h-full w-full items-center justify-center">
                                            {product.discount && (
                                                <span className="absolute left-5 top-3 z-10 rounded-full bg-black px-4 py-1.5 text-sm font-bold text-white">
                                                    {product.discount}
                                                </span>
                                            )}

                                            {product.soldOut && (
                                                <span className="absolute left-1/2 top-3 z-10 -translate-x-1/2 rounded-full bg-white px-4 py-1.5 text-sm font-bold uppercase tracking-wide text-black shadow-sm">
                                                    SOLD OUT
                                                </span>
                                            )}

                                            <img
                                                src={getImageUrl(primaryImage)}
                                                alt={product.name || "Beauty product"}
                                                className={`h-full w-full object-cover transition duration-500 ${
                                                    hoverImage ? "group-hover:opacity-0" : "group-hover:scale-105"
                                                }`}
                                            />
                                            {hoverImage && (
                                                <img
                                                    src={getImageUrl(hoverImage)}
                                                    alt={product.name || "Beauty product"}
                                                className="absolute inset-0 h-full w-full object-cover opacity-0 transition duration-500 group-hover:scale-105 group-hover:opacity-100"
                                                    loading="lazy"
                                                />
                                            )}

                                            <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 overflow-hidden rounded-lg bg-white opacity-0 shadow-lg transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                                                <button
                                                    type="button"
                                                    onClick={(event) => {
                                                        event.preventDefault();
                                                        event.stopPropagation();
                                                        dispatch(reduxAddToCart({ product: getCartProduct(product), qty: 1 }));
                                                    }}
                                                    className="flex h-11 w-11 items-center justify-center border-r border-gray-100 text-gray-700 transition hover:bg-gray-950 hover:text-white"
                                                    aria-label="Add to cart"
                                                >
                                                    <ShoppingCart aria-hidden="true" className="h-6 w-6" strokeWidth={1.7} />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={(event) => {
                                                        event.preventDefault();
                                                        event.stopPropagation();
                                                        dispatch(reduxToggleWishlist(product));
                                                    }}
                                                    className="flex h-11 w-11 items-center justify-center text-gray-700 transition hover:bg-gray-950 hover:text-white"
                                                    aria-label="Add to wishlist"
                                                >
                                                    <Icon name="heart" className="h-6 w-6" />
                                                </button>
                                            </div>
                                        </Link>
                                    </div>

                                    <Link to={productPath} state={{ product }} className="min-h-10">
                                        <h3 className="line-clamp-2 text-sm font-semibold leading-5 text-gray-900 transition group-hover:text-[#a94f61]">
                                            {product.name}
                                        </h3>
                                    </Link>

                                    <p className="mt-1 min-h-5 text-xs text-gray-500">
                                        {getTextValue(product.category)}
                                    </p>

                                    {Array.isArray(product.variants) && product.variants.length > 0 && (
                                      <div className="mt-2 flex min-h-5 items-center gap-1.5" aria-label="Available shades">
                                        {product.variants.slice(0, 6).map((variant, index) => (
                                          <span key={`${variant.name}-${index}`} title={`${variant.name}${variant.undertone ? ` · ${variant.undertone}` : ''}${variant.finish ? ` · ${variant.finish}` : ''}`} className="h-4 w-4 rounded-full border border-gray-300" style={{ backgroundColor: /^#[0-9a-f]{6}$/i.test(variant.hex || '') ? variant.hex : '#e8d8d5' }} />
                                        ))}
                                        {product.variants.length > 6 && <span className="text-[11px] text-gray-500">+{product.variants.length - 6}</span>}
                                      </div>
                                    )}

                                    <div className="mt-2 flex min-h-5 items-center text-base leading-none">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <span
                                                key={star}
                                                className={star <= (product.rating || 4) ? "text-yellow-400" : "text-gray-300"}
                                            >
                                                ★
                                            </span>
                                        ))}
                                    </div>

                                    <div className="mt-auto flex items-center gap-2 pt-3 text-sm font-bold">
                                        {comparePrice && (
                                            <span className="text-base font-normal text-gray-400 line-through">
                                                {typeof comparePrice === "string" ? comparePrice : formatPrice(comparePrice)}
                                            </span>
                                        )}
                                        <span className="text-gray-950">
                                            {typeof product.price === "string" ? product.price : formatPrice(product.price)}
                                        </span>
                                    </div>
                                </article>
                            );
                        })}
                    </div>

                    {pageCount > 1 && (
                        <div className="mt-16 flex items-center justify-center gap-3 text-lg font-bold text-gray-950">
                            <button
                                type="button"
                                onClick={goToPrevPage}
                                className="inline-flex h-10 w-10 items-center justify-center text-3xl font-light transition hover:text-pink-600"
                                aria-label="Previous page"
                            >
                                ‹
                            </button>

                            {Array.from({ length: pageCount }).map((_, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() => setCurrentPage(index)}
                                    className={`inline-flex h-11 w-11 items-center justify-center rounded-xl transition ${
                                        index === currentPage
                                            ? "bg-black text-white"
                                            : "bg-white text-gray-950 hover:text-pink-600"
                                    }`}
                                    aria-label={`Go to product page ${index + 1}`}
                                >
                                    {index + 1}
                                </button>
                            ))}

                            <button
                                type="button"
                                onClick={goToNextPage}
                                className="inline-flex h-10 w-10 items-center justify-center text-3xl font-light transition hover:text-pink-600"
                                aria-label="Next page"
                            >
                                ›
                            </button>
                        </div>
                    )}
                    </>
                )}
                </div>
            </section>
        </main>
    );
};

export default ProductsPage;
