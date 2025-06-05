import { useState, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext.js";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Set axios defaults
  axios.defaults.withCredentials = true;
  axios.defaults.baseURL = "http://localhost:5000";

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/officer/profile");
        setUser(res.data);
      } catch (err) {
        setUser(null);
        console.error("Failed to fetch profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const login = async (soNumber, password) => {
    try {
      await axios.post("/officer/login", { soNumber, password });
      await refreshProfile();
      return true;
    } catch (err) {
      const msg = err.response?.data?.msg || err.message || "Login failed";
      throw new Error(msg);
    }
  };

  const logout = async () => {
    try {
      await axios.post("/officer/logout");
    } catch (err) {
      console.error("Logout error:", err);
    }
    setUser(null);
  };

  const refreshProfile = async () => {
    try {
      const res = await axios.get("/officer/profile");
      setUser(res.data);
    } catch {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        refreshProfile,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
