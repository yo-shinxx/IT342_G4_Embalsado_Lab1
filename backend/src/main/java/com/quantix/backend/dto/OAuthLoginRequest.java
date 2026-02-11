package com.quantix.backend.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OAuthLoginRequest {
    private String provider;
    private String accessToken;
    private String idToken;
}
