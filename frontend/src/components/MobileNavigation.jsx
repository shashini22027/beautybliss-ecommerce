import React from 'react';
import { Home, ShoppingBag, Heart, User } from 'lucide-react';

const MobileNavigation = () => {
  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-pink-100 flex justify-around py-3 z-45 shadow-lg">
      <a href="/" className="flex flex-col items-center text-stone-600 hover:text-primary-700 transition">
        <Home size={20} />
        <span className="text-2xs font-semibold mt-1">Home</span>
      </a>
      <a href="/products" className="flex flex-col items-center text-stone-600 hover:text-primary-700 transition">
        <ShoppingBag size={20} />
        <span className="text-2xs font-semibold mt-1">Shop</span>
      </a>
      <a href="/wishlist" className="flex flex-col items-center text-stone-600 hover:text-primary-700 transition">
        <Heart size={20} />
        <span className="text-2xs font-semibold mt-1">Wishlist</span>
      </a>
      <a href="/profile" className="flex flex-col items-center text-stone-600 hover:text-primary-700 transition">
        <User size={20} />
        <span className="text-2xs font-semibold mt-1">Profile</span>
      </a>
    </div>
  );
};

export default MobileNavigation;
