import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [wishlistItems, setWishlistItems] = useState([]);

  // Initialize and Sync Wishlist depending on auth state
  useEffect(() => {
    if (user) {
      // User is logged in, grab their specific wishlist
      const userWishlistKey = `wishlistItems_${user.email}`;
      const savedUserWishlist = localStorage.getItem(userWishlistKey);
      
      if (savedUserWishlist) {
        setWishlistItems(JSON.parse(savedUserWishlist));
      } else {
        // First time logging in or no saved wishlist, see if they had guest items
        const guestWishlist = localStorage.getItem('wishlistItems');
        if (guestWishlist) {
          const parsedGuest = JSON.parse(guestWishlist);
          setWishlistItems(parsedGuest);
          localStorage.setItem(userWishlistKey, guestWishlist);
        } else {
          setWishlistItems([]);
        }
      }
    } else {
      // Guest user
      const guestWishlist = localStorage.getItem('wishlistItems');
      setWishlistItems(guestWishlist ? JSON.parse(guestWishlist) : []);
    }
  }, [user]);

  // Save to appropriate localStorage key whenever wishlistItems change
  useEffect(() => {
    if (user) {
      localStorage.setItem(`wishlistItems_${user.email}`, JSON.stringify(wishlistItems));
    } else {
      localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems));
    }
  }, [wishlistItems, user]);

  const toggleWishlist = (product) => {
    if (!product || typeof product !== 'object') return;
    const productId = product?._id || product?.id || product?.name;
    
    setWishlistItems((prevItems) => {
      const exist = prevItems.find(x => (x._id || x.id || x.name) === productId);
      if (exist) {
        return prevItems.filter(x => (x._id || x.id || x.name) !== productId);
      } else {
        return [...prevItems, product];
      }
    });
  };

  return (
    <WishlistContext.Provider value={{ wishlistItems, toggleWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};
