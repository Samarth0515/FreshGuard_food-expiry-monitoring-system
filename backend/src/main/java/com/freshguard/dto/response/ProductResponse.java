package com.freshguard.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.freshguard.enums.ExpiryStatus;
import com.freshguard.enums.InputMethod;
import com.freshguard.enums.StorageType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponse {
    private Long id;
    private String name;
    private String category;
    private StorageType location;
    private BigDecimal quantity;
    private String quantityUnit;
    private LocalDate mfgDate;
    private LocalDate expiryDate;
    private ExpiryStatus expiryStatus;
    private InputMethod inputMethod;
    private String barcode;
    private String notes;
    private LocalDateTime createdAt;

    @JsonProperty("expDate")
    public LocalDate getExpDate() {
        return expiryDate;
    }
}
