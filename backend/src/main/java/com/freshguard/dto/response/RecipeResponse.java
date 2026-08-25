package com.freshguard.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.freshguard.enums.Difficulty;
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
public class RecipeResponse {
    private Long id;
    private String title;
    private String description;
    private String cookTime;
    private String servings;
    private Difficulty difficulty;

    @Builder.Default
    private List<String> ingredients = new ArrayList<>();

    @Builder.Default
    private List<String> steps = new ArrayList<>();

    @JsonProperty("desc")
    public String getDesc() {
        return description;
    }

    @JsonProperty("tags")
    public List<String> getTags() {
        return ingredients;
    }
}
