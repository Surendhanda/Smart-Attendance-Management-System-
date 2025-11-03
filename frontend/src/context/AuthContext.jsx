// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // ✅ Load saved session on first render
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");

    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
    }
  }, []);

  // ✅ Login method (called after successful login)
  const login = (userData, tokenValue) => {
    if (!userData || !tokenValue) return;

    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", tokenValue);

    setUser(userData);
    setToken(tokenValue);
  };

  // 🚪 Logout method
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    setUser(null);
    setToken(null);

    navigate("/login", { replace: true });
  };

  const isAuthenticated = Boolean(token);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Custom hook for easy access
export const useAuth = () => useContext(AuthContext);
