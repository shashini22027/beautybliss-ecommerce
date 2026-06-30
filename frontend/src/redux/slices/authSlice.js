import { createSlice, createSelector, createAsyncThunk } from '@reduxjs/toolkit';
import { apiFetch } from '../../utils/api';

const getTokenPayload = (token) => {
  try {
    const payload = token.split('.')[1];
    const decodedPayload = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decodedPayload);
  } catch {
    return null;
  }
};

const getStoredUser = () => {
  try {
    const userInfo = localStorage.getItem('userInfo');

    if (!userInfo) {
      return null;
    }

    const user = JSON.parse(userInfo);
    const payload = user?.token ? getTokenPayload(user.token) : null;
    const tokenExpiresAt = payload?.exp ? payload.exp * 1000 : 0;

    if (!tokenExpiresAt || tokenExpiresAt <= Date.now()) {
      localStorage.removeItem('userInfo');
      return null;
    }

    return user;
  } catch {
    localStorage.removeItem('userInfo');
    return null;
  }
};

const initialState = {
  user: getStoredUser(),
  loading: false,
};

export const logoutUserThunk = createAsyncThunk('auth/logout', async (_, { dispatch }) => {
  try {
    await apiFetch('/api/users/logout', { method: 'POST' });
  } catch (error) {
    console.error('Logout failed:', error);
  }
  dispatch(logoutUser());
});

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
