import { useContext, useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";

const Icon = ({ name, className = "w-5 h-5" }) => {
    const paths = {
        search: "M21 21l-4.3-4.3M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z",
        heart: "M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z",
        bag: "M6 8h12l-1 13H7L6 8zm3 0a3 3 0 0 1 6 0",
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

const productDescriptions = [
    {
        name: "Aliver Pumpkin Seed Oil 60ml",
        category: "Skin Care, Body Care, Hair Care, Nourishing Oils",
        price: "රු2,390.00",
        oldPrice: "",
        rating: 5,
        discount: "",
        soldOut: false,
        image:
            "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=700&q=85",
    },
    {
        name: "Aliver Luscious Lips Shimmer Lip Oil",
        category: "Lips",
        price: "From රු1,390.00",
        oldPrice: "",
        rating: 4,
        discount: "-34%",
        soldOut: false,
        image:
            "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=700&q=85",
    },
    {
        name: "Aliver Teeth Whitening Foam Toothpaste Mint Flavour",
        category: "Oral Care",
        price: "රු1,090.00",
        oldPrice: "රු1,650.00",
        rating: 3,
        discount: "-34%",
        soldOut: true,
        image:
            "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=700&q=85",
    },
    {
        name: "Aliver Lip Plumper Lip Gloss for Fuller & Hydrated 2Pcs/Set",
        category: "Lips, Lip glow",
        price: "රු1,650.00",
        oldPrice: "රු2,190.00",
        rating: 4,
        discount: "-25%",
        soldOut: false,
        image:
            "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=700&q=85",
    },
    {
        name: "Brightening Vitamin C Serum",
        category: "Skin Care",
        price: "රු2,850.00",
        oldPrice: "රු3,250.00",
        rating: 5,
        discount: "-12%",
        soldOut: false,
        image:
            "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=700&q=85",
    },
    {
        name: "Rose Cloud Cleanser",
        category: "Cleansers",
        price: "රු3,250.00",
        oldPrice: "",
        rating: 4,
        discount: "",
        soldOut: false,
        image:
            "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=700&q=85",
    },
    {
        name: "Daily Silk Sunscreen",
        category: "Sun Care",
        price: "රු4,200.00",
        oldPrice: "රු4,900.00",
        rating: 5,
        discount: "-14%",
        soldOut: false,
        image:
            "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=700&q=85",
    },
    {
        name: "Velvet Repair Cream",
        category: "Moisturizers",
        price: "රු5,750.00",
        oldPrice: "",
        rating: 4,
        discount: "",
        soldOut: false,
        image:
            "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=700&q=85",
    },
    {
        name: "Glow Boost Vitamin C Drops",
        category: "Skin Care",
        price: "රු2,950.00",
        oldPrice: "",
        rating: 5,
        discount: "New",
        soldOut: false,
        image:
            "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=700&q=85",
    },
    {
        name: "Soft Matte Lip Tint",
        category: "Cosmetics",
        price: "රු1,750.00",
        oldPrice: "",
        rating: 4,
        discount: "New",
        soldOut: false,
        image:
            "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=700&q=85",
    },
    {
        name: "Hydra Dew Face Cream",
        category: "Moisturizers",
        price: "රු3,650.00",
        oldPrice: "",
        rating: 5,
        discount: "New",
        soldOut: false,
        image:
            "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=700&q=85",
    },
    {
        name: "Fresh Bloom Body Mist",
        category: "Fragrances",
        price: "රු2,490.00",
        oldPrice: "",
        rating: 4,
        discount: "New",
        soldOut: false,
        image:
            "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=700&q=85",
    },
    {
        name: "Silk Repair Hair Serum",
        category: "Hair Care",
        price: "රු3,150.00",
        oldPrice: "",
        rating: 5,
        discount: "New",
        soldOut: false,
        image:
            "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=700&q=85",
    },
    {
        name: "Glow Routine Bundle",
        category: "Beauty Sets",
        price: "රු6,990.00",
        oldPrice: "රු8,200.00",
        rating: 5,
        discount: "-15%",
        soldOut: false,
        image:
            "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=700&q=85",
    },
    {
        name: "Aliver Natural Foot Peel Mask 2 Packs (Lavender)",
        category: "Body Care, Foot & Hand",
        price: "රු1,650.00",
        oldPrice: "",
        rating: 5,
        discount: "",
        soldOut: false,
        image:
            "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=700&q=85",
    },
    {
        name: "Aliver Neem Oil 60ml",
        category: "Nourishing Oils",
        price: "රු2,290.00",
        oldPrice: "",
        rating: 4,
        discount: "",
        soldOut: true,
        image:
            "https://images.unsplash.com/photo-1615396899839-c99c121888b0?auto=format&fit=crop&w=700&q=85",
    },
    {
        name: "Aliver Organic Sunflower Oil For Skin 60ml",
        category: "Skin Care, Body Care, Hair Care, Nourishing Oils",
        price: "රු2,290.00",
        oldPrice: "",
        rating: 4,
        discount: "",
        soldOut: false,
        image:
            "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=700&q=85",
    },
    {
        name: "Aliver Rosemary Essential Oil 60ml",
        category: "Hair Care, Nourishing Oils",
        price: "රු2,490.00",
        oldPrice: "",
        rating: 5,
        discount: "New",
        soldOut: false,
        image:
            "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=700&q=85",
    },
    {
        name: "Aliver Coffee Body Scrub",
        category: "Body Care",
        price: "රු1,990.00",
        oldPrice: "රු2,450.00",
        rating: 4,
        discount: "-19%",
        soldOut: false,
        image:
            "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=700&q=85",
    },
    {
        name: "Aliver Aloe Vera Soothing Gel",
        category: "Skin Care, Body Care",
        price: "රු1,850.00",
        oldPrice: "",
        rating: 5,
        discount: "",
        soldOut: false,
        image:
            "https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=700&q=85",
    },
];

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

const ProductsPage = () => {
    const { addToCart } = useContext(CartContext);
    const { toggleWishlist } = useContext(WishlistContext);
    const [products, setProducts] = useState(productDescriptions);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");
    const [currentPage, setCurrentPage] = useState(0);
    const productsPerPage = 6;

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
        setCurrentPage(0);
    }, [activeCategory]);

    useEffect(() => {
        setProducts(productDescriptions);
        setLoading(false);
        setError("");
    }, []);

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
            { name: "COSMETICS", value: "cosmetics", icon: "makeup" },
            { name: "HAIRCARE", value: "haircare", icon: "hair" },
            { name: "FRAGRANCES", value: "fragrances", icon: "oil" },
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
                                <span className="block text-xl font-extrabold uppercase leading-6 text-white md:text-2xl">
                                    {category.name}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-[1540px] px-6 py-16 lg:py-20">
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
                    <>
                    <div className="grid gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
                        {visibleProducts.map((product) => {
                            const id = getProductId(product);
                            const productPath = `/product/${id}`;

                            return (
                                <article
                                    key={id || product.name}
                                    className="group relative block text-center"
                                >
                                    <div className="relative mx-auto mb-5 flex h-[350px] w-full max-w-[390px] items-center justify-center overflow-hidden bg-white">
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
                                                src={
                                                    product.image ||
                                                    product.images?.[0] ||
                                                    "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80"
                                                }
                                                alt={product.name || "Beauty product"}
                                                className="h-[330px] w-full max-w-[360px] object-contain transition duration-500 group-hover:scale-105"
                                            />
                                        </Link>

                                        <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center opacity-0 transition duration-300 group-hover:opacity-100">
                                            <div className="flex overflow-hidden rounded-lg bg-white shadow-[0_12px_32px_rgba(0,0,0,0.16)]">
                                                <button
                                                    type="button"
                                                    aria-label="Add to cart"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        addToCart(getCartProduct(product), 1);
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
                                    </div>

                                    <Link to={productPath} state={{ product }}>
                                        <h3 className="mx-auto min-h-[48px] max-w-[320px] text-lg font-bold leading-snug text-gray-800 transition group-hover:text-pink-600">
                                            {product.name || "Beauty Essential"}
                                        </h3>
                                    </Link>

                                    <p className="mt-2 min-h-[24px] text-base text-gray-400">
                                        {getTextValue(
                                            product.category,
                                            "BeautyBliss"
                                        )}
                                    </p>

                                    <div className="mt-3 flex justify-center text-xl leading-none">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <span
                                                key={star}
                                                className={star <= (product.rating || 4) ? "text-yellow-400" : "text-gray-300"}
                                            >
                                                ★
                                            </span>
                                        ))}
                                    </div>

                                    <div className="mt-4 flex items-center justify-center gap-2 text-lg font-bold">
                                        {product.oldPrice && (
                                            <span className="text-base font-normal text-gray-400 line-through">
                                                {typeof product.oldPrice === "string" ? product.oldPrice : `Rs. ${Number(product.oldPrice || 0).toFixed(2)}`}
                                            </span>
                                        )}
                                        <span className="text-gray-950">
                                            {typeof product.price === "string" ? product.price : `Rs. ${Number(product.price || 0).toFixed(2)}`}
                                        </span>
                                    </div>

                                    <div className="mt-4 space-y-2 text-sm font-semibold text-gray-400">
                                        <p>3 X Rs. 763.33 with</p>
                                        <p>or 3 X රු763.33 with KOKO</p>
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
            </section>
        </main>
    );
};

export default ProductsPage;
