import { useState, useEffect, createContext, useContext } from 'react';
import { useLocalStorage } from './useLocalStorage';

interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  role: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

interface LoginResponse {
  user: User;
  token: string;
  refreshToken?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const useAuthProvider = (): AuthContextType => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useLocalStorage<string | null>('auth_token', null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 检查本地存储的token是否有效
    if (token) {
      validateToken();
    } else {
      setIsLoading(false);
    }
  }, [token]);

  const validateToken = async () => {
    try {
      const response = await fetch('/api/auth/validate', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData.user);
      } else {
        // Token无效，清除本地存储
        setToken(null);
        setUser(null);
      }
    } catch (error) {
      console.error('Token validation failed:', error);
      setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials): Promise<void> => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          usernameOrEmail: credentials.email,
          password: credentials.password
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '登录失败');
      }

      const data: LoginResponse = await response.json();
      
      setUser(data.user);
      setToken(data.token);
      
      // 如果选择记住我，将token存储到localStorage
      if (credentials.rememberMe) {
        localStorage.setItem('auth_token', data.token);
      }
      
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth_token');
    
    // 可选：调用后端登出接口
    if (token) {
      fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }).catch(error => {
        console.error('Logout API call failed:', error);
      });
    }
  };

  const isAuthenticated = !!user && !!token;

  return {
    user,
    token,
    login,
    logout,
    isAuthenticated,
    isLoading
  };
};

// 权限检查Hook
export const usePermission = () => {
  const { user } = useAuth();

  const hasRole = (role: string): boolean => {
    return user?.role === role;
  };

  const hasAnyRole = (roles: string[]): boolean => {
    return user ? roles.includes(user.role) : false;
  };

  const isAdmin = (): boolean => {
    return hasRole('admin');
  };

  const isModerator = (): boolean => {
    return hasRole('moderator');
  };

  const canManageUsers = (): boolean => {
    return hasAnyRole(['admin', 'moderator']);
  };

  return {
    hasRole,
    hasAnyRole,
    isAdmin,
    isModerator,
    canManageUsers
  };
};

// 受保护路由Hook
export const useRequireAuth = () => {
  const { isAuthenticated, isLoading } = useAuth();
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // 重定向到登录页面
      window.location.href = '/login';
    }
  }, [isAuthenticated, isLoading]);

  return { isAuthenticated, isLoading };
};

export { AuthContext };
