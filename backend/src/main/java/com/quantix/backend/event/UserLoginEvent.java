package com.quantix.backend.event;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserLoginEvent {
    private Long userId;
    private String email;
    private String loginMethod;
}