import { useState, useCallback } from 'react';
import { useAuth } from './useAuth';

interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

interface RequestOptions extends RequestInit {
  timeout?: number;
}

// 移除未使用的接口

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const { token, logout } = useAuth();

  const request = useCallback(async <T = any>(
    url: string,
    options: RequestOptions = {}
  ): Promise<T> => {
    setLoading(true);
    setError(null);

    const {
      timeout = 10000,
      headers = {},
      ...restOptions
    } = options;

    // 设置默认headers
    const defaultHeaders = new Headers({
      'Content-Type': 'application/json',
      ...headers
    });

    // 添加认证token
    if (token) {
      defaultHeaders.set('Authorization', `Bearer ${token}`);
    }

    // 创建AbortController用于超时控制
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...restOptions,
        headers: defaultHeaders,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      // 处理HTTP错误状态
      if (!response.ok) {
        if (response.status === 401) {
          // Token过期或无效，自动登出
          logout();
          throw new ApiError('认证已过期，请重新登录', 401);
        }

        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;

        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          // 如果响应不是JSON格式，使用默认错误消息
        }

        throw new ApiError(errorMessage, response.status);
      }

      // 解析响应数据
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();

        // 如果响应包含success字段且为false，抛出错误
        if (data.success === false) {
          throw new ApiError(data.message || '请求失败');
        }

        // 返回数据部分或整个响应
        return data.data !== undefined ? data.data : data;
      } else {
        // 非JSON响应，返回文本
        return await response.text() as T;
      }

    } catch (err) {
      clearTimeout(timeoutId);

      if (err instanceof ApiError) {
        setError(err);
        throw err;
      }

      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          const timeoutError = new ApiError('请求超时', 408);
          setError(timeoutError);
          throw timeoutError;
        }

        const apiError = new ApiError(err.message || '网络请求失败');
        setError(apiError);
        throw apiError;
      }

      const unknownError = new ApiError('未知错误');
      setError(unknownError);
      throw unknownError;
    } finally {
      setLoading(false);
    }
  }, [token, logout]);

  // GET请求
  const get = useCallback(<T = any>(url: string, options?: RequestOptions): Promise<T> => {
    return request<T>(url, { ...options, method: 'GET' });
  }, [request]);

  // POST请求
  const post = useCallback(<T = any>(
    url: string,
    data?: any,
    options?: RequestOptions
  ): Promise<T> => {
    return request<T>(url, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined
    });
  }, [request]);

  // PUT请求
  const put = useCallback(<T = any>(
    url: string,
    data?: any,
    options?: RequestOptions
  ): Promise<T> => {
    return request<T>(url, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined
    });
  }, [request]);

  // PATCH请求
  const patch = useCallback(<T = any>(
    url: string,
    data?: any,
    options?: RequestOptions
  ): Promise<T> => {
    return request<T>(url, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined
    });
  }, [request]);

  // DELETE请求
  const del = useCallback(<T = any>(url: string, options?: RequestOptions): Promise<T> => {
    return request<T>(url, { ...options, method: 'DELETE' });
  }, [request]);

  // 文件上传
  const upload = useCallback(<T = any>(
    url: string,
    file: File,
    options?: Omit<RequestOptions, 'body'>
  ): Promise<T> => {
    const formData = new FormData();
    formData.append('file', file);

    return request<T>(url, {
      ...options,
      method: 'POST',
      body: formData,
      // 不设置Content-Type，让浏览器自动设置multipart/form-data边界
    });
  }, [request]);

  // 批量请求
  const batch = useCallback(async <T = any>(
    requests: Array<{ url: string; options?: RequestOptions }>
  ): Promise<T[]> => {
    const promises = requests.map(({ url, options }) => request<T>(url, options));
    return Promise.all(promises);
  }, [request]);

  // 清除错误
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    request,
    get,
    post,
    put,
    patch,
    delete: del,
    upload,
    batch,
    clearError
  };
};

// 自定义ApiError类
class ApiError extends Error {
  status?: number;
  code?: string;

  constructor(message: string, status?: number, code?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    
    // 修复 TypeScript 中扩展 Error 的问题
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

// 用于特定API端点的Hook
export const useUserApi = () => {
  const api = useApi();

  const getUsers = (params?: Record<string, any>) => {
    const searchParams = new URLSearchParams(params);
    return api.get(`/api/users?${searchParams}`);
  };

  const getUser = (id: number) => {
    return api.get(`/api/users/${id}`);
  };

  const createUser = (userData: any) => {
    return api.post('/api/users', userData);
  };

  const updateUser = (id: number, userData: any) => {
    return api.put(`/api/users/${id}`, userData);
  };

  const deleteUser = (id: number) => {
    return api.delete(`/api/users/${id}`);
  };

  return {
    ...api,
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser
  };
};

// 用于认证API的Hook
export const useAuthApi = () => {
  const api = useApi();

  const login = (credentials: { email: string; password: string }) => {
    return api.post('/api/auth/login', credentials);
  };

  const register = (userData: any) => {
    return api.post('/api/auth/register', userData);
  };

  const logout = () => {
    return api.post('/api/auth/logout');
  };

  const refreshToken = () => {
    return api.post('/api/auth/refresh');
  };

  const forgotPassword = (email: string) => {
    return api.post('/api/auth/forgot-password', { email });
  };

  const resetPassword = (token: string, password: string) => {
    return api.post('/api/auth/reset-password', { token, password });
  };

  const validateToken = () => {
    return api.get('/api/auth/validate');
  };

  return {
    ...api,
    login,
    register,
    logout,
    refreshToken,
    forgotPassword,
    resetPassword,
    validateToken
  };
};

export { ApiError };
