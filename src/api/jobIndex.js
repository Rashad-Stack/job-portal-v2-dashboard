import axiosInstance from "./axios";

// const API_BASE_URL = "http://localhost:3000/api/v2/job-index";


// Get all job index
export const getAllJobIndex = async () => {
  try {
    const response = await axiosInstance.get(`/job-index/all`);

    if (response.status !== 200) {
      throw new Error("Failed to fetch job index");
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching job index:", error);
    throw error;
  }
};

// Get job by job index
export const getJobindexId = async (id) => {
  try {
    const response = await axiosInstance.get(`/job-index/${id}`);
    if (response.status !== 200) {
      throw new Error("Failed to fetch job index");
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching job index:", error);
    throw error;
  }
};

// Create new job index
export const createJobIndex = async (jobIndexData) => {
  try {
    const transformedData = {
      ...jobIndexData,
      deadline: jobIndexData.deadline
        ? new Date(jobIndexData.deadline).toISOString()
        : null,
    };

    const response = await axiosInstance.post(
      `/job-index/create`,
      transformedData
    );

    if (response.status !== 201) {
      const errorData = await response.json();
      console.error("Backend error message:", errorData);
      throw new Error(errorData.message || "Failed to create job index");
    }

    return response.data;
  } catch (error) {
    console.error("Error creating job index (catch block):", error);
    throw error;
  }
};

// Update job index
export const updateJobIndex = async (id, jobIndexData) => {
  try {
    const transformedData = {
      ...jobIndexData,
      numberOfHiring: parseInt(jobIndexData.numberOfHiring) || 1,
    };
    const response = await axiosInstance.put(
      `/job-index/update/${id}`,
      transformedData
    );

    if (response.status !== 200) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update job");
    }

    return response.data;
  } catch (error) {
    console.error("Error updating job index:", error);
    throw error;
  }
};

// Delete job index
export const deleteJobIndex = async (id) => {
  try {
    const response = await axiosInstance.delete(`/job-index/delete/${id}`);
    if (response.status !== 200) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to delete job index");
    }
    return response.data;
  } catch (error) {
    console.error("Error deleting job index:", error);
    throw error;
  }
};
