import React, { useState, useEffect, useRef } from 'react';
import HeroBanner from '../components/HeroBanner';
import CategoryCards from '../components/CategoryCards';
import ProductCard from '../components/ProductCard';
import API from '../services/api';

const HomePage = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [visibleCount, setVisibleCount] = useState(4);
  const exploreRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const prodRes = await API.get('/products');
        const catRes = await API.get('/categories');
        setAllProducts(prodRes.data);
        setCategories(catRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 4, allProducts.length));
    setTimeout(() => {
      exploreRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, 100);
  };

  const handleViewAll = () => {
    setVisibleCount(allProducts.length);
    setTimeout(() => {
      exploreRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const featured = allProducts.slice(0, 4);
  const remaining = allProducts.slice(4, visibleCount);

  return (
    <div className="space-y-16">
      {/* Hero Banner Section */}
      <HeroBanner />

      {/* Categories Grid */}
      <CategoryCards categories={categories} />

      {/* Featured Bestsellers Section */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-serif text-stone-900 font-bold">Featured Bestsellers</h2>
          <p className="text-stone-500 text-xs mt-1">Discover our top-rated cosmetics & skincare selections.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {featured.map((prod) => (
            <ProductCard key={prod._id} product={prod} />
          ))}
        </div>
        {visibleCount < allProducts.length && (
          <div className="text-center pt-4">
            <button
              onClick={handleViewAll}
              className="bg-stone-900 hover:bg-stone-950 text-white font-semibold px-8 py-3 rounded-full text-xs uppercase tracking-wider transition"
            >
              View All Products
            </button>
          </div>
        )}
      </div>

      {/* Explore More Collections section-by-section */}
      {visibleCount > 4 && (
        <div ref={exploreRef} className="space-y-8 pt-8 border-t border-pink-100/60 transition-all duration-500">
          <div className="text-center">
            <h2 className="text-3xl font-serif text-stone-900 font-bold">Explore Our Collections</h2>
            <p className="text-stone-500 text-xs mt-1">Glow, style, and nourish with premium beauty essentials.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {remaining.map((prod) => (
              <ProductCard key={prod._id} product={prod} />
            ))}
          </div>
          {visibleCount < allProducts.length && (
            <div className="text-center pt-4">
              <button
                onClick={handleLoadMore}
                className="bg-primary-50 hover:bg-primary-100 text-primary-700 border border-primary-200 font-semibold px-8 py-2.5 rounded-full text-xs uppercase tracking-wider transition"
              >
                Load Next Section
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HomePage;
