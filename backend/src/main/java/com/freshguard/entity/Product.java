package com.freshguard.entity;

import com.freshguard.enums.ExpiryStatus;
import com.freshguard.enums.InputMethod;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "products")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "storage_id")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private StorageLocation storageLocation;

    @Column(nullable = false, length = 180)
    private String name;

    @Column(length = 80)
    private String category;

    @Column(precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal quantity = BigDecimal.ONE;

    @Column(name = "quantity_unit", length = 30)
    private String quantityUnit;

    @Column(length = 60)
    private String barcode;

    @Column(name = "mfg_date")
    private LocalDate mfgDate;

    @Column(name = "expiry_date", nullable = false)
    private LocalDate expiryDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "expiry_status", nullable = false, columnDefinition = "ENUM('FRESH','NEAR_EXPIRY','EXPIRED')")
    @Builder.Default
    private ExpiryStatus expiryStatus = ExpiryStatus.FRESH;

    @Enumerated(EnumType.STRING)
    @Column(name = "input_method", columnDefinition = "ENUM('MANUAL','BARCODE','BILL_SCAN','VOICE')")
    @Builder.Default
    private InputMethod inputMethod = InputMethod.MANUAL;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
