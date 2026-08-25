package com.freshguard.dto.request;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.freshguard.enums.UserType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SignUpRequest {

    @NotBlank(message = "Name is required")
    @Size(max = 120, message = "Name must not exceed 120 characters")
    private String name;

    @NotBlank(message = "Member ID is required")
    @Size(max = 60, message = "Member ID must not exceed 60 characters")
    @JsonAlias({"id", "member_id"})
    private String memberId;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    @NotNull(message = "User type is required")
    @JsonAlias({"user_type"})
    private UserType userType;
}
