package com.quantix.backend.security;

import com.quantix.backend.entity.User;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class JwtTokenProvider implements TokenProvider {

    @Value("${jwt.secret}")
    private String secretKey;

    @Value("${jwt.expiration}")
    private long validityInMilliseconds;

    // Simple in-memory token blacklist (use Redis in production)
    private final Map<String, Boolean> tokenBlacklist = new ConcurrentHashMap<>();

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secretKey.getBytes());
    }

    @Override
    public String generateToken(User user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", user.getUserId());
        claims.put("email", user.getEmail());
        claims.put("firstName", user.getFirstName());
        claims.put("lastName", user.getLastName());
        claims.put("role", user.getRole().getRoleName());

        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + validityInMilliseconds);

        return Jwts.builder()
                .claims(claims)
                .subject(user.getEmail())
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(getSigningKey(), Jwts.SIG.HS512)
                .compact();
    }

    @Override
    public boolean validateToken(String token) {
        try {
            if (tokenBlacklist.containsKey(token)) {
                return false;
            }

            Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    @Override
    public Long getUserIdFromToken(String token) {
        Claims claims = getClaims(token);
        return claims.get("userId", Long.class);
    }

    @Override
    public String getRoleFromToken(String token) {
        Claims claims = getClaims(token);
        return claims.get("role", String.class);
    }

    @Override
    public String getEmailFromToken(String token) {
        Claims claims = getClaims(token);
        return claims.getSubject();
    }

    @Override
    public void invalidateToken(String token) {
        tokenBlacklist.put(token, true);
    }

    @Override
    public String refreshToken(String token) {
        Claims claims = getClaims(token);
        Long userId = claims.get("userId", Long.class);

        // Create new token with same claims but new expiration
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + validityInMilliseconds);

        return Jwts.builder()
                .claims(claims)
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(getSigningKey(), Jwts.SIG.HS512)
                .compact();
    }

    private Claims getClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
