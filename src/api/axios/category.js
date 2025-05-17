import axiosInstance from "./axiosInstance";

const API_BASE_URL = "http://localhost:3000/api/v2/category";

const getAuthHeaders = () => {
  const token = localStorage.getItem("svaAuth");
  if (!token) {
    throw new Error("Authentication token not found. Please log in again.");
  }
  return {
    Authorization: `Bearer ${token}`,
  };
};

// Get all Categories
export const getAllCategories = async () => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}/all`, {
      headers: getAuthHeaders(),
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error.response?.data?.message || error.message;
  }
};

// Get Category by ID
export const getCategoryById = async (id) => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching Category:", error);
    throw error.response?.data?.message || error.message;
  }
};

// Create new Category
export const createCategory = async (categoryData) => {
  try {
    const transformedData = {
      ...categoryData,
    };

    const response = await axiosInstance.post(`${API_BASE_URL}/create`, transformedData, {
      headers: getAuthHeaders(),
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error("Error creating category:", error);
    throw error.response?.data?.message || error.message;
  }
};

// Update Category
export const updateCategory = async ({ id, name }) => {
  try {
    const response = await axiosInstance.put(`${API_BASE_URL}/update`, { id, name }, {
      headers: getAuthHeaders(),
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error("Error updating category:", error);
    throw error.response?.data?.message || error.message;
  }
};

// Delete Category
export const deleteCategory = async (id) => {
  try {
    const response = await axiosInstance.delete(`${API_BASE_URL}/delete`, {
      headers: getAuthHeaders(),
      withCredentials: true,
      data: { id },
    });

    return response.data;
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error.response?.data?.message || error.message;
  }
};