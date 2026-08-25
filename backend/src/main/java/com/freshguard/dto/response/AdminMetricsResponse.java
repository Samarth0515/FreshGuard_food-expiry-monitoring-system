package com.freshguard.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashMap;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminMetricsResponse {
    private long totalUsers;
    private long totalHomeUsers;
    private long totalShopkeepers;
    private long totalAdmins;
    private long totalProducts;
    private long totalFresh;
    private long totalNearExpiry;
    private long totalExpired;
    private long totalExpiringToday;
    private long totalRecipes;
    private long totalBarcodes;

    @Builder.Default
    private Map<String, Long> storageDistribution = new HashMap<>();
}
