package com.quantix.backend.controller;

import com.quantix.backend.dto.ApiResponse;
import com.quantix.backend.dto.CategoryDTO;
import com.quantix.backend.service.CategoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
@CrossOrigin(origins = "${cors.allowed.origins}")
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<CategoryDTO>>> getAllCategories() {
        try {
            log.info("GET /api/categories - Fetching all categories");

            List<CategoryDTO> categories = categoryService.getAllCategories();

            ApiResponse<List<CategoryDTO>> response = ApiResponse.<List<CategoryDTO>>builder()
                    .success(true)
                    .data(categories)
                    .error(null)
                    .timestamp(LocalDateTime.now().toString())
                    .build();

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
        log.error("Error fetching categories: {}", e.getMessage(), e);
        return buildErrorResponse(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CategoryDTO>> getCategoryById(@PathVariable Long id) {
        try {
            log.info("GET /api/categories/{}", id);

            CategoryDTO category = categoryService.getCategoryById(id);

            ApiResponse<CategoryDTO> response = ApiResponse.<CategoryDTO>builder()
                    .success(true)
                    .data(category)
                    .error(null)
                    .timestamp(LocalDateTime.now().toString())
                    .build();

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            log.error("Category not found: {}", e.getMessage());
            return buildErrorResponse(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            log.error("Error fetching category: {}", e.getMessage(), e);
            return buildErrorResponse(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private <T> ResponseEntity<ApiResponse<T>> buildErrorResponse(String message, HttpStatus status) {
        ApiResponse<T> response = ApiResponse.<T>builder()
                .success(false)
                .data(null)
                .error(ApiResponse.ErrorData.builder()
                        .code(status.name())
                        .message(message)
                        .build())
                .timestamp(LocalDateTime.now().toString())
                .build();

        return ResponseEntity.status(status).body(response);
    }
}