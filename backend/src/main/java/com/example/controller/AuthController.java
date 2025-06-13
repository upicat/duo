package com.example.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.common.Result;
import com.example.dto.request.LoginRequest;
import com.example.dto.response.LoginResponse;
import com.example.service.AuthService;

import io.swagger.v3.oas.annotations.Operation;
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
}
