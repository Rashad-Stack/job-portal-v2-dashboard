import { jwtDecode } from "jwt-decode";
import React from "react";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    const token = localStorage.getItem("svaAuth");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const isExpired = decoded.exp * 1000 < Date.now();

        if (!isExpired) {
          setIsAuthenticated(true);
          setUser(decoded);
        } else {
          localStorage.removeItem("svaAuth");
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (err) {
        console.error("Invalid token:", err);
        localStorage.removeItem("svaAuth");
        setIsAuthenticated(false);
        setUser(null);
      }
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
  }, []);

  return { isAuthenticated, user };
}
