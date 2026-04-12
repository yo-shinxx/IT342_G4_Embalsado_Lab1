package com.quantix.mobile.ui.auth

import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.Toast
import androidx.activity.viewModels
import androidx.appcompat.app.AppCompatActivity
import com.quantix.mobile.databinding.ActivityRegisterBinding
import com.quantix.mobile.ui.MainActivity
import com.quantix.mobile.ui.auth.viewmodel.RegisterViewModel
import com.quantix.mobile.util.Resource
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class RegisterActivity : AppCompatActivity() {

    private lateinit var binding: ActivityRegisterBinding
    private val viewModel: RegisterViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityRegisterBinding.inflate(layoutInflater)
        setContentView(binding.root)

        setupUI()
        observeRegisterState()
    }

    private fun setupUI() {
        // Register button click
        binding.btnRegister.setOnClickListener {
            val firstName = binding.etFirstName.text.toString().trim()
            val lastName = binding.etLastName.text.toString().trim()
            val email = binding.etEmail.text.toString().trim()
            val password = binding.etPassword.text.toString().trim()

            // Clear previous errors
            binding.tilFirstName.error = null
            binding.tilLastName.error = null
            binding.tilEmail.error = null
            binding.tilPassword.error = null

            // Attempt registration
            viewModel.register(firstName, lastName, email, password)
        }

        // Navigate to Login
        binding.tvLogin.setOnClickListener {
            startActivity(Intent(this, LoginActivity::class.java))
        }
    }

    private fun observeRegisterState() {
        viewModel.registerState.observe(this) { resource ->
            when (resource) {
                is Resource.Loading -> {
                    showLoading(true)
                }
                is Resource.Success -> {
                    showLoading(false)
                    Toast.makeText(this, "Registration successful!", Toast.LENGTH_SHORT).show()

                    // Navigate to MainActivity
                    val intent = Intent(this, MainActivity::class.java)
                    intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
                    startActivity(intent)
                    finish()
                }
                is Resource.Error -> {
                    showLoading(false)

                    // Show error message
                    val errorMessage = resource.message ?: "Registration failed"

                    // Determine which field to show error on
                    when {
                        errorMessage.contains("first name", ignoreCase = true) -> {
                            binding.tilFirstName.error = errorMessage
                        }
                        errorMessage.contains("last name", ignoreCase = true) -> {
                            binding.tilLastName.error = errorMessage
                        }
                        errorMessage.contains("email", ignoreCase = true) -> {
                            binding.tilEmail.error = errorMessage
                        }
                        errorMessage.contains("password", ignoreCase = true) -> {
                            binding.tilPassword.error = errorMessage
                        }
                        else -> {
                            Toast.makeText(this, errorMessage, Toast.LENGTH_LONG).show()
                        }
                    }
                }
            }
        }
    }

    private fun showLoading(isLoading: Boolean) {
        binding.progressBar.visibility = if (isLoading) View.VISIBLE else View.GONE
        binding.btnRegister.isEnabled = !isLoading
        binding.etFirstName.isEnabled = !isLoading
        binding.etLastName.isEnabled = !isLoading
        binding.etEmail.isEnabled = !isLoading
        binding.etPassword.isEnabled = !isLoading
    }
}