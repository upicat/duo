export interface User {
  id: string
  username: string
  email: string
  firstName: string
  lastName: string
  avatar?: string
  roles: Role[]
  createdAt: string
  updatedAt: string
  isActive: boolean
}

export interface Role {
  id: string
  name: string
  description?: string
  permissions: Permission[]
}

export interface Permission {
  id: string
  name: string
  resource: string
  action: string
}

export interface UserCreateRequest {
  username: string
  email: string
  password: string
  firstName: string
  lastName: string
  roles?: string[]
}

export interface UserUpdateRequest {
  username?: string
  email?: string
  firstName?: string
  lastName?: string
  avatar?: string
  roles?: string[]
  isActive?: boolean
}

export interface UserListResponse {
  users: User[]
  total: number
  page: number
  limit: number
}

export interface UserQuery {
  page?: number
  limit?: number
  search?: string
  role?: string
  isActive?: boolean
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}
