import axios from "axios";

const api = axios.create({
  baseURL: `http://${window.location.hostname}:8080/backend/api`,
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
