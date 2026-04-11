package com.quantix.mobile.data.model.response

data class AuthResponse(
    val token: String,
    val tokenType: String,
    val user: UserData
)

data class UserData(
    val id: Long,
    val email: String,
    val firstName: String,
    val lastName: String,
    val role: Role
)

data class Role(
    val roleId: Long,
    val roleName: String
)