import { createSlice, createSelector } from '@reduxjs/toolkit';

const userInfo = localStorage.getItem('userInfo');
const initialState = {
  user: userInfo ? JSON.parse(userInfo) : null,
  loading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action) {
      state.user = action.payload;
      localStorage.setItem('userInfo', JSON.stringify(action.payload));
    },
    logoutUser(state) {
      state.user = null;
      localStorage.removeItem('userInfo');
    },
    setAuthLoading(state, action) {
      state.loading = action.payload;
    },
  },
});

export const { loginSuccess, logoutUser, setAuthLoading } = authSlice.actions;

// Selectors
export const selectAuthState = (state) => state.auth;
export const selectUser = createSelector(selectAuthState, (auth) => auth.user);
export const selectIsLoggedIn = createSelector(selectUser, (user) => !!user);
export const selectAuthLoading = createSelector(selectAuthState, (auth) => auth.loading);

export default authSlice.reducer;
