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

  const safeCartItems = Array.isArray(cartItems) ? cartItems : [];
  const safeWishlistItems = Array.isArray(wishlistItems) ? wishlistItems : [];
  const cartCount = safeCartItems.reduce(
    (acc, item) => acc + Number(item?.qty || item?.quantity || 1),
    0
  );
  const wishlistCount = safeWishlistItems.length;
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
    <div className="sticky top-0 z-50 bg-white">
      <div className="border-b border-gray-100 bg-[#2b2b2b] px-4 py-2 text-center text-[11px] font-bold uppercase tracking-[0.2em] text-white">
        Islandwide delivery | Cash on delivery available | 100% genuine products
      </div>
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-[1540px] px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-5">
            {/* Logo - Left */}
            <Link
              to="/"
              className="flex-shrink-0 text-xl font-extrabold tracking-[0.16em] text-gray-950 md:text-2xl"
            >
              BEAUTYBLISS
            </Link>

            {/* Desktop Navigation - Center */}
            <nav className="hidden items-center gap-9 text-[13px] font-extrabold uppercase tracking-[0.14em] text-gray-700 md:flex">
              <Link to="/" className="transition hover:text-pink-600">
                HOME
              </Link>
              <Link to="/products" className="transition hover:text-pink-600">
                SHOP
              </Link>
              <Link to="/offers" className="transition hover:text-pink-600">
                OFFERS
              </Link>
              <Link to="/blog" className="transition hover:text-pink-600">
                BLOG
              </Link>
              <Link to="/about" className="transition hover:text-pink-600">
                ABOUT US
              </Link>
              <Link to="/contact" className="transition hover:text-pink-600">
                CONTACT US
              </Link>
            </nav>

            {/* Icons - Right */}
            <div className="flex items-center gap-5">
              {/* Mobile Menu Button */}
              <button
                type="button"
                onClick={() => {
                  setMobileOpen((prev) => !prev);
                  setShowSearch(false);
                }}
                  className="p-2 text-gray-700 hover:text-pink-600 md:hidden"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>

              {/* Search */}
              <div className="relative" ref={searchRef}>
                <button
                  type="button"
                  onClick={handleSearchButtonClick}
                  className="text-gray-700 transition hover:text-pink-600"
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
                        className="w-full border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm shadow-[0_12px_32px_rgba(0,0,0,0.14)] focus:border-gray-950 focus:outline-none"
                      />
                    </div>
                  </form>
                )}
              </div>

              {/* Wishlist */}
              <Link
                to="/wishlist"
                className="relative text-gray-700 transition hover:text-pink-600"
              >
                <Heart size={20} />
                {wishlistCount > 0 && (
                  <span className="absolute -right-2 -top-2 inline-flex h-5 min-w-5 items-center justify-center bg-pink-600 px-1 text-[10px] font-bold text-white">
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
                  className="text-gray-700 transition hover:text-pink-600"
                  aria-label="Profile"
                >
                  <User size={20} />
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 top-full mt-3 w-60 overflow-hidden border border-gray-200 bg-white shadow-[0_18px_42px_rgba(0,0,0,0.14)]">
                    {user ? (
                      <>
                        <div className="border-b border-gray-100 px-4 py-3">
                          <p className="mb-1 text-xs font-bold uppercase tracking-widest text-gray-500">My Account</p>
                        </div>
                        <Link
                          to="/profile"
                          onClick={() => setShowProfileMenu(false)}
                          className="block px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-[#f6f6f6] hover:text-pink-600"
                        >
                          Dashboard
                        </Link>
                        <Link
                          to="/orders"
                          onClick={() => setShowProfileMenu(false)}
                          className="block px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-[#f6f6f6] hover:text-pink-600"
                        >
                          Orders
                        </Link>
                        <Link
                          to="/profile"
                          onClick={() => setShowProfileMenu(false)}
                          className="block px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-[#f6f6f6] hover:text-pink-600"
                        >
                          Downloads
                        </Link>
                        <Link
                          to="/profile"
                          onClick={() => setShowProfileMenu(false)}
                          className="block px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-[#f6f6f6] hover:text-pink-600"
                        >
                          Addresses
                        </Link>
                        <Link
                          to="/profile"
                          onClick={() => setShowProfileMenu(false)}
                          className="block px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-[#f6f6f6] hover:text-pink-600"
                        >
                          Account details
                        </Link>
                        <Link
                          to="/wishlist"
                          onClick={() => setShowProfileMenu(false)}
                          className="block px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-[#f6f6f6] hover:text-pink-600"
                        >
                          Wishlist
                        </Link>
                        {isAdmin && (
                          <>
                            <div className="border-t border-gray-100 my-1"></div>
                            <Link
                              to="/admin-dashboard"
                              onClick={() => setShowProfileMenu(false)}
                              className="block px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-[#f6f6f6] hover:text-pink-600"
                            >
                              Admin Dashboard
                            </Link>
                          </>
                        )}
                        <div className="border-t border-gray-100 my-1"></div>
                        <button
                          type="button"
                          onClick={() => {
                            logout();
                            setShowProfileMenu(false);
                            navigate('/login');
                          }}
                          className="block w-full px-4 py-2.5 text-left text-sm font-semibold text-gray-700 transition hover:bg-[#f6f6f6] hover:text-pink-600"
                        >
                          Logout
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/login"
                          onClick={() => setShowProfileMenu(false)}
                          className="block px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-[#f6f6f6] hover:text-pink-600"
                        >
                          Login
                        </Link>
                        <Link
                          to="/register"
                          onClick={() => setShowProfileMenu(false)}
                          className="block px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-[#f6f6f6] hover:text-pink-600"
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
                className="relative text-gray-700 transition hover:text-pink-600"
              >
                <ShoppingBag size={20} />
                {cartCount > 0 && (
                  <span className="absolute -right-2 -top-2 inline-flex h-5 min-w-5 items-center justify-center bg-pink-600 px-1 text-[10px] font-bold text-white">
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
        <div className="border-b border-gray-200 bg-white md:hidden">
          <div className="mx-auto max-w-[1540px] space-y-3 px-4 py-4">
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
                className="w-full border border-gray-200 py-2.5 pl-10 pr-4 text-sm focus:border-gray-950 focus:outline-none"
              />
            </form>

            {/* Mobile Nav Links */}
            <div className="space-y-2 border-t border-gray-200 pt-3">
              <Link
                to="/"
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-2 text-sm font-bold uppercase tracking-widest text-gray-700 hover:bg-[#f6f6f6]"
              >
                HOME
              </Link>
              <Link
                to="/products"
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-2 text-sm font-bold uppercase tracking-widest text-gray-700 hover:bg-[#f6f6f6]"
              >
                SHOP
              </Link>
              <Link
                to="/offers"
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-2 text-sm font-bold uppercase tracking-widest text-gray-700 hover:bg-[#f6f6f6]"
              >
                OFFERS
              </Link>
              <Link
                to="/blog"
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-2 text-sm font-bold uppercase tracking-widest text-gray-700 hover:bg-[#f6f6f6]"
              >
                BLOG
              </Link>
              <Link
                to="/about"
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-2 text-sm font-bold uppercase tracking-widest text-gray-700 hover:bg-[#f6f6f6]"
              >
                ABOUT US
              </Link>
              <Link
                to="/contact"
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-2 text-sm font-bold uppercase tracking-widest text-gray-700 hover:bg-[#f6f6f6]"
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
                  className="block px-4 py-2 text-sm font-bold uppercase tracking-widest text-gray-700 hover:bg-[#f6f6f6]"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-2 text-sm font-bold uppercase tracking-widest text-pink-600 hover:bg-pink-50"
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
