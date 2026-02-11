package com.quantix.backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "user_roles")
public class UserRole {
    private Long roleId;
    private String roleName;  // "NAS" or "COORDINATOR"
    private String description;
}