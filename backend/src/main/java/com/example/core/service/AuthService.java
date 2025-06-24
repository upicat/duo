package com.example.core.service;

import org.springframework.security.core.Authentication;

import com.example.api.dto.response.LoginResponse;
import com.example.api.dto.response.UserResponse;

public interface AuthService {
    
    /**
     * 用户认证
     * @param usernameOrEmail 用户名或邮箱
     * @param password 密码
     * @return 登录响应信息
     */
    LoginResponse authenticateUser(String usernameOrEmail, String password);
    
    /**
     * 获取当前用户信息
     * @param authentication 认证信息
     * @return 用户响应信息
     */
    UserResponse getCurrentUser(Authentication authentication);
}
