package com.example.core.service;

import com.example.api.dto.response.LoginResponse;

public interface AuthService {
    
    /**
     * 用户认证
     * @param usernameOrEmail 用户名或邮箱
     * @param password 密码
     * @return 登录响应信息
     */
    LoginResponse authenticateUser(String usernameOrEmail, String password);
}
