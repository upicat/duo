package com.example.service.impl;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Service;

import com.example.dto.response.LoginResponse;
import com.example.entity.User;
import com.example.repository.UserRepository;
import com.example.security.JwtTokenProvider;
import com.example.service.AuthService;

@Service
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final UserRepository userRepository;

    public AuthServiceImpl(AuthenticationManager authenticationManager, 
                          JwtTokenProvider tokenProvider,
                          UserRepository userRepository) {
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
        this.userRepository = userRepository;
    }

    @Override
    public LoginResponse authenticateUser(String usernameOrEmail, String password) {
        try {
            // 使用用户名或邮箱进行认证
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(usernameOrEmail, password)
            );
            
            String token = tokenProvider.generateToken(authentication);
            
            // 根据用户名或邮箱查找用户
            User user = userRepository.findByUsernameOrEmail(usernameOrEmail)
                .orElseThrow(() -> new RuntimeException("用户不存在"));
            
            return new LoginResponse(token, user.getUsername(), user.getId());
        } catch (AuthenticationException e) {
            throw new RuntimeException("用户名/邮箱或密码错误");
        }
    }
}
