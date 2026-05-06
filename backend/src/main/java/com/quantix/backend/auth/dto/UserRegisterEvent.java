package com.quantix.backend.auth.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserRegisterEvent {
    private Long userId;
    private String email;
    private String firstName;
    private String lastName;
}