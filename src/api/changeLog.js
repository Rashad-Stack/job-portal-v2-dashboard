const API_BASE_URL = "http://localhost:3000/api/v2/job-index/changelog";
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
export const fetchAllChangeLog = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/all`, {
      method: "GET",
      headers: getAuthHeaders(),
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Failed to fetch change log");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching changelog:", error);
    throw error;
  }
};
