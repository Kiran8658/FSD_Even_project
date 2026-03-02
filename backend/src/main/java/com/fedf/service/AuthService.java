package com.fedf.service;

import com.fedf.dto.*;
import com.fedf.entity.User;
import com.fedf.repository.UserRepository;
import com.fedf.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthResponse signUp(SignUpRequest request) {
        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        // Use provided username, or generate from name if not given
        String username = (request.getUsername() != null && !request.getUsername().isBlank())
                ? request.getUsername().toLowerCase().replaceAll("\\s+", "_")
                : request.getName().toLowerCase().replaceAll("\\s+", "_");

        // Ensure username is unique
        int counter = 0;
        String baseUsername = username;
        while (userRepository.existsByUsername(username)) {
            counter++;
            username = baseUsername + counter;
        }

        // Check if username is already taken (before adjustment)
        if (counter > 0) {
            // username was adjusted, that's fine
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
        User user = resolveUserByIdentifier(request.getIdentifier());

        // Manual password verification to support alias/email/username logins
        boolean passwordMatches = passwordEncoder.matches(request.getPassword(), user.getPassword());
        if (!passwordMatches) {
            throw new BadCredentialsException("Invalid email or password");
        }

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
        UserDTO.Links links = UserDTO.Links.builder()
                .linkedIn(user.getLinkLinkedIn())
                .github(user.getLinkGithub())
                .twitter(user.getLinkTwitter())
                .website(user.getLinkWebsite())
                .resume(user.getLinkResume())
                .telegram(user.getLinkTelegram())
                .leetCode(user.getLinkLeetCode())
                .build();

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
                .links(links)
                .build();
    }

    private User resolveUserByIdentifier(String identifier) {
        if (identifier == null || identifier.isBlank()) {
            throw new RuntimeException("Email or username is required");
        }

        String trimmed = identifier.trim();
        String normalizedEmail = normalizeEmailAlias(trimmed);

        return userRepository.findByEmail(normalizedEmail)
                .orElseGet(() -> userRepository.findByUsername(trimmed.toLowerCase())
                        .orElseThrow(() -> new RuntimeException("User not found")));
    }

    private String normalizeEmailAlias(String identifier) {
        String lowered = identifier.toLowerCase();
        if ("demo@gmail.com".equals(lowered)) {
            return "demo@ghostwrite.io";
        }
        return identifier;
    }
}
