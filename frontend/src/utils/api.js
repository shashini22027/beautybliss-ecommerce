import { store } from '../redux/store';
import { loginSuccess, logoutUser } from '../redux/slices/authSlice';

// Helper to get current access token
const getAccessToken = () => {
  const state = store.getState();
  return state.auth.user?.token;
};

// Base fetch wrapper
export const apiFetch = async (url, options = {}) => {
  const token = getAccessToken();
  
  const headers = new Headers(options.headers || {});
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  // Set default Content-Type if body is present and not FormData
  if (options.body && !(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const config = {
    ...options,
    headers,
  };

  let response = await fetch(url, config);

  // If 401 Unauthorized, try to refresh token
  if (response.status === 401) {
    try {
      const refreshResponse = await fetch('/api/users/refresh', {
        method: 'POST',
      });

      if (refreshResponse.ok) {
        const { token: newToken } = await refreshResponse.json();
        
        // Update store with new token
        const currentUser = store.getState().auth.user;
        if (currentUser) {
          store.dispatch(loginSuccess({ ...currentUser, token: newToken }));
          
          // Retry original request with new token
          headers.set('Authorization', `Bearer ${newToken}`);
          response = await fetch(url, { ...config, headers });
        }
      } else {
        // Refresh failed, logout
        store.dispatch(logoutUser());
        // Handle redirect to login if necessary
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      store.dispatch(logoutUser());
    }
  }

  return response;
};
