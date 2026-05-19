import React from 'react';
import { Heart, ShoppingCart } from 'lucide-react';

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white border border-pink-100/60 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition duration-300 flex flex-col">
      <div className="relative bg-[#faf7f5] aspect-square overflow-hidden group">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" loading="lazy" />
        <button className="absolute top-3 right-3 p-2 bg-white rounded-full text-stone-400 hover:text-red-500 shadow-sm transition">
          <Heart size={16} />
        </button>
      </div>
      <div className="p-5 flex-grow flex flex-col justify-between">
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-nude-500 uppercase tracking-widest">{product.brand}</span>
          <h3 className="text-stone-900 font-serif font-medium text-sm leading-snug hover:text-primary-700 transition">
            <a href={`/product/${product._id}`}>{product.name}</a>
          </h3>
        </div>
        <div className="flex items-center justify-between mt-4">
          <span className="text-stone-900 font-bold text-sm">${product.price.toFixed(2)}</span>
          <button className="p-2 bg-primary-50 hover:bg-primary-100 text-primary-700 rounded-full transition">
            <ShoppingCart size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
