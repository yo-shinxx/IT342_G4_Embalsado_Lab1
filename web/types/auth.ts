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


export interface GoogleAuthResponse {
  token: string;
  tokenType: string;
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
  role: {
    roleId: number;
    roleName: string;
  };
}