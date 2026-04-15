package com.quantix.backend.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EquipmentUpdatedEvent {
    private Long userId;
    private String email;
    private Long equipmentId;
    private String equipmentName;
    private Map<String, Object> changes;
}