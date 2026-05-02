package com.quantix.backend.config;

import com.quantix.backend.service.CategoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final CategoryService categoryService;

    @Override
    public void run(String... args) {
        log.info("Initializing database with default data...");
        categoryService.initializeDefaultCategories();
        log.info("Database initialization complete");
    }
}