import { apiClient } from './api'
import { 
  LoginRequest, 
  LoginResponse, 
  RegisterRequest, 
  RegisterResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  ChangePasswordRequest,
  ResetPasswordRequest,
  ResetPasswordConfirmRequest
} from '../types/auth'
import { User } from '../types/user'

class AuthService {
  // Login
  async login(credentials: LoginRequest) {
    return apiClient.post<LoginResponse>('/auth/login', credentials)
  }

  // Register
  async register(userData: RegisterRequest) {
    return apiClient.post<RegisterResponse>('/auth/register', userData)
  }

  // Logout
  async logout() {
    return apiClient.post('/auth/logout')
  }

  // Get current user
  async getCurrentUser() {
    return apiClient.get<User>('/auth/me')
  }

  // Refresh token
  async refreshToken() {
    const refreshToken = localStorage.getItem('refreshToken')
    if (!refreshToken) {
      throw new Error('No refresh token available')
    }
    
    const request: RefreshTokenRequest = { refreshToken }
    return apiClient.post<RefreshTokenResponse>('/auth/refresh', request)
  }

  // Change password
  async changePassword(data: ChangePasswordRequest) {
    return apiClient.post('/auth/change-password', data)
  }

  // Reset password request
  async resetPassword(data: ResetPasswordRequest) {
    return apiClient.post('/auth/reset-password', data)
  }

  // Reset password confirm
  async resetPasswordConfirm(data: ResetPasswordConfirmRequest) {
    return apiClient.post('/auth/reset-password/confirm', data)
  }

  // Verify email
  async verifyEmail(token: string) {
    return apiClient.post('/auth/verify-email', { token })
  }

  // Resend verification email
  async resendVerificationEmail(email: string) {
    return apiClient.post('/auth/resend-verification', { email })
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = localStorage.getItem('token')
    return !!token
  }

  // Get stored token
  getToken(): string | null {
    return localStorage.getItem('token')
  }

  // Set token
  setToken(token: string): void {
    localStorage.setItem('token', token)
  }

  // Remove token
  removeToken(): void {
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
  }

  // Get refresh token
  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken')
  }

  // Set refresh token
  setRefreshToken(refreshToken: string): void {
    localStorage.setItem('refreshToken', refreshToken)
  }
}

export const authService = new AuthService()
export default authService
