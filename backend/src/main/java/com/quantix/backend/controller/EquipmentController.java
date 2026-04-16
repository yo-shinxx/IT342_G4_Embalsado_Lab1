package com.quantix.backend.controller;

import com.quantix.backend.dto.ApiResponse;
import com.quantix.backend.dto.EquipmentDTO;
import com.quantix.backend.dto.EquipmentRequest;
import com.quantix.backend.dto.PaginatedResponse;
import com.quantix.backend.repository.UserRepository;
import com.quantix.backend.service.EquipmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@Slf4j
@RestController
@RequestMapping("/api/equipments")
@RequiredArgsConstructor
@CrossOrigin(origins = "${cors.allowed.origins}")
public class EquipmentController {

    private final EquipmentService equipmentService;
    private final UserRepository userRepository;

    private static final String DEFAULT_IMAGE_URL =
            "https://i.pinimg.com/1200x/ee/ca/b9/eecab93ad7e597dbcad7403c0a880038.jpg";

    @GetMapping
    public ResponseEntity<ApiResponse<PaginatedResponse<EquipmentDTO>>> getAllEquipment(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int limit,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String status
    ) {
        try {
            log.info("GET /api/equipment - page: {}, limit: {}, categoryId: {}, status: {}",
                    page, limit, categoryId, status);

            PaginatedResponse<EquipmentDTO> result = equipmentService.getAllEquipment(
                    page, limit, categoryId, status
            );

            ApiResponse<PaginatedResponse<EquipmentDTO>> response = ApiResponse.<PaginatedResponse<EquipmentDTO>>builder()
                    .success(true)
                    .data(result)
                    .error(null)
                    .timestamp(LocalDateTime.now().toString())
                    .build();

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Error fetching equipment list: {}", e.getMessage(), e);
            return buildErrorResponse(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<EquipmentDTO>> getEquipmentById(@PathVariable Long id) {
        try {
            log.info("GET /api/equipment/{}", id);

            EquipmentDTO equipment = equipmentService.getEquipmentById(id);

            ApiResponse<EquipmentDTO> response = ApiResponse.<EquipmentDTO>builder()
                    .success(true)
                    .data(equipment)
                    .error(null)
                    .timestamp(LocalDateTime.now().toString())
                    .build();

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            log.error("Equipment not found with ID {}: {}", id, e.getMessage());
            return buildErrorResponse(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            log.error("Error fetching equipment: {}", e.getMessage(), e);
            return buildErrorResponse(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<PaginatedResponse<EquipmentDTO>>> searchEquipment(
            @RequestParam String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int limit
    ) {
        try {
            log.info("GET /api/equipment/search - query: {}, page: {}, limit: {}", q, page, limit);

            PaginatedResponse<EquipmentDTO> result = equipmentService.searchEquipment(q, page, limit);

            ApiResponse<PaginatedResponse<EquipmentDTO>> response = ApiResponse.<PaginatedResponse<EquipmentDTO>>builder()
                    .success(true)
                    .data(result)
                    .error(null)
                    .timestamp(LocalDateTime.now().toString())
                    .build();

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Error searching equipment: {}", e.getMessage(), e);
            return buildErrorResponse(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_COORDINATOR')")
    public ResponseEntity<ApiResponse<EquipmentDTO>> createEquipment(
            @Valid @RequestBody EquipmentRequest request,
            Authentication authentication
    ) {
        try {
            log.info("POST /api/equipment - Creating equipment: {}", request.getName());

            // Set default image if none provided
            if (request.getImageUrl() == null || request.getImageUrl().trim().isEmpty()) {
                request.setImageUrl(DEFAULT_IMAGE_URL);
                log.info("Using default image URL");
            }

            String userEmail = authentication.getName();

            Long userId = getUserIdFromEmail(userEmail);

            EquipmentDTO created = equipmentService.createEquipment(request, userId);

            ApiResponse<EquipmentDTO> response = ApiResponse.<EquipmentDTO>builder()
                    .success(true)
                    .data(created)
                    .error(null)
                    .timestamp(LocalDateTime.now().toString())
                    .build();

            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (RuntimeException e) {
            log.error("Error creating equipment: {}", e.getMessage());
            return buildErrorResponse(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            log.error("Error creating equipment: {}", e.getMessage(), e);
            return buildErrorResponse(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_COORDINATOR')")
    public ResponseEntity<ApiResponse<EquipmentDTO>> updateEquipment(
            @PathVariable Long id,
            @Valid @RequestBody EquipmentRequest request,
            Authentication authentication
    ) {
        try {
            log.info("PUT /api/equipment/{} - Updating equipment", id);

            String userEmail = authentication.getName();
            Long userId = getUserIdFromEmail(userEmail);

            EquipmentDTO updated = equipmentService.updateEquipment(id, request, userId);

            ApiResponse<EquipmentDTO> response = ApiResponse.<EquipmentDTO>builder()
                    .success(true)
                    .data(updated)
                    .error(null)
                    .timestamp(LocalDateTime.now().toString())
                    .build();

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            log.error("Error updating equipment: {}", e.getMessage());
            return buildErrorResponse(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            log.error("Error updating equipment: {}", e.getMessage(), e);
            return buildErrorResponse(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<EquipmentDTO>> updateEquipmentStatus(
            @PathVariable Long id,
            @RequestBody UpdateStatusRequest request,
            Authentication authentication
    ) {
        try {
            log.info("PUT /api/equipment/{}/status - New status: {}", id, request.getStatus());

            String userEmail = authentication.getName();
            Long userId = getUserIdFromEmail(userEmail);

            EquipmentDTO updated = equipmentService.updateEquipmentStatus(
                    id, request.getStatus(), userId
            );

            ApiResponse<EquipmentDTO> response = ApiResponse.<EquipmentDTO>builder()
                    .success(true)
                    .data(updated)
                    .error(null)
                    .timestamp(LocalDateTime.now().toString())
                    .build();

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            log.error("Error updating equipment status: {}", e.getMessage());
            return buildErrorResponse(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            log.error("Error updating equipment status: {}", e.getMessage(), e);
            return buildErrorResponse(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

//    archive equipment (Coordinator only)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_COORDINATOR')")
    public ResponseEntity<ApiResponse<Void>> archiveEquipment(
            @PathVariable Long id,
            Authentication authentication
    ) {
        try {
            log.info("DELETE /api/equipment/{} - Archiving equipment", id);

            String userEmail = authentication.getName();
            Long userId = getUserIdFromEmail(userEmail);

            equipmentService.archiveEquipment(id, userId);

            ApiResponse<Void> response = ApiResponse.<Void>builder()
                    .success(true)
                    .data(null)
                    .error(null)
                    .timestamp(LocalDateTime.now().toString())
                    .build();

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            log.error("Error archiving equipment: {}", e.getMessage());
            return buildErrorResponse(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            log.error("Error archiving equipment: {}", e.getMessage(), e);
            return buildErrorResponse(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // helper
    private Long getUserIdFromEmail(String email) {
        return userRepository.getUserIdByEmail(email);
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

    // Inner class for status update request
    @lombok.Data
    public static class UpdateStatusRequest {
        private String status;
    }
}