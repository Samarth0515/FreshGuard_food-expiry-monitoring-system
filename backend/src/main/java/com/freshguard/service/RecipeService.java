package com.freshguard.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.freshguard.dto.response.RecipeResponse;
import com.freshguard.entity.Recipe;
import com.freshguard.entity.RecipeIngredient;
import com.freshguard.repository.RecipeIngredientRepository;
import com.freshguard.repository.RecipeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class RecipeService {

    private final RecipeRepository recipeRepository;
    private final RecipeIngredientRepository recipeIngredientRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Transactional(readOnly = true)
    public List<RecipeResponse> suggestRecipes(String ingredientsQuery) {
        List<Recipe> recipes;

        if (ingredientsQuery == null || ingredientsQuery.trim().isEmpty()) {
            recipes = recipeRepository.findAll(Sort.by(Sort.Direction.ASC, "id"));
        } else {
            List<String> ingredientList = Arrays.stream(ingredientsQuery.split(","))
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .map(String::toLowerCase)
                    .distinct()
                    .toList();

            if (ingredientList.isEmpty()) {
                recipes = recipeRepository.findAll(Sort.by(Sort.Direction.ASC, "id"));
            } else {
                // Find recipes matching any or all ingredients
                recipes = recipeRepository.findRecipesMatchingAllIngredients(ingredientList, ingredientList.size());
                // If strict all-match yields nothing, fallback to recipes matching any of the ingredients
                if (recipes.isEmpty()) {
                    recipes = recipeRepository.findAll().stream()
                            .filter(r -> r.getIngredients().stream()
                                    .anyMatch(ri -> ingredientList.stream().anyMatch(input -> ri.getIngredient().toLowerCase().contains(input) || input.contains(ri.getIngredient().toLowerCase()))))
                            .toList();
                }
            }
        }

        return recipes.stream().map(this::mapToResponse).toList();
    }

    private RecipeResponse mapToResponse(Recipe r) {
        List<String> stepsList = new ArrayList<>();
        if (r.getSteps() != null && !r.getSteps().isBlank()) {
            try {
                stepsList = objectMapper.readValue(r.getSteps(), new TypeReference<List<String>>() {});
            } catch (Exception e) {
                log.warn("Could not parse recipe steps for recipe {}: {}", r.getId(), e.getMessage());
                stepsList = List.of(r.getSteps());
            }
        }

        List<String> ingredientNames = r.getIngredients() != null
                ? r.getIngredients().stream().map(RecipeIngredient::getIngredient).toList()
                : recipeIngredientRepository.findByRecipeId(r.getId()).stream().map(RecipeIngredient::getIngredient).toList();

        return RecipeResponse.builder()
                .id(r.getId())
                .title(r.getTitle())
                .description(r.getDescription())
                .cookTime(r.getCookTime())
                .servings(r.getServings())
                .difficulty(r.getDifficulty())
                .ingredients(ingredientNames)
                .steps(stepsList)
                .build();
    }
}
