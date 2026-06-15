import React, { useContext } from 'react';
import { Home, ShoppingBag, Heart, User, ShoppingCart } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCartItems } from '../redux/slices/cartSlice';
import { selectWishlistItems } from '../redux/slices/wishlistSlice';
import { AuthContext } from '../context/AuthContext';

const MobileNavigation = () => {
  const cartItems = useSelector(selectCartItems);
  const wishlistItems = useSelector(selectWishlistItems);
  const { user } = useContext(AuthContext);

  const safeCartItems = Array.isArray(cartItems) ? cartItems : [];
  const safeWishlistItems = Array.isArray(wishlistItems) ? wishlistItems : [];
  const cartCount = safeCartItems.reduce(
    (acc, item) => acc + Number(item?.qty || item?.quantity || 1),
    0
  );
  const wishlistCount = safeWishlistItems.length;

  const navItems = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/products', label: 'Shop', icon: ShoppingBag },
    { to: '/wishlist', label: 'Wishlist', icon: Heart, count: wishlistCount },
    { to: '/cart', label: 'Cart', icon: ShoppingCart, count: cartCount },
    { to: user ? '/profile' : '/login', label: user ? 'Profile' : 'Login', icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 grid grid-cols-5 border-t border-gray-200 bg-white px-2 py-2 shadow-[0_-10px_30px_rgba(0,0,0,0.08)] sm:hidden">
      {navItems.map(({ to, label, icon: Icon, count }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            `relative flex min-w-[3.75rem] flex-col items-center px-2 py-2 text-[11px] font-bold uppercase tracking-wide transition ${
              isActive ? 'bg-[#f2f2f2] text-gray-950' : 'text-gray-500 hover:text-pink-600'
            }`
          }
        >
          <Icon size={20} />
          {count > 0 && (
            <span className="absolute right-2 top-1 inline-flex h-4 min-w-[1rem] items-center justify-center bg-pink-600 px-1 text-[10px] font-bold leading-none text-white">
              {count}
            </span>
          )}
          <span className="mt-1">{label}</span>
        </NavLink>
      ))}
    </div>
  );
};

export default MobileNavigation;
