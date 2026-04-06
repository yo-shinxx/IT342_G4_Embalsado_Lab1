package com.quantix.backend.event;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserRegisterEvent {
    private String userId;
    private String email;
    private String firstName;
    private String lastName;
}