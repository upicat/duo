package com.example.core.service;

import java.util.List;

import com.example.api.dto.response.UserResponse;

public interface UserService {
    
    /**
     * 根据ID获取用户信息
     * @param id 用户ID
     * @return 用户响应对象
     */
    UserResponse getUserById(Long id);
    
    /**
     * 获取用户列表
     * @param page 页码（从0开始）
     * @param size 每页大小
     * @param keyword 搜索关键词（可选，用于搜索用户名或邮箱）
     * @return 用户列表
     */
    List<UserResponse> getUserList(int page, int size, String keyword);
    
    /**
     * 获取用户总数
     * @param keyword 搜索关键词（可选）
     * @return 用户总数
     */
    long getUserCount(String keyword);
}
