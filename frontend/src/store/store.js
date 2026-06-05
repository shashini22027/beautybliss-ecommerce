import { configureStore } from "@reduxjs/toolkit";
import adminDashboardReducer from "./adminDashboardSlice";

export const store = configureStore({
  reducer: {
    adminDashboard: adminDashboardReducer,
  },
});
