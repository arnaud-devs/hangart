import axios from 'axios';
import { refreshAccessToken } from './authClient';

// Axios instance for calling Next.js API routes and backend
export const http = axios.create({
  // Use relative base for Next.js API; for direct backend calls set full URL per request
  baseURL: '/',
  withCredentials: true, // send cookies (access_token)
});

let isRefreshing = false;
let pendingRequests: Array<(tokenUpdated: boolean) => void> = [];

function subscribeTokenRefresh(cb: (tokenUpdated: boolean) => void) {
  pendingRequests.push(cb);
}

function onRefreshed(success: boolean) {
  pendingRequests.forEach(cb => cb(success));
  pendingRequests = [];
}

http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error?.response?.status;

    if (status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // mark to avoid loops
    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        subscribeTokenRefresh((success) => {
          if (success) {
            resolve(http(originalRequest));
          } else {
            reject(error);
          }
        });
      });
    }

    isRefreshing = true;
    try {
      const refresh = typeof window !== 'undefined' ? localStorage.getItem('refresh') : null;
      if (!refresh) {
        isRefreshing = false;
        onRefreshed(false);
        return Promise.reject(error);
      }
      await refreshAccessToken(refresh);
      isRefreshing = false;
      onRefreshed(true);
      return http(originalRequest);
    } catch (e) {
      isRefreshing = false;
      onRefreshed(false);
      return Promise.reject(error);
    }
  }
);

export default http;
