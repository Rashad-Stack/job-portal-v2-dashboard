import axiosInstance from ".";

const API_BASE_URL = "http://localhost:3000/api/v2/job/forms/";

const getAuthHeaders = () => {
  const token = localStorage.getItem("svaAuth");
  if (!token) {
    throw new Error("Authentication token not found. Please log in again.");
  }
  return {
    Authorization: `Bearer ${token}`,
  };
};

// Get all job forms
export const getAllJobForms = async () => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}all`, {
      headers: getAuthHeaders(),
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching job forms:", error);
    throw error.response?.data?.message || error.message;
  }
};

// Get job form by ID
export const getJobFormById = async (id) => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}${id}`, {
      headers: getAuthHeaders(),
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching job form:", error);
    throw error.response?.data?.message || error.message;
  }
};

// Create new job form
export const createJobForm = async (jobFormData) => {
  try {
    const transformedData = {
      ...jobFormData,
    };

    const response = await axiosInstance.post(`${API_BASE_URL}create`, transformedData, {
      headers: getAuthHeaders(),
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error("Error creating job form (catch block):", error);
    throw error.response?.data?.message || error.message;
  }
};

// Update job form
export const updateJobForm = async (id, jobFormData) => {
  try {
    const transformedData = {
      ...jobFormData,
      numberOfHiring: parseInt(jobFormData.numberOfHiring) || 1,
      skills: Array.isArray(jobFormData.skills)
        ? jobFormData.skills.join("\n")
        : jobFormData.skills,
    };

    const response = await axiosInstance.put(`${API_BASE_URL}update/${id}`, transformedData, {
      headers: getAuthHeaders(),
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error("Error updating job form:", error);
    throw error.response?.data?.message || error.message;
  }
};

// Delete job form
export const deleteJobForm = async (id) => {
  try {
    const response = await axiosInstance.delete(`${API_BASE_URL}delete/${id}`, {
      headers: getAuthHeaders(),
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting job form:", error);
    throw error.response?.data?.message || error.message;
  }
};