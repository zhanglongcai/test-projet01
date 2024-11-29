import Cookies from 'js-cookie';
import { useUserStore } from '../stores/userStore';
import { toastManager } from './toast-manager';

const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const REMEMBER_KEY = 'remember_me';

// Token management
export const auth = {
  getToken: () => Cookies.get(TOKEN_KEY),
  getRefreshToken: () => Cookies.get(REFRESH_TOKEN_KEY),
  
  setTokens: (accessToken: string, refreshToken: string, remember: boolean = false) => {
    const options = remember ? { expires: 30 } : { expires: 1 }; // 30 days if remember me, 1 day if not
    Cookies.set(TOKEN_KEY, accessToken, options);
    Cookies.set(REFRESH_TOKEN_KEY, refreshToken, options);
  },
  
  removeTokens: () => {
    Cookies.remove(TOKEN_KEY);
    Cookies.remove(REFRESH_TOKEN_KEY);
  },

  // Remember me preference
  setRememberMe: (value: boolean) => {
    localStorage.setItem(REMEMBER_KEY, String(value));
  },
  
  getRememberMe: () => {
    return localStorage.getItem(REMEMBER_KEY) === 'true';
  },

  // Token refresh
  refreshToken: async () => {
    try {
      const refreshToken = auth.getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await fetch('/api/auth/refresh-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ refreshToken })
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const data = await response.json();
      const remember = auth.getRememberMe();
      auth.setTokens(data.data.accessToken, data.data.refreshToken, remember);
      
      return data.data.accessToken;
    } catch (error) {
      auth.removeTokens();
      useUserStore.getState().logout();
      throw error;
    }
  },

  // Auto login check
  checkAutoLogin: async () => {
    try {
      const token = auth.getToken();
      const refreshToken = auth.getRefreshToken();
      
      if (!token || !refreshToken) {
        return false;
      }

      // Verify current token
      const response = await fetch('/api/auth/verify', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        useUserStore.getState().setAuth(token, data.data.user);
        return true;
      }

      // If token is invalid, try to refresh
      const newToken = await auth.refreshToken();
      if (newToken) {
        const verifyResponse = await fetch('/api/auth/verify', {
          headers: {
            Authorization: `Bearer ${newToken}`
          }
        });

        if (verifyResponse.ok) {
          const data = await verifyResponse.json();
          useUserStore.getState().setAuth(newToken, data.data.user);
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error('Auto login failed:', error);
      return false;
    }
  },

  // Session expiry handler
  handleSessionExpiry: () => {
    toastManager.error('登录已过期，请重新登录');
    auth.removeTokens();
    useUserStore.getState().logout();
    window.location.href = '/login';
  }
};