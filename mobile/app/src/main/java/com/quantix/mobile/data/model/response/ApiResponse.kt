package com.quantix.mobile.data.model.response

data class ApiResponse<T>(
    val success: Boolean,
    val data: T?,
    val error: ErrorData?,
    val timestamp: String
)

data class ErrorData(
    val code: String,
    val message: String
)