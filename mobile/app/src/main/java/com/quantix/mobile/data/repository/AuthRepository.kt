package com.quantix.mobile.data.repository

import com.quantix.mobile.data.api.AuthApiService
import com.quantix.mobile.data.local.TokenManager
import com.quantix.mobile.data.model.request.LoginRequest
import com.quantix.mobile.data.model.request.RegisterRequest
import com.quantix.mobile.data.model.response.AuthResponse
import com.quantix.mobile.util.Resource
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import kotlinx.coroutines.flow.flowOn
import javax.inject.Inject

class AuthRepository @Inject constructor(
    private val authApiService: AuthApiService,
    private val tokenManager: TokenManager
) {

    fun register(
        firstName: String,
        lastName: String,
        email: String,
        password: String
    ): Flow<Resource<AuthResponse>> = flow {
        try {
            emit(Resource.Loading())

            val request = RegisterRequest(firstName, lastName, email, password)
            val response = authApiService.register(request)

            if (response.isSuccessful && response.body() != null) {
                val apiResponse = response.body()!!

                if (apiResponse.success && apiResponse.data != null) {
                    // save token and user info
                    tokenManager.saveAuthToken(apiResponse.data.token)
                    tokenManager.saveUserInfo(
                        apiResponse.data.user.id,
                        apiResponse.data.user.email,
                        apiResponse.data.user.role.roleName
                    )
                    emit(Resource.Success(apiResponse.data))
                } else {
                    emit(Resource.Error(apiResponse.error?.message ?: "Registration failed"))
                }
            } else {
                emit(Resource.Error("Network error: ${response.code()}"))
            }
        } catch (e: Exception) {
            emit(Resource.Error(e.localizedMessage ?: "An unexpected error occurred"))
        }
    }.flowOn(Dispatchers.IO)

    fun login(email: String, password: String): Flow<Resource<AuthResponse>> = flow {
        try {
            emit(Resource.Loading())

            val request = LoginRequest(email, password)
            val response = authApiService.login(request)

            if (response.isSuccessful && response.body() != null) {
                val apiResponse = response.body()!!

                if (apiResponse.success && apiResponse.data != null) {
                    // save token and user info
                    tokenManager.saveAuthToken(apiResponse.data.token)
                    tokenManager.saveUserInfo(
                        apiResponse.data.user.id,
                        apiResponse.data.user.email,
                        apiResponse.data.user.role.roleName
                    )
                    emit(Resource.Success(apiResponse.data))
                } else {
                    emit(Resource.Error(apiResponse.error?.message ?: "Login failed"))
                }
            } else {
                emit(Resource.Error("Network error: ${response.code()}"))
            }
        } catch (e: Exception) {
            emit(Resource.Error(e.localizedMessage ?: "An unexpected error occurred"))
        }
    }.flowOn(Dispatchers.IO)
}