package com.freshguard.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BarcodeLookupResponse {
    private String barcode;
    private String name;
    private String brand;
    private String category;
    private Integer defaultExpiryDays;
    private String imageUrl;
    private String ingredients;
    private Map<String, String> nutrition;

    @JsonProperty("productName")
    public String getProductName() {
        return name;
    }
}
