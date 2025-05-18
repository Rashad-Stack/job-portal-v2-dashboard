import axiosInstance from "./axios";

// const API_BASE_URL = "http://localhost:3000/api/v2/job-index/changelog";

export const fetchAllChangeLog = async () => {
  try {
    const response = await axiosInstance.get(`/job-index/changelog/all`);
    if (response.status !== 200) {
      throw new Error("Failed to fetch change log");
    }
    return await response.data;
  } catch (error) {
    console.error("Error fetching changelog:", error);
    throw error;
  }
};
