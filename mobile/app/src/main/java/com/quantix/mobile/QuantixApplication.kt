package com.quantix.mobile

import android.app.Application
import dagger.hilt.android.HiltAndroidApp

@HiltAndroidApp
class QuantixApplication : Application() {
    override fun onCreate() {
        super.onCreate()
    }
}