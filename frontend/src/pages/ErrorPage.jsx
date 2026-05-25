import React from 'react';
import { Link } from 'react-router-dom';

const ErrorPage = () => {
  return (
    <main className="min-h-screen bg-[#faf7f4] px-4 py-8 text-gray-950 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl overflow-hidden rounded-[2rem] border border-gray-200 bg-white shadow-[0_24px_80px_rgba(28,25,23,0.08)] lg:grid-cols-[0.95fr_1fr]">
        <section className="relative hidden bg-[#1f1a17] p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-0 opacity-80">
            <img
              src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80"
              alt="Beauty background"
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
              Keep exploring
            </p>
            <h1 className="text-5xl font-serif font-bold leading-tight tracking-tight">
              Beauty never gets lost.
            </h1>
            <p className="mt-5 text-sm leading-6 text-pink-50/80">
              We couldn't find the page you were looking for, but the rest of our glow collection is ready for you.
            </p>
          </div>
        </section>

        <section className="relative flex items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-xl">
            <div className="mb-8">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.28em] text-pink-500">
                Oops! Page missing
              </p>
              <h2 className="text-6xl font-serif font-bold tracking-tight text-gray-950">
                404
              </h2>
              <p className="mt-4 text-3xl font-serif font-semibold text-gray-900">
                Page Not Found
              </p>
            </div>

            <p className="mb-8 max-w-2xl text-sm leading-7 text-gray-500">
              The beauty page you are looking for might have been removed, had its name changed, or is temporarily unavailable. Return home or explore our latest collections.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link
                to="/"
                className="inline-flex h-12 items-center justify-center rounded-lg bg-gray-950 px-6 text-sm font-bold uppercase tracking-[0.18em] text-white shadow-lg shadow-gray-950/10 transition hover:bg-pink-600"
              >
                Go to Homepage
              </Link>
              <Link
                to="/products"
                className="inline-flex h-12 items-center justify-center rounded-lg border border-gray-200 bg-white px-6 text-sm font-bold uppercase tracking-[0.18em] text-gray-950 transition hover:border-pink-300 hover:bg-pink-50"
              >
                Browse Products
              </Link>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {[
                { label: 'Skincare', href: '/products?category=skincare' },
                { label: 'Makeup', href: '/products?category=makeup' },
                { label: 'Body Care', href: '/products?category=body-care' },
                { label: 'Fragrance', href: '/products?category=fragrance' },
              ].map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  className="rounded-2xl border border-pink-100 bg-[#fff4f6] px-5 py-4 text-sm font-semibold text-gray-900 transition hover:border-pink-300 hover:bg-pink-50"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default ErrorPage;
