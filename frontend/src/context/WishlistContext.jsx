import React, { createContext, useState } from 'react';

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);

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
