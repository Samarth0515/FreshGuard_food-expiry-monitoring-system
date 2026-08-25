package com.freshguard.controller;

import com.freshguard.dto.response.ApiResponse;
import com.freshguard.dto.response.NotificationResponse;
import com.freshguard.security.UserPrincipal;
import com.freshguard.service.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@Tag(name = "Notifications", description = "User alert notifications for upcoming, today, and expired products")
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    @Operation(summary = "Get the 20 most recent unread notifications for authenticated user")
    public ResponseEntity<List<NotificationResponse>> getRecentNotifications(
            @AuthenticationPrincipal UserPrincipal principal) {
        List<NotificationResponse> notifications = notificationService.getRecentNotifications(principal.getId());
        return ResponseEntity.ok(notifications);
    }

    @PatchMapping("/{id}/read")
    @Operation(summary = "Mark a single notification as read")
    public ResponseEntity<ApiResponse> markAsRead(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id) {
        ApiResponse response = notificationService.markAsRead(principal.getId(), id);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/read-all")
    @Operation(summary = "Mark all notifications as read for the authenticated user")
    public ResponseEntity<ApiResponse> markAllAsRead(
            @AuthenticationPrincipal UserPrincipal principal) {
        ApiResponse response = notificationService.markAllAsRead(principal.getId());
        return ResponseEntity.ok(response);
    }
}
