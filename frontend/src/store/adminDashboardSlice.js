import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../services/api";

const getListFromResponse = (data, key) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.[key])) return data[key];
  return [];
};

const getOrderItems = (order) => {
  if (Array.isArray(order.orderItems) && order.orderItems.length) {
    return order.orderItems;
  }
  if (Array.isArray(order.items) && order.items.length) return order.items;
  return [];
};

const getItemQty = (item) => Number(item.qty || item.quantity || 1);

const getItemPrice = (item) => {
  if (typeof item.price === "number") return item.price;

  const price = String(item.price || "0")
    .replace(/From/gi, "")
    .replace(/[^\d.]/g, "");

  return Number(price || 0);
};

const getOrderTotal = (order) => {
  const orderItems = getOrderItems(order);
  const itemsTotal = orderItems.reduce(
    (total, item) => total + getItemPrice(item) * getItemQty(item),
    0
  );

  return itemsTotal || Number(order.totalPrice || order.total || order.amount || 0);
};

export const fetchAdminDashboardData = createAsyncThunk(
  "adminDashboard/fetchData",
  async (_, { rejectWithValue }) => {
    try {
      const [productsRes, ordersRes, statsRes] = await Promise.allSettled([
        api.get("/products"),
        api.get("/orders"),
        api.get("/admin/stats"),
      ]);

      const products =
        productsRes.status === "fulfilled"
          ? getListFromResponse(productsRes.value.data, "products")
          : [];
      const orders =
        ordersRes.status === "fulfilled"
          ? getListFromResponse(ordersRes.value.data, "orders")
          : [];
      const stats =
        statsRes.status === "fulfilled" && statsRes.value.data
          ? statsRes.value.data
          : {};

      const failedRequest = [productsRes, ordersRes, statsRes].find(
        (result) => result.status === "rejected"
      );

      return {
        products,
        orders,
        users: stats.totalUsers || stats.users || 0,
        error:
          failedRequest?.reason?.response?.data?.message ||
          failedRequest?.reason?.message ||
          "",
      };
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || err.message || "Unable to load dashboard data"
      );
    }
  }
);

const initialState = {
  products: [],
  orders: [],
  users: 0,
  loading: false,
  error: "",
};

const adminDashboardSlice = createSlice({
  name: "adminDashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminDashboardData.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchAdminDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.orders = action.payload.orders;
        state.users = action.payload.users;
        state.error = action.payload.error;
      })
      .addCase(fetchAdminDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Unable to load dashboard data";
      });
  },
});

export const selectAdminDashboardStats = (state) => {
  const { products, orders, users } = state.adminDashboard;
  const sales = orders.reduce((sum, order) => sum + getOrderTotal(order), 0);

  return {
    users,
    products: products.length,
    orders: orders.length,
    sales,
  };
};

export default adminDashboardSlice.reducer;
