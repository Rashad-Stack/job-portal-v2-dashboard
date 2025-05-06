const API_BASE_URL = "http://localhost:3000/api/v2/category";
const getAuthHeaders = () => {
  const token = localStorage.getItem("svaAuth");
  if (!token) {
    throw new Error("Authentication token not found. Please log in again.");
  }
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};
// Get all jobs
export const getAllCategories = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/all`, {
      method: "GET",
      headers: getAuthHeaders(),
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};
// Get job by ID
export const getCategoryById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch Category");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching Category:", error);
    throw error;
  }
};
// Create new job
export const createCategory = async (categoryData) => {
  try {
    const transformedData = {
      ...categoryData,
    };

    const response = await fetch(`${API_BASE_URL}/create`, {
      method: "POST",
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(transformedData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Backend error message:", errorData);
      throw new Error(errorData.message || "Failed to create job");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating job (catch block):", error);
    throw error;
  }
};
// Update job
export const updateCategory = async (id, categoryData) => {
  try {
    const transformedData = {
      ...categoryData,
    };

    const response = await fetch(`${API_BASE_URL}/update/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      credentials: "include",
      body: JSON.stringify(transformedData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to Category job");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating Category:", error);
    throw error;
  }
};
// Delete job
export const deleteCategory = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/delete`, {
      method: "DELETE",
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ id }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to delete category");
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
};
