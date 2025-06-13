package com.example.security;

import java.util.Collections;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.example.entity.User;
import com.example.repository.UserRepository;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String usernameOrEmail) throws UsernameNotFoundException {
        User user = userRepository.findByUsernameOrEmail(usernameOrEmail)
                .orElseThrow(() -> new UsernameNotFoundException("用户不存在: " + usernameOrEmail));

        return new org.springframework.security.core.userdetails.User(
                user.getUsername(), // 始终使用用户名作为principal
                user.getPassword(),
                user.getStatus() == User.UserStatus.ACTIVE,
                true,
                true,
                user.getStatus() != User.UserStatus.LOCKED,
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"))
        );
    }

    /**
     * 根据用户名或邮箱加载用户详情
     * @param usernameOrEmail 用户名或邮箱
     * @return 用户详情
     * @throws UsernameNotFoundException 用户不存在异常
     */
    public UserDetails loadUserByUsernameOrEmail(String usernameOrEmail) throws UsernameNotFoundException {
        return loadUserByUsername(usernameOrEmail);
    }
}
