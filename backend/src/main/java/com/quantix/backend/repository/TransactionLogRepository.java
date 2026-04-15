package com.quantix.backend.repository;

import com.quantix.backend.entity.TransactionLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TransactionLogRepository extends JpaRepository<TransactionLog, Long> {

    List<TransactionLog> findByUserIdOrderByTimestampDesc(String userId);

    Page<TransactionLog> findByUserId(String userId, Pageable pageable);

    List<TransactionLog> findByAction(String action);

    List<TransactionLog> findByTimestampBetween(LocalDateTime start, LocalDateTime end);

    List<TransactionLog> findByUserIdAndAction(String userId, String action);

    long countByUserId(String userId);

    @Query("SELECT t FROM TransactionLog t ORDER BY t.timestamp DESC")
    List<TransactionLog> findRecentTransactions(Pageable pageable);

    @Query("SELECT t FROM TransactionLog t WHERE t.email LIKE %:keyword% OR t.details LIKE %:keyword%")
    List<TransactionLog> searchByKeyword(@Param("keyword") String keyword);
}