import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import { message as antMessage } from 'antd'
import { storage } from './storage'

// 使用类型断言解决类型问题
const message = antMessage as any

// 创建 axios 实例
const request: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 添加认证 token
    const token = storage.get('token')
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`
    }

    // 添加请求时间戳
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now(),
      }
    }

    return config
  },
  (error: AxiosError) => {
    console.error('Request error:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  (response: AxiosResponse) => {
    const { data } = response

    // 如果是文件下载，直接返回
    if (response.config.responseType === 'blob') {
      return response
    }

    // 检查业务状态码
    if (data.code !== undefined) {
      if (data.code === 200 || data.success) {
        return data
      } else {
        // 业务错误
        const errorMessage = data.message || '请求失败'
        message.error(errorMessage)
        return Promise.reject(new Error(errorMessage))
      }
    }

    return data
  },
  (error: AxiosError) => {
    console.error('Response error:', error)

    // 网络错误
    if (!error.response) {
      message.error('网络连接失败，请检查网络设置')
      return Promise.reject(error)
    }

    const { status, data } = error.response

    switch (status) {
      case 401:
        // 未授权，清除本地存储并跳转到登录页
        storage.remove('token')
        storage.remove('user')
        message.error('登录已过期，请重新登录')
        window.location.href = '/login'
        break
      case 403:
        message.error('没有权限访问该资源')
        break
      case 404:
        message.error('请求的资源不存在')
        break
      case 500:
        message.error('服务器内部错误')
        break
      default:
        const errorMessage = (data as any)?.message || `请求失败 (${status})`
        message.error(errorMessage)
    }

    return Promise.reject(error)
  }
)

// 封装常用请求方法
export const http = {
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return request.get(url, config)
  },

  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return request.post(url, data, config)
  },

  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return request.put(url, data, config)
  },

  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return request.delete(url, config)
  },

  patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return request.patch(url, data, config)
  },

  upload<T = any>(url: string, formData: FormData, config?: AxiosRequestConfig): Promise<T> {
    return request.post(url, formData, {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config?.headers,
      },
    })
  },

  download(url: string, filename?: string, config?: AxiosRequestConfig): Promise<void> {
    return request.get(url, {
      ...config,
      responseType: 'blob',
    }).then((response: AxiosResponse) => {
      const blob = new Blob([response.data])
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = filename || 'download'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(downloadUrl)
    })
  },
}

export default request
