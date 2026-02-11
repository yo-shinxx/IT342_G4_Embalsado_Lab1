package com.quantix.backend.service;

import com.quantix.backend.dto.*;
import com.quantix.backend.entity.User;
import com.quantix.backend.entity.UserRole;
import com.quantix.backend.repository.UserRepository;
import com.quantix.backend.repository.UserRoleRepository;
import com.quantix.backend.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final UserRoleRepository userRoleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        log.info("Registering new user: {}", request.getEmail());

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        if (!isInstitutionalEmail(request.getEmail())) {
            throw new RuntimeException("Please use institutional email (@cit.edu)");
        }

        // default role (NAS)
        UserRole nasRole = userRoleRepository.findByRoleName("NAS")
                .orElseThrow(() -> new RuntimeException("Default role 'NAS' not found. Please initialize roles in database."));

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setRole(nasRole);
        user.setIsActive(true);

        user = userRepository.save(user);
        log.info("User registered successfully: {}", user.getEmail());

        String token = jwtTokenProvider.generateToken(user);

        return buildAuthResponse(token, user);
    }

    public AuthResponse login(LoginRequest request) {
        log.info("User login attempt: {}", request.getEmail());

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        if (!user.getIsActive()) {
            throw new RuntimeException("Account is inactive. Please contact administrator.");
        }

        log.info("User logged in successfully: {}", user.getEmail());

        String token = jwtTokenProvider.generateToken(user);

        return buildAuthResponse(token, user);
    }

    // will add OAuth login later


    public void logout(String token) {
        log.info("User logout - invalidating token");
        jwtTokenProvider.invalidateToken(token);
    }

    public UserDTO getProfile(Long userId) {
        log.info("Fetching profile for user ID: {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return convertToDTO(user);
    }

    // helpers

    private boolean isInstitutionalEmail(String email) {
        return email != null && email.toLowerCase().endsWith("@cit.edu");
    }

    private User createUserFromOAuth(String email, OAuthLoginRequest request) {
        log.info("Creating new user from OAuth: {}", email);

        // default role
        UserRole nasRole = userRoleRepository.findByRoleName("NAS")
                .orElseThrow(() -> new RuntimeException("Default role 'NAS' not found"));


        User user = new User();
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode("OAUTH_USER"));
        user.setFirstName("OAuth");
        user.setLastName("User");
        user.setRole(nasRole);
        user.setIsActive(true);

        return userRepository.save(user);
    }

    private AuthResponse buildAuthResponse(String token, User user) {
        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .userId(user.getUserId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .role(user.getRole())
                .build();
    }

    private UserDTO convertToDTO(User user) {
        return UserDTO.builder()
                .userId(user.getUserId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .role(user.getRole())
                .isActive(user.getIsActive())
                .build();
    }
}