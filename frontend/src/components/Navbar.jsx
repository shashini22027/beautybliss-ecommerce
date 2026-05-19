import React from 'react';
import { ShoppingBag, Heart, User, Search, Menu } from 'lucide-react';

const Navbar = ({ onSearch }) => {
  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-primary-100 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <button className="sm:hidden p-2 text-stone-600 hover:text-primary-600">
              <Menu size={24} />
            </button>
            <span className="text-2xl font-serif font-bold tracking-widest text-primary-700 ml-2 sm:ml-0">BEAUTYBLISS</span>
          </div>

          <div className="hidden sm:flex space-x-8 text-sm font-medium text-stone-600">
            <a href="/" className="hover:text-primary-600 transition">Home</a>
            <a href="/products" className="hover:text-primary-600 transition">Shop</a>
            <a href="/categories" className="hover:text-primary-600 transition">Categories</a>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative hidden md:block">
              <input
                type="text"
                placeholder="Search beauty..."
                className="w-48 bg-stone-50 border border-stone-200 rounded-full py-1.5 pl-8 pr-4 text-xs focus:outline-none focus:ring-1 focus:ring-primary-300"
                onChange={(e) => onSearch && onSearch(e.target.value)}
              />
              <Search className="absolute left-2.5 top-2 text-stone-400" size={14} />
            </div>
            
            <a href="/wishlist" className="p-2 text-stone-600 hover:text-primary-600 transition relative">
              <Heart size={20} />
            </a>
            
            <a href="/cart" className="p-2 text-stone-600 hover:text-primary-600 transition relative">
              <ShoppingBag size={20} />
            </a>

            <a href="/profile" className="p-2 text-stone-600 hover:text-primary-600 transition">
              <User size={20} />
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
