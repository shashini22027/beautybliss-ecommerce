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

  const categoryKey = id || "";

  const categoryImages = {
    skincare:
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=1600&q=80",
    makeup:
      "https://images.unsplash.com/photo-1631214174585-fe5582DF1a5c?auto=format&fit=crop&w=1600&q=80",
    "body-care":
      "https://images.unsplash.com/photo-1600857062241-98e5dba7f214?auto=format&fit=crop&w=1600&q=80",
    fragrance:
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1600&q=80",
    haircare:
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1600&q=80",
  };

  const categoryDescriptions = {
    skincare: "Nourish your skin with our premium skincare collection",
    makeup: "Express yourself with our curated makeup essentials",
    "body-care": "Pamper yourself with luxurious body care products",
    fragrance: "Discover captivating scents that define your style",
    haircare: "Transform your hair with our professional haircare range",
  };

  const categoryTitle = useMemo(() => {
    if (!categoryKey) return "Category";

    const normalizedKey = slugify(categoryKey);
    const matchingProduct = products.find((product) => {
      const productCategory = product.category;
      const productCategoryName = getTextValue(productCategory);
      const productCategoryId = getCategoryId(productCategory);

      return (
        categoryKey === productCategoryId ||
        normalizedKey === slugify(productCategoryName) ||
        normalizedKey === slugify(productCategoryId)
      );
    });

    if (matchingProduct) {
      return getTextValue(matchingProduct.category, formatCategoryTitle(categoryKey));
    }

    return formatCategoryTitle(categoryKey);
  }, [categoryKey, products]);
  const searchTerm = "";

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

  const heroImage = categoryImages[categoryKey] || categoryImages.skincare;
  const categoryDesc =
    categoryDescriptions[categoryKey] ||
    "Discover premium beauty products curated for you";

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Banner */}
      <section className="relative h-[450px] w-full overflow-hidden lg:h-[500px]">
        <img
          src={heroImage}
          alt={categoryTitle}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />

        <div className="absolute inset-0 flex flex-col items-start justify-end px-6 py-12 sm:px-10 sm:py-16 lg:py-20">
          <div className="max-w-2xl">
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.15em] text-pink-300">
              Collection
            </p>
            <h1 className="mb-4 text-5xl font-serif font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
              {categoryTitle}
            </h1>
            <p className="text-lg leading-relaxed text-pink-50/90">
              {categoryDesc}
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="bg-gradient-to-b from-white via-[#fff9f8] to-white px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-7xl">
          {/* Header Stats */}
          <div className="mb-12 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-pink-500">
                BeautyBliss Curated
              </p>
              <h2 className="text-3xl font-serif font-bold text-gray-950 sm:text-4xl">
                Featured Products
              </h2>
              <p className="mt-2 text-base text-gray-600">
                {filteredProducts.length} products available in this collection
              </p>
            </div>

            <Link
              to="/products"
              className="inline-flex items-center gap-2 rounded-lg bg-pink-600 px-6 py-3 text-sm font-bold uppercase tracking-[0.12em] text-white transition hover:bg-pink-700 hover:shadow-lg"
            >
              Browse All
              <Icon name="arrow" className="h-4 w-4" />
            </Link>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                <div
                  key={item}
                  className="space-y-4 rounded-xl border border-pink-100 bg-white p-4"
                >
                  <div className="aspect-[4/5] animate-pulse rounded-lg bg-gradient-to-br from-pink-100 to-pink-50" />
                  <div className="space-y-2">
                    <div className="h-3 w-1/2 animate-pulse rounded bg-gray-200" />
                    <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
                    <div className="h-3 w-2/3 animate-pulse rounded bg-gray-200" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-4">
              <p className="font-medium text-red-800">{error}</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="rounded-xl border border-pink-200 bg-gradient-to-br from-pink-50 to-pink-25 px-8 py-20 text-center">
              <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-pink-200/50" />
              <p className="mb-2 text-lg font-semibold text-gray-950">
                No products found
              </p>
              <p className="text-gray-600">
                This collection is currently empty. Check back soon!
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProducts.map((product) => {
                const productId = product._id || product.id;

                return (
                  <article
                    key={productId || product.name}
                    className="group flex flex-col overflow-hidden rounded-xl border border-pink-100 bg-white shadow-sm transition duration-300 hover:border-pink-300 hover:shadow-[0_20px_50px_rgba(190,24,93,0.15)]"
                  >
                    {/* Product Image */}
                    <Link
                      to={productId ? `/product/${productId}` : "#"}
                      className="relative block overflow-hidden bg-gradient-to-br from-pink-50 to-pink-25"
                    >
                      <div className="relative aspect-[4/5]">
                        <img
                          src={
                            product.image ||
                            product.images?.[0] ||
                            "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80"
                          }
                          alt={product.name || "Beauty product"}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
                      </div>

                      {/* Badge */}
                      {product.rating && product.rating > 4.5 && (
                        <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-amber-400 px-2.5 py-1 text-xs font-bold text-amber-950 shadow-md">
                          <span>★</span>
                          <span>{Number(product.rating).toFixed(1)}</span>
                        </div>
                      )}
                    </Link>

                    {/* Product Info */}
                    <div className="flex flex-1 flex-col p-4">
                      <p className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-pink-600">
                        {getTextValue(
                          product.brand,
                          getTextValue(product.category, "BeautyBliss")
                        )}
                      </p>

                      <Link to={productId ? `/product/${productId}` : "#"}>
                        <h3 className="mb-3 line-clamp-2 text-base font-bold leading-snug text-gray-950 transition group-hover:text-pink-600">
                          {product.name || "Beauty Essential"}
                        </h3>
                      </Link>

                      {product.description && (
                        <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-gray-600">
                          {product.description}
                        </p>
                      )}

                      {/* Price & Action */}
                      <div className="mt-auto flex items-center justify-between gap-3 pt-4">
                        <div>
                          <p className="text-2xl font-bold text-gray-950">
                            ${Number(product.price || 0).toFixed(2)}
                          </p>
                        </div>
                        <button
                          type="button"
                          className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-pink-600 to-pink-700 text-white transition hover:shadow-lg active:scale-95"
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

      {/* CTA Section */}
      {filteredProducts.length > 0 && (
        <section className="border-t border-pink-100 bg-gradient-to-r from-pink-600 via-pink-500 to-rose-600 px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-4 text-3xl font-serif font-bold text-white sm:text-4xl">
              Complete Your Beauty Routine
            </h2>
            <p className="mb-8 text-lg text-pink-50">
              Discover more premium products to elevate your beauty collection
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-8 py-3 text-sm font-bold uppercase tracking-[0.12em] text-pink-600 transition hover:bg-pink-50"
            >
              Shop Now
              <Icon name="arrow" className="h-4 w-4" />
            </Link>
          </div>
        </section>
      )}
    </main>
  );
};

export default CategoryPage;
