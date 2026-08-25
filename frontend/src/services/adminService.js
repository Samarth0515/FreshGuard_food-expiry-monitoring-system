/**
 * adminService.js
 * ----------------------------------------------------------------------
 * REST client for Administrator Control Center (/api/admin).
 * ----------------------------------------------------------------------
 */

import apiClient from "./apiClient";

export async function getSystemMetrics() {
  return apiClient.get("/admin/metrics");
}

export async function getAllUsers() {
  return apiClient.get("/admin/users");
}

export async function deleteUser(id) {
  return apiClient.delete(`/admin/users/${id}`);
}

export async function createRecipe(recipeData) {
  return apiClient.post("/admin/recipes", recipeData);
}

export async function updateRecipe(id, recipeData) {
  return apiClient.put(`/admin/recipes/${id}`, recipeData);
}

export async function deleteRecipe(id) {
  return apiClient.delete(`/admin/recipes/${id}`);
}

export async function createBarcode(barcodeData) {
  return apiClient.post("/admin/barcodes", barcodeData);
}

export async function triggerExpiryCheck() {
  return apiClient.post("/admin/trigger-expiry-check");
}

export const adminService = {
  getSystemMetrics,
  getAllUsers,
  deleteUser,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  createBarcode,
  triggerExpiryCheck,
};

export default adminService;
