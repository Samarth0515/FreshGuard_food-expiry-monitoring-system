/**
 * productService.js
 * ----------------------------------------------------------------------
 * Product inventory & dashboard analytics service connected to Spring Boot API.
 * ----------------------------------------------------------------------
 */

import apiClient from "./apiClient";
import { recipeService } from "./recipeService";
import { notificationService } from "./notificationService";

export async function fetchProducts(params = {}) {
  return apiClient.get("/products", params);
}

export async function createProduct(product) {
  // Normalize fields
  const payload = {
    name: product.name,
    category: product.category,
    location: product.location ? product.location.toUpperCase() : "FRIDGE",
    quantity: product.quantity || 1,
    quantityUnit: product.quantityUnit || "pcs",
    mfgDate: product.mfgDate || null,
    expiryDate: product.expiryDate || product.expDate,
    inputMethod: product.inputMethod || "MANUAL",
    barcode: product.barcode || null,
    notes: product.notes || "",
  };

  return apiClient.post("/products", payload);
}

export async function updateProduct(id, product) {
  const payload = {
    name: product.name,
    category: product.category,
    location: product.location ? product.location.toUpperCase() : "FRIDGE",
    quantity: product.quantity || 1,
    quantityUnit: product.quantityUnit || "pcs",
    mfgDate: product.mfgDate || null,
    expiryDate: product.expiryDate || product.expDate,
    inputMethod: product.inputMethod || "MANUAL",
    barcode: product.barcode || null,
    notes: product.notes || "",
  };

  return apiClient.put(`/products/${id}`, payload);
}

export async function deleteProduct(id) {
  return apiClient.delete(`/products/${id}`);
}

export async function getDashboardSummary() {
  return apiClient.get("/products/summary");
}

export async function search(query) {
  return apiClient.get("/products/search", { q: query });
}

export async function lookupByBarcode(barcode) {
  return apiClient.get(`/products/barcode/${encodeURIComponent(barcode)}`);
}

export const productService = {
  getAll: fetchProducts,
  fetchProducts,
  getById: (id) => apiClient.get(`/products/${id}`),
  create: createProduct,
  createProduct,
  update: updateProduct,
  updateProduct,
  remove: deleteProduct,
  deleteProduct,
  getDashboardSummary,
  search,
  lookupByBarcode,
};

export { recipeService, notificationService };
export default productService;
