export interface RegisterRequest {
  email: string;
  password: string;
  username: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ValidateTokenRequest {
  token: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface User {
  id: string;
  email: string;
  username: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface TokenValidationResponse {
  valid: boolean;
  user?: User;
}

export interface TokenRefreshResponse {
  accessToken: string;
  refreshToken: string;
}

export interface JwtPayload {
  sub: string;
  email: string;
  username: string;
  iat?: number;
  exp?: number;
}
