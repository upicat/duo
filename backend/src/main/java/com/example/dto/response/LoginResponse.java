package com.example.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "登录响应")
public class LoginResponse {
    
    @Schema(description = "JWT令牌")
    private String token;
    
    @Schema(description = "令牌类型", example = "Bearer")
    private String tokenType = "Bearer";
    
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
}
