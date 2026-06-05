import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { WishlistContext } from "../context/WishlistContext";
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
  const wishlistContext = useContext(WishlistContext) || {};
  const rawWishlistItems = Array.isArray(wishlistContext.wishlistItems)
    ? wishlistContext.wishlistItems
    : [];
  const wishlistItems = rawWishlistItems.filter(
    (item) => item && typeof item === "object"
  );
  const toggleWishlist = wishlistContext.toggleWishlist || (() => {});
  const navigate = useNavigate();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  const menuItems = [
    { label: "Dashboard", to: "/profile" },
    { label: "Orders", to: "/orders" },
    { label: "Addresses", to: "/profile" },
    { label: "Account details", to: "/profile" },
    { label: "Wishlist", to: "/wishlist", active: true },
  ];

  return (
    <main className="min-h-screen bg-white text-gray-950">
      <section className="mx-auto max-w-[1460px] px-6 py-12">
        <div className="grid gap-10 lg:grid-cols-[315px_1fr]">
          <aside className="border-gray-200 lg:border-r lg:pr-9">
            <h2 className="border-b border-gray-200 pb-5 text-2xl font-extrabold uppercase">
              My Account
            </h2>
            <nav className="mt-5 space-y-1 text-lg font-bold">
              {menuItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  className={`block px-5 py-3 transition hover:bg-[#f2f2f2] hover:text-pink-600 ${
                    item.active ? "bg-[#f2f2f2]" : ""
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <button
                type="button"
                onClick={logoutHandler}
                className="block w-full px-5 py-3 text-left transition hover:bg-[#f2f2f2] hover:text-pink-600"
              >
                Logout
              </button>
            </nav>
          </aside>

          <section>
            <div className="flex flex-col gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
              <h1 className="text-2xl font-extrabold uppercase">Your Products Wishlist</h1>
              <div className="flex items-center gap-3 text-lg font-bold">
                <span>Share:</span>
                <span className="text-gray-700">f</span>
                <span className="text-gray-700">☏</span>
              </div>
            </div>

            {wishlistItems.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-lg text-gray-600">Your wishlist is currently empty.</p>
                <Link
                  to="/products"
                  className="mt-8 inline-flex h-12 items-center justify-center bg-[#2b2b2b] px-8 text-sm font-bold uppercase text-white transition hover:bg-pink-600"
                >
                  Browse products
                </Link>
              </div>
            ) : (
              <div className="pt-6">
                <div className="mb-8 grid grid-cols-[1fr_auto] items-center text-base font-bold text-gray-600">
                  <button
                    type="button"
                    onClick={() => toggleWishlist(wishlistItems[0])}
                    className="inline-flex items-center gap-2 transition hover:text-red-600"
                  >
                    <Icon name="close" className="h-5 w-5" />
                    Remove
                  </button>
                  <input type="checkbox" className="h-4 w-4" aria-label="Select wishlist item" />
                </div>

                <div className="grid gap-x-10 gap-y-14 sm:grid-cols-2 xl:grid-cols-3">
                  {wishlistItems.map((product) => {
                    const productId = getProductId(product);
                    const price = getProductPrice(product);
                    const image = product?.image || product?.images?.[0];
                    const rating = Number(product.rating || 4);

                    return (
                      <article key={productId || product.name || price} className="max-w-[430px] text-center">
                        <Link
                          to={productId ? `/product/${productId}` : "#"}
                          state={{ product }}
                          className="mx-auto flex h-[340px] w-full items-center justify-center bg-white"
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
                        <p className="mt-3 text-lg">
                          From <span className="font-bold text-gray-950">{formatPrice(price)}</span>
                        </p>
                      </article>
                    );
                  })}
                </div>
              </div>
            )}
          </section>
        </div>
      </section>
    </main>
  );
};

export default WishlistPage;
