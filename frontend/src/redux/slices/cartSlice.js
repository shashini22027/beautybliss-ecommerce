import { createSlice, createSelector } from "@reduxjs/toolkit";

const getProductId = (item) =>
  item?.product?._id || item?.product?.id || item?._id || item?.id || item?.name;

const loadInitialCart = () => {
  try {
    const saved = localStorage.getItem("cartItems");
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const initialState = {
  cartItems: loadInitialCart(),
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { product, qty = 1 } = action.payload;
      if (!product) return;
      const finalQty = Math.max(1, Number(qty));
      const productId = getProductId(product);
      const existing = state.cartItems.find((i) => getProductId(i) === productId);
      if (existing) {
        const existingQty = Number(existing.qty || existing.quantity || 1);
        existing.qty = existingQty + finalQty;
      } else {
        state.cartItems.push({ ...product, product, qty: finalQty });
      }
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    removeFromCart: (state, action) => {
      const id = action.payload;
      state.cartItems = state.cartItems.filter((i) => getProductId(i) !== id);
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    clearCart: (state) => {
      state.cartItems = [];
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    setCart: (state, action) => {
      state.cartItems = action.payload;
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
  },
});

export const { addToCart, removeFromCart, clearCart, setCart } = cartSlice.actions;

// Selectors
export const selectCartState = (state) => state.cart;
export const selectCartItems = createSelector(selectCartState, (cart) => cart.cartItems || []);
export const selectCartCount = createSelector(selectCartItems, (items) =>
  items.reduce((total, item) => total + Number(item?.qty || item?.quantity || 1), 0)
);
export const selectCartTotal = createSelector(selectCartItems, (items) =>
  items.reduce((sum, item) => {
    const price = Number(item.price || 0);
    const qty = Number(item?.qty || item?.quantity || 1);
    return sum + price * qty;
  }, 0)
);

export default cartSlice.reducer;
