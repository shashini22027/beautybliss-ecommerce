import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MobileNavigation from '../components/MobileNavigation';

const MainLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      <main className="w-full flex-grow pb-20 sm:pb-0">
        {children}
      </main>
      <Footer />
      <MobileNavigation />
    </div>
  );
};

export default MainLayout;
