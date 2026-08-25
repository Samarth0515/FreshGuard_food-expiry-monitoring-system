package com.freshguard.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
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
public class DashboardSummaryResponse {
    private long total;
    private long fresh;
    private long nearExpiry;
    private long expired;
    private long expiringToday;
    private long categories;

    @Builder.Default
    private Map<String, Long> byStorage = new HashMap<>();

    @JsonProperty("green")
    public long getGreen() {
        return fresh;
    }

    @JsonProperty("yellow")
    public long getYellow() {
        return nearExpiry;
    }

    @JsonProperty("red")
    public long getRed() {
        return expired;
    }
}
