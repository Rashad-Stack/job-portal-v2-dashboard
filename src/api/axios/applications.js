import axiosInstance from ".";

// Get all jobs
export const getAllApplications = async () => {
  try {
    const response = await axiosInstance.get("all");
    if (response.status !== 200) {
      throw new Error("Failed to fetch jobs");
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching jobs:", error);
    throw error;
  }
};
