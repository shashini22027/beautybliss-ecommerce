import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product, qty) => {
    const existItem = cartItems.find((x) => x.product._id === product._id);
    if (existItem) {
      setCartItems(cartItems.map((x) => x.product._id === product._id ? { ...x, qty: Number(qty) } : x));
    } else {
      setCartItems([...cartItems, { product, qty: Number(qty) }]);
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
