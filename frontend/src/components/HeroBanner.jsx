import React from 'react';

const HeroBanner = () => {
  return (
    <div className="relative flex flex-col items-center justify-between gap-8 overflow-hidden border border-gray-200 bg-[#f6f6f6] px-8 py-20 md:flex-row sm:px-16">
      <div className="max-w-md space-y-6">
        <span className="text-xs font-extrabold uppercase tracking-[0.28em] text-pink-600">New Skincare Collection</span>
        <h1 className="text-4xl font-extrabold leading-tight text-gray-950 sm:text-5xl">Elevate Your Natural Glow</h1>
        <p className="text-sm leading-7 text-gray-600">Experience the combination of organic herbal ingredients and state of the art skincare technology.</p>
        <a href="/products" className="bb-storefront-button">Shop Collection</a>
      </div>
      <div className="flex w-full justify-center md:w-1/2">
        <img src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&q=80" alt="Cosmetics Banner" className="max-h-96 object-contain transition duration-500 hover:scale-105" />
      </div>
    </div>
  );
};

export default HeroBanner;
