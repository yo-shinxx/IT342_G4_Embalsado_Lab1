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
import org.springframework.security.oauth2.core.user.OAuth2User;
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
        user.setAvatar("https://i.pinimg.com/736x/a9/5e/7a/a95e7a415633a614613e757bac4246ed.jpg");
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

    @Transactional
    public AuthResponse authenticateWithGoogleOAuth2User(OAuth2User oAuth2User) {
        log.info("Authenticating with Google OAuth2");

        String email = oAuth2User.getAttribute("email");
        String firstName = oAuth2User.getAttribute("given_name");
        String lastName = oAuth2User.getAttribute("family_name");
        String picture = oAuth2User.getAttribute("picture");

        log.info("OAuth2 user info - Email: {}, Name: {} {}", email, firstName, lastName);

        if (email == null || email.isEmpty()) {
            throw new IllegalArgumentException("Email not found in Google account");
        }

//        if (!isInstitutionalEmail(email)) {
//            throw new IllegalArgumentException("Please use institutional email (@cit.edu)");
//        }

        // Find or create user
        User user = userRepository.findByEmail(email)
                .orElseGet(() -> createUserFromOAuth(email, firstName, lastName, picture));

        if (!user.getIsActive()) {
            throw new IllegalArgumentException("Account is inactive. Please contact administrator.");
        }

        // Update user info if changed
        boolean updated = false;
        if (firstName != null && !firstName.equals(user.getFirstName())) {
            user.setFirstName(firstName);
            updated = true;
        }
        if (lastName != null && !lastName.equals(user.getLastName())) {
            user.setLastName(lastName);
            updated = true;
        }
        if (picture != null && !picture.equals(user.getAvatar())) {
            user.setAvatar(picture);
            updated = true;
        }

        if (updated) {
            user = userRepository.save(user);
            log.info("Updated user information from OAuth2: {}", email);
        }

        log.info("User authenticated successfully via Google OAuth2: {}", email);

        String token = jwtTokenProvider.generateToken(user);

        return buildAuthResponse(token, user);
    }


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

    private User createUserFromOAuth(String email, String firstName, String lastName, String avatar) {
        log.info("Creating new user from OAuth with full details: {}", email);

        // default role
        UserRole nasRole = userRoleRepository.findByRoleName("NAS")
                .orElseThrow(() -> new RuntimeException("Default role 'NAS' not found"));

        User user = new User();
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode("OAUTH_USER"));
        user.setFirstName(firstName != null ? firstName : "OAuth");
        user.setLastName(lastName != null ? lastName : "User");
        user.setAvatar(avatar != null ? avatar : "https://i.pinimg.com/736x/a9/5e/7a/a95e7a415633a614613e757bac4246ed.jpg");
        user.setRole(nasRole);
        user.setIsActive(true);

        return userRepository.save(user);
    }

    private AuthResponse buildAuthResponse(String token, User user) {
    AuthUser authUser = AuthUser.builder()
            .id(user.getUserId())
            .email(user.getEmail())
            .firstName(user.getFirstName())
            .lastName(user.getLastName())
            .role(user.getRole())
            .build();

    return AuthResponse.builder()
            .token(token)
            .tokenType("Bearer")
            .user(authUser)
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