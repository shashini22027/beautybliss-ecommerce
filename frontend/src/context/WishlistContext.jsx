import React, { createContext, useState, useEffect } from 'react';

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState(() => {
    try {
      const local = localStorage.getItem('wishlistItems');
      const parsedItems = local ? JSON.parse(local) : [];
      return Array.isArray(parsedItems)
        ? parsedItems.filter((item) => item && typeof item === 'object')
        : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const toggleWishlist = (product) => {
    if (!product || typeof product !== 'object') return;
    const productId = product?._id || product?.id || product?.name;
    const exist = wishlistItems.find(x => (x._id || x.id || x.name) === productId);
    if (exist) {
      setWishlistItems(wishlistItems.filter(x => (x._id || x.id || x.name) !== productId));
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
