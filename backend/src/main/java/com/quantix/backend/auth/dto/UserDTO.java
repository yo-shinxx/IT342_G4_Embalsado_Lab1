package com.quantix.backend.auth.dto;

import com.quantix.backend.auth.entity.UserRole;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private Long userId;
    private String email;
    private String firstName;
    private String lastName;
    private UserRole role;
    private Boolean isActive;
}
