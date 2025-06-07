import { useState, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  axios.defaults.withCredentials = true;
  axios.defaults.baseURL = "http://localhost:5000";

  // Fetch user profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        // Try police profile first
        let res = await axios.get("/officer/profile");
        setUser({ ...res.data, role: "police" });
      } catch {
        try {
          // Try firehealth profile
          let res = await axios.get("/officer/firehealth/profile");
          setUser({ ...res.data, role: "firehealth" });
        } catch {
          setUser(null);
        }
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  // Officer login (SONumber)
  const loginOfficer = async (soNumber, password) => {
    setLoading(true);
    try {
      await axios.post("/officer/login", { soNumber, password });
      const res = await axios.get("/officer/profile");
      setUser({ ...res.data, role: "police" });
      setLoading(false);
      return true;
    } catch (err) {
      setLoading(false);
      throw new Error(err.response?.data?.msg || "Login failed");
    }
  };

  // FireHealth login (email)
  const loginFireHealth = async (email, password) => {
    setLoading(true);
    try {
      await axios.post("/officer/firehealth/login", { email, password });
      const res = await axios.get("/officer/firehealth/profile");
      setUser({ ...res.data, role: "firehealth" });
      setLoading(false);
      return true;
    } catch (err) {
      setLoading(false);
      throw new Error(err.response?.data?.msg || "Login failed");
    }
  };

  // FireHealth login (phone)
  const loginFireHealthWithPhone = async (phone, password) => {
    setLoading(true);
    try {
      await axios.post("/officer/firehealth/login-phone", { phone, password });
      const res = await axios.get("/officer/firehealth/profile");
      setUser({ ...res.data, role: "firehealth" });
      setLoading(false);
      return true;
    } catch (err) {
      setLoading(false);
      throw new Error(err.response?.data?.msg || "Login failed");
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      if (user?.role === "firehealth") {
        await axios.post("/officer/firehealth/logout");
      } else {
        await axios.post("/officer/logout");
      }
    } catch (err) {
      console.error("Logout failed:", err);
    }
    setUser(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        loginOfficer,
        loginFireHealth,
        loginFireHealthWithPhone,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
