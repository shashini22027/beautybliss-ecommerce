import React from 'react';

const CategoryCards = ({ categories }) => {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Shop by Categories</h2>
        <p className="text-gray-600 text-sm mt-2">Browse our curated categories to find exactly what you need, from skincare to makeup.</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((cat) => (
          <a 
            key={cat._id} 
            href={`/category/${cat._id}`} 
            className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition duration-500 aspect-square block"
          >
            <img 
              src={cat.image} 
              alt={cat.name} 
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition duration-500" 
              loading="lazy" 
            />
            
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition duration-300" />
            
            {/* Content */}
            <div className="absolute inset-0 flex items-end p-6">
              <div>
                <h3 className="text-white text-2xl font-bold">{cat.name}</h3>
                {cat.description && (
                  <p className="text-gray-100 text-sm mt-1">{cat.description}</p>
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
