package com.quantix.backend.dto;

import com.quantix.backend.entity.User;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String tokenType;
    private AuthUser user;

    public AuthResponse(String token, User user) {
        this.token = token;
        this.tokenType = "Bearer";
        this.user = new AuthUser(user);
    }
}
