import React from 'react';

const CategoryCards = ({ categories }) => {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold uppercase tracking-tight text-gray-950 md:text-4xl">Shop by Categories</h2>
        <p className="mt-2 text-sm text-gray-600">Browse our curated categories to find exactly what you need, from skincare to makeup.</p>
      </div>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((cat) => (
          <a 
            key={cat._id} 
            href={`/category/${cat._id}`} 
            className="group relative block aspect-square overflow-hidden border border-gray-200 bg-white shadow-[0_1px_10px_rgba(0,0,0,0.08)] transition duration-500 hover:shadow-[0_6px_20px_rgba(0,0,0,0.12)]"
          >
            <img 
              src={cat.image} 
              alt={cat.name} 
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition duration-500" 
              loading="lazy" 
            />
            
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/20 transition duration-300 group-hover:bg-black/35" />
            
            {/* Content */}
            <div className="absolute inset-0 flex items-end p-6">
              <div>
                <h3 className="text-2xl font-extrabold uppercase text-white">{cat.name}</h3>
                {cat.description && (
                  <p className="mt-1 text-sm text-gray-100">{cat.description}</p>
                )}
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default CategoryCards;
