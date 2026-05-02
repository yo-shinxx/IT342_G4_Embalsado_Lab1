package com.quantix.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EquipmentDTO {
    private Long id;
    private String name;
    private CategoryDTO category;
    private String model;
    private String manufacturer;
    private String specifications;
    private String conditionStatus;
    private LocalDate purchaseDate;
    private String serialNumber;
    private Integer quantity;
    private String imageUrl;
    private LocalDateTime createdAt;
    private CreatedByDTO createdBy;
    private LocalDateTime updatedAt;
}