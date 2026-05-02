package com.quantix.backend.controller;

import com.quantix.backend.entity.TransactionLog;
import com.quantix.backend.repository.TransactionLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/transaction-logs")
@RequiredArgsConstructor
public class TransactionLogController {

    private final TransactionLogRepository transactionLogRepository;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllTransactionLogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int limit,
            @RequestParam(required = false) String action,
            @RequestParam(defaultValue = "timestamp") String sort,
            @RequestParam(defaultValue = "desc") String direction
    ) {
        Sort.Direction sortDirection = direction.equalsIgnoreCase("desc")
                ? Sort.Direction.DESC
                : Sort.Direction.ASC;

        Pageable pageable = PageRequest.of(page, limit, Sort.by(sortDirection, sort));

        Page<TransactionLog> logsPage;

        if (action != null && !action.isEmpty()) {
            logsPage = transactionLogRepository.findByAction(action, pageable);
        } else {
            logsPage = transactionLogRepository.findAll(pageable);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("content", logsPage.getContent());
        response.put("pagination", Map.of(
                "page", logsPage.getNumber(),
                "limit", logsPage.getSize(),
                "total", logsPage.getTotalElements(),
                "pages", logsPage.getTotalPages()
        ));

        return ResponseEntity.ok(response);
    }
}