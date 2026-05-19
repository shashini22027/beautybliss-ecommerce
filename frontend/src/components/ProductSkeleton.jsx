import React from 'react';

const ProductSkeleton = () => {
  return (
    <div className="animate-pulse bg-white border border-pink-50 rounded-2xl overflow-hidden p-4 space-y-4">
      <div className="bg-stone-100 aspect-square rounded-xl"></div>
      <div className="h-4 bg-stone-100 rounded w-1/3"></div>
      <div className="h-4 bg-stone-100 rounded w-3/4"></div>
      <div className="h-6 bg-stone-100 rounded w-1/4"></div>
    </div>
  );
};

export default ProductSkeleton;
