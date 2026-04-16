package com.quantix.backend.repository;

import com.quantix.backend.entity.Transaction;
import com.quantix.backend.entity.Transaction.ActionType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    // paginated
    Page<Transaction> findAllByOrderByTimestampDesc(Pageable pageable);

    Page<Transaction> findByEquipmentEquipmentIdOrderByTimestampDesc(Long equipmentId, Pageable pageable);

    Page<Transaction> findByUserUserIdOrderByTimestampDesc(Long userId, Pageable pageable);

    Page<Transaction> findByActionTypeOrderByTimestampDesc(ActionType actionType, Pageable pageable);

    @Query("SELECT t FROM Transaction t WHERE t.timestamp BETWEEN :startDate AND :endDate ORDER BY t.timestamp DESC")
    Page<Transaction> findByDateRange(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            Pageable pageable
    );
}