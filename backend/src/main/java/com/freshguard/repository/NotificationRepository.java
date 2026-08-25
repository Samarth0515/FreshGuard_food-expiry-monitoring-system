package com.freshguard.repository;

import com.freshguard.entity.Notification;
import com.freshguard.enums.AlertType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findTop20ByUserIdAndIsReadFalseOrderBySentAtDesc(Long userId);

    List<Notification> findTop20ByUserIdOrderBySentAtDesc(Long userId);

    boolean existsByUserIdAndProductIdAndAlertTypeAndSentAtAfter(Long userId, Long productId, AlertType alertType, LocalDateTime sentAt);

    @Modifying
    @Query("UPDATE Notification n SET n.isRead = true WHERE n.user.id = :userId")
    void markAllAsReadByUserId(@Param("userId") Long userId);
}
