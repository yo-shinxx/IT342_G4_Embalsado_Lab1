package com.quantix.mobile.util

object ValidationUtils {

    fun validateEmail(email: String): String? {
        return when {
            email.isBlank() -> "Email is required"
            !email.endsWith("@cit.edu") -> "Please use institutional email (@cit.edu)"
            !android.util.Patterns.EMAIL_ADDRESS.matcher(email).matches() -> "Invalid email format"
            else -> null
        }
    }

    fun validatePassword(password: String): String? {
        return when {
            password.isBlank() -> "Password is required"
            password.length < 8 -> "Password must be at least 8 characters"
            !password.any { it.isDigit() } -> "Password must contain at least one number"
            !password.any { it.isLetter() } -> "Password must contain at least one letter"
            else -> null
        }
    }

    fun validateName(name: String, fieldName: String): String? {
        return when {
            name.isBlank() -> "$fieldName is required"
            name.length < 2 -> "$fieldName must be at least 2 characters"
            else -> null
        }
    }
}