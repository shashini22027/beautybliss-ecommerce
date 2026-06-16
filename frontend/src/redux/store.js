import { configureStore } from "@reduxjs/toolkit";
import adminDashboardReducer from "./slices/adminDashboardSlice";
import authReducer from "./slices/authSlice";
import cartReducer from "./slices/cartSlice";
import wishlistReducer from "./slices/wishlistSlice";
import productsReducer from "./slices/productsSlice";

export const store = configureStore({
  reducer: {
    adminDashboard: adminDashboardReducer,
    auth: authReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    products: productsReducer,
  },
});
