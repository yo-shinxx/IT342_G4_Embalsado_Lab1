package com.quantix.mobile.ui.auth.viewmodel

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
class RegisterViewModel @Inject constructor(
    private val authRepository: AuthRepository
) : ViewModel() {

    private val _registerState = MutableLiveData<Resource<AuthResponse>>()
    val registerState: LiveData<Resource<AuthResponse>> = _registerState

    fun register(firstName: String, lastName: String, email: String, password: String) {
        // validate inputs
        val firstNameError = ValidationUtils.validateName(firstName, "First name")
        if (firstNameError != null) {
            _registerState.value = Resource.Error(firstNameError)
            return
        }

        val lastNameError = ValidationUtils.validateName(lastName, "Last name")
        if (lastNameError != null) {
            _registerState.value = Resource.Error(lastNameError)
            return
        }

        val emailError = ValidationUtils.validateEmail(email)
        if (emailError != null) {
            _registerState.value = Resource.Error(emailError)
            return
        }

        val passwordError = ValidationUtils.validatePassword(password)
        if (passwordError != null) {
            _registerState.value = Resource.Error(passwordError)
            return
        }

        authRepository.register(firstName, lastName, email, password).onEach { resource ->
            _registerState.value = resource
        }.launchIn(viewModelScope)
    }
}