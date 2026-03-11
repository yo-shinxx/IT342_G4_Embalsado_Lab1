import { apiRequest } from "@/lib/api";
import { AuthResponse } from "@/types/auth";
import { GoogleAuthResponse } from "@/types/auth";

type RegisterPayload = { firstName: string; lastName: string; email: string; password: string };
type LoginPayload = { email: string; password: string };

export async function registerUser(data: RegisterPayload) {
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
    }
  }
}


export const authenticateWithGoogle = async (token: string): Promise<GoogleAuthResponse> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Google authentication failed');
  }

  return response.json();
};