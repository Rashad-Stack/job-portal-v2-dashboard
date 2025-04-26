const API_BASE_URL = "http://localhost:3000/api/v1/job";

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Authentication token not found. Please log in again.");
  }
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

// Get all jobs
export const getAllJobs = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/all`);
    if (!response.ok) {
      throw new Error("Failed to fetch jobs");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching jobs:", error);
    throw error;
  }
};

// Get job by ID
export const getJobById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch job");
    }
    return await response.json();
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
      // Optional: If backend still expects responsibilities field, send empty array
      responsibilities: jobData.responsibilities || [],
    };

    const response = await fetch(`${API_BASE_URL}/create`, {
      method: "POST",
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json", // ✅ Important: tell backend it's JSON
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
export const updateJob = async (id, jobData) => {
  try {
    const transformedData = {
      ...jobData,
      vacancy: parseInt(jobData.vacancy) || 1,
      salaryType: jobData.salaryType?.toUpperCase(),
      salaryMin: jobData.salaryRange?.min
        ? parseFloat(jobData.salaryRange.min)
        : null,
      salaryMax: jobData.salaryRange?.max
        ? parseFloat(jobData.salaryRange.max)
        : null,
      fixedSalary: jobData.fixedSalary ? parseFloat(jobData.fixedSalary) : null,
      deadline: jobData.deadline
        ? new Date(jobData.deadline).toISOString()
        : null,
      // ✅ Backend expects this as an array of strings
      responsibilities: Array.isArray(jobData.responsibilities)
        ? jobData.responsibilities
        : jobData.responsibilities?.split("\n"),
      // ✅ Backend expects this as a single string (not array)
      skills: Array.isArray(jobData.skills)
        ? jobData.skills.join("\n")
        : jobData.skills,
    };

    const response = await fetch(`${API_BASE_URL}/update/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      credentials: "include",
      body: JSON.stringify(transformedData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update job");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating job:", error);
    throw error;
  }
};

// Delete job
export const deleteJob = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/delete/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
      credentials: "include",
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to delete job");
    }
    return await response.json();
  } catch (error) {
    console.error("Error deleting job:", error);
    throw error;
  }
};
