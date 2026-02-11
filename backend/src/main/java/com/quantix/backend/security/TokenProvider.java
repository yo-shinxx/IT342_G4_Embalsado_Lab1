package com.quantix.backend.security;

import com.quantix.backend.entity.User;

public interface TokenProvider {

    String generateToken(User user);

    boolean validateToken(String token);

    Long getUserIdFromToken(String token);

    String getEmailFromToken(String token);

    String getRoleFromToken(String token);

    String refreshToken(String token);
}
