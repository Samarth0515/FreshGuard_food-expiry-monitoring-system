/**
 * notificationService.js
 * ----------------------------------------------------------------------
 * Notification management service connected to Spring Boot /api/notifications.
 * ----------------------------------------------------------------------
 */

import apiClient from "./apiClient";

export async function getNotifications() {
  return apiClient.get("/notifications");
}

export async function markAsRead(id) {
  return apiClient.patch(`/notifications/${id}/read`);
}

export async function markAllAsRead() {
  return apiClient.patch("/notifications/read-all");
}

export const notificationService = {
  getNotifications,
  markAsRead,
  markAllAsRead,
};

export default notificationService;
