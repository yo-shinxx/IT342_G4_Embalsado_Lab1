package com.quantix.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "transaction_logs")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransactionLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "transaction_log_id")
    private Long transactionLogId;

    @Column(name = "action", nullable = false)
    private String action;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "equipment_name")
    private String equipmentName;

    @Column(name = "details", length = 1000)
    private String details;

    @CreationTimestamp
    @Column(name = "timestamp", nullable = false, updatable = false)
    private LocalDateTime timestamp;
}