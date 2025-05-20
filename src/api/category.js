import axiosInstance from "./axios";

// Get all Categories
export const getAllCategories = async () => {
  try {
    const response = await axiosInstance.get(`/category/all`);
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error.response?.data?.message || error.message;
  }
};

// Get Category by ID
export const getCategoryById = async (id) => {
  try {
    const response = await axiosInstance.get(`/category/${id}`);
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

    console.log("transformedData", transformedData);

    const response = await axiosInstance.post(
      `/category/create`,
      transformedData
    );

    if (response.status !== 201) {
      const errorData = response.data;
      console.error("Backend error message:", errorData);
      throw new Error(errorData.message || "Failed to create job");
    }

    return response.data;
  } catch (error) {
    console.error("Error creating category:", error);
    throw error.response?.data?.message || error.message;
  }
};

// Update Category
export const updateCategory = async ({ id, name }) => {
  try {
    const response = await axiosInstance.put(`/category/update`, { id, name });

    return response.data;
  } catch (error) {
    console.error("Error updating category:", error);
    throw error.response?.data?.message || error.message;
  }
};

// Delete Category
export const deleteCategory = async (id) => {
  console.log("id", id);
  try {
    const response = await axiosInstance.delete(`/category/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error.response?.data?.message || error.message;
  }
};
