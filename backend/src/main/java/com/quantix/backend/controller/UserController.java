package com.quantix.backend.controller;

import com.quantix.backend.entity.User;
import com.quantix.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<?> getProfile(Authentication auth) {
        System.out.println("=== Debug Profile ===");
        System.out.println("Auth object: " + auth);
        System.out.println("Auth name: " + (auth != null ? auth.getName() : "null"));
        System.out.println("Auth principal: " + (auth != null ? auth.getPrincipal() : "null"));
        
        if (auth == null) {
            return ResponseEntity.status(401).body(Map.of("error", "No authentication"));
        }


        String email = auth.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return ResponseEntity.ok(Map.of(
            "id", user.getUserId(),
            "email", user.getEmail(),
            "firstName", user.getFirstName(),
            "lastName", user.getLastName(),
            "avatar", user.getAvatar() != null ? user.getAvatar() : "",
            "role", user.getRole().getRoleName()
        ));
    }
}