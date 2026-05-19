import React from 'react';
import MainLayout from './layouts/MainLayout';

function App() {
  return (
    <MainLayout>
      <div className="text-center py-20">
        <h1 className="text-4xl font-serif font-bold text-nude-800 mb-4">Luxury Skincare & Cosmetics</h1>
        <p className="text-stone-600 max-w-md mx-auto">Discover the finest curation of premium cosmetics inspired by pure elegance.</p>
      </div>
    </MainLayout>
  );
}

export default App;
