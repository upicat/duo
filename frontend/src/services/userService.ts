import { apiClient } from './api'
import { 
  User, 
  UserCreateRequest, 
  UserUpdateRequest, 
  UserListResponse, 
  UserQuery 
} from '../types/user'

class UserService {
  // Get all users with pagination and filters
  async getUsers(params?: UserQuery) {
    const queryParams = new URLSearchParams()
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString())
        }
      })
    }
    
    const url = `/users${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    return apiClient.get<UserListResponse>(url)
  }

  // Get user by ID
  async getUserById(id: string) {
    return apiClient.get<User>(`/users/${id}`)
  }

  // Create new user
  async createUser(userData: UserCreateRequest) {
    return apiClient.post<User>('/users', userData)
  }

  // Update user
  async updateUser(id: string, userData: UserUpdateRequest) {
    return apiClient.put<User>(`/users/${id}`, userData)
  }

  // Delete user
  async deleteUser(id: string) {
    return apiClient.delete(`/users/${id}`)
  }

  // Batch delete users
  async batchDeleteUsers(ids: string[]) {
    return apiClient.post('/users/batch-delete', { ids })
  }

  // Update user status (activate/deactivate)
  async updateUserStatus(id: string, isActive: boolean) {
    return apiClient.patch<User>(`/users/${id}/status`, { isActive })
  }

  // Reset user password
  async resetUserPassword(id: string, newPassword: string) {
    return apiClient.post(`/users/${id}/reset-password`, { newPassword })
  }

  // Get user roles
  async getUserRoles(id: string) {
    return apiClient.get(`/users/${id}/roles`)
  }

  // Update user roles
  async updateUserRoles(id: string, roleIds: string[]) {
    return apiClient.put(`/users/${id}/roles`, { roleIds })
  }

  // Upload user avatar
  async uploadAvatar(id: string, file: File) {
    return apiClient.upload(`/users/${id}/avatar`, file)
  }

  // Get user statistics
  async getUserStats() {
    return apiClient.get('/users/stats')
  }

  // Search users
  async searchUsers(query: string, limit = 10) {
    return apiClient.get<User[]>(`/users/search?q=${encodeURIComponent(query)}&limit=${limit}`)
  }

  // Export users
  async exportUsers(format: 'csv' | 'excel' = 'csv', filters?: UserQuery) {
    const queryParams = new URLSearchParams()
    queryParams.append('format', format)
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString())
        }
      })
    }
    
    return apiClient.download(`/users/export?${queryParams.toString()}`, `users.${format}`)
  }

  // Import users
  async importUsers(file: File) {
    return apiClient.upload('/users/import', file)
  }
}

export const userService = new UserService()
export default userService
