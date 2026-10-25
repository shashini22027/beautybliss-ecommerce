import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../services/api";

export const fetchAdminDashboardData = createAsyncThunk(
  "adminDashboard/fetchData",
  async ({ from, to } = {}, { rejectWithValue }) => {
    try {
      const params = {};
      if (from) params.from = from;
      if (to) params.to = to;
      const { data } = await api.get("/admin/stats", { params });
      return data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || error.message || "Unable to load dashboard data"
      );
    }
  }
);

const initialState = {
  data: null,
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
        state.data = action.payload;
      })
      .addCase(fetchAdminDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Unable to load dashboard data";
      });
  },
});

const emptyDashboardStats = Object.freeze({});

export const selectAdminDashboardStats = (state) =>
  state.adminDashboard.data ?? emptyDashboardStats;

export default adminDashboardSlice.reducer;
