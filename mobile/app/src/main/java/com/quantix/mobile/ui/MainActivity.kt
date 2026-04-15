package com.quantix.mobile.ui

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.quantix.mobile.databinding.ActivityMainBinding
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class MainActivity : AppCompatActivity() {

    private lateinit var binding: ActivityMainBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // TODO: Implement dashboard in future phases
        binding.tvWelcome.text = "Welcome to Quantix!\nDashboard coming soon..."
    }
}