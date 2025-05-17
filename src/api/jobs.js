import axiosInstance from "./axios";

// Get all jobs
export const getAllJobs = async () => {
  try {
    const response = await axiosInstance.get(`/job/all`);
    if (response.status !== 200) {
      throw new Error("Failed to fetch jobs");
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching jobs:", error);
    throw error;
  }
};

// Get job by ID
export const getJobById = async (id) => {
  try {
    const response = await axiosInstance.get(`/job/${id}`);
    if (response.status !== 200) {
      throw new Error("Failed to fetch jobs");
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching job:", error);
    throw error;
  }
};

// Create new job
export const createJob = async (jobData) => {
  try {
    // Transform data to match schema requirements
    const transformedData = {
      ...jobData,
      deadline: jobData.deadline
        ? new Date(jobData.deadline).toISOString()
        : null,
      responsibilities: jobData.responsibilities || [],
    };

    // Use axiosInstance or axios directly
    const response = await axiosInstance.post("/job/create", transformedData);

    console.log("response", response);

    // Axios automatically parses JSON, so response.data contains the parsed response
    if (response.status !== 201) {
      const errorData = response.data;
      console.error("Backend error message:", errorData);
      throw new Error(errorData.message || "Failed to create job");
    }

    return response.data; // Return the parsed data directly
  } catch (error) {
    console.error("Error creating job (catch block):", error);
    throw error;
  }
};

// Update job
export const updateJob = async (id, jobData) => {
  try {
    const transformedData = {
      ...jobData,
      numberOfHiring: parseInt(jobData.numberOfHiring) || 1,
      skills: Array.isArray(jobData.skills)
        ? jobData.skills.join("\n")
        : jobData.skills,
    };

    const response = await axiosInstance.put(
      `/job/update/${id}`,
      transformedData
    );

    if (response.status !== 200) {
      const errorData = response.data;
      throw new Error(errorData.message || "Failed to update job");
    }

    return response.data; // Axios automatically parses JSON
  } catch (error) {
    console.error("Error updating job:", error);
    throw error;
  }
};

// Delete job
export const deleteJob = async (id) => {
  try {
    const response = await axiosInstance.delete(`/job/delete/${id}`);
    if (response.status !== 200) {
      const errorData = response.data;
      throw new Error(errorData.message || "Failed to delete job");
    }
    return response.data; // Axios automatically parses JSON
  } catch (error) {
    console.error("Error deleting job:", error);
    throw error;
  }
};
