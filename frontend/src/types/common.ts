export interface ApiResponse<T = any> {
  success: boolean
  data: T
  message?: string
  errors?: string[]
}

export interface PaginationParams {
  page: number
  limit: number
  total: number
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: PaginationParams
}

export interface SortParams {
  sortBy: string
  sortOrder: 'asc' | 'desc'
}

export interface FilterParams {
  [key: string]: any
}

export interface SearchParams {
  query: string
  fields?: string[]
}

export interface SelectOption {
  label: string
  value: string | number
  disabled?: boolean
}

export interface TableColumn {
  key: string
  title: string
  dataIndex: string
  width?: number
  sortable?: boolean
  filterable?: boolean
  render?: (value: any, record: any) => React.ReactNode
}

export interface FormField {
  name: string
  label: string
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'checkbox' | 'radio'
  required?: boolean
  placeholder?: string
  options?: SelectOption[]
  validation?: {
    min?: number
    max?: number
    pattern?: RegExp
    message?: string
  }
}

export interface MenuItem {
  key: string
  label: string
  icon?: string
  path?: string
  children?: MenuItem[]
  permissions?: string[]
}

export interface BreadcrumbItem {
  title: string
  path?: string
}

export interface NotificationItem {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  timestamp: number
  read?: boolean
}

export interface LoadingState {
  loading: boolean
  error: string | null
}

export interface AsyncState<T> extends LoadingState {
  data: T | null
}

export type Theme = 'light' | 'dark'

export type Language = 'zh-CN' | 'en-US'

export interface AppConfig {
  theme: Theme
  language: Language
  apiBaseUrl: string
  appTitle: string
  version: string
}
