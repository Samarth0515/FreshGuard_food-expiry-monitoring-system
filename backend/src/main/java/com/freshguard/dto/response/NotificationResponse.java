package com.freshguard.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.freshguard.enums.AlertType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationResponse {
    private Long id;
    private Long productId;
    private String productName;
    private AlertType alertType;
    private String message;
    private boolean isRead;
    private LocalDateTime sentAt;

    @JsonProperty("isRead")
    public boolean isRead() {
        return isRead;
    }
}
