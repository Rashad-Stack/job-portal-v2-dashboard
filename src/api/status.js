import axiosInstance from "./axios";

// const API_BASE_URL = "http://localhost:3000/api/v2/status";

// Get all Status
export const getAllStatus = async () => {
  try {
    const response = await axiosInstance.get(`/status/all`);
    if (response.status !== 200) {
      throw new Error("Failed to fetch status");
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching status:", error);
    throw error;
  }
};
// Get job by Status
export const getStatusId = async (id) => {
  try {
    const response = await axiosInstance.get(`/status/${id}`);
    if (response.status !== 200) {
      throw new Error("Failed to fetch Status");
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching Status:", error);
    throw error;
  }
};
// Create new Status
export const createStatus = async (statusData) => {
  try {
    const transformedData = {
      ...statusData,
    };

    const response = await axiosInstance.post(`/status/create`, transformedData);

    if (response.status !== 201) {
      const errorData = await response.json();
      console.error("Backend error message:", errorData);
      throw new Error(errorData.message || "Failed to create job");
    }

    return response.data;
  } catch (error) {
    console.error("Error creating job (catch block):", error);
    throw error;
  }
};
// Update Status
export const updateStatus = async ({ id, name }) => {
  try {
    const response = await axiosInstance.put(`/status/update`, { id, name });

    if (response.status !== 200) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update Status");
    }

    return response.data;
  } catch (error) {
    console.error("Error updating status:", error);
    throw error;
  }
};

// Delete Status
export const deleteStatus = async (id) => {
  try {
    const response = await axiosInstance.delete(`/status/delete`, { id });

    if (response.status !== 200) {
      const errorData = await response.data;
      throw new Error(errorData.message || "Failed to delete Status");
    }

    return response.json();
  } catch (error) {
    console.error("Error deleting status:", error);
    throw error;
  }
};
