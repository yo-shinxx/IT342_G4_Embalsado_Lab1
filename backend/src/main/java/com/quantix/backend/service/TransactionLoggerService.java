package com.quantix.backend.service;

import com.quantix.backend.entity.TransactionLog;
import com.quantix.backend.repository.TransactionLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class TransactionLoggerService {

    private final TransactionLogRepository transactionLogRepository;

    public void log(String action, Long userId, String email, String details) {
        log.info("[TRANSACTION] action={}, userId={}, email={}, details={}", action, userId, email, details);

        // save to database (for transaction history feature)
        TransactionLog transactionLog = TransactionLog.builder()
                .action(action)
                .userId(userId)
                .email(email)
                .details(details)
                .timestamp(LocalDateTime.now())
                .build();

        transactionLogRepository.save(transactionLog);
    }

    public void logEquipmentAction(String action, Long userId, String email, String equipmentName, String details) {
        log.info("[TRANSACTION] action={}, userId={}, email={}, equipment={}, details={}", action, userId, email, equipmentName, details);

        TransactionLog transactionLog = TransactionLog.builder()
                .action(action)
                .userId(userId)
                .email(email)
                .equipmentName(equipmentName)
                .details(details)
                .timestamp(LocalDateTime.now())
                .build();

        transactionLogRepository.save(transactionLog);
    }
}