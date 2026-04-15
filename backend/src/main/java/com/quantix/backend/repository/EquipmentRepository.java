package com.quantix.backend.repository;

import com.quantix.backend.entity.Category;
import com.quantix.backend.entity.Equipment;
import com.quantix.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EquipmentRepository extends JpaRepository<Equipment, Long> {
    Optional<Equipment> findByName(String name);
}
