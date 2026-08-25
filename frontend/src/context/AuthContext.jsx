import React, { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser, loginUser, logoutUser, signUpUser } from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);
    setLoading(false);
  }, []);

  const login = async (memberId, password) => {
    const user = await loginUser(memberId, password);
    setCurrentUser(user);
    return user;
  };

  const signUp = async (userData) => {
    const user = await signUpUser(userData);
    setCurrentUser(user);
    return user;
  };

  const logout = () => {
    logoutUser();
    setCurrentUser(null);
  };

  const role = currentUser?.userType ? currentUser.userType.toUpperCase() : "";
  const isAdmin = role === "ADMIN";
  const isShopkeeper = role === "SHOPKEEPER";
  const isHomeUser = !currentUser || role === "HOME_USER";

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        isAuthenticated: !!currentUser,
        isAdmin,
        isShopkeeper,
        isHomeUser,
        login,
        signUp,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
