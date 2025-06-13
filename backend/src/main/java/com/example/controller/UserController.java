package com.example.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.common.Result;
import com.example.dto.response.UserResponse;
import com.example.service.UserService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "用户接口", description = "用户相关操作")
@RestController
@RequestMapping("/users")
@SecurityRequirement(name = "Bearer Authentication")
public class UserController extends BaseController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @Operation(summary = "获取用户信息", description = "根据用户ID获取用户详细信息")
    @GetMapping("/{id}")
    public Result<UserResponse> getUserById(@PathVariable Long id) {
        UserResponse user = userService.getUserById(id);
        return Result.success(user);
    }

    @Operation(summary = "获取用户列表", description = "分页查询用户列表，支持按关键词搜索")
    @GetMapping
    public Result<java.util.Map<String, Object>> getUserList(
            @org.springframework.web.bind.annotation.RequestParam(defaultValue = "0") int page,
            @org.springframework.web.bind.annotation.RequestParam(defaultValue = "10") int size,
            @org.springframework.web.bind.annotation.RequestParam(required = false) String keyword) {
        
        java.util.List<UserResponse> users = userService.getUserList(page, size, keyword);
        long total = userService.getUserCount(keyword);
        
        java.util.Map<String, Object> result = new java.util.HashMap<>();
        result.put("users", users);
        result.put("total", total);
        result.put("page", page);
        result.put("size", size);
        
        return Result.success(result);
    }
}
