import axios from "axios";

const defaultBaseUrl = "https://ecommerce-backend-sex1.onrender.com/backend/api";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || defaultBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

// Use interceptor for token to be more reliable
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
