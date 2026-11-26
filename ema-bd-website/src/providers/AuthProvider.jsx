import { createContext, useState } from "react";

// creating a context
export const AuthContext = createContext();

const getStoredRoles = () => {
  const storedRole = localStorage.getItem("role");
  if (!storedRole) return [];

  try {
    const parsedRoles = JSON.parse(storedRole);
    if (Array.isArray(parsedRoles)) {
      return parsedRoles.filter((role) => typeof role === "string");
    }
  } catch {
    return storedRole
      .split(",")
      .map((role) => role.trim())
      .filter(Boolean);
  }

  return [];
};

const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => localStorage.getItem("token") !== null,
  );
  const [role, setCurrentRole] = useState(getStoredRoles);

  const setRole = (nextRoles) => {
    const normalizedRoles = Array.isArray(nextRoles) ? nextRoles : [];
    setCurrentRole(normalizedRoles);
    localStorage.setItem("role", JSON.stringify(normalizedRoles));
  };

  const login = () => {
    setIsLoggedIn(true);
  };

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setCurrentRole([]);
  };

  const authInfo = { isLoggedIn, login, logout, role, setRole };
  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;