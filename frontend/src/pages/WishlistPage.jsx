import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { WishlistContext } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';

const WishlistPage = () => {
  const { wishlistItems } = useContext(WishlistContext);

  return (
    <main className="min-h-screen bg-[#faf7f4] px-4 py-10 text-gray-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <section className="overflow-hidden rounded-[2rem] border border-gray-200 bg-white px-6 py-8 shadow-[0_24px_80px_rgba(28,25,23,0.08)] sm:px-10 sm:py-12">
          <div className="mb-8 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.28em] text-pink-500">
              My Wishlist
            </p>
            <h1 className="text-4xl font-serif font-bold tracking-tight text-gray-950 sm:text-5xl">
              Your beauty favorites
            </h1>
            <p className="mt-3 max-w-2xl mx-auto text-sm leading-7 text-gray-500">
              Save the beauty items you love for easy access later. Add from product pages or remove items as your routine evolves.
            </p>
          </div>

          {wishlistItems.length === 0 ? (
            <div className="rounded-[1.75rem] border border-pink-100 bg-[#fff4f6] px-8 py-14 text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-gray-400">
                No saved items yet
              </p>
              <p className="mt-4 text-base text-gray-600">
                Your wishlist is currently empty. Start adding products you want to keep an eye on.
              </p>
              <Link
                to="/products"
                className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-gray-950 px-8 text-sm font-bold uppercase tracking-[0.18em] text-white transition hover:bg-pink-600"
              >
                Browse products
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {wishlistItems.map((prod) => (
                <ProductCard key={prod._id} product={prod} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default WishlistPage;
