package com.freshguard.service;

import com.freshguard.dto.response.ApiResponse;
import com.freshguard.dto.response.NotificationResponse;
import com.freshguard.entity.Notification;
import com.freshguard.exception.ResourceNotFoundException;
import com.freshguard.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    @Transactional(readOnly = true)
    public List<NotificationResponse> getRecentNotifications(Long userId) {
        List<Notification> unread = notificationRepository.findTop20ByUserIdAndIsReadFalseOrderBySentAtDesc(userId);
        if (!unread.isEmpty()) {
            return unread.stream().map(this::mapToResponse).toList();
        }
        // If all are read, show recent 20 for convenience
        return notificationRepository.findTop20ByUserIdOrderBySentAtDesc(userId)
                .stream().map(this::mapToResponse).toList();
    }

    @Transactional
    public ApiResponse markAsRead(Long userId, Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found with ID: " + notificationId));

        if (!notification.getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException("Notification not found for this user");
        }

        notification.setRead(true);
        notificationRepository.save(notification);
        return ApiResponse.success("Marked as read");
    }

    @Transactional
    public ApiResponse markAllAsRead(Long userId) {
        notificationRepository.markAllAsReadByUserId(userId);
        return ApiResponse.success("All notifications marked as read");
    }

    private NotificationResponse mapToResponse(Notification n) {
        return NotificationResponse.builder()
                .id(n.getId())
                .productId(n.getProduct() != null ? n.getProduct().getId() : null)
                .productName(n.getProduct() != null ? n.getProduct().getName() : "Item")
                .alertType(n.getAlertType())
                .message(n.getMessage())
                .isRead(n.isRead())
                .sentAt(n.getSentAt())
                .build();
    }
}
