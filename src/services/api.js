import axios from "axios";

export const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL;
console.log("API_BASE_URL:", API_BASE_URL);

const API = axios.create({
  baseURL: API_BASE_URL, // URL backend Laravel
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// REQUEST INTERCEPTOR → tambahkan token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  // CEGAH TOKEN "undefined"
  if (token && token !== "undefined" && token !== "null") {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// RESPONSE INTERCEPTOR
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Token invalid, logout...");

      // Hapus token
      localStorage.removeItem("token");

      // OPTIONAL (lebih aman): redirect otomatis
      if (window.location.pathname.startsWith("/admin")) {
        window.location.href = "/";
      }
    }

    return Promise.reject(error);
  }
);

export default API;
