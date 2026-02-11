package com.quantix.backend.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OAuthUserInfo {
    private String email;
    private String firstName;
    private String lastName;
    private String provider;
}
