import React from 'react';

const SidebarFilters = ({
  categories,
  activeCategory,
  onSelectCategory,
  activeSubcategory,
  onSelectSubcategory,
  activeColor,
  onSelectColor,
  activeCountry,
  onSelectCountry
}) => {
  const subcategories = ['Lipstick', 'Serum', 'Blush', 'Mascara', 'Shampoo', 'Conditioner', 'Perfume', 'Sunscreen', 'Foundation', 'Cream'];
  const colors = ['Red', 'Peach'];
  const countries = ['Korean', 'French', 'USA', 'Japan'];

  return (
    <div className="bg-white border border-pink-100/60 rounded-2xl p-6 space-y-6 sticky top-24">
      {/* Category Section */}
      <div>
        <h3 className="text-stone-900 font-serif font-bold text-sm uppercase tracking-wider mb-3">Categories</h3>
        <div className="space-y-2">
          <button
            onClick={() => onSelectCategory('')}
            className={`block text-xs uppercase tracking-wider ${!activeCategory ? 'text-primary-700 font-bold border-b-2 border-primary-500' : 'text-stone-600 hover:text-primary-600'} transition`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => onSelectCategory(cat._id)}
              className={`block text-xs uppercase tracking-wider ${activeCategory === cat._id ? 'text-primary-700 font-bold border-b-2 border-primary-500' : 'text-stone-600 hover:text-primary-600'} transition`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Subcategory Section */}
      <div className="border-t border-pink-50 pt-4">
        <h3 className="text-stone-900 font-serif font-bold text-sm uppercase tracking-wider mb-3">Subcategory</h3>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => onSelectSubcategory('')}
            className={`px-2.5 py-1 text-[10px] rounded-full font-semibold transition ${!activeSubcategory ? 'bg-primary-600 text-white' : 'bg-stone-50 text-stone-600 border border-stone-200 hover:bg-pink-50'}`}
          >
            All
          </button>
          {subcategories.map((sub) => (
            <button
              key={sub}
              onClick={() => onSelectSubcategory(sub)}
              className={`px-2.5 py-1 text-[10px] rounded-full font-semibold transition ${activeSubcategory === sub ? 'bg-primary-600 text-white' : 'bg-stone-50 text-stone-600 border border-stone-200 hover:bg-pink-50'}`}
            >
              {sub}
            </button>
          ))}
        </div>
      </div>

      {/* Color Section */}
      <div className="border-t border-pink-50 pt-4">
        <h3 className="text-stone-900 font-serif font-bold text-sm uppercase tracking-wider mb-3">Color Shade</h3>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => onSelectColor('')}
            className={`px-2.5 py-1 text-[10px] rounded-full font-semibold transition ${!activeColor ? 'bg-primary-600 text-white' : 'bg-stone-50 text-stone-600 border border-stone-200 hover:bg-pink-50'}`}
          >
            All Shades
          </button>
          {colors.map((col) => (
            <button
              key={col}
              onClick={() => onSelectColor(col)}
              className={`px-2.5 py-1 text-[10px] rounded-full font-semibold transition ${activeColor === col ? 'bg-primary-600 text-white' : 'bg-stone-50 text-stone-600 border border-stone-200 hover:bg-pink-50'}`}
            >
              {col}
            </button>
          ))}
        </div>
      </div>

      {/* Country of Origin Section */}
      <div className="border-t border-pink-50 pt-4">
        <h3 className="text-stone-900 font-serif font-bold text-sm uppercase tracking-wider mb-3">Origin Country</h3>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => onSelectCountry('')}
            className={`px-2.5 py-1 text-[10px] rounded-full font-semibold transition ${!activeCountry ? 'bg-primary-600 text-white' : 'bg-stone-50 text-stone-600 border border-stone-200 hover:bg-pink-50'}`}
          >
            All Origins
          </button>
          {countries.map((cnt) => (
            <button
              key={cnt}
              onClick={() => onSelectCountry(cnt)}
              className={`px-2.5 py-1 text-[10px] rounded-full font-semibold transition ${activeCountry === cnt ? 'bg-primary-600 text-white' : 'bg-stone-50 text-stone-600 border border-stone-200 hover:bg-pink-50'}`}
            >
              {cnt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SidebarFilters;
