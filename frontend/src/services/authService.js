/**
 * authService.js
 * ----------------------------------------------------------------------
 * Authentication service connected to Spring Boot backend (/api/auth).
 * ----------------------------------------------------------------------
 */

import apiClient, { setAuthToken } from "./apiClient";

const CURRENT_USER_KEY = "currentUser";
const FRESHGUARD_USER_KEY = "freshguard_current_user";

export function getCurrentUser() {
  const raw = localStorage.getItem(CURRENT_USER_KEY) || localStorage.getItem(FRESHGUARD_USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function loginUser(memberId, password) {
  if (!memberId || !password) {
    throw new Error("Please enter both Member ID and Password");
  }

  const res = await apiClient.post("/auth/login", {
    memberId: memberId.trim(),
    password: password.trim(),
  });

  if (res.token) {
    setAuthToken(res.token);
  }

  const user = res.user || { memberId, name: memberId };
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  localStorage.setItem(FRESHGUARD_USER_KEY, JSON.stringify(user));

  return user;
}

export async function signUpUser({ name, id, password, confirmPassword, userType }) {
  if (!name || !id || !password) {
    throw new Error("Please fill all required fields!");
  }
  if (confirmPassword && password !== confirmPassword) {
    throw new Error("Passwords do not match!");
  }

  // Normalize userType
  let normalizedType = "HOME_USER";
  if (userType) {
    const lower = userType.toLowerCase();
    if (lower.includes("shop")) {
      normalizedType = "SHOPKEEPER";
    }
  }

  const res = await apiClient.post("/auth/signup", {
    name: name.trim(),
    memberId: id.trim(),
    password: password.trim(),
    userType: normalizedType,
  });

  if (res.token) {
    setAuthToken(res.token);
  }

  const user = res.user || { id, name, userType: normalizedType };
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  localStorage.setItem(FRESHGUARD_USER_KEY, JSON.stringify(user));

  return user;
}

export async function changePassword({ memberId, oldPassword, newPassword }) {
  if (!oldPassword || !newPassword) {
    throw new Error("Please fill all password fields");
  }

  const res = await apiClient.post("/auth/change-password", {
    memberId: memberId.trim(),
    oldPassword,
    newPassword,
  });

  return res;
}

export function logoutUser() {
  setAuthToken(null);
  localStorage.removeItem(CURRENT_USER_KEY);
  localStorage.removeItem(FRESHGUARD_USER_KEY);
}

export const authService = {
  getCurrentUser,
  loginUser,
  signUpUser,
  changePassword,
  logoutUser,
};

export default authService;
