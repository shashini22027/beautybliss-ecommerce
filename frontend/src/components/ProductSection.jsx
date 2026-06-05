import React from 'react';
import ProductCard from './ProductCard';

const ProductSection = ({ title, description, products, badge = null }) => {
  if (!products || products.length === 0) return null;

  return (
    <section className="py-16 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-2">
          {badge && (
            <span className="inline-block px-4 py-1 bg-rose-100 text-rose-700 text-xs font-bold rounded-full uppercase tracking-wider">
              {badge}
            </span>
          )}
        </div>
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 mb-2">
          {title}
        </h2>
        {description && (
          <p className="text-stone-600 text-sm max-w-2xl mx-auto">
            {description}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default ProductSection;
