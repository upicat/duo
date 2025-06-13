import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { User, UserCreateRequest, UserUpdateRequest } from '../../types/user'
import { userService } from '../../services/userService'

interface UserState {
  users: User[]
  currentUser: User | null
  loading: boolean
  error: string | null
}

const initialState: UserState = {
  users: [],
  currentUser: null,
  loading: false,
  error: null,
}

// Async thunks
export const fetchUsers = createAsyncThunk<User[]>(
  'user/fetchUsers',
  async () => {
    const response = await userService.getUsers()
    return response.data.data.users
  }
)

export const fetchUserById = createAsyncThunk<User, string>(
  'user/fetchUserById',
  async (id: string) => {
    const response = await userService.getUserById(id)
    return response.data.data
  }
)

export const createUser = createAsyncThunk<User, UserCreateRequest>(
  'user/createUser',
  async (userData: UserCreateRequest) => {
    const response = await userService.createUser(userData)
    return response.data.data
  }
)

export const updateUser = createAsyncThunk<User, { id: string; userData: UserUpdateRequest }>(
  'user/updateUser',
  async ({ id, userData }: { id: string; userData: UserUpdateRequest }) => {
    const response = await userService.updateUser(id, userData)
    return response.data.data
  }
)

export const deleteUser = createAsyncThunk<string, string>(
  'user/deleteUser',
  async (id: string) => {
    await userService.deleteUser(id)
    return id
  }
)

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setCurrentUser: (state, action: PayloadAction<User | null>) => {
      state.currentUser = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false
        state.users = action.payload
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch users'
      })
      // Fetch user by ID
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false
        state.currentUser = action.payload
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch user'
      })
      // Create user
      .addCase(createUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false
        state.users.push(action.payload)
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to create user'
      })
      // Update user
      .addCase(updateUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false
        const index = state.users.findIndex(user => user.id === action.payload.id)
        if (index !== -1) {
          state.users[index] = action.payload
        }
        if (state.currentUser?.id === action.payload.id) {
          state.currentUser = action.payload
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to update user'
      })
      // Delete user
      .addCase(deleteUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false
        state.users = state.users.filter(user => user.id !== action.payload)
        if (state.currentUser?.id === action.payload) {
          state.currentUser = null
        }
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to delete user'
      })
  },
})

export const { clearError, setCurrentUser } = userSlice.actions
export default userSlice.reducer
