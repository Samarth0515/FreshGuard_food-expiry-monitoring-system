/**
 * recipeService.js
 * ----------------------------------------------------------------------
 * Recipe suggestions service connected to Spring Boot /api/recipes/suggest.
 * ----------------------------------------------------------------------
 */

import apiClient from "./apiClient";

export async function suggest(ingredients = []) {
  const queryParam = Array.isArray(ingredients)
    ? ingredients.join(",")
    : ingredients || "";

  const params = queryParam ? { ingredients: queryParam } : {};
  return apiClient.get("/recipes/suggest", params);
}

export const recipeService = {
  suggest,
};

export default recipeService;
