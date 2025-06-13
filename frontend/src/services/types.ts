// Re-export all types for easy access
export * from '../types/user'
export * from '../types/auth'
export * from '../types/common'

// Additional service-specific types
export interface UploadProgress {
  loaded: number
  total: number
  percentage: number
}

export interface DownloadOptions {
  filename?: string
  contentType?: string
}

export interface RequestConfig {
  timeout?: number
  retries?: number
  retryDelay?: number
}

export interface ApiError {
  code: string
  message: string
  details?: any
  timestamp: string
}

export interface ValidationError {
  field: string
  message: string
  code: string
}

export interface BatchOperation<T> {
  items: T[]
  operation: 'create' | 'update' | 'delete'
}

export interface BatchResult<T> {
  success: T[]
  failed: Array<{
    item: T
    error: ApiError
  }>
}

// Pagination helpers
export interface PaginationMeta {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

// Search and filter types
export interface SearchOptions {
  query: string
  fields?: string[]
  fuzzy?: boolean
  caseSensitive?: boolean
}

export interface FilterOptions {
  [key: string]: any
}

export interface SortOptions {
  field: string
  direction: 'asc' | 'desc'
}

// Cache types
export interface CacheOptions {
  ttl?: number // Time to live in seconds
  key?: string
  tags?: string[]
}

// Webhook types
export interface WebhookEvent {
  id: string
  type: string
  data: any
  timestamp: string
  source: string
}

// File upload types
export interface FileUploadOptions {
  maxSize?: number
  allowedTypes?: string[]
  multiple?: boolean
  onProgress?: (progress: UploadProgress) => void
  onComplete?: (result: any) => void
  onError?: (error: ApiError) => void
}

// Export/Import types
export interface ExportOptions {
  format: 'csv' | 'excel' | 'json' | 'pdf'
  fields?: string[]
  filters?: FilterOptions
  filename?: string
}

export interface ImportOptions {
  format: 'csv' | 'excel' | 'json'
  mapping?: Record<string, string>
  skipErrors?: boolean
  dryRun?: boolean
}

export interface ImportResult {
  total: number
  success: number
  failed: number
  errors: ValidationError[]
}
