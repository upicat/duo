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
            console.log('Validating token:', token);

            // 使用apiClient而不是直接fetch
            const response = await import('../services/api').then(module => {
                const apiClient = module.apiClient;
                return apiClient.get('/auth/validate');
            });

            console.log('Token validation response:', response);

            // 从响应中提取数据
            const userData = response.data.data;
            setUser(userData);
            console.log('Token validation successful, user:', userData);
        } catch (error: any) {
            console.error('Token validation failed:', error);

            // 只有在401或403错误时才清除token，网络错误时保留token
            if (error.response?.status === 401 || error.response?.status === 403) {
                console.log('Token is invalid, clearing token');
                setToken(null);
                setUser(null);
            } else {
                console.log('Network error during token validation, keeping token');
                // 网络错误时，不清除token，但也不设置用户信息
                setUser(null);
            }
            setToken(null);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (credentials: LoginCredentials): Promise<void> => {
        setIsLoading(true);

        try {
            // 使用apiClient而不是直接fetch
            const response = await import('../services/api').then(module => {
                const apiClient = module.apiClient;
                return apiClient.post('/auth/login', {
                    usernameOrEmail: credentials.email,
                    password: credentials.password
                });
            });

            // 从响应中提取数据
            const data: LoginResponse = response.data.data;

            console.log('Login successful:', data);

            setUser(data.user);
            setToken(data.token);

            // token已经通过useLocalStorage自动存储，不需要额外操作

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
        // token已经通过useLocalStorage自动清除，不需要额外操作

        // 可选：调用后端登出接口
        if (token) {
            import('../services/api').then(module => {
                const apiClient = module.apiClient;
                return apiClient.post('/auth/logout');
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
