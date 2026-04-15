package com.quantix.mobile.data.api

import com.quantix.mobile.data.model.request.LoginRequest
import com.quantix.mobile.data.model.request.RegisterRequest
import com.quantix.mobile.data.model.response.ApiResponse
import com.quantix.mobile.data.model.response.AuthResponse
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.POST

interface AuthApiService {

    @POST("auth/register")
    suspend fun register(
        @Body request: RegisterRequest
    ): Response<AuthResponse>

    @POST("auth/login")
    suspend fun login(
        @Body request: LoginRequest
    ): Response<AuthResponse>
}