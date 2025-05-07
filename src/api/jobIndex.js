const API_BASE_URL = "http://localhost:3000/api/v2/job-index";

// Helper function to get auth headers
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

// Get all job index
export const getAllJobIndex = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/all`, {
      method: "GET",
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch job index");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching job index:", error);
    throw error;
  }
};

// Get job by job index
export const getJobindexId = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch job index");
    }
    return await response.json();
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
      throw new Error(errorData.message || "Failed to create job index");
    }

    return await response.json();
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
    console.error("Error updating job index:", error);
    throw error;
  }
};

// Delete job index
export const deleteJobIndex = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/delete/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
      credentials: "include",
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to delete job index");
    }
    return await response.json();
  } catch (error) {
    console.error("Error deleting job index:", error);
    throw error;
  }
};
