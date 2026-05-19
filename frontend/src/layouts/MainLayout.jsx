import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MobileNavigation from '../components/MobileNavigation';

const MainLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-nude-50">
      <Navbar />
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 mb-12 sm:mb-0">
        {children}
      </main>
      <Footer />
      <MobileNavigation />
    </div>
  );
};

export default MainLayout;
