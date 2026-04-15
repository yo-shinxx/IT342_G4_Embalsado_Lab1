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
import org.json.JSONObject
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
                val authResponse = response.body()!!
                    // save token and user info
                tokenManager.saveAuthToken(authResponse.token)
                tokenManager.saveUserInfo(
                    authResponse.user.id,
                    authResponse.user.email,
                    authResponse.user.role.roleName
                )
                emit(Resource.Success(authResponse))
            } else {
                // Parse error message from response body
                val errorMessage = try {
                    response.errorBody()?.string()?.let { errorBody ->
                        val json = JSONObject(errorBody)
                        json.optString("error", "Registration failed")
                    } ?: "Registration failed: ${response.code()}"
                } catch (e: Exception) {
                    "Registration failed"
                }
                emit(Resource.Error(errorMessage))
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
                val authResponse = response.body()!!

                tokenManager.saveAuthToken(authResponse.token)
                tokenManager.saveUserInfo(
                    authResponse.user.id,
                    authResponse.user.email,
                    authResponse.user.role.roleName
                )
                emit(Resource.Success(authResponse))
            } else {
                // Parse error message from response body
                val errorMessage = try {
                    response.errorBody()?.string()?.let { errorBody ->
                        val json = JSONObject(errorBody)
                        json.optString("error", "Login failed")
                    } ?: "Login failed: ${response.code()}"
                } catch (e: Exception) {
                    "Login failed"
                }
                emit(Resource.Error(errorMessage))
            }
        } catch (e: Exception) {
            emit(Resource.Error(e.localizedMessage ?: "An unexpected error occurred"))
        }
    }.flowOn(Dispatchers.IO)
}