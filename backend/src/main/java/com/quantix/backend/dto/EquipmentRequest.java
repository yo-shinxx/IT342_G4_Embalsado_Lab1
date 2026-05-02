package com.quantix.backend.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EquipmentRequest {

    @NotBlank(message = "Equipment name is required")
    private String name;

    @NotNull(message = "Category is required")
    private Long categoryId;

    private String model;
    private String manufacturer;
    private String specifications;

    @NotBlank(message = "Condition status is required")
    private String conditionStatus;

    private LocalDate purchaseDate;
    private String serialNumber;

    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity;

    private String imageUrl;
}