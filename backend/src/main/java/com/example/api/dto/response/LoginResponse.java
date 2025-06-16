package com.example.api.dto.response;

import com.example.api.dto.UserDto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "登录响应")
public class LoginResponse {
    
    @Schema(description = "JWT令牌")
    private String token;
    
    @Schema(description = "令牌类型", example = "Bearer")
    private String tokenType = "Bearer";
    
    @Schema(description = "用户对象")
    private UserDto user;
    
    // 保留这些字段以向后兼容
    @Schema(description = "用户名")
    private String username;
    
    @Schema(description = "用户ID")
    private Long userId;
    
    public LoginResponse() {}
    
    public LoginResponse(String token, String username, Long userId) {
        this.token = token;
        this.username = username;
        this.userId = userId;
    }
    
    public LoginResponse(String token, UserDto user) {
        this.token = token;
        this.user = user;
        // 为了向后兼容，同时设置username和userId
        if (user != null) {
            this.username = user.getUsername();
            this.userId = user.getId();
        }
    }
    
    public String getToken() {
        return token;
    }
    
    public void setToken(String token) {
        this.token = token;
    }
    
    public String getTokenType() {
        return tokenType;
    }
    
    public void setTokenType(String tokenType) {
        this.tokenType = tokenType;
    }
    
    public String getUsername() {
        return username;
    }
    
    public void setUsername(String username) {
        this.username = username;
    }
    
    public Long getUserId() {
        return userId;
    }
    
    public void setUserId(Long userId) {
        this.userId = userId;
    }
    
    public UserDto getUser() {
        return user;
    }
    
    public void setUser(UserDto user) {
        this.user = user;
    }
}
