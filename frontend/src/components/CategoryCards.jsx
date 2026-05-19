import React from 'react';

const CategoryCards = ({ categories }) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-serif text-stone-900 font-bold">Shop by Category</h2>
        <p className="text-stone-500 text-xs mt-1">Carefully formulated categories for every skin profile.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <a key={cat._id} href={`/products?category=${cat._id}`} className="group relative rounded-xl overflow-hidden shadow-sm hover:shadow-md transition duration-300 aspect-video block">
            <img src={cat.image} alt={cat.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-500" />
            <div className="absolute inset-0 bg-stone-950/30 group-hover:bg-stone-950/40 transition duration-300" />
            <div className="absolute inset-0 p-6 flex flex-col justify-end">
              <h3 className="text-white text-xl font-serif font-semibold">{cat.name}</h3>
              <p className="text-stone-200 text-xs mt-1">{cat.description}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default CategoryCards;
