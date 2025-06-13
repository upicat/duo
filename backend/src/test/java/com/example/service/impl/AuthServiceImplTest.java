package com.example.service.impl;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;

import com.example.dto.response.LoginResponse;
import com.example.entity.User;
import com.example.repository.UserRepository;
import com.example.security.JwtTokenProvider;

@ExtendWith(MockitoExtension.class)
class AuthServiceImplTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtTokenProvider tokenProvider;

    @Mock
    private UserRepository userRepository;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private AuthServiceImpl authService;

    private User testUser;
    private String testUsername = "testuser";
    private String testPassword = "password123";
    private String testToken = "jwt.token.here";

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername(testUsername);
        testUser.setPassword("encodedPassword");
        testUser.setNickname("Test User");
        testUser.setEmail("test@example.com");
        testUser.setStatus(User.UserStatus.ACTIVE);
    }

    @Test
    void authenticateUser_Success() {
        // Given
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);
        when(tokenProvider.generateToken(eq(authentication))).thenReturn(testToken);
        when(userRepository.findByUsername(testUsername)).thenReturn(Optional.of(testUser));

        // When
        LoginResponse result = authService.authenticateUser(testUsername, testPassword);

        // Then
        assertNotNull(result);
        assertEquals(testToken, result.getToken());
        assertEquals(testUsername, result.getUsername());
        assertEquals(testUser.getId(), result.getUserId());

        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verify(tokenProvider).generateToken(eq(authentication));
        verify(userRepository).findByUsername(testUsername);
    }

    @Test
    void authenticateUser_AuthenticationFailure() {
        // Given
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new BadCredentialsException("Bad credentials"));

        // When & Then
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            authService.authenticateUser(testUsername, "wrongpassword");
        });

        assertEquals("用户名或密码错误", exception.getMessage());
        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verify(tokenProvider, never()).generateToken(any(Authentication.class));
        verify(userRepository, never()).findByUsername(any());
    }

    @Test
    void authenticateUser_UserNotFound() {
        // Given
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);
        when(tokenProvider.generateToken(eq(authentication))).thenReturn(testToken);
        when(userRepository.findByUsername(testUsername)).thenReturn(Optional.empty());

        // When & Then
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            authService.authenticateUser(testUsername, testPassword);
        });

        assertEquals("用户不存在", exception.getMessage());
        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verify(tokenProvider).generateToken(eq(authentication));
        verify(userRepository).findByUsername(testUsername);
    }

    @Test
    void authenticateUser_WithNullUsername() {
        // When & Then
        assertThrows(RuntimeException.class, () -> {
            authService.authenticateUser(null, testPassword);
        });
    }

    @Test
    void authenticateUser_WithEmptyUsername() {
        // When & Then
        assertThrows(RuntimeException.class, () -> {
            authService.authenticateUser("", testPassword);
        });
    }

    @Test
    void authenticateUser_WithNullPassword() {
        // When & Then
        assertThrows(RuntimeException.class, () -> {
            authService.authenticateUser(testUsername, null);
        });
    }

    @Test
    void authenticateUser_WithEmptyPassword() {
        // When & Then
        assertThrows(RuntimeException.class, () -> {
            authService.authenticateUser(testUsername, "");
        });
    }

    @Test
    void authenticateUser_VerifyAuthenticationTokenCreation() {
        // Given
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);
        when(tokenProvider.generateToken(eq(authentication))).thenReturn(testToken);
        when(userRepository.findByUsername(testUsername)).thenReturn(Optional.of(testUser));

        // When
        authService.authenticateUser(testUsername, testPassword);

        // Then
        verify(authenticationManager).authenticate(argThat(token -> 
            token instanceof UsernamePasswordAuthenticationToken &&
            testUsername.equals(token.getPrincipal()) &&
            testPassword.equals(token.getCredentials())
        ));
    }
}
