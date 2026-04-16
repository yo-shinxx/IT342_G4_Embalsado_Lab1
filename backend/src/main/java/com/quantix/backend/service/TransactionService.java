package com.quantix.backend.service;

import com.quantix.backend.dto.PaginatedResponse;
import com.quantix.backend.dto.PaginationInfo;
import com.quantix.backend.dto.TransactionDTO;
import com.quantix.backend.dto.TransactionEquipmentDTO;
import com.quantix.backend.dto.TransactionUserDTO;
import com.quantix.backend.entity.Transaction;
import com.quantix.backend.entity.Transaction.ActionType;
import com.quantix.backend.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;

    public PaginatedResponse<TransactionDTO> getAllTransactions(
            int page,
            int limit,
            String actionType,
            LocalDateTime startDate,
            LocalDateTime endDate
    ) {
        log.info("Fetching transactions - page: {}, limit: {}, actionType: {}",
                page, limit, actionType);

        Pageable pageable = PageRequest.of(page, limit, Sort.by("timestamp").descending());
        Page<Transaction> transactionPage;

        if (actionType != null) {
            ActionType action = ActionType.valueOf(actionType);
            transactionPage = transactionRepository.findByActionTypeOrderByTimestampDesc(action, pageable);
        } else if (startDate != null && endDate != null) {
            transactionPage = transactionRepository.findByDateRange(startDate, endDate, pageable);
        } else {
            transactionPage = transactionRepository.findAllByOrderByTimestampDesc(pageable);
        }

        return buildPaginatedResponse(transactionPage);
    }

    public PaginatedResponse<TransactionDTO> getTransactionsByEquipment(Long equipmentId, int page, int limit) {
        log.info("Fetching transactions for equipment ID: {}", equipmentId);
        Pageable pageable = PageRequest.of(page, limit, Sort.by("timestamp").descending());
        Page<Transaction> transactionPage = transactionRepository
                .findByEquipmentEquipmentIdOrderByTimestampDesc(equipmentId, pageable);
        return buildPaginatedResponse(transactionPage);
    }

    public PaginatedResponse<TransactionDTO> getTransactionsByUser(Long userId, int page, int limit) {
        log.info("Fetching transactions for user ID: {}", userId);
        Pageable pageable = PageRequest.of(page, limit, Sort.by("timestamp").descending());
        Page<Transaction> transactionPage = transactionRepository
                .findByUserUserIdOrderByTimestampDesc(userId, pageable);
        return buildPaginatedResponse(transactionPage);
    }

    private TransactionDTO convertToDTO(Transaction transaction) {
        return TransactionDTO.builder()
                .id(transaction.getTransactionId())
                .timestamp(transaction.getTimestamp())
                .user(TransactionUserDTO.builder()
                        .id(transaction.getUser().getUserId())
                        .name(transaction.getUser().getFirstName() + " " +
                                transaction.getUser().getLastName())
                        .email(transaction.getUser().getEmail())
                        .build())
                .equipment(TransactionEquipmentDTO.builder()
                        .id(transaction.getEquipment().getEquipmentId())
                        .name(transaction.getEquipment().getName())
                        .build())
                .actionType(transaction.getActionType().name())
                .build();
    }

    private PaginatedResponse<TransactionDTO> buildPaginatedResponse(Page<Transaction> page) {
        return PaginatedResponse.<TransactionDTO>builder()
                .content(page.getContent().stream()
                        .map(this::convertToDTO)
                        .toList())
                .pagination(PaginationInfo.builder()
                        .page(page.getNumber())
                        .limit(page.getSize())
                        .total(page.getTotalElements())
                        .pages(page.getTotalPages())
                        .build())
                .build();
    }
}