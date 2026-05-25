import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

const Icon = ({ name, className = "w-5 h-5" }) => {
  const paths = {
    search: "M21 21l-4.3-4.3M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z",
    arrow: "M5 12h14m-6-6 6 6-6 6",
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

const getCategoryId = (category) => {
  if (!category) return "";
  if (typeof category === "string" || typeof category === "number") return String(category);
  return category._id || category.id || getTextValue(category);
};

const slugify = (text) =>
  String(text || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const formatCategoryTitle = (value) =>
  String(value || "")
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((word) => `${word[0].toUpperCase()}${word.slice(1)}`)
    .join(" ");

const CategoryPage = () => {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const categoryKey = id || "";
  const categoryTitle = categoryKey ? formatCategoryTitle(categoryKey) : "Category";

  const heroImages = {
    skincare:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80",
    makeup:
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80",
    "body-care":
      "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1200&q=80",
  };

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();

        if (!res.ok) throw new Error(data?.message || "Unable to load products");
        setProducts(Array.isArray(data) ? data : data.products || []);
      } catch (err) {
        setError(err.message || "Unable to load products");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    const normalizedCategory = slugify(categoryKey);

    return products.filter((product) => {
      const productCategory = getTextValue(product.category);
      const productCategoryId = getCategoryId(product.category);
      const productSlug = slugify(productCategory);

      const matchesCategory =
        !normalizedCategory ||
        normalizedCategory === productSlug ||
        normalizedCategory === slugify(productCategoryId) ||
        normalizedCategory === slugify(productCategory);

      const matchesSearch = `${product.name || ""} ${productCategory}`
        .toLowerCase()
        .includes(searchTerm.trim().toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [categoryKey, products, searchTerm]);

  return (
    <main className="min-h-screen bg-[#faf7f4] px-4 py-8 text-gray-950 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl overflow-hidden rounded-lg border border-gray-200 bg-white shadow-[0_24px_80px_rgba(28,25,23,0.08)] lg:grid-cols-[0.92fr_1fr]">
        <section className="relative hidden bg-[#1f1a17] p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-0 opacity-80">
            <img
              src={heroImages[categoryKey] || heroImages.skincare}
              alt={categoryTitle}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1f1a17] via-[#1f1a17]/70 to-[#1f1a17]/20" />
          </div>

          <div className="relative z-10">
            <Link
              to="/"
              className="inline-flex items-center text-2xl font-serif font-bold tracking-[0.18em]"
            >
              BEAUTYBLISS
            </Link>
          </div>

          <div className="relative z-10 max-w-md">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.32em] text-pink-200">
              Category Collection
            </p>
            <h1 className="text-5xl font-serif font-bold leading-tight tracking-tight">
              {categoryTitle}
            </h1>
            <p className="mt-5 text-sm leading-6 text-pink-50/80">
              Curated products for the {categoryTitle} routine, designed to help you refresh, replenish, and glow.
            </p>
          </div>
        </section>

        <section className="relative flex items-start justify-center p-6 sm:p-10">
          <div className="w-full max-w-4xl">
            <div className="mb-8">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.28em] text-pink-500">
                Category View
              </p>
              <h2 className="text-4xl font-serif font-bold tracking-tight text-gray-950">
                {categoryTitle}
              </h2>
              <p className="mt-3 text-sm leading-6 text-gray-500">
                Browse products selected for this category or search to refine your results.
              </p>
            </div>

            <div className="mb-8 grid gap-4 sm:grid-cols-[1fr_auto]">
              <label className="relative block w-full">
                <Icon
                  name="search"
                  className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search within this category"
                  className="h-12 w-full rounded-lg border border-gray-200 bg-white pl-12 pr-4 text-sm font-medium text-gray-950 outline-none transition placeholder:text-gray-400 focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
                />
              </label>
              <Link
                to="/products"
                className="inline-flex h-12 items-center justify-center rounded-lg border border-gray-200 bg-white px-5 text-sm font-bold uppercase tracking-[0.18em] text-gray-950 transition hover:border-pink-300 hover:bg-pink-50"
              >
                View all products
              </Link>
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
                  Try a different search or visit the full store.
                </p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredProducts.map((product) => {
                  const productId = product._id || product.id;

                  return (
                    <article
                      key={productId || product.name}
                      className="group overflow-hidden rounded-lg border border-pink-200 shadow-sm transition hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(190,24,93,0.12)]"
                      style={{ backgroundColor: "#fff4f6" }}
                    >
                      <Link to={productId ? `/product/${productId}` : "#"} className="block">
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
                        </div>
                      </Link>

                      <div className="p-5">
                        <div className="mb-3 flex items-center justify-between gap-3">
                          <p className="truncate text-xs font-bold uppercase tracking-[0.18em] text-pink-500">
                            {getTextValue(product.brand, getTextValue(product.category, "BeautyBliss"))}
                          </p>
                          <div className="flex items-center gap-1 text-xs font-bold text-gray-500">
                            <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                            {product.rating || "4.8"}
                          </div>
                        </div>

                        <Link to={productId ? `/product/${productId}` : "#"}>
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
                            <Icon name="arrow" className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

export default CategoryPage;
