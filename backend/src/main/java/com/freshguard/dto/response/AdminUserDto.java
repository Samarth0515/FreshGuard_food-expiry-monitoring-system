package com.freshguard.dto.response;

import com.freshguard.enums.UserType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminUserDto {
    private Long id;
    private String name;
    private String memberId;
    private UserType userType;
    private long productCount;
    private long storageLocationCount;
    private LocalDateTime createdAt;
}
