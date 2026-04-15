package com.quantix.backend.service;

import com.quantix.backend.dto.*;
import com.quantix.backend.entity.Category;
import com.quantix.backend.entity.Equipment;
import com.quantix.backend.entity.Equipment.ConditionStatus;
import com.quantix.backend.entity.Transaction;
import com.quantix.backend.entity.User;
import com.quantix.backend.event.EquipmentArchivedEvent;
import com.quantix.backend.event.EquipmentCreatedEvent;
import com.quantix.backend.event.EquipmentStatusChangedEvent;
import com.quantix.backend.event.EquipmentUpdatedEvent;
import com.quantix.backend.repository.CategoryRepository;
import com.quantix.backend.repository.EquipmentRepository;
import com.quantix.backend.repository.TransactionRepository;
import com.quantix.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class EquipmentService {

    private final EquipmentRepository equipmentRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final TransactionRepository transactionRepository;
    private final TransactionLoggerService transactionLogger;
    private final ApplicationEventPublisher eventPublisher;

    public PaginatedResponse<EquipmentDTO> getAllEquipment(
            int page,
            int limit,
            Long categoryId,
            String status
    ) {
        log.info("Fetching equipment - page: {}, limit: {}, categoryId: {}, status: {}",
                page, limit, categoryId, status);

        Pageable pageable = PageRequest.of(page, limit, Sort.by("createdAt").descending());
        Page<Equipment> equipmentPage;

        if (categoryId != null && status != null) {
            ConditionStatus conditionStatus = ConditionStatus.valueOf(status);
            equipmentPage = equipmentRepository
                    .findByCategoryCategoryIdAndConditionStatusAndIsArchivedFalse(
                            categoryId, conditionStatus, pageable
                    );
        } else if (categoryId != null) {
            equipmentPage = equipmentRepository
                    .findByCategoryCategoryIdAndIsArchivedFalse(categoryId, pageable);
        } else if (status != null) {
            ConditionStatus conditionStatus = ConditionStatus.valueOf(status);
            equipmentPage = equipmentRepository
                    .findByConditionStatusAndIsArchivedFalse(conditionStatus, pageable);
        } else {
            equipmentPage = equipmentRepository.findByIsArchivedFalse(pageable);
        }

        return buildPaginatedResponse(equipmentPage);
    }

    public EquipmentDTO getEquipmentById(Long id) {
        log.info("Fetching equipment by ID: {}", id);
        Equipment equipment = equipmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Equipment not found with ID: " + id));

        if (equipment.getIsArchived()) {
            throw new RuntimeException("Equipment is archived");
        }

        return convertToDTO(equipment);
    }

    public PaginatedResponse<EquipmentDTO> searchEquipment(String query, int page, int limit) {
        log.info("Searching equipment with query: {}", query);
        Pageable pageable = PageRequest.of(page, limit, Sort.by("name").ascending());
        Page<Equipment> equipmentPage = equipmentRepository.searchByName(query, pageable);
        return buildPaginatedResponse(equipmentPage);
    }

    @Transactional
    public EquipmentDTO createEquipment(EquipmentRequest request, Long userId) {
        log.info("Creating new equipment: {} by user ID: {}", request.getName(), userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        Equipment equipment = new Equipment();
        equipment.setName(request.getName());
        equipment.setCategory(category);
        equipment.setModel(request.getModel());
        equipment.setManufacturer(request.getManufacturer());
        equipment.setSpecifications(request.getSpecifications());
        equipment.setConditionStatus(ConditionStatus.valueOf(request.getConditionStatus()));
        equipment.setPurchaseDate(request.getPurchaseDate());
        equipment.setSerialNumber(request.getSerialNumber());
        equipment.setQuantity(request.getQuantity() != null ? request.getQuantity() : 1);
        equipment.setImageUrl(request.getImageUrl());
        equipment.setCreatedBy(user);
        equipment.setIsArchived(false);

        equipment = equipmentRepository.save(equipment);

        eventPublisher.publishEvent(new EquipmentCreatedEvent(
                String.valueOf(user.getUserId()),
                user.getEmail(),
                equipment.getEquipmentId(),
                equipment.getName(),
                equipment.getConditionStatus().name()
        ));

        log.info("Equipment created successfully with ID: {}", equipment.getEquipmentId());
        return convertToDTO(equipment);
    }

    @Transactional
    public EquipmentDTO updateEquipment(Long id, EquipmentRequest request, Long userId) {
        log.info("Updating equipment ID: {} by user ID: {}", id, userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Equipment equipment = equipmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Equipment not found"));

        if (equipment.getIsArchived()) {
            throw new RuntimeException("Cannot update archived equipment");
        }

        Map<String, Object> changes = new HashMap<>();

        if (!equipment.getName().equals(request.getName())) {
            changes.put("name", Map.of("old", equipment.getName(), "new", request.getName()));
            equipment.setName(request.getName());
        }

        if (request.getCategoryId() != null &&
                !equipment.getCategory().getCategoryId().equals(request.getCategoryId())) {
            Category newCategory = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            changes.put("category", Map.of(
                    "old", equipment.getCategory().getName(),
                    "new", newCategory.getName()
            ));
            equipment.setCategory(newCategory);
        }

        equipment.setModel(request.getModel());
        equipment.setManufacturer(request.getManufacturer());
        equipment.setSpecifications(request.getSpecifications());
        equipment.setPurchaseDate(request.getPurchaseDate());
        equipment.setSerialNumber(request.getSerialNumber());
        equipment.setQuantity(request.getQuantity());
        equipment.setImageUrl(request.getImageUrl());

        equipment = equipmentRepository.save(equipment);

        eventPublisher.publishEvent(new EquipmentUpdatedEvent(
                String.valueOf(user.getUserId()),
                user.getEmail(),
                equipment.getEquipmentId(),
                equipment.getName(),
                changes
        ));

        log.info("Equipment updated successfully");
        return convertToDTO(equipment);
    }

    @Transactional
    public EquipmentDTO updateEquipmentStatus(Long id, String newStatus, Long userId) {
        log.info("Updating equipment status - ID: {}, new status: {}", id, newStatus);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Equipment equipment = equipmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Equipment not found"));

        if (equipment.getIsArchived()) {
            throw new RuntimeException("Cannot update archived equipment");
        }

        String previousStatus = equipment.getConditionStatus().name();
        equipment.setConditionStatus(ConditionStatus.valueOf(newStatus));
        equipment = equipmentRepository.save(equipment);

        // Log transaction
        Map<String, Object> details = Map.of(
                "previousStatus", previousStatus,
                "newStatus", newStatus
        );
        eventPublisher.publishEvent(new EquipmentStatusChangedEvent(
                String.valueOf(user.getUserId()),
                user.getEmail(),
                equipment.getEquipmentId(),
                equipment.getName(),
                previousStatus,
                newStatus
        ));

        log.info("Equipment status updated successfully");
        return convertToDTO(equipment);
    }

    @Transactional
    public void archiveEquipment(Long id, Long userId) {
        log.info("Archiving equipment ID: {} by user ID: {}", id, userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Equipment equipment = equipmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Equipment not found"));

        equipment.setIsArchived(true);
        equipmentRepository.save(equipment);

        eventPublisher.publishEvent(new EquipmentArchivedEvent(
                String.valueOf(user.getUserId()),
                user.getEmail(),
                equipment.getEquipmentId(),
                equipment.getName()
        ));

        log.info("Equipment archived successfully");
    }

    private EquipmentDTO convertToDTO(Equipment equipment) {
        return EquipmentDTO.builder()
                .id(equipment.getEquipmentId())
                .name(equipment.getName())
                .category(CategoryDTO.builder()
                        .id(equipment.getCategory().getCategoryId())
                        .name(equipment.getCategory().getName())
                        .description(equipment.getCategory().getDescription())
                        .build())
                .model(equipment.getModel())
                .manufacturer(equipment.getManufacturer())
                .specifications(equipment.getSpecifications())
                .conditionStatus(equipment.getConditionStatus().name())
                .purchaseDate(equipment.getPurchaseDate())
                .serialNumber(equipment.getSerialNumber())
                .quantity(equipment.getQuantity())
                .imageUrl(equipment.getImageUrl())
                .createdAt(equipment.getCreatedAt())
                .createdBy(CreatedByDTO.builder()
                        .id(equipment.getCreatedBy().getUserId())
                        .name(equipment.getCreatedBy().getFirstName() + " " +
                                equipment.getCreatedBy().getLastName())
                        .build())
                .updatedAt(equipment.getUpdatedAt())
                .build();
    }

    private PaginatedResponse<EquipmentDTO> buildPaginatedResponse(Page<Equipment> page) {
        return PaginatedResponse.<EquipmentDTO>builder()
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