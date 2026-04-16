package com.quantix.backend.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {

    private boolean success;
    private T data;
    private ErrorData error;
    private String timestamp;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class ErrorData {
        private String code;
        private String message;
        private Object details;
    }

    // Static helper methods for common responses
    public static <T> ApiResponse<T> success(T data) {
        return ApiResponse.<T>builder()
                .success(true)
                .data(data)
                .timestamp(java.time.LocalDateTime.now().toString())
                .build();
    }

    public static <T> ApiResponse<T> error(String code, String message) {
        return ApiResponse.<T>builder()
                .success(false)
                .error(ErrorData.builder()
                        .code(code)
                        .message(message)
                        .build())
                .timestamp(java.time.LocalDateTime.now().toString())
                .build();
    }

    public static <T> ApiResponse<T> error(String code, String message, Object details) {
        return ApiResponse.<T>builder()
                .success(false)
                .error(ErrorData.builder()
                        .code(code)
                        .message(message)
                        .details(details)
                        .build())
                .timestamp(java.time.LocalDateTime.now().toString())
                .build();
    }
}