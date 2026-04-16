package com.quantix.backend.controller;

import com.quantix.backend.dto.ApiResponse;
import com.quantix.backend.dto.PaginatedResponse;
import com.quantix.backend.dto.TransactionDTO;
import com.quantix.backend.service.TransactionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@Slf4j
@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
@CrossOrigin(origins = "${cors.allowed.origins}")
public class TransactionController {

    private final TransactionService transactionService;

    //all transactions (paginated)
    @GetMapping
    public ResponseEntity<ApiResponse<PaginatedResponse<TransactionDTO>>> getAllTransactions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int limit,
            @RequestParam(required = false) String actionType,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate
    ) {
        try {
            log.info("GET /api/transactions - page: {}, limit: {}, actionType: {}",
                    page, limit, actionType);

            PaginatedResponse<TransactionDTO> result = transactionService.getAllTransactions(
                    page, limit, actionType, startDate, endDate
            );

            ApiResponse<PaginatedResponse<TransactionDTO>> response =
                    ApiResponse.<PaginatedResponse<TransactionDTO>>builder()
                            .success(true)
                            .data(result)
                            .error(null)
                            .timestamp(LocalDateTime.now().toString())
                            .build();

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Error fetching transactions: {}", e.getMessage(), e);
            return buildErrorResponse(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/equipment/{equipmentId}")
    public ResponseEntity<ApiResponse<PaginatedResponse<TransactionDTO>>> getTransactionsByEquipment(
            @PathVariable Long equipmentId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int limit
    ) {
        try {
            log.info("GET /api/transactions/equipment/{} - page: {}, limit: {}",
                    equipmentId, page, limit);

            PaginatedResponse<TransactionDTO> result = transactionService
                    .getTransactionsByEquipment(equipmentId, page, limit);

            ApiResponse<PaginatedResponse<TransactionDTO>> response =
                    ApiResponse.<PaginatedResponse<TransactionDTO>>builder()
                            .success(true)
                            .data(result)
                            .error(null)
                            .timestamp(LocalDateTime.now().toString())
                            .build();

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Error fetching equipment transactions: {}", e.getMessage(), e);
            return buildErrorResponse(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<PaginatedResponse<TransactionDTO>>> getTransactionsByUser(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int limit
    ) {
        try {
            log.info("GET /api/transactions/user/{} - page: {}, limit: {}",
                    userId, page, limit);

            PaginatedResponse<TransactionDTO> result = transactionService
                    .getTransactionsByUser(userId, page, limit);

            ApiResponse<PaginatedResponse<TransactionDTO>> response =
                    ApiResponse.<PaginatedResponse<TransactionDTO>>builder()
                            .success(true)
                            .data(result)
                            .error(null)
                            .timestamp(LocalDateTime.now().toString())
                            .build();

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Error fetching user transactions: {}", e.getMessage(), e);
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