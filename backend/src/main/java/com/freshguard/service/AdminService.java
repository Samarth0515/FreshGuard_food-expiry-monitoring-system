package com.freshguard.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.freshguard.dto.request.CreateBarcodeRequest;
import com.freshguard.dto.request.CreateRecipeRequest;
import com.freshguard.dto.response.*;
import com.freshguard.entity.BarcodeCatalog;
import com.freshguard.entity.Product;
import com.freshguard.entity.Recipe;
import com.freshguard.entity.RecipeIngredient;
import com.freshguard.entity.User;
import com.freshguard.enums.ExpiryStatus;
import com.freshguard.enums.StorageType;
import com.freshguard.enums.UserType;
import com.freshguard.exception.DuplicateMemberIdException;
import com.freshguard.exception.ResourceNotFoundException;
import com.freshguard.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final StorageLocationRepository storageLocationRepository;
    private final RecipeRepository recipeRepository;
    private final RecipeIngredientRepository recipeIngredientRepository;
    private final BarcodeCatalogRepository barcodeCatalogRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Transactional(readOnly = true)
    public AdminMetricsResponse getSystemMetrics() {
        List<User> users = userRepository.findAll();
        long totalUsers = users.size();
        long homeUsers = users.stream().filter(u -> u.getUserType() == UserType.HOME_USER).count();
        long shopkeepers = users.stream().filter(u -> u.getUserType() == UserType.SHOPKEEPER).count();
        long admins = users.stream().filter(u -> u.getUserType() == UserType.ADMIN).count();

        List<Product> products = productRepository.findAll();
        long totalProducts = products.size();
        LocalDate today = LocalDate.now();

        long fresh = products.stream().filter(p -> p.getExpiryStatus() == ExpiryStatus.FRESH).count();
        long nearExpiry = products.stream().filter(p -> p.getExpiryStatus() == ExpiryStatus.NEAR_EXPIRY).count();
        long expired = products.stream().filter(p -> p.getExpiryStatus() == ExpiryStatus.EXPIRED).count();
        long expiringToday = products.stream().filter(p -> today.equals(p.getExpiryDate())).count();

        long fridge = products.stream().filter(p -> p.getStorageLocation() != null && p.getStorageLocation().getName() == StorageType.FRIDGE).count();
        long pantry = products.stream().filter(p -> p.getStorageLocation() != null && p.getStorageLocation().getName() == StorageType.PANTRY).count();
        long freezer = products.stream().filter(p -> p.getStorageLocation() != null && p.getStorageLocation().getName() == StorageType.FREEZER).count();

        Map<String, Long> storageDist = new HashMap<>();
        storageDist.put("FRIDGE", fridge);
        storageDist.put("PANTRY", pantry);
        storageDist.put("FREEZER", freezer);

        long totalRecipes = recipeRepository.count();
        long totalBarcodes = barcodeCatalogRepository.count();

        return AdminMetricsResponse.builder()
                .totalUsers(totalUsers)
                .totalHomeUsers(homeUsers)
                .totalShopkeepers(shopkeepers)
                .totalAdmins(admins)
                .totalProducts(totalProducts)
                .totalFresh(fresh)
                .totalNearExpiry(nearExpiry)
                .totalExpired(expired)
                .totalExpiringToday(expiringToday)
                .totalRecipes(totalRecipes)
                .totalBarcodes(totalBarcodes)
                .storageDistribution(storageDist)
                .build();
    }

    @Transactional(readOnly = true)
    public List<AdminUserDto> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream().map(u -> AdminUserDto.builder()
                .id(u.getId())
                .name(u.getName())
                .memberId(u.getMemberId())
                .userType(u.getUserType())
                .productCount(u.getProducts() != null ? u.getProducts().size() : 0)
                .storageLocationCount(u.getStorageLocations() != null ? u.getStorageLocations().size() : 0)
                .createdAt(u.getCreatedAt())
                .build()
        ).toList();
    }

    @Transactional
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));
        if (user.getUserType() == UserType.ADMIN && "admin".equalsIgnoreCase(user.getMemberId())) {
            throw new IllegalArgumentException("Cannot delete primary system administrator account.");
        }
        userRepository.delete(user);
    }

    @Transactional
    public RecipeResponse createRecipe(CreateRecipeRequest request) {
        String stepsJson = "[]";
        try {
            stepsJson = objectMapper.writeValueAsString(request.getSteps());
        } catch (Exception e) {
            log.warn("Error converting recipe steps to JSON: {}", e.getMessage());
        }

        Recipe recipe = Recipe.builder()
                .title(request.getTitle().trim())
                .description(request.getDescription())
                .cookTime(request.getCookTime())
                .servings(request.getServings())
                .difficulty(request.getDifficulty())
                .steps(stepsJson)
                .build();

        recipe = recipeRepository.save(recipe);

        List<RecipeIngredient> ingredientEntities = new ArrayList<>();
        for (String ing : request.getIngredients()) {
            if (ing != null && !ing.trim().isEmpty()) {
                ingredientEntities.add(RecipeIngredient.builder()
                        .recipe(recipe)
                        .ingredient(ing.trim().toLowerCase())
                        .build());
            }
        }
        recipeIngredientRepository.saveAll(ingredientEntities);
        recipe.setIngredients(ingredientEntities);

        return RecipeResponse.builder()
                .id(recipe.getId())
                .title(recipe.getTitle())
                .description(recipe.getDescription())
                .cookTime(recipe.getCookTime())
                .servings(recipe.getServings())
                .difficulty(recipe.getDifficulty())
                .ingredients(request.getIngredients())
                .steps(request.getSteps())
                .build();
    }

    @Transactional
    public RecipeResponse updateRecipe(Long id, CreateRecipeRequest request) {
        Recipe recipe = recipeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Recipe not found with ID: " + id));

        String stepsJson = "[]";
        try {
            stepsJson = objectMapper.writeValueAsString(request.getSteps());
        } catch (Exception e) {
            log.warn("Error converting recipe steps to JSON: {}", e.getMessage());
        }

        recipe.setTitle(request.getTitle().trim());
        recipe.setDescription(request.getDescription());
        recipe.setCookTime(request.getCookTime());
        recipe.setServings(request.getServings());
        recipe.setDifficulty(request.getDifficulty());
        recipe.setSteps(stepsJson);

        // Replace ingredients
        recipe.getIngredients().clear();
        recipeRepository.save(recipe);

        List<RecipeIngredient> newIngredients = new ArrayList<>();
        for (String ing : request.getIngredients()) {
            if (ing != null && !ing.trim().isEmpty()) {
                newIngredients.add(RecipeIngredient.builder()
                        .recipe(recipe)
                        .ingredient(ing.trim().toLowerCase())
                        .build());
            }
        }
        recipeIngredientRepository.saveAll(newIngredients);
        recipe.setIngredients(newIngredients);

        return RecipeResponse.builder()
                .id(recipe.getId())
                .title(recipe.getTitle())
                .description(recipe.getDescription())
                .cookTime(recipe.getCookTime())
                .servings(recipe.getServings())
                .difficulty(recipe.getDifficulty())
                .ingredients(request.getIngredients())
                .steps(request.getSteps())
                .build();
    }

    @Transactional
    public void deleteRecipe(Long id) {
        Recipe recipe = recipeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Recipe not found with ID: " + id));
        recipeRepository.delete(recipe);
    }

    @Transactional
    public BarcodeLookupResponse createBarcode(CreateBarcodeRequest request) {
        String cleanBarcode = request.getBarcode().trim();
        if (barcodeCatalogRepository.findByBarcode(cleanBarcode).isPresent()) {
            throw new DuplicateMemberIdException("Barcode '" + cleanBarcode + "' already exists in catalog.");
        }

        BarcodeCatalog item = BarcodeCatalog.builder()
                .barcode(cleanBarcode)
                .productName(request.getProductName().trim())
                .brand(request.getBrand() != null ? request.getBrand().trim() : null)
                .category(request.getCategory() != null ? request.getCategory().trim() : null)
                .defaultExpiryDays(request.getDefaultExpiryDays() != null ? request.getDefaultExpiryDays() : 180)
                .build();

        item = barcodeCatalogRepository.save(item);

        return BarcodeLookupResponse.builder()
                .barcode(item.getBarcode())
                .name(item.getProductName())
                .brand(item.getBrand())
                .category(item.getCategory())
                .defaultExpiryDays(item.getDefaultExpiryDays())
                .build();
    }
}
