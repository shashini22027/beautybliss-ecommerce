import React, { createContext, useState, useEffect } from 'react';

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState(() => {
    const local = localStorage.getItem('wishlistItems');
    return local ? JSON.parse(local) : [];
  });

  useEffect(() => {
    localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const toggleWishlist = (product) => {
    const exist = wishlistItems.find(x => x._id === product._id);
    if (exist) {
      setWishlistItems(wishlistItems.filter(x => x._id !== product._id));
    } else {
      setWishlistItems([...wishlistItems, product]);
    }
  };

  return (
    <WishlistContext.Provider value={{ wishlistItems, toggleWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};
