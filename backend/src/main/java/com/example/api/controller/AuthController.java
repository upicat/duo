package com.example.api.controller;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.api.dto.request.LoginRequest;
import com.example.api.dto.response.LoginResponse;
import com.example.api.dto.response.UserResponse;
import com.example.core.service.AuthService;
import com.example.infra.common.Result;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "认证接口", description = "处理用户登录、注册等认证相关操作")
@RestController
public class AuthController extends BaseController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @Operation(summary = "用户登录", description = "使用用户名/邮箱和密码获取JWT令牌")
    @PostMapping("/auth/login")
    public Result<LoginResponse> login(@RequestBody LoginRequest request) {
        LoginResponse response = authService.authenticateUser(request.getUsernameOrEmail(), request.getPassword());
        return Result.success(response);
    }

    @Operation(summary = "验证令牌", description = "验证JWT令牌的有效性并返回用户信息")
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/auth/validate")
    public Result<UserResponse> validateToken(Authentication authentication) {
        UserResponse userResponse = authService.getCurrentUser(authentication);
        return Result.success(userResponse);
    }
}
