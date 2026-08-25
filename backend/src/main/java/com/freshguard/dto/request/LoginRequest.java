package com.freshguard.dto.request;

import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {

    @NotBlank(message = "Member ID is required")
    @JsonAlias({"id", "member_id"})
    private String memberId;

    @NotBlank(message = "Password is required")
    private String password;
}
