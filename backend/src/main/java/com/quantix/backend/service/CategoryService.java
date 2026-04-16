package com.quantix.backend.service;

import com.quantix.backend.dto.CategoryDTO;
import com.quantix.backend.entity.Category;
import com.quantix.backend.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    @Transactional(readOnly = true)
    public List<CategoryDTO> getAllCategories() {
        log.info("Fetching all categories");
        return categoryRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CategoryDTO getCategoryById(Long id) {
        log.info("Fetching category by ID: {}", id);
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with ID: " + id));
        return convertToDTO(category);
    }

    @Transactional
    public void initializeDefaultCategories() {
        log.info("Initializing default categories");
        if (categoryRepository.count() > 0) {
            log.info("Categories already exist, skipping initialization");
            return;
        }

        String[][] defaultCategories = {
                // for now, in the context of a computer engineering laboratory
                {"COMPUTING", "Computers, servers, and software tools"},
                {"NETWORKING", "Routers, switches, cables, and access points"},
                {"ELECTRONICS", "ICs, resistors, capacitors, LEDs, and semiconductors"},
                {"PROTOTYPING", "Breadboards, Arduino, Raspberry Pi, soldering kits"},
                {"INSTRUMENTS", "Multimeters, oscilloscopes, logic analyzers, power supplies"},
                {"SAFETY", "ESD straps, goggles, gloves, fire extinguishers"}
        };

        for (String[] cat : defaultCategories) {
            if (!categoryRepository.existsByName(cat[0])) {
                Category category = new Category();
                category.setName(cat[0]);
                category.setDescription(cat[1]);
                categoryRepository.save(category);
                log.info("Created default category: {}", cat[0]);
            }
        }
    }

    private CategoryDTO convertToDTO(Category category) {
        return CategoryDTO.builder()
                .id(category.getCategoryId())
                .name(category.getName())
                .description(category.getDescription())
                .build();
    }
}