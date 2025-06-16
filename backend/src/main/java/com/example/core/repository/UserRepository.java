package com.example.core.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.core.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    /**
     * 根据用户名查找用户
     * @param username 用户名
     * @return 用户信息
     */
    Optional<User> findByUsername(String username);
    
    /**
     * 检查用户名是否存在
     * @param username 用户名
     * @return 是否存在
     */
    boolean existsByUsername(String username);
    
    /**
     * 根据邮箱查找用户
     * @param email 邮箱
     * @return 用户信息
     */
    Optional<User> findByEmail(String email);
    
    /**
     * 根据用户名或邮箱查找用户
     * @param usernameOrEmail 用户名或邮箱
     * @return 用户信息
     */
    default Optional<User> findByUsernameOrEmail(String usernameOrEmail) {
        // 简单判断是否为邮箱格式
        if (usernameOrEmail != null && usernameOrEmail.contains("@")) {
            return findByEmail(usernameOrEmail);
        } else {
            return findByUsername(usernameOrEmail);
        }
    }
}
