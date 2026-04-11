package com.quantix.mobile.ui.auth

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.quantix.mobile.data.model.response.AuthResponse
import com.quantix.mobile.data.repository.AuthRepository
import com.quantix.mobile.util.Resource
import com.quantix.mobile.util.ValidationUtils
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.launchIn
import kotlinx.coroutines.flow.onEach
import javax.inject.Inject

@HiltViewModel
class LoginViewModel @Inject constructor(
    private val authRepository: AuthRepository
) : ViewModel() {

    private val _loginState = MutableLiveData<Resource<AuthResponse>>()
    val loginState: LiveData<Resource<AuthResponse>> = _loginState

    fun login(email: String, password: String) {
        // validate
        val emailError = ValidationUtils.validateEmail(email)
        if (emailError != null) {
            _loginState.value = Resource.Error(emailError)
            return
        }

        val passwordError = ValidationUtils.validatePassword(password)
        if (passwordError != null) {
            _loginState.value = Resource.Error(passwordError)
            return
        }

        // call repository
        authRepository.login(email, password).onEach { resource ->
            _loginState.value = resource
        }.launchIn(viewModelScope)
    }
}