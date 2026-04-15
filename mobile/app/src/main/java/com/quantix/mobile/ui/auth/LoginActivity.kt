package com.quantix.mobile.ui.auth

import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.Toast
import androidx.activity.viewModels
import androidx.appcompat.app.AppCompatActivity
import com.quantix.mobile.databinding.ActivityLoginBinding
import com.quantix.mobile.ui.MainActivity
import com.quantix.mobile.ui.auth.viewmodel.LoginViewModel
import com.quantix.mobile.util.Resource
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class LoginActivity : AppCompatActivity() {

    private lateinit var binding: ActivityLoginBinding
    private val viewModel: LoginViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityLoginBinding.inflate(layoutInflater)
        setContentView(binding.root)

        setupUI()
        observeLoginState()
    }

    private fun setupUI() {
        binding.btnLogin.setOnClickListener {
            val email = binding.etEmail.text.toString().trim()
            val password = binding.etPassword.text.toString().trim()

            // clear prev errors
            binding.tilEmail.error = null
            binding.tilPassword.error = null

            viewModel.login(email, password)
        }

        // navigate to register
        binding.tvSignUp.setOnClickListener {
            startActivity(Intent(this, RegisterActivity::class.java))
        }
    }

    private fun observeLoginState() {
        viewModel.loginState.observe(this) { resource ->
            when (resource) {
                is Resource.Loading -> {
                    showLoading(true)
                }
                is Resource.Success -> {
                    showLoading(false)
                    Toast.makeText(this, "Login successful!", Toast.LENGTH_SHORT).show()

                    // to dashboard
                    val intent = Intent(this, MainActivity::class.java)
                    intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
                    startActivity(intent)
                    finish()
                }
                is Resource.Error -> {
                    showLoading(false)
                    val errorMessage = resource.message ?: "Login failed"

                    when {
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
        binding.btnLogin.isEnabled = !isLoading
        binding.etEmail.isEnabled = !isLoading
        binding.etPassword.isEnabled = !isLoading
    }
}