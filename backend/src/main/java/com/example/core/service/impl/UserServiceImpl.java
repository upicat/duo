package com.example.core.service.impl;

import org.springframework.stereotype.Service;

import com.example.api.dto.response.UserResponse;
import com.example.core.entity.User;
import com.example.core.repository.UserRepository;
import com.example.core.service.UserService;
import com.example.infra.exception.ResourceNotFoundException;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));

        return convertToUserResponse(user);
    }

    @Override
    public java.util.List<UserResponse> getUserList(int page, int size, String keyword) {
        java.util.List<User> users = userRepository.findAll();
        return users.stream()
                .map(this::convertToUserResponse)
                .collect(java.util.stream.Collectors.toList());
    }

    @Override
    public long getUserCount(String keyword) {
        return userRepository.count();
    }

    /**
     * 将用户实体转换为用户响应对象
     * 
     * @param user 用户实体
     * @return 用户响应对象
     */
    private UserResponse convertToUserResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getNickname(),
                user.getEmail(),
                user.getPhone(),
                user.getStatus().name());
    }
}
