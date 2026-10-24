import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Heart } from "lucide-react";
import { ShoppingCart } from "lucide-react";
import { selectWishlistItems, toggleWishlist as reduxToggleWishlist } from "../redux/slices/wishlistSlice";
import { addToCart } from "../redux/slices/cartSlice";
import { formatPrice, parsePrice } from "../utils/currency";

const Icon = ({ name, className = "w-5 h-5" }) => {
  const paths = {
    close: "M18 6 6 18M6 6l12 12",
    star: "M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21 7 14.2 2 9.3l6.9-1L12 2z",
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

const getProductId = (product) => product?._id || product?.id || product?.slug || product?.name;

const getCategoryName = (category) => {
  if (typeof category === "object" && category?.name) return category.name;
  return typeof category === "string" ? category : null;
};

const getBrandName = (brand) => {
  if (typeof brand === "object" && brand?.name) return brand.name;
  return typeof brand === "string" ? brand : null;
};

const getProductPrice = (product) => {
  return parsePrice(product?.price);
};

const WishlistPage = () => {
  const dispatch = useDispatch();
  const rawWishlistItems = useSelector(selectWishlistItems);
  const wishlistItems = Array.isArray(rawWishlistItems)
    ? rawWishlistItems.filter((item) => item && typeof item === "object")
    : [];
  const toggleWishlist = (product) => dispatch(reduxToggleWishlist(product));
  const moveToCart = (product) => {
    dispatch(addToCart({ product, qty: 1 }));
  };

  const [selectedItems, setSelectedItems] = useState(new Set());

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = wishlistItems.map(getProductId).filter(Boolean);
      setSelectedItems(new Set(allIds));
    } else {
      setSelectedItems(new Set());
    }
  };

  const handleSelectItem = (productId, isChecked) => {
    const newSelected = new Set(selectedItems);
    if (isChecked) {
      newSelected.add(productId);
    } else {
      newSelected.delete(productId);
    }
    setSelectedItems(newSelected);
  };

  const handleRemoveSelected = () => {
    if (selectedItems.size === 0) return;
    wishlistItems.forEach(product => {
      const id = getProductId(product);
      if (selectedItems.has(id)) {
        toggleWishlist(product);
      }
    });
    setSelectedItems(new Set());
  };

  const isAllSelected = wishlistItems.length > 0 && selectedItems.size === wishlistItems.length;

  return (
    <main className="min-h-screen bg-white text-gray-950">
      {/* Hero Banner */}
      <section className="relative min-h-[420px] overflow-hidden">
        <img
          src="/images/banner.jpg"
          alt="Wishlist"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/35" />
        <div className="relative z-10 mx-auto flex min-h-[420px] max-w-[1540px] flex-col items-center justify-center px-6 py-16 text-center text-white">
          <h1 className="text-6xl font-bold uppercase tracking-tight md:text-7xl">
            Wishlist
          </h1>
          <div className="mt-6 flex items-center gap-3 text-base font-medium">
            <Link to="/" className="text-white/85 transition hover:text-white">
              Home
            </Link>
            <span>/</span>
            <span className="font-bold">Wishlist</span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        {wishlistItems.length === 0 ? (
          <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
            <Heart
              aria-hidden="true"
              className="mb-8 h-36 w-36 stroke-[1.5] text-gray-200"
            />
            <h2 className="text-4xl font-bold text-stone-900 sm:text-5xl">
              This wishlist is empty.
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-stone-600">
              You don&apos;t have any products in your wishlist yet. You will find
              a lot of interesting products on our Shop page.
            </p>
            <Link
              to="/products"
              className="mt-7 inline-flex items-center justify-center bg-[#2b2b2b] px-8 py-3 text-sm font-bold uppercase tracking-[0.08em] text-white transition hover:bg-pink-600"
            >
              Return to Shop
            </Link>
          </div>
        ) : (
          <section>
            <div className="flex flex-col gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="mb-2 text-sm font-bold uppercase tracking-widest text-rose-600">
                  Your Beauty Picks
                </p>
                <h2 className="text-3xl font-bold text-stone-900 sm:text-4xl">
                  Your Products Wishlist
                </h2>
              </div>
            </div>

            <div className="pt-8">
                <div className="mb-8 flex items-center justify-between text-base font-bold text-gray-600">
                  <button
                    type="button"
                    onClick={handleRemoveSelected}
                    disabled={selectedItems.size === 0}
                    className={`inline-flex items-center gap-2 transition ${selectedItems.size > 0 ? "hover:text-red-600 cursor-pointer" : "opacity-50 cursor-not-allowed"}`}
                  >
                    <Icon name="close" className="h-5 w-5" />
                    Remove Selected
                  </button>
                  <div className="flex items-center gap-2">
                    <label htmlFor="selectAll" className="cursor-pointer select-none">Select All</label>
                    <input 
                      type="checkbox" 
                      id="selectAll"
                      className="h-4 w-4 cursor-pointer" 
                      checked={isAllSelected}
                      onChange={handleSelectAll}
                    />
                  </div>
                </div>

                <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 xl:grid-cols-3">
                  {wishlistItems.map((product) => {
                    const productId = getProductId(product);
                    const price = getProductPrice(product);
                    const image = product?.image || product?.images?.[0];
                    const rating = Number(product.rating || 4);

                    return (
                      <article key={productId || product.name || price} className="text-center mx-auto w-full">
                        <div className="relative mx-auto flex h-[340px] w-full items-center justify-center bg-white group border border-gray-100 p-4">
                          <input 
                            type="checkbox" 
                            className="absolute top-4 right-4 h-5 w-5 z-10 cursor-pointer"
                            checked={selectedItems.has(productId)}
                            onChange={(e) => handleSelectItem(productId, e.target.checked)}
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              toggleWishlist(product);
                            }}
                            className="absolute top-4 left-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white text-gray-500 shadow hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                            aria-label="Remove from wishlist"
                          >
                            <Icon name="close" className="h-4 w-4" />
                          </button>
                          <Link
                            to={productId ? `/product/${productId}` : "#"}
                            state={{ product }}
                            className="h-full w-full flex items-center justify-center"
                          >
                            {image ? (
                              <img
                                src={image}
                                alt={product?.name || "Wishlist product"}
                                className="h-full w-full object-contain"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center bg-[#f6f6f6] text-gray-400">
                                No image
                              </div>
                            )}
                          </Link>
                        </div>

                        <Link
                          to={productId ? `/product/${productId}` : "#"}
                          state={{ product }}
                          className="mx-auto mt-6 block max-w-[360px] text-xl font-bold leading-7 text-gray-800 transition hover:text-pink-600"
                        >
                          {product?.name || "Wishlist product"}
                        </Link>
                        <p className="mt-3 text-lg text-gray-400">
                          {getCategoryName(product?.category) || getBrandName(product?.brand) || "Beauty product"}
                        </p>
                        <div className="mt-3 flex justify-center text-xl leading-none">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Icon
                              key={star}
                              name="star"
                              className={`h-5 w-5 ${
                                star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <div className="mt-3 flex flex-col items-center gap-0.5">
                          {product?.compareAtPrice && product.compareAtPrice > price && (
                            <span className="text-sm text-gray-400 line-through">
                              {formatPrice(product.compareAtPrice)}
                            </span>
                          )}
                          <span className="text-base font-extrabold text-gray-950">
                            {typeof product.price === 'number' ? formatPrice(price) : product.price}
                          </span>
                        </div>
                        <button type="button" onClick={() => moveToCart(product)} disabled={Number(product?.countInStock ?? 1) < 1} className="mt-4 inline-flex min-h-11 items-center justify-center gap-2 bg-[#292526] px-5 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-[#a94f61] disabled:cursor-not-allowed disabled:opacity-50">
                          <ShoppingCart size={16} /> Move to cart
                        </button>
                      </article>
                    );
                  })}
                </div>
            </div>
          </section>
        )}
      </section>
    </main>
  );
};

export default WishlistPage;
