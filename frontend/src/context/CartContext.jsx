import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

const getProductId = (item) =>
  item?.product?._id || item?.product?.id || item?._id || item?.id || item?.name;

const getCartItemQty = (item) => Number(item?.qty || item?.quantity || 1);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const local = localStorage.getItem('cartItems');
      const parsedItems = local ? JSON.parse(local) : [];
      return Array.isArray(parsedItems)
        ? parsedItems.filter((item) => item && typeof item === 'object')
        : [];
    } catch {
      localStorage.removeItem('cartItems');
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, qty) => {
    if (!product || typeof product !== 'object') return;
    const finalQty = Math.max(1, Number(qty));
    const productId = product._id || product.id || product.name;
    const existItem = cartItems.find((x) => getProductId(x) === productId);
    if (existItem) {
      setCartItems(cartItems.map((x) => getProductId(x) === productId ? { ...x, qty: finalQty } : x));
    } else {
      setCartItems([...cartItems, { product, qty: finalQty }]);
    }
  };

  const removeFromCart = (id) => {
    setCartItems(cartItems.filter((x) => getProductId(x) !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, getCartItemQty }}>
      {children}
    </CartContext.Provider>
  );
};
