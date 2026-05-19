import React from 'react';
import ProductCard from './ProductCard';

const FeaturedProducts = ({ products }) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-serif text-stone-900 font-bold">Featured Products</h2>
        <p className="text-stone-500 text-xs mt-1">Discover our top-rated cosmetics & skincare bestsellers.</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((prod) => (
          <ProductCard key={prod._id} product={prod} />
        ))}
      </div>
    </div>
  );
};

export default FeaturedProducts;
