import React from 'react';
import Navbar from '../components/Navbar';

const MainLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-nude-50">
      <Navbar />
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
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
