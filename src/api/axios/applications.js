import axiosInstance from ".";

const API_BASE_URL = "http://localhost:3000/api/v2/job/application";

// Get all jobs
export const getAllApplications = async () => {
  try {
    const response = await axiosInstance.get("all");
    if (!response.ok) {
      throw new Error("Failed to fetch jobs");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching jobs:", error);
    throw error;
  }
};
