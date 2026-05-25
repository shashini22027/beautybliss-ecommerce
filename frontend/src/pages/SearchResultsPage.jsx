import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import API from '../services/api';

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get('q') || '';
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

  return (
    <main className="min-h-screen bg-[#faf7f4] px-4 py-10 text-gray-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <section className="overflow-hidden rounded-[2rem] border border-gray-200 bg-white px-6 py-8 shadow-[0_24px_80px_rgba(28,25,23,0.08)] sm:px-10 sm:py-10">
          <div className="mb-8">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.28em] text-pink-500">
              Search Results
            </p>
            <h1 className="text-4xl font-serif font-bold tracking-tight text-gray-950 sm:text-5xl">
              Results for <span className="text-pink-600 italic">"{keyword || 'everything'}"</span>
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-500">
              Discover the best BeautyBliss picks that match your search. Use the search bar again to refine results or explore trending categories.
            </p>
          </div>

          {error ? (
            <div className="rounded-3xl border border-red-100 bg-red-50 px-5 py-6 text-sm font-medium text-red-700">
              {error}
            </div>
          ) : null}

          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="h-96 animate-pulse rounded-3xl border border-pink-100 bg-[#fff4f6]" />
              ))}
            </div>
          ) : keyword ? (
            products.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((prod) => (
                  <ProductCard key={prod._id} product={prod} />
                ))}
              </div>
            ) : (
              <div className="rounded-[1.75rem] border border-pink-100 bg-[#fff4f6] px-8 py-14 text-center">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-gray-400">
                  No results found
                </p>
                <p className="mt-4 text-base text-gray-600">
                  We couldn't find any products matching "{keyword}".
                </p>
                <Link
                  to="/products"
                  className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-gray-950 px-8 text-sm font-bold uppercase tracking-[0.18em] text-white transition hover:bg-pink-600"
                >
                  Browse all products
                </Link>
              </div>
            )
          ) : (
            <div className="rounded-[1.75rem] border border-pink-100 bg-[#fff4f6] px-8 py-14 text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-gray-400">
                Start your search
              </p>
              <p className="mt-4 text-base text-gray-600">
                Enter a keyword in the search bar to find your favorite beauty products.
              </p>
              <Link
                to="/products"
                className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-gray-950 px-8 text-sm font-bold uppercase tracking-[0.18em] text-white transition hover:bg-pink-600"
              >
                Browse all products
              </Link>
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default SearchResultsPage;
