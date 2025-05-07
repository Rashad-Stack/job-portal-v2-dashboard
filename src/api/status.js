const API_BASE_URL = "http://localhost:3000/api/v2/status";
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
// Get all Status
export const getAllStatus = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/all`, {
      method: "GET",
      headers: getAuthHeaders(),
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Failed to fetch status");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching status:", error);
    throw error;
  }
};
// Get job by Status
export const getStatusId = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch Status");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching Status:", error);
    throw error;
  }
};
// Create new Status
export const createStatus = async (statusData) => {
  try {
    const transformedData = {
      ...statusData,
    };

    const response = await fetch(`${API_BASE_URL}/create`, {
      method: "POST",
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
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
// Update Status
export const updateStatus = async ({ id, name }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      credentials: "include",
      body: JSON.stringify({ id, name }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update Status");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating status:", error);
    throw error;
  }
};

// Delete Status
export const deleteStatus = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/delete`, {
      method: "DELETE",
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ id }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to delete Status");
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting status:", error);
    throw error;
  }
};
