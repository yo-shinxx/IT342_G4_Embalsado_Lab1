package com.quantix.backend.auth.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserLoginEvent {
    private Long userId;
    private String email;
    private String loginMethod;
}