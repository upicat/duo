import { User } from './user'

export interface LoginRequest {
  username: string
  password: string
  rememberMe?: boolean
}

export interface LoginResponse {
  user: User
  token: string
  refreshToken: string
  expiresIn: number
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
  confirmPassword: string
  firstName: string
  lastName: string
}

export interface RegisterResponse {
  user: User
  token: string
  refreshToken: string
  expiresIn: number
}

export interface RefreshTokenRequest {
  refreshToken: string
}

export interface RefreshTokenResponse {
  token: string
  refreshToken: string
  expiresIn: number
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export interface ResetPasswordRequest {
  email: string
}

export interface ResetPasswordConfirmRequest {
  token: string
  newPassword: string
  confirmPassword: string
}

export interface AuthState {
  user: User | null
  token: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}
