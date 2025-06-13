// API 相关常量
export const API_ENDPOINTS = {
  // 认证相关
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REGISTER: '/auth/register',
    REFRESH_TOKEN: '/auth/refresh',
    CURRENT_USER: '/auth/me',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    CHANGE_PASSWORD: '/auth/change-password',
  },
  // 用户相关
  USERS: {
    LIST: '/users',
    CREATE: '/users',
    UPDATE: (id: string) => `/users/${id}`,
    DELETE: (id: string) => `/users/${id}`,
    DETAIL: (id: string) => `/users/${id}`,
    AVATAR: (id: string) => `/users/${id}/avatar`,
  },
  // 角色相关
  ROLES: {
    LIST: '/roles',
    CREATE: '/roles',
    UPDATE: (id: string) => `/roles/${id}`,
    DELETE: (id: string) => `/roles/${id}`,
    DETAIL: (id: string) => `/roles/${id}`,
  },
  // 权限相关
  PERMISSIONS: {
    LIST: '/permissions',
    TREE: '/permissions/tree',
  },
  // 文件上传
  UPLOAD: {
    IMAGE: '/upload/image',
    FILE: '/upload/file',
    AVATAR: '/upload/avatar',
  },
}

// 本地存储键名
export const STORAGE_KEYS = {
  TOKEN: 'token',
  REFRESH_TOKEN: 'refreshToken',
  USER: 'user',
  PERMISSIONS: 'permissions',
  ROLES: 'roles',
  THEME: 'theme',
  LANGUAGE: 'language',
  SIDEBAR_COLLAPSED: 'sidebarCollapsed',
  REMEMBER_ME: 'rememberMe',
}

// 路由路径
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  ABOUT: '/about',
  USERS: '/users',
  USER_DETAIL: '/users/:id',
  USER_EDIT: '/users/:id/edit',
  USER_CREATE: '/users/create',
  ROLES: '/roles',
  PERMISSIONS: '/permissions',
  PROFILE: '/profile',
  SETTINGS: '/settings',
}

// 用户状态
export const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  BANNED: 'banned',
} as const

// 用户状态标签
export const USER_STATUS_LABELS = {
  [USER_STATUS.ACTIVE]: '正常',
  [USER_STATUS.INACTIVE]: '禁用',
  [USER_STATUS.BANNED]: '封禁',
}

// 用户状态颜色
export const USER_STATUS_COLORS = {
  [USER_STATUS.ACTIVE]: 'success',
  [USER_STATUS.INACTIVE]: 'warning',
  [USER_STATUS.BANNED]: 'error',
} as const

// 通知类型
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
} as const

// 主题类型
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
} as const

// 语言类型
export const LANGUAGES = {
  ZH_CN: 'zh-CN',
  EN_US: 'en-US',
} as const

// 分页配置
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: ['10', '20', '50', '100'],
  SHOW_SIZE_CHANGER: true,
  SHOW_QUICK_JUMPER: true,
  SHOW_TOTAL: (total: number, range: [number, number]) =>
    `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
}

// 表单验证规则
export const VALIDATION_RULES = {
  REQUIRED: { required: true, message: '此字段为必填项' },
  EMAIL: {
    type: 'email' as const,
    message: '请输入有效的邮箱地址',
  },
  PHONE: {
    pattern: /^1[3-9]\d{9}$/,
    message: '请输入有效的手机号码',
  },
  PASSWORD: {
    min: 6,
    max: 20,
    message: '密码长度应在6-20位之间',
  },
  USERNAME: {
    pattern: /^[a-zA-Z0-9_]{3,20}$/,
    message: '用户名只能包含字母、数字和下划线，长度3-20位',
  },
}

// 文件上传配置
export const UPLOAD_CONFIG = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: {
    IMAGE: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    DOCUMENT: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    EXCEL: ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
  },
  AVATAR: {
    MAX_SIZE: 2 * 1024 * 1024, // 2MB
    ALLOWED_TYPES: ['image/jpeg', 'image/png'],
    MAX_WIDTH: 800,
    MAX_HEIGHT: 800,
  },
}

// HTTP 状态码
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const

// 业务状态码
export const BUSINESS_CODE = {
  SUCCESS: 200,
  FAIL: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
} as const

// 日期格式
export const DATE_FORMATS = {
  DATE: 'YYYY-MM-DD',
  DATETIME: 'YYYY-MM-DD HH:mm:ss',
  TIME: 'HH:mm:ss',
  MONTH: 'YYYY-MM',
  YEAR: 'YYYY',
}

// 正则表达式
export const REGEX = {
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  PHONE: /^1[3-9]\d{9}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{6,20}$/,
  USERNAME: /^[a-zA-Z0-9_]{3,20}$/,
  URL: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
  IP: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
}

// 默认头像
export const DEFAULT_AVATAR = 'https://via.placeholder.com/100x100?text=Avatar'

// 应用信息
export const APP_INFO = {
  NAME: 'Duo',
  VERSION: '1.0.0',
  DESCRIPTION: '基于 React + TypeScript + Spring Boot 的现代化前后端分离项目',
  AUTHOR: 'Duo Team',
  COPYRIGHT: '© 2024 Duo Team. All rights reserved.',
}
