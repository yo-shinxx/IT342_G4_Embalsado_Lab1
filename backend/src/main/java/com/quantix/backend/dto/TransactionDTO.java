package com.quantix.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransactionDTO {
    private Long id;
    private LocalDateTime timestamp;
    private TransactionUserDTO user;
    private TransactionEquipmentDTO equipment;
    private String actionType;
    private Map<String, Object> details;
}