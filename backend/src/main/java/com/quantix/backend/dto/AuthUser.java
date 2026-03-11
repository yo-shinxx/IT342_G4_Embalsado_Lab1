package com.quantix.backend.dto;

import com.quantix.backend.entity.User;
import com.quantix.backend.entity.UserRole;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthUser {
    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private UserRole role;

    public AuthUser(User user) {
        this.id = user.getUserId();
        this.email = user.getEmail();
        this.firstName = user.getFirstName();
        this.lastName = user.getLastName();
        this.role = user.getRole();
    }
}
