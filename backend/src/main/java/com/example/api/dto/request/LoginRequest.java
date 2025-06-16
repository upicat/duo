package com.example.api.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

@Schema(description = "登录请求")
public class LoginRequest {

    @Schema(description = "用户名或邮箱", example = "admin 或 admin@example.com")
    @NotBlank(message = "用户名或邮箱不能为空")
    private String usernameOrEmail;

    @Schema(description = "密码", example = "password123")
    @NotBlank(message = "密码不能为空")
    private String password;

    public LoginRequest() {
    }

    public LoginRequest(String usernameOrEmail, String password) {
        this.usernameOrEmail = usernameOrEmail;
        this.password = password;
    }

    public String getUsernameOrEmail() {
        return usernameOrEmail;
    }

    public void setUsernameOrEmail(String usernameOrEmail) {
        this.usernameOrEmail = usernameOrEmail;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    // 保持向后兼容性的方法
    @Deprecated
    public String getUsername() {
        return usernameOrEmail;
    }

    @Deprecated
    public void setUsername(String username) {
        this.usernameOrEmail = username;
    }
}
