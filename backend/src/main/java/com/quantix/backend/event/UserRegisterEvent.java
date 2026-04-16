package com.quantix.backend.event;

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