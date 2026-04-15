package com.quantix.mobile.data.local

import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import javax.inject.Inject
import javax.inject.Singleton

private val Context.dataStore: DataStore<Preferences> by preferencesDataStore(name = "quantix_prefs")

@Singleton
class TokenManager @Inject constructor(
    @ApplicationContext private val context: Context
) {
    companion object {
        private val AUTH_TOKEN = stringPreferencesKey("auth_token")
        private val USER_EMAIL = stringPreferencesKey("user_email")
        private val USER_ID = stringPreferencesKey("user_id")
        private val USER_ROLE = stringPreferencesKey("user_role")
    }

    suspend fun saveAuthToken(token: String) {
        context.dataStore.edit { preferences ->
            preferences[AUTH_TOKEN] = token
        }
    }

    suspend fun saveUserInfo(userId: Long, email: String, role: String) {
        context.dataStore.edit { preferences ->
            preferences[USER_ID] = userId.toString()
            preferences[USER_EMAIL] = email
            preferences[USER_ROLE] = role
        }
    }

    fun getAuthToken(): Flow<String?> {
        return context.dataStore.data.map { preferences ->
            preferences[AUTH_TOKEN]
        }
    }

    suspend fun clearAllData() {
        context.dataStore.edit { preferences ->
            preferences.clear()
        }
    }
}