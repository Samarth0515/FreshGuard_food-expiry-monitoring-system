package com.freshguard.entity;

import com.freshguard.enums.Difficulty;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "recipes")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Recipe {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "cook_time", length = 40)
    private String cookTime;

    @Column(length = 40)
    private String servings;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "ENUM('Easy','Medium','Hard')")
    @Builder.Default
    private Difficulty difficulty = Difficulty.Easy;

    @Column(columnDefinition = "JSON")
    private String steps;

    @OneToMany(mappedBy = "recipe", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<RecipeIngredient> ingredients = new ArrayList<>();
}
