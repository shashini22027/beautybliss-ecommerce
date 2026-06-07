import { configureStore } from "@reduxjs/toolkit";
import adminDashboardReducer from "./slices/adminDashboardSlice";
import authReducer from "./slices/authSlice";
import cartReducer from "./slices/cartSlice";
import wishlistReducer from "./slices/wishlistSlice";

export const store = configureStore({
  reducer: {
    adminDashboard: adminDashboardReducer,
    auth: authReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
  },
});
