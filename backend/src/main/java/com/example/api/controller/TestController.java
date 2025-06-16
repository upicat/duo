package com.example.api.controller;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.core.entity.User;
import com.example.core.repository.UserRepository;

@RestController
@RequestMapping("/test")
public class TestController {

    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;

    public TestController(PasswordEncoder passwordEncoder, UserRepository userRepository) {
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
    }

    @GetMapping("/test-password")
    public String testPassword(@RequestParam String username, @RequestParam String password) {
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) {
            return "用户不存在";
        }

        boolean matches = passwordEncoder.matches(password, user.getPassword());
        return String.format("用户: %s, 数据库密码: %s, 输入密码: %s, 匹配结果: %s",
                username, user.getPassword(), password, matches);
    }

    @GetMapping("/generate-hash")
    public String generateHash(@RequestParam String password) {
        String hash = passwordEncoder.encode(password);
        return String.format("明文: %s, 生成的哈希: %s", password, hash);
    }

    @GetMapping("/update-password")
    public String updatePassword(@RequestParam String username, @RequestParam String newPassword) {
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) {
            return "用户不存在";
        }

        String hashedPassword = passwordEncoder.encode(newPassword);
        user.setPassword(hashedPassword);
        userRepository.save(user);

        return String.format("用户 %s 的密码已更新为: %s (哈希: %s)", username, newPassword, hashedPassword);
    }
}
