package com.quantix.backend.security;

import com.quantix.backend.dto.AuthResponse;
import com.quantix.backend.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {
    private AuthService authService;
    @Value("${app.frontend.url:http://localhost:3000}")
    private String frontendUrl;
    public OAuth2LoginSuccessHandler(AuthService authService) { this.authService = authService; }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException {
        Object principal = authentication.getPrincipal();
        if(!(principal instanceof OAuth2User oAuth2User)){
            response.sendRedirect(frontendUrl + "/auth/callback?error=oauth2_principal_invalid");
            return;
        }

        try {
            AuthResponse authResponse = authService.authenticateWithGoogleOAuth2User(oAuth2User);
            String encodedToken = URLEncoder.encode(authResponse.getToken(), StandardCharsets.UTF_8);
            response.sendRedirect(frontendUrl + "/auth/callback?tokens=" + encodedToken);
        } catch (IllegalArgumentException e) {
            String encodedMessage = URLEncoder.encode(e.getMessage(), StandardCharsets.UTF_8);
            response.sendRedirect(frontendUrl + "/auth/callback?tokens=" + encodedMessage);
        }
    }
}
