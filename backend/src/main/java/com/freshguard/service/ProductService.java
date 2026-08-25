package com.freshguard.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.freshguard.dto.request.ProductRequest;
import com.freshguard.dto.response.BarcodeLookupResponse;
import com.freshguard.dto.response.DashboardSummaryResponse;
import com.freshguard.dto.response.ProductResponse;
import com.freshguard.entity.BarcodeCatalog;
import com.freshguard.entity.Product;
import com.freshguard.entity.StorageLocation;
import com.freshguard.entity.User;
import com.freshguard.enums.ExpiryStatus;
import com.freshguard.enums.StorageType;
import com.freshguard.exception.ResourceNotFoundException;
import com.freshguard.repository.BarcodeCatalogRepository;
import com.freshguard.repository.ProductRepository;
import com.freshguard.repository.StorageLocationRepository;
import com.freshguard.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final StorageLocationRepository storageLocationRepository;
    private final BarcodeCatalogRepository barcodeCatalogRepository;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public static ExpiryStatus calculateExpiryStatus(LocalDate expiryDate) {
        if (expiryDate == null) {
            return ExpiryStatus.FRESH;
        }
        LocalDate today = LocalDate.now();
        long daysUntilExpiry = ChronoUnit.DAYS.between(today, expiryDate);

        if (daysUntilExpiry < 0) {
            return ExpiryStatus.EXPIRED;
        } else if (daysUntilExpiry <= 7) {
            return ExpiryStatus.NEAR_EXPIRY;
        } else {
            return ExpiryStatus.FRESH;
        }
    }

    @Transactional(readOnly = true)
    public List<ProductResponse> getAllProducts(Long userId, String q, ExpiryStatus status, StorageType location, String sort) {
        Sort sortObj = resolveSort(sort);
        String searchTerm = (q != null && !q.trim().isEmpty()) ? q.trim() : null;

        List<Product> products = productRepository.searchProducts(userId, searchTerm, status, location, sortObj);
        return products.stream().map(this::mapToResponse).toList();
    }

    @Transactional(readOnly = true)
    public ProductResponse getProductById(Long userId, Long id) {
        Product product = productRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + id));
        return mapToResponse(product);
    }

    @Transactional
    public ProductResponse createProduct(Long userId, ProductRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        final StorageType finalStorageType = request.getLocation() != null ? request.getLocation() : StorageType.FRIDGE;
        StorageLocation storageLocation = storageLocationRepository.findByUserIdAndName(userId, finalStorageType)
                .orElseGet(() -> storageLocationRepository.save(
                        StorageLocation.builder()
                                .user(user)
                                .name(finalStorageType)
                                .description("Custom storage location")
                                .build()
                ));

        ExpiryStatus status = calculateExpiryStatus(request.getExpiryDate());

        Product product = Product.builder()
                .user(user)
                .storageLocation(storageLocation)
                .name(request.getName().trim())
                .category(request.getCategory() != null ? request.getCategory().trim() : null)
                .quantity(request.getQuantity())
                .quantityUnit(request.getQuantityUnit() != null ? request.getQuantityUnit().trim() : null)
                .barcode(request.getBarcode() != null ? request.getBarcode().trim() : null)
                .mfgDate(request.getMfgDate())
                .expiryDate(request.getExpiryDate())
                .expiryStatus(status)
                .inputMethod(request.getInputMethod())
                .notes(request.getNotes())
                .build();

        product = productRepository.save(product);
        return mapToResponse(product);
    }

    @Transactional
    public ProductResponse updateProduct(Long userId, Long productId, ProductRequest request) {
        Product product = productRepository.findByIdAndUserId(productId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + productId));

        if (request.getLocation() != null) {
            final StorageType updateLoc = request.getLocation();
            final User productUser = product.getUser();
            StorageLocation storageLocation = storageLocationRepository.findByUserIdAndName(userId, updateLoc)
                    .orElseGet(() -> storageLocationRepository.save(
                            StorageLocation.builder()
                                    .user(productUser)
                                    .name(updateLoc)
                                    .description("Storage location")
                                    .build()
                    ));
            product.setStorageLocation(storageLocation);
        }

        product.setName(request.getName().trim());
        product.setCategory(request.getCategory() != null ? request.getCategory().trim() : null);
        product.setQuantity(request.getQuantity());
        product.setQuantityUnit(request.getQuantityUnit() != null ? request.getQuantityUnit().trim() : null);
        product.setBarcode(request.getBarcode() != null ? request.getBarcode().trim() : null);
        product.setMfgDate(request.getMfgDate());
        product.setExpiryDate(request.getExpiryDate());
        product.setExpiryStatus(calculateExpiryStatus(request.getExpiryDate()));
        if (request.getInputMethod() != null) {
            product.setInputMethod(request.getInputMethod());
        }
        product.setNotes(request.getNotes());

        product = productRepository.save(product);
        return mapToResponse(product);
    }

    @Transactional
    public void deleteProduct(Long userId, Long productId) {
        Product product = productRepository.findByIdAndUserId(productId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + productId));
        productRepository.delete(product);
    }

    @Transactional(readOnly = true)
    public DashboardSummaryResponse getDashboardSummary(Long userId) {
        LocalDate today = LocalDate.now();
        List<Object[]> results = productRepository.getSummaryMetrics(userId, today);

        if (results == null || results.isEmpty()) {
            return DashboardSummaryResponse.builder().build();
        }

        Object[] row = results.get(0);
        long total = ((Number) row[0]).longValue();
        long fresh = ((Number) row[1]).longValue();
        long nearExpiry = ((Number) row[2]).longValue();
        long expired = ((Number) row[3]).longValue();
        long expiringToday = ((Number) row[4]).longValue();
        long categories = ((Number) row[5]).longValue();
        long fridge = ((Number) row[6]).longValue();
        long pantry = ((Number) row[7]).longValue();
        long freezer = ((Number) row[8]).longValue();

        Map<String, Long> byStorage = new HashMap<>();
        byStorage.put("FRIDGE", fridge);
        byStorage.put("PANTRY", pantry);
        byStorage.put("FREEZER", freezer);

        return DashboardSummaryResponse.builder()
                .total(total)
                .fresh(fresh)
                .nearExpiry(nearExpiry)
                .expired(expired)
                .expiringToday(expiringToday)
                .categories(categories)
                .byStorage(byStorage)
                .build();
    }

    @Transactional(readOnly = true)
    public BarcodeLookupResponse lookupByBarcode(String barcode) {
        String cleanBarcode = barcode.trim();

        // 1. Search local barcode catalog
        Optional<BarcodeCatalog> catalogOpt = barcodeCatalogRepository.findByBarcode(cleanBarcode);
        if (catalogOpt.isPresent()) {
            BarcodeCatalog item = catalogOpt.get();
            return BarcodeLookupResponse.builder()
                    .barcode(item.getBarcode())
                    .name(item.getProductName())
                    .brand(item.getBrand())
                    .category(item.getCategory())
                    .defaultExpiryDays(item.getDefaultExpiryDays())
                    .build();
        }

        // 2. Fallback to Open Food Facts API
        try {
            String url = "https://world.openfoodfacts.org/api/v0/product/" + cleanBarcode + ".json";
            String rawJson = restTemplate.getForObject(url, String.class);

            if (rawJson != null) {
                JsonNode root = objectMapper.readTree(rawJson);
                int status = root.path("status").asInt(0);

                if (status == 1 && root.has("product")) {
                    JsonNode productNode = root.get("product");
                    String productName = productNode.path("product_name").asText("Unknown product");
                    String brand = productNode.path("brands").asText("");
                    String category = productNode.path("categories").asText("Packaged Food");
                    String imageUrl = productNode.path("image_url").asText("");
                    String ingredients = productNode.path("ingredients_text").asText("No ingredients available");

                    JsonNode nutriments = productNode.path("nutriments");
                    Map<String, String> nutrition = new LinkedHashMap<>();
                    if (!nutriments.isMissingNode()) {
                        nutrition.put("Energy", nutriments.path("energy_100g").asText("?") + " " + nutriments.path("energy_unit").asText("kcal"));
                        nutrition.put("Fat", nutriments.path("fat_100g").asText("?") + "g");
                        nutrition.put("Saturated Fat", nutriments.path("saturated-fat_100g").asText("?") + "g");
                        nutrition.put("Carbohydrates", nutriments.path("carbohydrates_100g").asText("?") + "g");
                        nutrition.put("Sugars", nutriments.path("sugars_100g").asText("?") + "g");
                        nutrition.put("Fiber", nutriments.path("fiber_100g").asText("?") + "g");
                        nutrition.put("Proteins", nutriments.path("proteins_100g").asText("?") + "g");
                        nutrition.put("Salt", nutriments.path("salt_100g").asText("?") + "g");
                    }

                    return BarcodeLookupResponse.builder()
                            .barcode(cleanBarcode)
                            .name(productName)
                            .brand(brand)
                            .category(category)
                            .defaultExpiryDays(180)
                            .imageUrl(imageUrl)
                            .ingredients(ingredients)
                            .nutrition(nutrition)
                            .build();
                }
            }
        } catch (Exception ex) {
            log.warn("Open Food Facts API call failed for barcode {}: {}", cleanBarcode, ex.getMessage());
        }

        throw new ResourceNotFoundException("Product not found for barcode " + cleanBarcode);
    }

    private Sort resolveSort(String sort) {
        if ("expiry_desc".equalsIgnoreCase(sort)) {
            return Sort.by(Sort.Direction.DESC, "expiryDate");
        } else if ("name_asc".equalsIgnoreCase(sort)) {
            return Sort.by(Sort.Direction.ASC, "name");
        } else {
            return Sort.by(Sort.Direction.ASC, "expiryDate");
        }
    }

    private ProductResponse mapToResponse(Product product) {
        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .category(product.getCategory())
                .location(product.getStorageLocation() != null ? product.getStorageLocation().getName() : StorageType.FRIDGE)
                .quantity(product.getQuantity())
                .quantityUnit(product.getQuantityUnit())
                .mfgDate(product.getMfgDate())
                .expiryDate(product.getExpiryDate())
                .expiryStatus(product.getExpiryStatus())
                .inputMethod(product.getInputMethod())
                .barcode(product.getBarcode())
                .notes(product.getNotes())
                .createdAt(product.getCreatedAt())
                .build();
    }
}
