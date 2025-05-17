import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  credentials: "include",
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("svaAuth");
    if (!token) {
      throw new Error("Authentication token not found. Please log in again.");
    }
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
