import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("svaAuth");

    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    if (error.status === 401) {
      localStorage.removeItem("svaAuth");
      window.location.replace("/login");
    }

    return Promise.reject(error.response.data);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.log("error in axios interceptor", error);
    if (error.status === 401) {
      localStorage.removeItem("svaAuth");
      window.location.replace("/login");
    }

    return Promise.reject(error.response.data);
  }
);

export default axiosInstance;
