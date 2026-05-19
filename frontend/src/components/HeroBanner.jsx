import React from 'react';

const HeroBanner = () => {
  return (
    <div className="relative rounded-2xl overflow-hidden luxury-gradient border border-pink-100 py-20 px-8 sm:px-16 flex flex-col md:flex-row items-center justify-between gap-8">
      <div className="max-w-md space-y-6">
        <span className="text-xs font-bold tracking-widest text-primary-600 uppercase">New Skincare Collection</span>
        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-stone-900 leading-tight">Elevate Your Natural Glow</h1>
        <p className="text-stone-600 text-sm">Experience the combination of organic herbal ingredients and state of the art skincare technology.</p>
        <a href="/products" className="inline-block bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition">Shop Collection</a>
      </div>
      <div className="w-full md:w-1/2 flex justify-center">
        <img src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&q=80" alt="Cosmetics Banner" className="max-h-96 object-contain rounded-lg shadow-md" />
      </div>
    </div>
  );
};

export default HeroBanner;
