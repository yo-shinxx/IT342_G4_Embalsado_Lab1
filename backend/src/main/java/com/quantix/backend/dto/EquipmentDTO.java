package com.quantix.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EquipmentDTO {
    private Long equipmentId;
    private String name;
    private CategoryDTO category;
    private String model;
    private String manufacturer;
    private String specifications;
    private LocalDateTime purchaseDate;
    private String serialNumber;
    private int quantity;
    private String imageUrl;
    private boolean isArchived;
    private LocalDateTime createdAt;
    private String createdByName;
    private LocalDateTime updatedAt;
}