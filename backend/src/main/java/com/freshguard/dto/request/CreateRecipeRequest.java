package com.freshguard.dto.request;

import com.freshguard.enums.Difficulty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateRecipeRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String description;
    private String cookTime;
    private String servings;

    @Builder.Default
    private Difficulty difficulty = Difficulty.Easy;

    @NotEmpty(message = "At least one ingredient is required")
    @Builder.Default
    private List<String> ingredients = new ArrayList<>();

    @NotEmpty(message = "At least one instruction step is required")
    @Builder.Default
    private List<String> steps = new ArrayList<>();
}
