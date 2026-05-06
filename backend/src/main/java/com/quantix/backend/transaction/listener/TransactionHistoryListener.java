package com.quantix.backend.transaction.listener;

import com.quantix.backend.auth.dto.UserRegisterEvent;
import com.quantix.backend.equipment.event.EquipmentArchivedEvent;
import com.quantix.backend.equipment.event.EquipmentCreatedEvent;
import com.quantix.backend.equipment.event.EquipmentStatusChangedEvent;
import com.quantix.backend.equipment.event.EquipmentUpdatedEvent;
import com.quantix.backend.transaction.service.TransactionLoggerService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class TransactionHistoryListener {

    private final TransactionLoggerService transactionLogger;

    @EventListener
    public void onUserRegister(UserRegisterEvent event) {
        transactionLogger.log(
                "REGISTER",
                event.getUserId(),
                event.getEmail(),
                "User registered: " + event.getFirstName() + " " + event.getLastName()
        );
    }

    @EventListener
    public void onEquipmentCreated(EquipmentCreatedEvent event) {
        transactionLogger.logEquipmentAction(
                "EQUIPMENT_CREATED",
                event.getUserId(),
                event.getEmail(),
                event.getEquipmentName(),
                "Equipment created: " + event.getEquipmentName() +
                        " (Status: " + event.getConditionStatus() + ")"
        );
    }

    @EventListener
    public void onEquipmentUpdated(EquipmentUpdatedEvent event) {
        transactionLogger.logEquipmentAction(
                "EQUIPMENT_UPDATED",
                event.getUserId(),
                event.getEmail(),
                event.getEquipmentName(),
                "Equipment updated: " + event.getEquipmentName() +
                        " - Changes: " + event.getChanges()
        );
    }

    @EventListener
    public void onEquipmentStatusChanged(EquipmentStatusChangedEvent event) {
        transactionLogger.logEquipmentAction(
                "EQUIPMENT_STATUS_CHANGED",
                event.getUserId(),
                event.getEmail(),
                event.getEquipmentName(),
                "Equipment status changed: " + event.getEquipmentName() +
                        " from " + event.getPreviousStatus() + " to " + event.getNewStatus()
        );
    }

    @EventListener
    public void onEquipmentArchived(EquipmentArchivedEvent event) {
        transactionLogger.logEquipmentAction(
                "EQUIPMENT_ARCHIVED",
                event.getUserId(),
                event.getEmail(),
                event.getEquipmentName(),
                "Equipment archived: " + event.getEquipmentName()
        );
    }
}