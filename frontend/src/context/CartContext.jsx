import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

const getProductId = (item) =>
  item?.product?._id || item?.product?.id || item?._id || item?.id || item?.name;

const getCartItemQty = (item) => Number(item?.qty || item?.quantity || 1);

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);

  // Initialize and Sync Cart depending on auth state
  useEffect(() => {
    if (user) {
      // User is logged in, grab their specific cart
      const userCartKey = `cartItems_${user.email}`;
      const savedUserCart = localStorage.getItem(userCartKey);
      
      if (savedUserCart) {
        setCartItems(JSON.parse(savedUserCart));
      } else {
        // First time logging in or no saved cart, see if they had guest items
        const guestCart = localStorage.getItem('cartItems');
        if (guestCart) {
          const parsedGuest = JSON.parse(guestCart);
          setCartItems(parsedGuest);
          localStorage.setItem(userCartKey, guestCart);
        } else {
          setCartItems([]);
        }
      }
    } else {
      // Guest user
      const guestCart = localStorage.getItem('cartItems');
      setCartItems(guestCart ? JSON.parse(guestCart) : []);
    }
  }, [user]);

  // Save to appropriate localStorage key whenever cartItems change
  useEffect(() => {
    if (user) {
      localStorage.setItem(`cartItems_${user.email}`, JSON.stringify(cartItems));
    } else {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }
  }, [cartItems, user]);

  const addToCart = (product, qty) => {
    if (!product || typeof product !== 'object') return;
    const finalQty = Math.max(1, Number(qty));
    const productId = product._id || product.id || product.name;

    setCartItems((prevItems) => {
      const existItem = prevItems.find((x) => getProductId(x) === productId);
      if (existItem) {
        const updatedTargetQty = Number(existItem.qty || existItem.quantity || 1) + finalQty;
        return prevItems.map((x) => 
          getProductId(x) === productId 
            ? { ...x, qty: updatedTargetQty } 
            : x
        );
      } else {
        return [...prevItems, { ...product, product, qty: finalQty }];
      }
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter((x) => getProductId(x) !== id));
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
