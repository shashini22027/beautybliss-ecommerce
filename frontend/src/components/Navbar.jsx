import React, { useState, useEffect, useRef, useContext } from 'react';
import { ShoppingBag, Heart, User, Search, Menu, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const profileRef = useRef(null);
  const searchRef = useRef(null);
  const searchInputRef = useRef(null);
  const navigate = useNavigate();

  const { cartItems } = useContext(CartContext);
  const { wishlistItems } = useContext(WishlistContext);
  const { user, logout } = useContext(AuthContext);

  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const wishlistCount = wishlistItems.length;
  const isAdmin = Boolean(user?.isAdmin || user?.role === 'admin');

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }

      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearch(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    const query = searchQuery.trim();

    if (!query) {
      return;
    }

    navigate(`/search?q=${encodeURIComponent(query)}`);
    setSearchQuery('');
    setShowSearch(false);
    setMobileOpen(false);
  };

  const handleSearchButtonClick = () => {
    setShowSearch((prev) => !prev);
    setShowProfileMenu(false);
  };

  return (
    <div className="sticky top-0 z-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            {/* Logo - Left */}
            <Link
              to="/"
              className="flex-shrink-0 font-bold text-lg md:text-xl tracking-tight text-gray-900"
            >
              BEAUTYBLISS
            </Link>

            {/* Desktop Navigation - Center */}
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700">
              <Link to="/" className="hover:text-gray-900 transition">
                HOME
              </Link>
              <Link to="/products" className="hover:text-gray-900 transition">
                SHOP
              </Link>
              <Link to="/blog" className="hover:text-gray-900 transition">
                BLOG
              </Link>
              <Link to="/about" className="hover:text-gray-900 transition">
                ABOUT US
              </Link>
              <Link to="/contact" className="hover:text-gray-900 transition">
                CONTACT US
              </Link>
            </nav>

            {/* Icons - Right */}
            <div className="flex items-center gap-6">
              {/* Mobile Menu Button */}
              <button
                type="button"
                onClick={() => {
                  setMobileOpen((prev) => !prev);
                  setShowSearch(false);
                }}
                className="md:hidden p-2 text-gray-600 hover:text-gray-900"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>

              {/* Search */}
              <div className="relative" ref={searchRef}>
                <button
                  type="button"
                  onClick={handleSearchButtonClick}
                  className="text-gray-600 hover:text-gray-900 transition"
                  aria-label="Search"
                  aria-expanded={showSearch}
                >
                  <Search size={20} />
                </button>

                {showSearch && (
                  <form
                    onSubmit={handleSearchSubmit}
                    className="absolute right-0 top-full mt-4 hidden w-80 md:block"
                  >
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <Search size={18} />
                      </span>
                      <input
                        ref={searchInputRef}
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm shadow-lg focus:border-gray-400 focus:outline-none"
                      />
                    </div>
                  </form>
                )}
              </div>

              {/* Wishlist */}
              <Link
                to="/wishlist"
                className="relative text-gray-600 hover:text-gray-900 transition"
              >
                <Heart size={20} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Profile */}
              <div className="relative" ref={profileRef}>
                <button
                  type="button"
                  onClick={() => {
                    setShowProfileMenu((prev) => !prev);
                    setShowSearch(false);
                  }}
                  className="text-gray-600 hover:text-gray-900 transition"
                  aria-label="Profile"
                >
                  <User size={20} />
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 top-full mt-2 w-48 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
                    {user ? (
                      <>
                        <Link
                          to="/profile"
                          onClick={() => setShowProfileMenu(false)}
                          className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          Profile
                        </Link>
                        <Link
                          to="/orders"
                          onClick={() => setShowProfileMenu(false)}
                          className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          Orders
                        </Link>
                        {isAdmin && (
                          <Link
                            to="/admin-dashboard"
                            onClick={() => setShowProfileMenu(false)}
                            className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            Admin Dashboard
                          </Link>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            logout();
                            setShowProfileMenu(false);
                            navigate('/login');
                          }}
                          className="block w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50"
                        >
                          Logout
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/login"
                          onClick={() => setShowProfileMenu(false)}
                          className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          Login
                        </Link>
                        <Link
                          to="/register"
                          onClick={() => setShowProfileMenu(false)}
                          className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          Create Account
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Cart */}
              <Link
                to="/cart"
                className="relative text-gray-600 hover:text-gray-900 transition"
              >
                <ShoppingBag size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-pink-600 text-[10px] font-bold text-white">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-3">
            {/* Search Form */}
            <form onSubmit={handleSearchSubmit} className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Search size={18} />
              </span>
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-gray-200 py-2 pl-10 pr-4 text-sm focus:border-gray-400 focus:outline-none"
              />
            </form>

            {/* Mobile Nav Links */}
            <div className="space-y-2 border-t border-gray-200 pt-3">
              <Link
                to="/"
                onClick={() => setMobileOpen(false)}
                className="block rounded px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                HOME
              </Link>
              <Link
                to="/products"
                onClick={() => setMobileOpen(false)}
                className="block rounded px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                SHOP
              </Link>
              <Link
                to="/blog"
                onClick={() => setMobileOpen(false)}
                className="block rounded px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                BLOG
              </Link>
              <Link
                to="/about"
                onClick={() => setMobileOpen(false)}
                className="block rounded px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                ABOUT US
              </Link>
              <Link
                to="/contact"
                onClick={() => setMobileOpen(false)}
                className="block rounded px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                CONTACT US
              </Link>
            </div>

            {/* Mobile Auth Links */}
            {!user && (
              <div className="space-y-2 border-t border-gray-200 pt-3">
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="block rounded px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  className="block rounded px-4 py-2 text-sm font-medium text-pink-600 hover:bg-pink-50"
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;