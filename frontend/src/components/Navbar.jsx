import React, { useState, useEffect, useRef } from 'react';
import { ShoppingCart, Heart, User, Search, Menu, X } from 'lucide-react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectWishlistItems } from '../redux/slices/wishlistSlice';
import { selectUser, logoutUserThunk } from '../redux/slices/authSlice';
import useCartBadgeCount from '../hooks/useCartBadgeCount';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const profileRef = useRef(null);
  const searchRef = useRef(null);
  const searchInputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const cartCount = useCartBadgeCount();
  const wishlistItems = useSelector(selectWishlistItems);
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  const safeWishlistItems = Array.isArray(wishlistItems) ? wishlistItems : [];
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

  useEffect(() => {
    setMobileOpen(false);
    setShowSearch(false);
    setShowProfileMenu(false);
  }, [location.pathname]);

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

  const navLinkClass =
    'relative py-2 text-[13px] font-medium tracking-[0.02em] transition hover:text-[#a94f61]';
  const mobileNavLinkClass =
    'block rounded px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-[#fbf3f1] hover:text-[#a94f61]';

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'Shop', to: '/products' },
    { label: 'Skin Consultation', to: '/skin-consultation' },
    { label: 'Blog', to: '/blog' },
    { label: 'About Us', to: '/about' },
    { label: 'Contact Us', to: '/contact' },
    { label: 'Offers', to: '/offers' },
  ];

  return (
    <div className="sticky top-0 z-50 bg-white shadow-[0_1px_0_rgba(0,0,0,0.06)]">
      <div className="border-b border-white/10 bg-[#292526] px-4 py-2 text-center text-[10px] font-medium tracking-[0.08em] text-white/90 sm:text-[11px]">
        <span className="sm:hidden">Islandwide delivery | Cash on delivery</span>
        <span className="hidden sm:inline">Islandwide delivery | Cash on delivery available | 100% genuine products</span>
      </div>
      <header className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-[1540px] px-4 sm:px-6 lg:px-8">
          <div className="flex min-h-[78px] items-center justify-between gap-3 py-3 sm:gap-5 sm:py-4">
            <Link
              to="/"
              className="text-xl font-black tracking-[0.08em] text-gray-950 sm:text-3xl sm:tracking-[0.16em] md:text-4xl"
            >
              BEAUTYBLISS
            </Link>

            <nav className="hidden items-center justify-center gap-8 xl:flex">
              {navLinks.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) => `${navLinkClass} ${isActive ? 'font-semibold text-[#a94f61] after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-[#a94f61]' : 'text-gray-700'}`}
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <div className="flex items-center justify-end gap-1 sm:gap-3">
              <button
                type="button"
                onClick={() => {
                  setMobileOpen((prev) => !prev);
                  setShowSearch(false);
                }}
                  className="bb-storefront-icon-button xl:hidden"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>

              {/* Search */}
              <div className="relative" ref={searchRef}>
                <button
                  type="button"
                  onClick={handleSearchButtonClick}
                  className="bb-storefront-icon-button"
                  aria-label="Search"
                  aria-expanded={showSearch}
                >
                  <Search size={24} strokeWidth={1.6} />
                </button>

                {showSearch && (
                  <form
                    onSubmit={handleSearchSubmit}
                    className="absolute right-0 top-full z-50 mt-4 w-[min(20rem,calc(100vw-2rem))]"
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
                className="bb-storefront-icon-button relative hidden sm:flex"
                aria-label={`Wishlist${wishlistCount ? `, ${wishlistCount} items` : ''}`}
              >
                <Heart size={24} strokeWidth={1.6} />
                {wishlistCount > 0 && (
                  <span className="absolute right-0 top-0 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-gray-950 px-1 text-[9px] font-bold leading-none text-white">
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
                  className="bb-storefront-icon-button hidden sm:flex"
                  aria-expanded={showProfileMenu}
                  aria-label="Profile"
                >
                  <User size={24} strokeWidth={1.6} />
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 top-full mt-3 w-60 overflow-hidden border border-gray-200 bg-white shadow-[0_18px_42px_rgba(0,0,0,0.14)]">
                    {user ? (
                      <>
                        <div className="border-b border-gray-100 px-4 py-3">
                          <p className="mb-1 text-xs font-bold uppercase tracking-widest text-gray-500">My Account</p>
                        </div>
                        {isAdmin ? (
                          <Link
                            to="/admin-dashboard"
                            onClick={() => setShowProfileMenu(false)}
                            className="block px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-[#f6f6f6] hover:text-pink-600"
                          >
                            Admin Dashboard
                          </Link>
                        ) : (
                          <Link
                            to="/profile"
                            onClick={() => setShowProfileMenu(false)}
                            className="block px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-[#f6f6f6] hover:text-pink-600"
                          >
                            Dashboard
                          </Link>
                        )}
                        <div className="border-t border-gray-100 my-1"></div>
                        <button
                          type="button"
                          onClick={() => {
                            dispatch(logoutUserThunk());
                            setShowProfileMenu(false);
                            window.location.href = '/login';
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
              className="bb-storefront-icon-button relative hidden sm:flex"
                aria-label={`Cart${cartCount ? `, ${cartCount} items` : ''}`}
              >
                <ShoppingCart size={24} strokeWidth={1.6} />
                {cartCount > 0 && (
                  <span className="absolute right-0 top-0 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-gray-950 px-1 text-[9px] font-bold leading-none text-white">
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
        <div className="border-b border-gray-200 bg-white xl:hidden">
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
              {navLinks.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  end={item.to === '/'}
                  className={({ isActive }) => `${mobileNavLinkClass} ${isActive ? 'bg-[#fbf3f1] font-semibold text-[#a94f61]' : ''}`}
                >
                  {item.label}
                </NavLink>
              ))}
            </div>

            {/* Mobile Auth Links */}
            {user ? (
              <div className="space-y-2 border-t border-gray-200 pt-3">
                <Link
                  to={isAdmin ? "/admin-dashboard" : "/profile"}
                  onClick={() => setMobileOpen(false)}
                  className={mobileNavLinkClass}
                >
                  {isAdmin ? "Admin Dashboard" : "My Account"}
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    dispatch(logoutUserThunk());
                    setMobileOpen(false);
                    navigate("/login");
                  }}
                  className={`${mobileNavLinkClass} w-full text-left`}
                >
                  Logout
                </button>
              </div>
            ) : (
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
