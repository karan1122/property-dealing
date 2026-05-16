// src/api/axios.js
import axios from "axios";

// ── Base instance ─────────────────────────────────────────────────────────────
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,   // ← sends httpOnly refresh token cookie automatically
  headers: { "Content-Type": "application/json" },
});

// ── Request interceptor: attach access token from memory ─────────────────────
API.interceptors.request.use((config) => {
  const token = window.__accessToken; // stored in memory (not localStorage)
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Response interceptor: auto-refresh on 401 TOKEN_EXPIRED ──────────────────
let isRefreshing = false;
let pendingQueue = []; // queued requests while refresh is in progress

const processQueue = (error, token = null) => {
  pendingQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token)));
  pendingQueue = [];
};

API.interceptors.response.use(
  (response) => response,

  async (error) => {
    const original = error.config;

    const isExpired =
      error.response?.status === 401 &&
      error.response?.data?.code === "TOKEN_EXPIRED" &&
      !original._retry; // prevent infinite loop

    if (!isExpired) return Promise.reject(error);

    original._retry = true;

    // If a refresh is already in-flight, queue this request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingQueue.push({
          resolve: (token) => {
            original.headers.Authorization = `Bearer ${token}`;
            resolve(API(original));
          },
          reject,
        });
      });
    }

    isRefreshing = true;

    try {
      // Cookie is sent automatically (withCredentials: true)
      const { data } = await API.post("/auth/refresh");

      window.__accessToken = data.accessToken; // update in-memory token

      processQueue(null, data.accessToken);

      original.headers.Authorization = `Bearer ${data.accessToken}`;
      return API(original); // retry original request
    } catch (refreshError) {
      processQueue(refreshError, null);
      window.__accessToken = null;

      // Redirect to login if refresh fails
      window.location.href = "/auth/login";
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default API;
