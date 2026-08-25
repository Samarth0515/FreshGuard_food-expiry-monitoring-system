package com.freshguard.dto.request;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.freshguard.enums.InputMethod;
import com.freshguard.enums.StorageType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductRequest {

    @NotBlank(message = "Product name is required")
    private String name;

    private String category;

    @NotNull(message = "Storage location is required")
    private StorageType location;

    @Builder.Default
    private BigDecimal quantity = BigDecimal.ONE;

    private String quantityUnit;

    private String barcode;

    private LocalDate mfgDate;

    @NotNull(message = "Expiry date is required")
    @JsonAlias({"expDate", "expiry_date"})
    private LocalDate expiryDate;

    @Builder.Default
    private InputMethod inputMethod = InputMethod.MANUAL;

    private String notes;
}
