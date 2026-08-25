package com.freshguard.controller;

import com.freshguard.dto.request.CreateBarcodeRequest;
import com.freshguard.dto.request.CreateRecipeRequest;
import com.freshguard.dto.response.*;
import com.freshguard.service.AdminService;
import com.freshguard.service.ExpiryMonitorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@Tag(name = "Admin Control Center", description = "System metrics, user monitoring, recipe management, and catalog control")
public class AdminController {

    private final AdminService adminService;
    private final ExpiryMonitorService expiryMonitorService;

    @GetMapping("/metrics")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get comprehensive platform and inventory health metrics")
    public ResponseEntity<AdminMetricsResponse> getSystemMetrics() {
        return ResponseEntity.ok(adminService.getSystemMetrics());
    }

    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "List all registered users across the platform")
    public ResponseEntity<List<AdminUserDto>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @DeleteMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete user account and cascade inventory data")
    public ResponseEntity<ApiResponse> deleteUser(@PathVariable Long id) {
        adminService.deleteUser(id);
        return ResponseEntity.ok(ApiResponse.success("User deleted successfully"));
    }

    @PostMapping("/recipes")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Add a new recipe to the global catalog")
    public ResponseEntity<RecipeResponse> createRecipe(@Valid @RequestBody CreateRecipeRequest request) {
        RecipeResponse recipe = adminService.createRecipe(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(recipe);
    }

    @PutMapping("/recipes/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update an existing recipe")
    public ResponseEntity<RecipeResponse> updateRecipe(@PathVariable Long id, @Valid @RequestBody CreateRecipeRequest request) {
        RecipeResponse recipe = adminService.updateRecipe(id, request);
        return ResponseEntity.ok(recipe);
    }

    @DeleteMapping("/recipes/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete a recipe from the global catalog")
    public ResponseEntity<ApiResponse> deleteRecipe(@PathVariable Long id) {
        adminService.deleteRecipe(id);
        return ResponseEntity.ok(ApiResponse.success("Recipe deleted successfully"));
    }

    @PostMapping("/barcodes")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Add a new barcode item to the catalog")
    public ResponseEntity<BarcodeLookupResponse> createBarcode(@Valid @RequestBody CreateBarcodeRequest request) {
        BarcodeLookupResponse barcode = adminService.createBarcode(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(barcode);
    }

    @PostMapping("/trigger-expiry-check")
    @Operation(summary = "Manually trigger the daily expiry monitoring check job")
    public ResponseEntity<ApiResponse> triggerExpiryCheck() {
        int processed = expiryMonitorService.processExpiryCheck();
        return ResponseEntity.ok(ApiResponse.success("Expiry check triggered successfully. Processed " + processed + " products."));
    }
}
