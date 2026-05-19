import React from 'react';
import ProductCard from './ProductCard';

const ProductCarousel = ({ products }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-serif text-stone-900 font-bold">Related Products</h3>
      <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-thin">
        {products.map((prod) => (
          <div key={prod._id} className="min-w-[200px] w-64">
            <ProductCard product={prod} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductCarousel;
