package com.quantix.backend.auth.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {
    private String email;
    private String firstName;
    private String lastName;
    private String password;
}
