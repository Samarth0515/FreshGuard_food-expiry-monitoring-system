package com.freshguard.controller;

import com.freshguard.dto.response.RecipeResponse;
import com.freshguard.service.RecipeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/recipes")
@RequiredArgsConstructor
@Tag(name = "Recipes", description = "Recipe suggestions based on near-expiry ingredients")
public class RecipeController {

    private final RecipeService recipeService;

    @GetMapping("/suggest")
    @Operation(summary = "Suggest recipes matching given ingredients")
    public ResponseEntity<List<RecipeResponse>> suggestRecipes(
            @RequestParam(required = false) String ingredients) {
        List<RecipeResponse> recipes = recipeService.suggestRecipes(ingredients);
        return ResponseEntity.ok(recipes);
    }
}
