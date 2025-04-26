const API_BASE_URL = "http://localhost:3000/api/v1/user";

export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Important for cookies
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Login failed");
    }

    const data = await response.json();

    // Store the token in localStorage
    if (data.token) {
      localStorage.setItem("token", data.token);
      // Also store the decoded token data for quick access
      const tokenData = JSON.parse(atob(data.token.split(".")[1]));
      localStorage.setItem(
        "userData",
        JSON.stringify({
          id: tokenData.id,
          role: tokenData.role, // Add role to user data
        })
      );
    }

    return {
      success: true,
      message: data.message,
      token: data.token,
    };
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const logout = async () => {
  try {
    // Call server logout endpoint
    await fetch(`${API_BASE_URL}/logout`, {
      method: "POST",
      credentials: "include",
    });
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    // Clear local storage regardless of server response
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
  }
};

export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    // Check if token is expired
    const tokenData = JSON.parse(atob(token.split(".")[1]));
    const expirationTime = tokenData.exp * 1000; // Convert to milliseconds
    return Date.now() < expirationTime;
  } catch (error) {
    console.error("Token validation error:", error);
    return false;
  }
};

export const getCurrentUser = () => {
  try {
    const userData = localStorage.getItem("userData");
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error("Error getting user data:", error);
    return null;
  }
};
