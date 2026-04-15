package com.quantix.backend.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EquipmentStatusChangedEvent {
    private String userId;
    private String email;
    private Long equipmentId;
    private String equipmentName;
    private String previousStatus;
    private String newStatus;
}