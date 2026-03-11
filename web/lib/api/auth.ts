import { apiRequest } from "@/lib/api";
import { AuthResponse } from "@/types/auth";

type RegisterPayload = { firstName: string; lastName: string; email: string; password: string };
type LoginPayload = { email: string; password: string };

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'

export const getGoogleAuthUrl = (): string => {
  return `${API_URL.replace('/api', '')}/oauth2/authorize/google`
}

export async function registerUser( data: RegisterPayload) {
  const result = await apiRequest<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });

  if (typeof window !== "undefined" && result.user) {
    if (result.user.email) {
      localStorage.setItem("userEmail", result.user.email);
    }
    if (result.user.id) {
      localStorage.setItem("userId", result.user.id.toString());
    }
  }

  return result;
}

export async function loginUser(data: LoginPayload) {
  const result = await apiRequest<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });

  if (typeof window !== "undefined" && result.user) {
    if (result.user.email) {
      localStorage.setItem("userEmail", result.user.email);
    }
    if (result.user.id) {
      localStorage.setItem("userId", result.user.id.toString());
    }
  }

  return result;
}

export async function logoutUser() {
  try {
    await apiRequest("/auth/logout", {
      method: "POST",
    });
  } finally {
    if (typeof window !== "undefined") {
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userId");
      localStorage.removeItem("authToken");
      document.cookie = "authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
  }
}

export const getCurrentUser = async () => {
  const token = localStorage.getItem('authToken')
  if (!token) {
    throw new Error('No authentication token')
  }
  const response = await fetch(`${API_URL}/auth/me`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  })
  if (!response.ok) {
    throw new Error('Failed to fetch user info')
  }
  return response.json()
}
