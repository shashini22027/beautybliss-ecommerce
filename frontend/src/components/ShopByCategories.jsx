import React from 'react';
import { Link } from 'react-router-dom';

const ShopByCategories = ({ categories }) => {
  if (!categories || categories.length === 0) return null;

  return (
    <section className="py-16 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 mb-2">
          Shop by Categories
        </h2>
        <p className="text-stone-600 text-sm">
          Browse our curated categories to find exactly what you need, from skincare to makeup.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((category) => (
          <Link
            key={category._id}
            to={`/category/${category.slug}`}
            className="group relative overflow-hidden rounded-lg h-40 flex items-center justify-center bg-gradient-to-br from-rose-50 to-pink-50 hover:shadow-lg transition-all duration-300"
          >
            {category.image && (
              <img
                src={category.image}
                alt={category.name}
                className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity"
              />
            )}
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
            <div className="relative z-10 text-center">
              <h3 className="text-lg md:text-xl font-bold text-stone-900 group-hover:text-white transition-colors">
                {category.name}
              </h3>
              <p className="text-xs text-stone-600 group-hover:text-gray-100 transition-colors mt-1">
                {category.productCount || '0'} products
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default ShopByCategories;
