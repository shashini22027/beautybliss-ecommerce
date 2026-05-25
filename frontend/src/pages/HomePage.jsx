import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const StatBadge = ({ value, label }) => (
  <div className="text-center">
    <p
      className="text-3xl md:text-4xl font-serif font-bold text-transparent bg-clip-text"
      style={{ backgroundImage: 'linear-gradient(90deg, #d8a7b1, #f4d6cc)' }}
    >
      {value}
    </p>
    <p className="text-[10px] uppercase tracking-[0.3em] text-[#8b6674] font-bold mt-1">
      {label}
    </p>
  </div>
);

const CategoryCard = ({ title, subtitle, to, image, video, accent }) => (
  <Link
    to={to}
    className="group relative block min-h-[280px] overflow-hidden rounded-3xl shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
    style={{ background: 'linear-gradient(135deg, #fff7f2 0%, #f7dce3 100%)' }}
  >
    {video && (
      <video
        src={video}
        poster={image}
        muted
        loop
        playsInline
        autoPlay
        className="absolute inset-0 h-full w-full object-cover opacity-75 transition duration-700 group-hover:scale-105 group-hover:opacity-95"
      />
    )}
    {!video && (
      <img
        src={image}
        alt={title}
        className="absolute inset-0 h-full w-full object-cover opacity-75 transition duration-700 group-hover:scale-105 group-hover:opacity-95"
      />
    )}
    <div
      className="absolute inset-0"
      style={{
        background:
          'linear-gradient(to top, rgba(255,247,242,0.94) 0%, rgba(255,247,242,0.62) 48%, rgba(255,247,242,0.12) 100%)',
      }}
    />
    <div className="relative z-10 flex min-h-[280px] flex-col items-start justify-end gap-4 p-10">
      <div>
        <p
          className="mb-1 text-xs font-bold uppercase tracking-[0.35em]"
          style={{ color: accent }}
        >
          {subtitle}
        </p>
        <h3 className="font-serif text-2xl font-bold text-[#3a2430] drop-shadow-sm transition-colors group-hover:text-[#8f4d63]">
          {title}
        </h3>
      </div>
      <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#8b6674] transition-colors group-hover:text-[#8f4d63]">
        Explore Collection
        <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
          &rarr;
        </span>
      </span>
    </div>
    <div
      className="absolute bottom-0 left-0 h-[3px] w-0 transition-all duration-500 group-hover:w-full"
      style={{ background: `linear-gradient(90deg, ${accent}, #fff1e8)` }}
    />
  </Link>
);

const ServicePill = ({ text }) => (
  <div className="flex items-center gap-3 rounded-2xl border border-rose-100 bg-white px-6 py-4 shadow-sm">
    <span className="h-2.5 w-2.5 rounded-full bg-rose-300" />
    <span className="text-sm font-bold uppercase tracking-widest text-gray-600">
      {text}
    </span>
  </div>
);

