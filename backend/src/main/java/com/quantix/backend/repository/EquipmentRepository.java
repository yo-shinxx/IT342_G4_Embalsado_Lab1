package com.quantix.backend.repository;

import com.quantix.backend.entity.Equipment;
import com.quantix.backend.entity.Equipment.ConditionStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface EquipmentRepository extends JpaRepository<Equipment, Long> {

    Page<Equipment> findByIsArchivedFalse(Pageable pageable);

    Page<Equipment> findByCategoryCategoryIdAndIsArchivedFalse(Long categoryId, Pageable pageable);

    Page<Equipment> findByConditionStatusAndIsArchivedFalse(ConditionStatus status, Pageable pageable);

    Page<Equipment> findByCategoryCategoryIdAndConditionStatusAndIsArchivedFalse(
            Long categoryId,
            ConditionStatus status,
            Pageable pageable
    );

    @Query("SELECT e FROM Equipment e WHERE LOWER(e.name) LIKE LOWER(CONCAT('%', :query, '%')) AND e.isArchived = false")
    Page<Equipment> searchByName(@Param("query") String query, Pageable pageable);

    long countByConditionStatusAndIsArchivedFalse(ConditionStatus status);
}