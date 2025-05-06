import { createContext, useContext, useState, useEffect } from "react";
import { login as loginAPI, logout as logoutAPI } from "../api/auth.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    const userData = await loginAPI(email, password);
    setUser(userData);
  };

  const logout = async () => {
    await logoutAPI();
    setUser(null);
  };

  const isAuthenticated = () => {
    console.log(user);
    return !!user;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