const HomePage = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const heroImages = [
    'https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=1400&q=85',
    'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1400&q=85',
    'https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=1400&q=85',
  ];

  const featuredProducts = [
    {
      name: 'Hydra Glow Serum',
      category: 'Serums',
      price: 'Rs. 4,950',
      image:
        'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=700&q=85',
    },
    {
      name: 'Velvet Repair Cream',
      category: 'Moisturizers',
      price: 'Rs. 5,750',
      image:
        'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=700&q=85',
    },
    {
      name: 'Rose Cloud Cleanser',
      category: 'Cleansers',
      price: 'Rs. 3,250',
      image:
        'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=700&q=85',
    },
    {
      name: 'Daily Silk Sunscreen',
      category: 'Sun Care',
      price: 'Rs. 4,200',
      image:
        'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=700&q=85',
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [heroImages.length]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-white">
      <section
        className="relative flex min-h-[92vh] items-center overflow-hidden"
        style={{
          background:
            'linear-gradient(120deg, #fff9f4 0%, #fdecef 52%, #f6d7df 100%)',
        }}
      >
        <div className="relative z-20 flex w-full flex-col justify-center px-8 py-24 md:w-1/2 md:px-16 lg:px-24">
          <div className="mb-8 flex items-center gap-3">
            <div className="h-[1px] w-8 bg-rose-300" />
            <span className="text-[11px] font-bold uppercase tracking-[0.35em] text-[#9d5f72]">
              BeautyBliss Luxury Skincare
            </span>
          </div>

          <h1
            className="mb-6 font-serif font-bold leading-[1.05] tracking-tight text-[#2f2029]"
            style={{ fontSize: 'clamp(2.7rem, 5vw, 5rem)' }}
          >
            Glow That
            <br />
            <span className="whitespace-nowrap">Feels Effortless</span>
            <br />
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: 'linear-gradient(90deg, #d8a7b1, #f4d6cc)',
              }}
            >
              Every Day
            </span>
          </h1>

          <p className="mb-10 max-w-sm text-sm leading-relaxed text-[#785d68] md:text-base">
            Discover skin-loving formulas made for hydrated, radiant, confident
            beauty routines.
          </p>

          <div className="flex flex-wrap items-center gap-5">
            <Link
              to="/products"
              className="inline-block bg-[#3a2430] px-11 py-[18px] text-xs font-bold uppercase tracking-[0.2em] text-white transition-all duration-300 hover:bg-[#5b2c45] active:scale-95"
            >
              Shop Products
            </Link>
            <Link
              to="/search"
              className="inline-block border-2 border-[#9d5f72]/70 px-11 py-[16px] text-xs font-bold uppercase tracking-[0.2em] text-[#5b2c45] transition-all duration-300 hover:bg-white hover:text-gray-950 active:scale-95"
            >
              Find My Match
            </Link>
          </div>

          <div className="mt-16 flex flex-wrap gap-10 border-t border-rose-300/40 pt-8">
            <StatBadge value="50+" label="Glow Essentials" />
            <StatBadge value="24H" label="Hydration Care" />
            <StatBadge value="4.9" label="Client Rating" />
            <StatBadge value="100%" label="Cruelty Free" />
          </div>
        </div>

        <div className="absolute right-0 top-0 h-full w-full select-none md:w-[58%]">
          <div className="absolute inset-0 h-full w-full bg-[radial-gradient(circle_at_top,right,_rgba(250,215,227,0.45),_transparent_35%)]" />
          <div className="absolute inset-0">
            {heroImages.map((src, index) => (
              <img
                key={src}
                src={src}
                alt="BeautyBliss skincare ritual"
                className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-1000 ${
                  index === currentImageIndex ? 'z-0 opacity-100' : '-z-10 opacity-0'
                }`}
                style={{ filter: 'brightness(1.02) contrast(1.02)' }}
              />
            ))}
          </div>

          <div
            className="absolute inset-0 z-10 pointer-events-none"
            style={{
              background: 'linear-gradient(to right, #fff9f4 0%, rgba(255,249,244,0.72) 28%, transparent 44%)',
            }}
          />
          <div
            className="absolute bottom-0 left-0 right-0 z-10 h-32 pointer-events-none"
            style={{
              background: 'linear-gradient(to top, #fff9f4 0%, transparent 100%)',
            }}
          />

          <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-3">
            {heroImages.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentImageIndex(idx)}
                className={`h-3 w-3 rounded-full border transition-all duration-300 ${
                  idx === currentImageIndex
                    ? 'scale-125 border-transparent bg-rose-200 shadow-[0_0_10px_rgba(244,214,204,0.65)]'
                    : 'border-rose-200/60 bg-transparent hover:bg-white/10'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      <div className="overflow-hidden border-y border-rose-100 bg-[#fffafa] py-5">
        <div className="flex gap-16 whitespace-nowrap animate-marquee">
          {[
            'Free Delivery On Selected Orders',
            'Dermatology-Inspired Formulas',
            'Cruelty-Free Beauty',
            'Glow Routine Essentials',
            'Secure Online Checkout',
            'Easy Returns',
            'Free Delivery On Selected Orders',
            'Dermatology-Inspired Formulas',
          ].map((text, index) => (
            <span
              key={`${text}-${index}`}
              className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400"
            >
              {text}
            </span>
          ))}
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="mb-14 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.4em] text-rose-400">
              Shop by Routine
            </p>
            <h2 className="font-serif text-4xl font-bold tracking-tighter text-gray-900 md:text-5xl">
              Build Your Beauty Ritual
            </h2>
          </div>
          <Link
            to="/products"
            className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 transition-colors hover:text-gray-900"
          >
            All Products
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              &rarr;
            </span>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <CategoryCard
            title="Skincare Essentials"
            subtitle="Cleanse, Treat, Hydrate"
            to="/category/skincare"
            image="https://images.unsplash.com/photo-1620916297397-a4a5402a3c6c?auto=format&fit=crop&w=900&q=85"
            accent="#d8a7b1"
          />
          <CategoryCard
            title="Makeup Must-Haves"
            subtitle="Soft Glam Favorites"
            to="/category/makeup"
            image="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=85"
            accent="#e7b8a5"
          />
          <CategoryCard
            title="Body & Fragrance"
            subtitle="Daily Self-Care"
            to="/category/body-care"
            image="https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=900&q=85"
            accent="#c9a8d8"
          />
        </div>
      </section>

      <section className="bg-gray-50 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.4em] text-rose-400">
              Customer Favorites
            </p>
            <h2 className="font-serif text-4xl font-bold tracking-tighter text-gray-900 md:text-5xl">
              Featured Beauty Picks
            </h2>
            <div className="mx-auto mt-6 h-[2px] w-16 bg-gradient-to-r from-rose-300 to-orange-100" />
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <Link
                key={product.name}
                to="/products"
                className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="aspect-[4/5] overflow-hidden bg-rose-50">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.3em] text-rose-400">
                    {product.category}
                  </p>
                  <h3 className="font-serif text-lg font-bold text-gray-900">
                    {product.name}
                  </h3>
                  <p className="mt-2 text-sm font-bold text-gray-500">
                    {product.price}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-14 text-center">
            <Link
              to="/products"
              className="inline-block rounded-full border-2 border-[#5b2c45] px-12 py-4 text-sm font-bold uppercase tracking-widest text-[#5b2c45] transition-all duration-300 hover:scale-105 hover:bg-[#5b2c45] hover:text-white hover:shadow-xl"
            >
              View All Products &rarr;
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid gap-8 rounded-[2rem] border border-gray-200 bg-white p-8 shadow-[0_24px_80px_rgba(28,25,23,0.08)] md:grid-cols-[0.9fr_1.1fr] lg:p-12">
          <div className="relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-[#fff7f2] via-[#f7dce3] to-[#efe1ff] p-10">
            <div
              className="absolute left-0 top-0 h-full w-full opacity-40"
              style={{
                backgroundImage:
                  'radial-gradient(circle at top left, rgba(255,255,255,0.85) 0%, transparent 34%), radial-gradient(circle at bottom right, rgba(255,255,255,0.65) 0%, transparent 28%)',
              }}
            />
            <div className="relative z-10 max-w-xl">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.4em] text-[#9d5f72]">
                Beauty Deals
              </p>
              <h2 className="mb-4 font-serif text-4xl font-bold tracking-tight text-[#2f2029] md:text-5xl">
                Product Deals
              </h2>
              <p className="text-sm leading-relaxed text-[#785d68]">
                Refresh your routine with seasonal savings on bestselling skincare and makeup essentials. Perfect for building effortless glow from morning to night.
              </p>
              <Link
                to="/products"
                className="mt-10 inline-flex h-14 items-center justify-center rounded-full border border-[#9d5f72] bg-[#fff6f2] px-8 text-sm font-bold uppercase tracking-[0.18em] text-[#2f2029] transition hover:border-pink-300 hover:bg-pink-50 hover:text-[#7b3154]"
              >
                Shop current deals
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {featuredProducts.slice(0, 4).map((product) => (
              <Link
                key={product.name}
                to="/products"
                className="group overflow-hidden rounded-3xl border border-pink-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative h-44 overflow-hidden bg-rose-50">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-[0.3em] text-pink-600 shadow-sm">
                    Deal
                  </span>
                </div>
                <div className="p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-rose-400">
                    {product.category}
                  </p>
                  <h3 className="mt-2 font-serif text-lg font-bold text-gray-950">
                    {product.name}
                  </h3>
                  <p className="mt-3 text-sm font-bold text-gray-700">
                    {product.price}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.4em] text-rose-400">
              BeautyBliss Promise
            </p>
            <h2 className="font-serif text-4xl font-bold tracking-tighter text-gray-900 md:text-5xl">
              Skincare Made Simple
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                label: '01',
                title: 'Glow-Focused',
                desc: 'Products selected to support hydrated, fresh-looking skin.',
              },
              {
                label: '02',
                title: 'Gentle Choices',
                desc: 'Routine essentials designed for daily beauty rituals.',
              },
              {
                label: '03',
                title: 'Fast Delivery',
                desc: 'Simple online shopping with reliable order handling.',
              },
              {
                label: '04',
                title: 'Easy Support',
                desc: 'Helpful service for product questions and order updates.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="group rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="mb-5 text-xs font-bold uppercase tracking-[0.3em] text-rose-300">
                  {item.label}
                </div>
                <h3 className="mb-3 font-serif text-lg font-bold text-gray-900 transition-colors group-hover:text-[#6f3a54]">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="flex flex-wrap justify-center gap-4">
          <ServicePill text="Routine Guidance" />
          <ServicePill text="Secure Checkout" />
          <ServicePill text="Gift Ready" />
          <ServicePill text="Self-Care Edits" />
          <ServicePill text="Beauty Support" />
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-28 text-center">
        <div className="mx-auto mb-12 h-[1px] w-16 bg-rose-300" />
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.4em] text-rose-400">
          Start Your Glow
        </p>
        <h2 className="mb-6 font-serif text-4xl font-bold tracking-tighter text-gray-900 md:text-5xl">
          Find the Routine That Feels Like You
        </h2>
        <p className="mx-auto mb-10 max-w-lg text-sm leading-relaxed text-gray-500">
          Explore skincare, makeup, and self-care favorites created for a more
          confident everyday beauty ritual.
        </p>
        <Link
          to="/products"
          className="inline-block rounded-full bg-gradient-to-r from-[#5b2c45] to-rose-300 px-12 py-4 text-sm font-bold uppercase tracking-widest text-white transition-all duration-300 hover:scale-105 hover:shadow-xl"
        >
          Browse BeautyBliss
        </Link>
      </section>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default HomePage;
