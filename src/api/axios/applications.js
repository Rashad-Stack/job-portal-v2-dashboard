import axiosInstance from ".";

const API_BASE_URL = "http://localhost:3000/api/v2/job/application";
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
export const getAllApplications = async () => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}/all`, {
      method: "GET ",
      headers: getAuthHeaders(),
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Failed to fetch jobs");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching jobs:", error);
    throw error;
  }
};
