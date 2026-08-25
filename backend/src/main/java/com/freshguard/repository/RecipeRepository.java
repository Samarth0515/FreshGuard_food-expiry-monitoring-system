package com.freshguard.repository;

import com.freshguard.entity.Recipe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface RecipeRepository extends JpaRepository<Recipe, Long> {

    @Query("SELECT r FROM Recipe r JOIN r.ingredients ri " +
           "WHERE LOWER(ri.ingredient) IN :ingredients " +
           "GROUP BY r.id, r.title, r.description, r.cookTime, r.servings, r.difficulty, r.steps " +
           "HAVING COUNT(DISTINCT LOWER(ri.ingredient)) = :requiredCount " +
           "ORDER BY r.id")
    List<Recipe> findRecipesMatchingAllIngredients(@Param("ingredients") Collection<String> ingredients,
                                                  @Param("requiredCount") long requiredCount);
}
