import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BadgePercent, Gift, Sparkles, Truck } from 'lucide-react';
import API from '../services/api';
import ProductCard from '../components/ProductCard';

const fallbackOffers = [
  {
    title: 'Glow Starter Set',
    description: 'Save on daily skincare essentials for fresh, hydrated skin.',
    badge: 'Up to 25% off',
    accent: 'from-pink-600 to-rose-500',
  },
  {
    title: 'Makeup Pair Deals',
    description: 'Bundle lips, cheeks, and eyes for a complete soft-glam look.',
    badge: 'Bundle savings',
    accent: 'from-fuchsia-600 to-pink-500',
  },
  {
    title: 'Fragrance Picks',
    description: 'Limited-time edits on signature scents and gift-ready minis.',
    badge: 'Limited time',
    accent: 'from-violet-600 to-pink-500',
  },
];

const getProductsFromResponse = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.products)) return data.products;
  if (Array.isArray(data?.data)) return data.data;
  return [];
};

const isSpecialOffer = (product) => {
  const category = typeof product.category === 'object'
    ? product.category?.name || product.category?.title || ''
    : product.category || '';

  return Boolean(product.isSpecialOffer) || String(category).trim().toLowerCase() === 'special offers';
};

const OffersPage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOfferProducts = async () => {
      try {
        const { data } = await API.get('/products');
        const products = getProductsFromResponse(data);
        setFeaturedProducts(products.filter(isSpecialOffer));
      } catch (error) {
        console.error('Failed to load offer products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOfferProducts();
  }, []);

  return (
    <main className="bg-stone-50">
      <section className="border-b border-pink-100 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8 lg:py-14">
          <div className="flex flex-col justify-center">
            <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-pink-200 bg-pink-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-pink-700">
              <BadgePercent size={16} />
              BeautyBliss Offers
            </div>
            <h1 className="max-w-3xl text-4xl font-bold leading-tight text-stone-950 sm:text-5xl">
              Fresh beauty picks with sweeter prices.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-stone-600">
              Explore seasonal deals, curated sets, and value bundles across makeup, skincare, and fragrance.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/products?category=special%20offers"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-pink-700 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-pink-200 transition hover:bg-pink-800"
              >
                Shop all deals
                <ArrowRight size={18} />
              </Link>
              <Link
                to="/wishlist"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-stone-200 bg-white px-6 py-3 text-sm font-bold text-stone-700 transition hover:border-pink-200 hover:text-pink-700"
              >
                View wishlist
              </Link>
            </div>
          </div>

          <div className="grid gap-4">
            {fallbackOffers.map((offer) => (
              <article key={offer.title} className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm">
                <div className={`h-2 bg-gradient-to-r ${offer.accent}`} />
                <div className="p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-pink-700">{offer.badge}</p>
                  <h2 className="mt-2 text-xl font-bold text-stone-950">{offer.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-stone-600">{offer.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-stone-200 bg-white p-5">
            <Gift className="text-pink-700" size={24} />
            <h3 className="mt-3 font-bold text-stone-950">Gift-ready edits</h3>
            <p className="mt-2 text-sm leading-6 text-stone-600">Curated sets that make checkout faster and gifting easier.</p>
          </div>
          <div className="rounded-lg border border-stone-200 bg-white p-5">
            <Sparkles className="text-pink-700" size={24} />
            <h3 className="mt-3 font-bold text-stone-950">Seasonal favorites</h3>
            <p className="mt-2 text-sm leading-6 text-stone-600">Trending beauty essentials refreshed for the current season.</p>
          </div>
          <div className="rounded-lg border border-stone-200 bg-white p-5">
            <Truck className="text-pink-700" size={24} />
            <h3 className="mt-3 font-bold text-stone-950">Easy delivery</h3>
            <p className="mt-2 text-sm leading-6 text-stone-600">Add deals to cart and continue through the regular checkout flow.</p>
          </div>
        </div>

        <div className="mt-10 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-pink-700">Special Offers</p>
            <h2 className="mt-2 text-2xl font-bold text-stone-950">Products on offer</h2>
          </div>
          <Link to="/products?category=special%20offers" className="hidden text-sm font-bold text-pink-700 hover:text-pink-800 sm:inline-flex">
            View all offers
          </Link>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {loading ? (
            [...Array(4)].map((_, index) => (
              <div key={index} className="h-72 animate-pulse rounded-lg border border-stone-200 bg-white" />
            ))
          ) : featuredProducts.length > 0 ? (
            featuredProducts.map((product) => (
              <ProductCard key={product._id || product.id || product.name} product={product} />
            ))
          ) : (
            <div className="rounded-lg border border-stone-200 bg-white p-6 text-sm text-stone-600 sm:col-span-2 lg:col-span-4">
              There are no products marked as Special Offers right now. Check back soon or browse the shop.
              <Link to="/products?category=special%20offers" className="ml-1 font-semibold text-pink-700 underline underline-offset-2">
                View Special Offers in the shop
              </Link>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default OffersPage;

