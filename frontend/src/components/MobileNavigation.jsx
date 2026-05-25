import React, { useContext } from 'react';
import { Home, ShoppingBag, Heart, User, ShoppingCart } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import { AuthContext } from '../context/AuthContext';

const MobileNavigation = () => {
  const { cartItems } = useContext(CartContext);
  const { wishlistItems } = useContext(WishlistContext);
  const { user } = useContext(AuthContext);

  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const wishlistCount = wishlistItems.length;

  const navItems = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/products', label: 'Shop', icon: ShoppingBag },
    { to: '/wishlist', label: 'Wishlist', icon: Heart, count: wishlistCount },
    { to: '/cart', label: 'Cart', icon: ShoppingCart, count: cartCount },
    { to: user ? '/profile' : '/login', label: user ? 'Profile' : 'Login', icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 grid grid-cols-5 border-t border-pink-100 bg-white px-2 py-2 shadow-lg sm:hidden">
      {navItems.map(({ to, label, icon: Icon, count }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            `relative flex min-w-[3.75rem] flex-col items-center rounded-lg px-2 py-2 text-xs font-semibold transition ${
              isActive ? 'bg-pink-50 text-pink-700' : 'text-stone-600 hover:text-pink-700'
            }`
          }
        >
          <Icon size={20} />
          {count > 0 && (
            <span className="absolute right-2 top-1 inline-flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-pink-700 px-1 text-[10px] font-bold leading-none text-white">
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
