import axiosInstance from "./axios";

// const API_BASE_URL = "http://localhost:3000/api/v2/category";

// Get all Category
export const getAllCategories = async () => {
  try {
    const response = await axiosInstance.get(`/category/all`);
    if (response.status !== 200) {
      throw new Error("Failed to fetch categories");
    }
    return await response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};
// Get Category by ID
export const getCategoryById = async (id) => {
  try {
    const response = await axiosInstance.get(`/category/${id}`);
    if (response.ok !== 200) {
      throw new Error("Failed to fetch Category");
    }
    return await response.data;
  } catch (error) {
    console.error("Error fetching Category:", error);
    throw error;
  }
};
// Create new Category
export const createCategory = async (categoryData) => {
  try {
    const transformedData = {
      ...categoryData,
    };

    const response = await axiosInstance.post(`/category/create`,transformedData);

    if (response.status !== 200) {
      const errorData = await response.data;
      console.error("Backend error message:", errorData);
      throw new Error(errorData.message || "Failed to create job");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating job (catch block):", error);
    throw error;
  }
};
// Update Category
export const updateCategory = async ({ id, name }) => {
  try {
    const response = await axiosInstance.put(`/category/update`, { id, name });

    if (response.ok !== 200) {
      const errorData = await response.data;
      throw new Error(errorData.message || "Failed to update category");
    }

    return await response.data;
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
};

// Delete Category
export const deleteCategory = async (id) => {
  try {
    const response = await axiosInstance.delete(`/category/delete`, { id });

    if (response.status !== 200) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to delete category");
    }

    return await response.jdata;
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
};
