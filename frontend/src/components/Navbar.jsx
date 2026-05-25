import React, { useState, useEffect, useRef, useContext } from 'react';
import { ShoppingBag, Heart, User, Search, Menu, X, ChevronDown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const [showCatDropdown, setShowCatDropdown] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileCatOpen, setMobileCatOpen] = useState(false);
  const dropdownRef = useRef(null);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  const { cartItems } = useContext(CartContext);
  const { wishlistItems } = useContext(WishlistContext);
  const { user, logout } = useContext(AuthContext);

  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const wishlistCount = wishlistItems.length;
  const isAdmin = Boolean(user?.isAdmin || user?.role === 'admin');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await API.get('/categories');
        setCategories(data);
      } catch (err) {
        console.error('Failed to load navbar categories:', err);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowCatDropdown(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (query) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      setSearchQuery('');
      setMobileOpen(false);
    }
  };

  return (
    <div className="sticky top-0 z-50">
      <header className="bg-white/95 backdrop-blur-xl border-b border-stone-200 shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 py-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMobileOpen((prev) => !prev)}
                className="lg:hidden p-2 rounded-full border border-stone-200 text-stone-600 bg-white shadow-sm hover:border-pink-200 hover:text-pink-700 transition"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>

              <Link
                to="/"
                className="flex items-center gap-3 rounded-full bg-gradient-to-br from-pink-100 to-rose-100 px-4 py-3 shadow-lg shadow-pink-200/70 transition hover:scale-[1.01]"
              >
                <div className="hidden sm:block">
                  <p className="text-[10px] uppercase tracking-[0.4em] text-stone-400">BeautyBliss</p>
                  <p className="text-sm font-semibold text-stone-900">Curated cosmetics for every glow</p>
                </div>
              </Link>
            </div>

            <div className="flex flex-1 flex-col gap-3 lg:mx-6 lg:flex-row lg:items-center lg:gap-4">
              <form onSubmit={handleSearchSubmit} className="relative w-full lg:max-w-xl">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-stone-400">
                  <Search size={18} />
                </span>
                <input
                  type="text"
                  placeholder="Search makeup, skincare, fragrance..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-full border border-stone-200 bg-stone-50 pl-12 pr-4 py-3 text-sm text-stone-700 outline-none transition focus:border-pink-300 focus:ring-2 focus:ring-pink-100"
                />
              </form>

              <nav className="hidden lg:flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.18em] text-stone-600">
                <Link
                  to="/products"
                  className="rounded-full border border-transparent bg-stone-100 px-4 py-2 transition hover:border-pink-200 hover:bg-white hover:text-pink-700"
                >
                  Shop
                </Link>
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setShowCatDropdown((prev) => !prev)}
                    className="flex items-center gap-1 rounded-full border border-stone-100 bg-white px-4 py-2 transition hover:border-pink-200 hover:text-pink-700"
                  >
                    COLLECTIONS
                    <ChevronDown size={14} className={`transition-transform ${showCatDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  {showCatDropdown && (
                    <div className="absolute left-0 top-full mt-3 w-56 overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-xl">
                      <div className="grid gap-1 p-3">
                        {categories.length > 0 ? (
                          categories.map((cat) => (
                            <Link
                              key={cat._id}
                              to={`/category/${cat._id}`}
                              onClick={() => setShowCatDropdown(false)}
                              className="block rounded-2xl px-4 py-3 text-sm text-stone-700 hover:bg-pink-50 hover:text-pink-700"
                            >
                              {cat.name}
                            </Link>
                          ))
                        ) : (
                          <span className="text-sm text-stone-400">Loading categories...</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <Link
                  to="/offers"
                  className="rounded-full border border-stone-100 bg-white px-4 py-2 transition hover:border-pink-200 hover:text-pink-700"
                >
                  Offers
                </Link>
                <Link
                  to="/about"
                  className="rounded-full border border-stone-100 bg-white px-4 py-2 transition hover:border-pink-200 hover:text-pink-700"
                >
                  About
                </Link>
              </nav>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/wishlist"
                className="relative flex h-12 w-12 items-center justify-center rounded-3xl border border-stone-200 bg-white text-stone-600 transition hover:border-pink-200 hover:text-pink-700"
              >
                <Heart size={20} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                    {wishlistCount}
                  </span>
                )}
              </Link>
              <Link
                to="/cart"
                className="relative flex h-12 w-12 items-center justify-center rounded-3xl border border-stone-200 bg-white text-stone-600 transition hover:border-pink-200 hover:text-pink-700"
              >
                <ShoppingBag size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-pink-700 text-[10px] font-bold text-white">
                    {cartCount}
                  </span>
                )}
              </Link>
              <div className="relative" ref={profileRef}>
                {user ? (
                  <button
                    type="button"
                    onClick={() => setShowProfileMenu((prev) => !prev)}
                    className="flex h-12 w-12 items-center justify-center rounded-3xl border border-stone-200 bg-white text-stone-600 transition hover:border-pink-200 hover:text-pink-700"
                    aria-expanded={showProfileMenu}
                  >
                    <User size={20} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowProfileMenu((prev) => !prev)}
                    className="flex h-12 w-12 items-center justify-center rounded-3xl border border-stone-200 bg-white text-stone-600 transition hover:border-pink-200 hover:text-pink-700"
                    aria-expanded={showProfileMenu}
                  >
                    <User size={20} />
                  </button>
                )}

                {showProfileMenu && (
                  <div className="absolute right-0 top-full mt-3 w-48 overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-xl">
                    {user ? (
                      <>
                        <Link
                          to="/profile"
                          onClick={() => setShowProfileMenu(false)}
                          className="block px-4 py-3 text-sm font-semibold text-stone-700 hover:bg-pink-50"
                        >
                          Profile
                        </Link>
                        <Link
                          to="/orders"
                          onClick={() => setShowProfileMenu(false)}
                          className="block px-4 py-3 text-sm font-semibold text-stone-700 hover:bg-pink-50"
                        >
                          Orders
                        </Link>
                        {isAdmin && (
                          <Link
                            to="/admin-dashboard"
                            onClick={() => setShowProfileMenu(false)}
                            className="block px-4 py-3 text-sm font-semibold text-stone-700 hover:bg-pink-50"
                          >
                            Admin dashboard
                          </Link>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            logout();
                            setShowProfileMenu(false);
                            navigate('/login');
                          }}
                          className="block w-full px-4 py-3 text-left text-sm font-semibold text-red-600 hover:bg-red-50"
                        >
                          Logout
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/login"
                          onClick={() => setShowProfileMenu(false)}
                          className="block px-4 py-3 text-sm font-semibold text-stone-700 hover:bg-pink-50"
                        >
                          Login
                        </Link>
                        <Link
                          to="/register"
                          onClick={() => setShowProfileMenu(false)}
                          className="block px-4 py-3 text-sm font-semibold text-stone-700 hover:bg-pink-50"
                        >
                          Create account
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div className="lg:hidden bg-white border-b border-stone-200 shadow-[0_20px_40px_rgba(15,23,42,0.08)]">
          <div className="space-y-4 px-5 py-5">
            <form onSubmit={handleSearchSubmit} className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-stone-400">
                <Search size={18} />
              </span>
              <input
                type="text"
                placeholder="Search beauty..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full border border-stone-200 bg-stone-50 pl-12 pr-4 py-3 text-sm text-stone-700 outline-none transition focus:border-pink-300 focus:ring-2 focus:ring-pink-100"
              />
            </form>

            <div className="grid gap-3">
              <Link
                to="/products"
                onClick={() => setMobileOpen(false)}
                className="rounded-3xl border border-stone-200 bg-white px-4 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-stone-700 transition hover:border-pink-200 hover:text-pink-700"
              >
                Shop
              </Link>
              <button
                onClick={() => setMobileCatOpen((prev) => !prev)}
                className="flex w-full items-center justify-between rounded-3xl border border-stone-200 bg-white px-4 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-stone-700 transition hover:border-pink-200 hover:text-pink-700"
              >
                COLLECTIONS
                <ChevronDown size={14} className={`transition-transform ${mobileCatOpen ? 'rotate-180' : ''}`} />
              </button>
              {mobileCatOpen && (
                <div className="space-y-2 rounded-3xl border border-pink-100 bg-pink-50 p-3">
                  {categories.map((cat) => (
                    <Link
                      key={cat._id}
                      to={`/category/${cat._id}`}
                      onClick={() => {
                        setMobileOpen(false);
                        setMobileCatOpen(false);
                      }}
                      className="block rounded-2xl px-4 py-3 text-sm text-stone-700 hover:bg-white"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
              <Link
                to="/offers"
                onClick={() => setMobileOpen(false)}
                className="rounded-3xl border border-stone-200 bg-white px-4 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-stone-700 transition hover:border-pink-200 hover:text-pink-700"
              >
                Offers
              </Link>
              <Link
                to="/about"
                onClick={() => setMobileOpen(false)}
                className="rounded-3xl border border-stone-200 bg-white px-4 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-stone-700 transition hover:border-pink-200 hover:text-pink-700"
              >
                About
              </Link>
            </div>

            <div className="grid gap-3">
              {!user ? (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-3xl border border-stone-200 bg-white px-4 py-3 text-center text-sm font-semibold text-stone-700 hover:border-pink-200 hover:text-pink-700 transition"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-3xl bg-pink-700 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-pink-800 transition"
                  >
                    Create account
                  </Link>
                </>
              ) : (
                <div className="grid gap-3">
                  <Link
                    to="/profile"
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-3xl bg-pink-700 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-pink-800 transition"
                  >
                    Profile
                  </Link>
                  <Link
                    to="/orders"
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-3xl border border-stone-200 bg-white px-4 py-3 text-center text-sm font-semibold text-stone-700 hover:border-pink-200 hover:text-pink-700 transition"
                  >
                    Orders
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin-dashboard"
                      onClick={() => setMobileOpen(false)}
                      className="block rounded-3xl border border-stone-200 bg-white px-4 py-3 text-center text-sm font-semibold text-stone-700 hover:border-pink-200 hover:text-pink-700 transition"
                    >
                      Admin dashboard
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setMobileOpen(false);
                      navigate('/login');
                    }}
                    className="block rounded-3xl border border-red-100 bg-red-50 px-4 py-3 text-center text-sm font-semibold text-red-600 hover:bg-red-100 transition"
                  >
                    Logout
                  </button>
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                <Link
                  to="/wishlist"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center rounded-3xl border border-stone-200 bg-white px-4 py-3 text-sm font-semibold text-stone-700 hover:border-pink-200 hover:text-pink-700 transition"
                >
                  Wishlist
                </Link>
                <Link
                  to="/cart"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center rounded-3xl bg-pink-700 px-4 py-3 text-sm font-semibold text-white hover:bg-pink-800 transition"
                >
                  Cart
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
