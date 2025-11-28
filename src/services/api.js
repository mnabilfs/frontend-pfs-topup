import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api", // URL backend Laravel
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
