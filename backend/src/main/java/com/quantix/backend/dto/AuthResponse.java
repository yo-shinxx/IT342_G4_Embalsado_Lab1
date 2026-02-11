package com.quantix.backend.dto;

import com.quantix.backend.entity.User;
import com.quantix.backend.entity.UserRole;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String tokenType = "Bearer";
    private Long userId;
    private String email;
    private String firstName;
    private String lastName;
    private UserRole role;

    public AuthResponse(String token, User user) {
        this.token = token;
        this.tokenType = "Bearer";
        this.userId = user.getUserId();
        this.email = user.getEmail();
        this.firstName = user.getFirstName();
        this.lastName = user.getLastName();
    }
}
