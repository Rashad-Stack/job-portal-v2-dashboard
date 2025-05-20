import axiosInstance from "./axios";

export const login = async (email, password) => {
  const res = await axiosInstance.post(`/user/login`, {
    email,
    password,
  });

  if (!res.status === 200) {
    const err = await res.json();
    throw new Error(err.message || "Login failed");
  }

  // ✅ Save token to localStorage
  localStorage.setItem("svaAuth", res.data.token);
};

export const logout = async () => {
  await axiosInstance.post(`/user/logout`);

  // ✅ Remove token from localStorage
  localStorage.removeItem("svaAuth");
};
