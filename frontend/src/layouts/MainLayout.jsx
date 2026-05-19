import React from 'react';

const MainLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-pink-100">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <span className="text-2xl font-serif font-bold tracking-widest text-primary-700">BEAUTYBLISS</span>
        </div>
      </header>
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 py-6">
        {children}
      </main>
      <footer className="bg-stone-900 text-stone-400 py-8 border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm">
          &copy; {new Date().getFullYear()} BeautyBliss. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
