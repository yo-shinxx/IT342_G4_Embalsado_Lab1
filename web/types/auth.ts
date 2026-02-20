export interface AuthUser {
  id: number;
  email: string;
  avatar?: string | null;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export interface ErrorResponse {
  error: string;
}
