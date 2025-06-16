package com.example.service.impl;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;

import com.example.dto.UserDto;
import com.example.dto.response.LoginResponse;
import com.example.entity.User;
import com.example.repository.UserRepository;
import com.example.security.JwtTokenProvider;
import com.example.service.AuthService;

import java.util.Collection;
import java.util.stream.Collectors;

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
            
            // 创建UserDto对象
            UserDto userDto = convertToUserDto(user, authentication.getAuthorities());
            
            // 返回包含完整user对象的LoginResponse
            return new LoginResponse(token, userDto);
        } catch (AuthenticationException e) {
            throw new RuntimeException("用户名/邮箱或密码错误");
        }
    }
    
    /**
     * 将User实体转换为UserDto
     * @param user User实体
     * @param authorities 用户权限
     * @return UserDto对象
     */
    private UserDto convertToUserDto(User user, Collection<? extends GrantedAuthority> authorities) {
        // 从权限中提取角色
        String role = authorities.stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(","));
        
        // 如果角色为空，设置一个默认值
        if (role == null || role.isEmpty()) {
            role = "USER";
        }
        
        // 创建并返回UserDto
        return new UserDto(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getNickname(), // 将nickname映射到fullName
                role,
                null // 暂时不设置avatar
        );
    }
}
