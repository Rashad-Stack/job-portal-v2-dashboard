import axiosInstance from "./axios";

// Get all jobs
export const getAllApplications = async () => {
  try {
    const response = await axiosInstance.get("/job/application/all");

    if (response.status !== 200) {
      throw new Error("Failed to fetch jobs");
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching jobs:", error);
    throw error;
  }
};

export const applicationUpdate = async (applicationId, updatedData) => {
  try {
    const response = await axiosInstance.patch(
      `/job/application/update/${applicationId}`,
      updatedData
    );

    if (response.status !== 200) {
      throw new Error("Failed to update application");
    }
    return response.data;
  } catch (error) {
    console.error("Error updating application:", error);
    throw error;
  }
};


