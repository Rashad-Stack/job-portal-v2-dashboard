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

// create a new user
export const createUser = async (data) => {
  const res = await axiosInstance.post("/user/create", {
    name: data.name,
    email: data.email,
    password: data.password,
    role: data.role
  });

  if (!res.status === 200) {
    const err = await res.json();
    throw new Error(err.message || "Failed To Create User");
  }

  return res.data;
};

// get all users
export const getAllUsers = async () => {
  const res = await axiosInstance.get("/user");

  if (!res.status === 200) {
    const err = await res.json();
    throw new Error(err.message || "Failed To Get User");
  }

  return res.data;
};

// delete a user
export const deleteUser = async (id) => {
  const res = await axiosInstance.delete(`/user/delete/${id}`);

  if (!res.status === 200) {
    const err = await res.json();
    throw new Error(err.message || "Failed To Delete User");
  }

  return res.data;
};