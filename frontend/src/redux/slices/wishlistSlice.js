import { createSlice, createSelector } from "@reduxjs/toolkit";

const getProductId = (item) =>
  item?.product?._id || item?.product?.id || item?._id || item?.id || item?.name;

const loadInitialWishlist = () => {
  try {
    const saved = localStorage.getItem("wishlistItems");
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const initialState = {
  wishlistItems: loadInitialWishlist(),
};

export const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    toggleWishlist: (state, action) => {
      const product = action.payload;
      if (!product) return;
      const id = getProductId(product);
      const exists = state.wishlistItems.find((i) => getProductId(i) === id);
      if (exists) {
        state.wishlistItems = state.wishlistItems.filter((i) => getProductId(i) !== id);
      } else {
        state.wishlistItems.push(product);
      }
      localStorage.setItem("wishlistItems", JSON.stringify(state.wishlistItems));
    },
    setWishlist: (state, action) => {
      state.wishlistItems = action.payload || [];
      localStorage.setItem("wishlistItems", JSON.stringify(state.wishlistItems));
    },
  },
});

export const { toggleWishlist, setWishlist } = wishlistSlice.actions;

// Selectors
export const selectWishlistState = (state) => state.wishlist;
export const selectWishlistItems = createSelector(selectWishlistState, (wishlist) => wishlist.wishlistItems || []);
export const selectIsWishlisted = (productId) => createSelector(
  selectWishlistItems, 
  (items) => !!items.find((i) => getProductId(i) === productId)
);

export default wishlistSlice.reducer;
