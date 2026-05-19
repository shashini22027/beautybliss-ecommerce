import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const local = localStorage.getItem('cartItems');
    return local ? JSON.parse(local) : [];
  });

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, qty) => {
    const finalQty = Math.max(1, Number(qty));
    const existItem = cartItems.find((x) => x.product._id === product._id);
    if (existItem) {
      setCartItems(cartItems.map((x) => x.product._id === product._id ? { ...x, qty: finalQty } : x));
    } else {
      setCartItems([...cartItems, { product, qty: finalQty }]);
    }
  };

  const removeFromCart = (id) => {
    setCartItems(cartItems.filter((x) => x.product._id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
