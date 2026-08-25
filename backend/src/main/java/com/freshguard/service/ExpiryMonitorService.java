package com.freshguard.service;

import com.freshguard.entity.Notification;
import com.freshguard.entity.Product;
import com.freshguard.enums.AlertType;
import com.freshguard.enums.ExpiryStatus;
import com.freshguard.repository.NotificationRepository;
import com.freshguard.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;

@Slf4j
@Service
@RequiredArgsConstructor
public class ExpiryMonitorService {

    private final ProductRepository productRepository;
    private final NotificationRepository notificationRepository;
    private final DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd MMM yyyy");

    @Scheduled(cron = "0 0 8 * * *")
    public void runDailyExpiryCheck() {
        log.info("Starting scheduled daily expiry monitoring check...");
        int processedCount = processExpiryCheck();
        log.info("Completed daily expiry check. Processed {} products.", processedCount);
    }

    @Transactional
    public int processExpiryCheck() {
        int pageNumber = 0;
        int pageSize = 100;
        int totalProcessed = 0;
        LocalDate today = LocalDate.now();
        LocalDateTime past24Hours = LocalDateTime.now().minusHours(24);

        Page<Product> page;
        do {
            Pageable pageable = PageRequest.of(pageNumber, pageSize);
            page = productRepository.findAll(pageable);

            for (Product product : page.getContent()) {
                totalProcessed++;
                checkAndProcessProduct(product, today, past24Hours);
            }

            pageNumber++;
        } while (page.hasNext());

        return totalProcessed;
    }

    private void checkAndProcessProduct(Product product, LocalDate today, LocalDateTime past24Hours) {
        LocalDate expDate = product.getExpiryDate();
        if (expDate == null) return;

        ExpiryStatus newStatus = ProductService.calculateExpiryStatus(expDate);
        if (product.getExpiryStatus() != newStatus) {
            product.setExpiryStatus(newStatus);
            productRepository.save(product);
        }

        long daysLeft = ChronoUnit.DAYS.between(today, expDate);
        String storageName = product.getStorageLocation() != null ? product.getStorageLocation().getName().name() : "STORAGE";
        String formattedDate = expDate.format(dateFormatter);

        // 1. TODAY_EXPIRY
        if (daysLeft == 0) {
            boolean exists = notificationRepository.existsByUserIdAndProductIdAndAlertTypeAndSentAtAfter(
                    product.getUser().getId(), product.getId(), AlertType.TODAY_EXPIRY, past24Hours);
            if (!exists) {
                notificationRepository.save(Notification.builder()
                        .user(product.getUser())
                        .product(product)
                        .alertType(AlertType.TODAY_EXPIRY)
                        .message(product.getName() + " expires TODAY. Use it or discard it.")
                        .build());
            }
        }
        // 2. NEAR_EXPIRY (1 to 7 days)
        else if (daysLeft > 0 && daysLeft <= 7) {
            boolean exists = notificationRepository.existsByUserIdAndProductIdAndAlertTypeAndSentAtAfter(
                    product.getUser().getId(), product.getId(), AlertType.UPCOMING_EXPIRY, past24Hours);
            if (!exists) {
                notificationRepository.save(Notification.builder()
                        .user(product.getUser())
                        .product(product)
                        .alertType(AlertType.UPCOMING_EXPIRY)
                        .message(product.getName() + " in " + storageName + " expires in " + daysLeft + " day(s) (" + formattedDate + ").")
                        .build());
            }
        }
        // 3. EXPIRED (< 0 days)
        else if (daysLeft < 0) {
            boolean exists = notificationRepository.existsByUserIdAndProductIdAndAlertTypeAndSentAtAfter(
                    product.getUser().getId(), product.getId(), AlertType.ALREADY_EXPIRED, past24Hours);
            if (!exists) {
                notificationRepository.save(Notification.builder()
                        .user(product.getUser())
                        .product(product)
                        .alertType(AlertType.ALREADY_EXPIRED)
                        .message(product.getName() + " in " + storageName + " has expired as of " + formattedDate + ".")
                        .build());
            }
        }
    }
}
