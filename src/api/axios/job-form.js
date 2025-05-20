import axiosInstance from ".";

// Get all job forms
export const getAllJobForms = async () => {
  try {
    const response = await axiosInstance.get(`/job/forms/all`);
    return response.data;
  } catch (error) {
    console.error("Error fetching job forms:", error);
    throw error.response?.data?.message || error.message;
  }
};

// Get job form by ID
export const getJobFormById = async (id) => {
  try {
    const response = await axiosInstance.get(`/job/forms/${id}`);
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

    const response = await axiosInstance.post(`/job/forms/create`, transformedData);

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

    const response = await axiosInstance.put(`/job/forms/update/${id}`, transformedData);

    return response.data;
  } catch (error) {
    console.error("Error updating job form:", error);
    throw error.response?.data?.message || error.message;
  }
};

// Delete job form
export const deleteJobForm = async (id) => {
  try {
    const response = await axiosInstance.delete(`/job/forms/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting job form:", error);
    throw error.response?.data?.message || error.message;
  }
};