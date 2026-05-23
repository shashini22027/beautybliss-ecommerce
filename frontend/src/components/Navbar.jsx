import React, { useState, useContext } from 'react';
import { ShoppingBag, Heart, User, Search, Menu } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const { cartItems } = useContext(CartContext);
  const { wishlistItems } = useContext(WishlistContext);

  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const wishlistCount = wishlistItems.length;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (query) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b border-pink-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <button className="sm:hidden p-2 text-stone-600 hover:text-primary-600">
              <Menu size={24} />
            </button>
            <Link to="/" className="text-2xl font-serif font-bold tracking-widest text-primary-700 ml-2 sm:ml-0 hover:text-primary-800 transition">
              BEAUTYBLISS
            </Link>
          </div>

          <div className="hidden sm:flex space-x-8 text-sm font-medium text-stone-600">
            <Link to="/" className="hover:text-primary-600 transition">Home</Link>
            <Link to="/products" className="hover:text-primary-600 transition">Shop</Link>
            <Link to="/products" className="hover:text-primary-600 transition">Categories</Link>
          </div>

          <div className="flex items-center space-x-4">
            <form onSubmit={handleSearchSubmit} className="relative hidden md:block">
              <input
                type="text"
                placeholder="Search beauty..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 bg-stone-50 border border-stone-200 rounded-full py-1.5 pl-8 pr-4 text-xs focus:outline-none focus:ring-1 focus:ring-primary-300 focus:bg-white transition"
              />
              <button type="submit" className="absolute left-2.5 top-2 text-stone-400 hover:text-primary-600 transition">
                <Search size={14} />
              </button>
            </form>
            
            <Link to="/wishlist" className="p-2 text-stone-600 hover:text-primary-600 transition relative">
              <Heart size={20} />
              {wishlistCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center transform translate-x-1/3 -translate-y-1/3">
                  {wishlistCount}
                </span>
              )}
            </Link>
            
            <Link to="/cart" className="p-2 text-stone-600 hover:text-primary-600 transition relative">
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-primary-600 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center transform translate-x-1/3 -translate-y-1/3">
                  {cartCount}
                </span>
              )}
            </Link>

            <Link to="/profile" className="p-2 text-stone-600 hover:text-primary-600 transition">
              <User size={20} />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
