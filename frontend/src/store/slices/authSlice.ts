import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { User } from '../../types/user'
import { LoginRequest, LoginResponse, RefreshTokenResponse } from '../../types/auth'
import { authService } from '../../services/authService'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: false,
  error: null,
}

// Async thunks
export const login = createAsyncThunk<LoginResponse, LoginRequest>(
  'auth/login',
  async (credentials: LoginRequest) => {
    const response = await authService.login(credentials)
    return response.data.data
  }
)

export const logout = createAsyncThunk(
  'auth/logout',
  async () => {
    await authService.logout()
  }
)

export const getCurrentUser = createAsyncThunk<User>(
  'auth/getCurrentUser',
  async () => {
    const response = await authService.getCurrentUser()
    return response.data.data
  }
)

export const refreshToken = createAsyncThunk<RefreshTokenResponse>(
  'auth/refreshToken',
  async () => {
    const response = await authService.refreshToken()
    return response.data.data
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user
      state.token = action.payload.token
      state.isAuthenticated = true
      localStorage.setItem('token', action.payload.token)
    },
    clearCredentials: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      localStorage.removeItem('token')
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = true
        localStorage.setItem('token', action.payload.token)
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Login failed'
        state.isAuthenticated = false
      })
      // Logout
      .addCase(logout.pending, (state) => {
        state.loading = true
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false
        state.user = null
        state.token = null
        state.isAuthenticated = false
        localStorage.removeItem('token')
      })
      .addCase(logout.rejected, (state) => {
        state.loading = false
        // Even if logout fails on server, clear local state
        state.user = null
        state.token = null
        state.isAuthenticated = false
        localStorage.removeItem('token')
      })
      // Get current user
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getCurrentUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false
        state.user = action.payload
        state.isAuthenticated = true
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to get user info'
        state.isAuthenticated = false
        state.token = null
        localStorage.removeItem('token')
      })
      // Refresh token
      .addCase(refreshToken.pending, (state) => {
        state.loading = true
      })
      .addCase(refreshToken.fulfilled, (state, action: PayloadAction<RefreshTokenResponse>) => {
        state.loading = false
        state.token = action.payload.token
        localStorage.setItem('token', action.payload.token)
      })
      .addCase(refreshToken.rejected, (state) => {
        state.loading = false
        state.user = null
        state.token = null
        state.isAuthenticated = false
        localStorage.removeItem('token')
      })
  },
})

export const { clearError, setCredentials, clearCredentials } = authSlice.actions
export default authSlice.reducer
