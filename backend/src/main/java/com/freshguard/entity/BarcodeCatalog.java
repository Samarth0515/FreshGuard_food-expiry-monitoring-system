package com.freshguard.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "barcode_product_catalog")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BarcodeCatalog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 60)
    private String barcode;

    @Column(name = "product_name", nullable = false, length = 180)
    private String productName;

    @Column(length = 100)
    private String brand;

    @Column(length = 80)
    private String category;

    @Column(name = "default_expiry_days")
    private Integer defaultExpiryDays;
}
