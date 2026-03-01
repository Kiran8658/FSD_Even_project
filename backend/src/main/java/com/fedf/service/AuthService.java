package com.fedf.service;

import com.fedf.dto.*;
import com.fedf.entity.User;
import com.fedf.repository.UserRepository;
import com.fedf.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;

    public AuthResponse signUp(SignUpRequest request) {
        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }
        
        // Generate username from name
        String username = request.getName().toLowerCase().replaceAll("\\s+", "_");
        
        // Ensure username is unique
        int counter = 0;
        String baseUsername = username;
        while (userRepository.existsByUsername(username)) {
            counter++;
            username = baseUsername + counter;
        }
        
        // Create new user
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .username(username)
                .password(passwordEncoder.encode(request.getPassword()))
                .avatar("https://api.dicebear.com/7.x/avataaars/svg?seed=" + username)
                .bio("Passionate developer & lifelong learner")
                .currentStreak(0)
                .longestStreak(0)
                .totalActivities(0)
                .build();
        
        User savedUser = userRepository.save(user);
        
        // Generate JWT token
        String token = jwtTokenProvider.generateToken(savedUser.getEmail());
        
        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .user(mapToUserDTO(savedUser))
                .build();
    }

    public AuthResponse signIn(SignInRequest request) {
        // Authenticate user
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        
        // Get user
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Generate JWT token
        String token = jwtTokenProvider.generateToken(user.getEmail());
        
        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .user(mapToUserDTO(user))
                .build();
    }

    public UserDTO getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return mapToUserDTO(user);
    }

    private UserDTO mapToUserDTO(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .name(user.getName())
                .avatar(user.getAvatar())
                .bio(user.getBio())
                .college(user.getCollege())
                .joinDate(user.getJoinDate() != null 
                        ? user.getJoinDate().format(DateTimeFormatter.ISO_LOCAL_DATE) 
                        : null)
                .build();
    }
}
