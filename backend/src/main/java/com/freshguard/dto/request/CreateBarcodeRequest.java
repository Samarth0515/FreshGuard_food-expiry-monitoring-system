package com.freshguard.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateBarcodeRequest {

    @NotBlank(message = "Barcode number is required")
    private String barcode;

    @NotBlank(message = "Product name is required")
    private String productName;

    private String brand;
    private String category;
    private Integer defaultExpiryDays;
}
