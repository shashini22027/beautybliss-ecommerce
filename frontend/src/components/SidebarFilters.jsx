import React from 'react';

const SidebarFilters = ({ categories, activeCategory, onSelectCategory }) => {
  return (
    <div className="bg-white border border-pink-100 rounded-2xl p-6 space-y-6 sticky top-24">
      <div>
        <h3 className="text-stone-900 font-serif font-semibold mb-3">Categories</h3>
        <div className="space-y-2">
          <button
            onClick={() => onSelectCategory('')}
            className={`block text-sm ${!activeCategory ? 'text-primary-700 font-semibold' : 'text-stone-600 hover:text-primary-600'} transition`}
          >
            All Products
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => onSelectCategory(cat._id)}
              className={`block text-sm ${activeCategory === cat._id ? 'text-primary-700 font-semibold' : 'text-stone-600 hover:text-primary-600'} transition`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SidebarFilters;
