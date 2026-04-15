package com.quantix.mobile.data.model.request

data class RegisterRequest(
    val firstName: String,
    val lastName: String,
    val email: String,
    val password: String
)