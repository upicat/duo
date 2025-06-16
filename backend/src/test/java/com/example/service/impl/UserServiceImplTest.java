package com.example.service.impl;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.example.api.dto.response.UserResponse;
import com.example.core.entity.User;
import com.example.core.repository.UserRepository;
import com.example.core.service.impl.UserServiceImpl;
import com.example.infra.exception.ResourceNotFoundException;

@ExtendWith(MockitoExtension.class)
class UserServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserServiceImpl userService;

    private User testUser1;
    private User testUser2;
    private List<User> testUsers;

    @BeforeEach
    void setUp() {
        testUser1 = new User();
        testUser1.setId(1L);
        testUser1.setUsername("testuser1");
        testUser1.setNickname("Test User 1");
        testUser1.setEmail("test1@example.com");
        testUser1.setPhone("13800138001");
        testUser1.setStatus(User.UserStatus.ACTIVE);

        testUser2 = new User();
        testUser2.setId(2L);
        testUser2.setUsername("testuser2");
        testUser2.setNickname("Test User 2");
        testUser2.setEmail("test2@example.com");
        testUser2.setPhone("13800138002");
        testUser2.setStatus(User.UserStatus.INACTIVE);

        testUsers = Arrays.asList(testUser1, testUser2);
    }

    @Test
    void getUserById_Success() {
        // Given
        Long userId = 1L;
        when(userRepository.findById(userId)).thenReturn(Optional.of(testUser1));

        // When
        UserResponse result = userService.getUserById(userId);

        // Then
        assertNotNull(result);
        assertEquals(testUser1.getId(), result.getId());
        assertEquals(testUser1.getUsername(), result.getUsername());
        assertEquals(testUser1.getNickname(), result.getNickname());
        assertEquals(testUser1.getEmail(), result.getEmail());
        assertEquals(testUser1.getPhone(), result.getPhone());
        assertEquals(testUser1.getStatus().name(), result.getStatus());

        verify(userRepository).findById(userId);
    }

    @Test
    void getUserById_UserNotFound() {
        // Given
        Long userId = 999L;
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        // When & Then
        ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class, () -> {
            userService.getUserById(userId);
        });

        assertTrue(exception.getMessage().contains("User"));
        assertTrue(exception.getMessage().contains("id"));
        assertTrue(exception.getMessage().contains(userId.toString()));

        verify(userRepository).findById(userId);
    }

    @Test
    @SuppressWarnings("null")
    void getUserById_WithNullId() {
        // When & Then
        assertThrows(Exception.class, () -> {
            userService.getUserById((Long) null);
        });

        verify(userRepository).findById((Long) null);
    }

    @Test
    void getUserList_Success() {
        // Given
        int page = 0;
        int size = 10;
        String keyword = null;
        when(userRepository.findAll()).thenReturn(testUsers);

        // When
        List<UserResponse> result = userService.getUserList(page, size, keyword);

        // Then
        assertNotNull(result);
        assertEquals(2, result.size());

        UserResponse user1Response = result.get(0);
        assertEquals(testUser1.getId(), user1Response.getId());
        assertEquals(testUser1.getUsername(), user1Response.getUsername());
        assertEquals(testUser1.getNickname(), user1Response.getNickname());
        assertEquals(testUser1.getEmail(), user1Response.getEmail());
        assertEquals(testUser1.getPhone(), user1Response.getPhone());
        assertEquals(testUser1.getStatus().name(), user1Response.getStatus());

        UserResponse user2Response = result.get(1);
        assertEquals(testUser2.getId(), user2Response.getId());
        assertEquals(testUser2.getUsername(), user2Response.getUsername());
        assertEquals(testUser2.getNickname(), user2Response.getNickname());
        assertEquals(testUser2.getEmail(), user2Response.getEmail());
        assertEquals(testUser2.getPhone(), user2Response.getPhone());
        assertEquals(testUser2.getStatus().name(), user2Response.getStatus());

        verify(userRepository).findAll();
    }

    @Test
    void getUserList_WithKeyword() {
        // Given
        int page = 0;
        int size = 10;
        String keyword = "test";
        when(userRepository.findAll()).thenReturn(testUsers);

        // When
        List<UserResponse> result = userService.getUserList(page, size, keyword);

        // Then
        assertNotNull(result);
        assertEquals(2, result.size());

        verify(userRepository).findAll();
    }

    @Test
    void getUserList_EmptyResult() {
        // Given
        int page = 0;
        int size = 10;
        String keyword = null;
        when(userRepository.findAll()).thenReturn(Arrays.asList());

        // When
        List<UserResponse> result = userService.getUserList(page, size, keyword);

        // Then
        assertNotNull(result);
        assertTrue(result.isEmpty());

        verify(userRepository).findAll();
    }

    @Test
    void getUserCount_Success() {
        // Given
        String keyword = null;
        long expectedCount = 5L;
        when(userRepository.count()).thenReturn(expectedCount);

        // When
        long result = userService.getUserCount(keyword);

        // Then
        assertEquals(expectedCount, result);

        verify(userRepository).count();
    }

    @Test
    void getUserCount_WithKeyword() {
        // Given
        String keyword = "test";
        long expectedCount = 3L;
        when(userRepository.count()).thenReturn(expectedCount);

        // When
        long result = userService.getUserCount(keyword);

        // Then
        assertEquals(expectedCount, result);

        verify(userRepository).count();
    }

    @Test
    void getUserCount_ZeroResult() {
        // Given
        String keyword = "nonexistent";
        when(userRepository.count()).thenReturn(0L);

        // When
        long result = userService.getUserCount(keyword);

        // Then
        assertEquals(0L, result);

        verify(userRepository).count();
    }

    @Test
    void convertToUserResponse_AllFieldsPresent() {
        // Given - 使用反射或创建一个测试方法来测试私有方法
        // 这里我们通过调用公共方法来间接测试转换逻辑
        Long userId = 1L;
        when(userRepository.findById(userId)).thenReturn(Optional.of(testUser1));

        // When
        UserResponse result = userService.getUserById(userId);

        // Then
        assertNotNull(result);
        assertEquals(testUser1.getId(), result.getId());
        assertEquals(testUser1.getUsername(), result.getUsername());
        assertEquals(testUser1.getNickname(), result.getNickname());
        assertEquals(testUser1.getEmail(), result.getEmail());
        assertEquals(testUser1.getPhone(), result.getPhone());
        assertEquals(testUser1.getStatus().name(), result.getStatus());
    }

    @Test
    void convertToUserResponse_WithDifferentStatus() {
        // Given
        Long userId = 2L;
        when(userRepository.findById(userId)).thenReturn(Optional.of(testUser2));

        // When
        UserResponse result = userService.getUserById(userId);

        // Then
        assertNotNull(result);
        assertEquals(testUser2.getId(), result.getId());
        assertEquals(testUser2.getUsername(), result.getUsername());
        assertEquals(testUser2.getNickname(), result.getNickname());
        assertEquals(testUser2.getEmail(), result.getEmail());
        assertEquals(testUser2.getPhone(), result.getPhone());
        assertEquals("INACTIVE", result.getStatus());
    }

    @Test
    void getUserList_VerifyStreamProcessing() {
        // Given
        when(userRepository.findAll()).thenReturn(testUsers);

        // When
        List<UserResponse> result = userService.getUserList(0, 10, null);

        // Then
        assertNotNull(result);
        assertEquals(testUsers.size(), result.size());

        // 验证每个用户都被正确转换
        for (int i = 0; i < testUsers.size(); i++) {
            User originalUser = testUsers.get(i);
            UserResponse responseUser = result.get(i);

            assertEquals(originalUser.getId(), responseUser.getId());
            assertEquals(originalUser.getUsername(), responseUser.getUsername());
            assertEquals(originalUser.getNickname(), responseUser.getNickname());
            assertEquals(originalUser.getEmail(), responseUser.getEmail());
            assertEquals(originalUser.getPhone(), responseUser.getPhone());
            assertEquals(originalUser.getStatus().name(), responseUser.getStatus());
        }

        verify(userRepository).findAll();
    }

    @Test
    void getUserList_WithPaginationParameters() {
        // Given
        int page = 1;
        int size = 5;
        String keyword = "search";
        when(userRepository.findAll()).thenReturn(testUsers);

        // When
        List<UserResponse> result = userService.getUserList(page, size, keyword);

        // Then
        assertNotNull(result);
        // 注意：当前实现没有真正的分页逻辑，只是返回所有结果
        // 这个测试验证方法能够接受分页参数而不出错
        assertEquals(testUsers.size(), result.size());

        verify(userRepository).findAll();
    }
}
