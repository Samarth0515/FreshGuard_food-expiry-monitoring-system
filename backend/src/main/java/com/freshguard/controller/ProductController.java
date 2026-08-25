package com.freshguard.controller;

import com.freshguard.dto.request.ProductRequest;
import com.freshguard.dto.response.BarcodeLookupResponse;
import com.freshguard.dto.response.DashboardSummaryResponse;
import com.freshguard.dto.response.ProductResponse;
import com.freshguard.enums.ExpiryStatus;
import com.freshguard.enums.StorageType;
import com.freshguard.security.UserPrincipal;
import com.freshguard.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@Tag(name = "Products", description = "Product inventory management, search, barcode lookup, and dashboard analytics")
public class ProductController {

    private final ProductService productService;

    @GetMapping
    @Operation(summary = "Get all products for the authenticated user with optional search, filter, and sort")
    public ResponseEntity<List<ProductResponse>> getAllProducts(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(required = false) String q,
            @RequestParam(required = false) ExpiryStatus status,
            @RequestParam(required = false) StorageType location,
            @RequestParam(required = false, defaultValue = "expiry_asc") String sort) {
        List<ProductResponse> products = productService.getAllProducts(principal.getId(), q, status, location, sort);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/search")
    @Operation(summary = "Search products by keyword")
    public ResponseEntity<List<ProductResponse>> searchProducts(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(required = false) String q) {
        List<ProductResponse> products = productService.getAllProducts(principal.getId(), q, null, null, "expiry_asc");
        return ResponseEntity.ok(products);
    }

    @GetMapping("/summary")
    @Operation(summary = "Get dashboard summary metrics and storage distribution")
    public ResponseEntity<DashboardSummaryResponse> getSummary(
            @AuthenticationPrincipal UserPrincipal principal) {
        DashboardSummaryResponse summary = productService.getDashboardSummary(principal.getId());
        return ResponseEntity.ok(summary);
    }

    @GetMapping("/barcode/{barcode}")
    @Operation(summary = "Lookup product metadata by barcode (local catalog or Open Food Facts API)")
    public ResponseEntity<BarcodeLookupResponse> lookupBarcode(@PathVariable String barcode) {
        BarcodeLookupResponse response = productService.lookupByBarcode(barcode);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get single product details by ID")
    public ResponseEntity<ProductResponse> getProductById(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id) {
        ProductResponse product = productService.getProductById(principal.getId(), id);
        return ResponseEntity.ok(product);
    }

    @PostMapping
    @Operation(summary = "Add a new product to user inventory")
    public ResponseEntity<ProductResponse> createProduct(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody ProductRequest request) {
        ProductResponse product = productService.createProduct(principal.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(product);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing product")
    public ResponseEntity<ProductResponse> updateProduct(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id,
            @Valid @RequestBody ProductRequest request) {
        ProductResponse product = productService.updateProduct(principal.getId(), id, request);
        return ResponseEntity.ok(product);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a product from inventory")
    public ResponseEntity<Void> deleteProduct(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id) {
        productService.deleteProduct(principal.getId(), id);
        return ResponseEntity.noContent().build();
    }
}
