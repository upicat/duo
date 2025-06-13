package com.example.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.example.entity.User;
import com.example.repository.UserRepository;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        // 检查是否已有用户数据
        if (userRepository.count() == 0) {
            createTestUsers();
        }
    }

    private void createTestUsers() {
        // 创建测试用户1 - 可以用用户名登录
        User user1 = new User();
        user1.setUsername("admin");
        user1.setEmail("admin@example.com");
        user1.setPassword(passwordEncoder.encode("password123"));
        user1.setNickname("管理员");
        user1.setStatus(User.UserStatus.ACTIVE);
        userRepository.save(user1);

        // 创建测试用户2 - 可以用邮箱登录
        User user2 = new User();
        user2.setUsername("testuser");
        user2.setEmail("test@example.com");
        user2.setPassword(passwordEncoder.encode("password123"));
        user2.setNickname("测试用户");
        user2.setStatus(User.UserStatus.ACTIVE);
        userRepository.save(user2);

        // 创建测试用户3 - 演示用户
        User user3 = new User();
        user3.setUsername("demo");
        user3.setEmail("demo@example.com");
        user3.setPassword(passwordEncoder.encode("demo123"));
        user3.setNickname("演示用户");
        user3.setStatus(User.UserStatus.ACTIVE);
        userRepository.save(user3);

        System.out.println("=== 测试用户已创建 ===");
        System.out.println("用户1: 用户名=admin, 邮箱=admin@example.com, 密码=password123");
        System.out.println("用户2: 用户名=testuser, 邮箱=test@example.com, 密码=password123");
        System.out.println("用户3: 用户名=demo, 邮箱=demo@example.com, 密码=demo123");
        System.out.println("现在可以使用用户名或邮箱进行登录测试！");
        System.out.println("========================");
    }
}
