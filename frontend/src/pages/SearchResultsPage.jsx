import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';

/* Inline grid-switcher icons (avoids missing lucide exports) */
const Grid2Icon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
  </svg>
);
const Grid3Icon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="5" height="5" /><rect x="9.5" y="2" width="5" height="5" /><rect x="17" y="2" width="5" height="5" />
    <rect x="2" y="9.5" width="5" height="5" /><rect x="9.5" y="9.5" width="5" height="5" /><rect x="17" y="9.5" width="5" height="5" />
    <rect x="2" y="17" width="5" height="5" /><rect x="9.5" y="17" width="5" height="5" /><rect x="17" y="17" width="5" height="5" />
  </svg>
);
const Grid4Icon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="4" height="4" /><rect x="8.7" y="2" width="4" height="4" /><rect x="15.3" y="2" width="4" height="4" />
    <rect x="2" y="10" width="4" height="4" /><rect x="8.7" y="10" width="4" height="4" /><rect x="15.3" y="10" width="4" height="4" />
    <rect x="2" y="18" width="4" height="4" /><rect x="8.7" y="18" width="4" height="4" /><rect x="15.3" y="18" width="4" height="4" />
  </svg>
);
import ProductCard from '../components/ProductCard';
import API from '../services/api';

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get('q') || '';
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [gridCols, setGridCols] = useState(4);
  const [sortBy, setSortBy] = useState('relevance');

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setError('');
        setLoading(true);
        const { data } = await API.get(`/products?keyword=${keyword}`);
        setProducts(Array.isArray(data) ? data : data.products || []);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Unable to load search results.');
      } finally {
        setLoading(false);
      }
    };

    if (keyword) {
      fetchResults();
    } else {
      setProducts([]);
    }
  }, [keyword]);

  // Sort products
  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return (a.price || 0) - (b.price || 0);
      case 'price-high':
        return (b.price || 0) - (a.price || 0);
      case 'name-az':
        return (a.name || '').localeCompare(b.name || '');
      case 'name-za':
        return (b.name || '').localeCompare(a.name || '');
      default:
        return 0;
    }
  });

  // Grid column classes
  const gridClass =
    gridCols === 2
      ? 'grid-cols-1 sm:grid-cols-2'
      : gridCols === 3
      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
      : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';

  return (
    <main className="min-h-screen bg-white text-gray-950">
      {/* ── Hero Banner (same style as About Us page) ── */}
      <section className="relative min-h-[420px] overflow-hidden">
        <img
          src="/images/banner.jpg"
          alt="Search results"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/35" />
        <div className="relative z-10 mx-auto flex min-h-[420px] max-w-[1540px] flex-col items-center justify-center px-6 py-16 text-white">
          <h1 className="text-center text-5xl font-bold tracking-tight md:text-7xl">
            Search Results for:{' '}
            <span className="italic">{keyword || '...'}</span>
          </h1>
        </div>
      </section>

      {/* ── Content Area ── */}
      <section className="mx-auto max-w-[1540px] px-6 py-10">
        {/* Breadcrumb + Toolbar Row */}
        <div className="mb-8 flex flex-col gap-4 border-b border-gray-200 pb-6 lg:flex-row lg:items-center lg:justify-between">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link to="/" className="transition hover:text-gray-950">Home</Link>
            <span>/</span>
            <Link to="/products" className="transition hover:text-gray-950">Shop</Link>
            <span>/</span>
            <span className="font-semibold text-gray-950">
              Search results for "{keyword}"
            </span>
          </nav>

          {/* Toolbar: Grid Switcher + Sort */}
          <div className="flex flex-wrap items-center gap-5">
            {/* Result Count */}
            <span className="text-sm text-gray-500">
              <span className="font-bold text-gray-950">{products.length}</span>{' '}
              {products.length === 1 ? 'product' : 'products'} found
            </span>

            {/* Grid Switcher */}
            <div className="flex items-center gap-1 border-l border-gray-200 pl-4">
              <button
                type="button"
                onClick={() => setGridCols(2)}
                className={`p-2 transition ${gridCols === 2 ? 'text-gray-950' : 'text-gray-400 hover:text-gray-600'}`}
                aria-label="2-column grid"
                title="2 columns"
              >
                <Grid2Icon />
              </button>
              <button
                type="button"
                onClick={() => setGridCols(3)}
                className={`p-2 transition ${gridCols === 3 ? 'text-gray-950' : 'text-gray-400 hover:text-gray-600'}`}
                aria-label="3-column grid"
                title="3 columns"
              >
                <Grid3Icon />
              </button>
              <button
                type="button"
                onClick={() => setGridCols(4)}
                className={`p-2 transition ${gridCols === 4 ? 'text-gray-950' : 'text-gray-400 hover:text-gray-600'}`}
                aria-label="4-column grid"
                title="4 columns"
              >
                <Grid4Icon />
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="border-l border-gray-200 pl-4">
              <select
                id="search-sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="cursor-pointer border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 outline-none transition focus:border-gray-400"
              >
                <option value="relevance">Relevance</option>
                <option value="price-low">Price: Low → High</option>
                <option value="price-high">Price: High → Low</option>
                <option value="name-az">Name: A → Z</option>
                <option value="name-za">Name: Z → A</option>
              </select>
            </div>
          </div>
        </div>

        {/* ── Error State ── */}
        {error && (
          <div className="mb-8 border border-red-200 bg-red-50 px-6 py-5 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {/* ── Loading State ── */}
        {loading ? (
          <div className={`grid gap-6 ${gridClass}`}>
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="aspect-[3/4] animate-pulse border border-gray-100 bg-gray-50"
              />
            ))}
          </div>
        ) : keyword ? (
          sortedProducts.length > 0 ? (
            /* ── Product Grid ── */
            <div className={`grid gap-6 ${gridClass}`}>
              {sortedProducts.map((prod) => (
                <ProductCard key={prod._id} product={prod} />
              ))}
            </div>
          ) : (
            /* ── No Results ── */
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-6 flex h-20 w-20 items-center justify-center bg-gray-100">
                <Search size={32} className="text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-950">No results found</h2>
              <p className="mt-3 max-w-md text-gray-500">
                We couldn't find any products matching "<span className="font-semibold text-gray-700">{keyword}</span>".
                Try a different keyword or browse our full collection.
              </p>
              <Link
                to="/products"
                className="mt-8 inline-flex items-center justify-center bg-[#2b2b2b] px-9 py-3 text-sm font-bold uppercase tracking-widest text-white transition hover:bg-pink-600"
              >
                Browse All Products
              </Link>
            </div>
          )
        ) : (
          /* ── Empty Search ── */
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-6 flex h-20 w-20 items-center justify-center bg-gray-100">
              <Search size={32} className="text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-950">Start your search</h2>
            <p className="mt-3 max-w-md text-gray-500">
              Enter a keyword in the search bar to find your favorite beauty products.
            </p>
            <Link
              to="/products"
              className="mt-8 inline-flex items-center justify-center bg-[#2b2b2b] px-9 py-3 text-sm font-bold uppercase tracking-widest text-white transition hover:bg-pink-600"
            >
              Browse All Products
            </Link>
          </div>
        )}
      </section>
    </main>
  );
};

export default SearchResultsPage;
