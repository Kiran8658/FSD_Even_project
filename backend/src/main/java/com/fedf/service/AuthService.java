package com.fedf.service;

import com.fedf.dto.*;
import com.fedf.entity.RefreshToken;
import com.fedf.entity.User;
import com.fedf.repository.RefreshTokenRepository;
import com.fedf.repository.UserRepository;
import com.fedf.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final com.fedf.repository.UserScoreRepository userScoreRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    @org.springframework.beans.factory.annotation.Value("${jwt.refresh-expiration:2592000000}")
    private long refreshExpirationMs;

    public AuthResponse signUp(SignUpRequest request) {
        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        // If user provided a username, use it as-is (normalized to lowercase for consistent login).
        // Do NOT auto-adjust it by appending numbers; instead, fail if it's already taken.
        String username;
        if (request.getUsername() != null && !request.getUsername().isBlank()) {
            username = request.getUsername().trim().toLowerCase();
            if (userRepository.existsByUsername(username)) {
                throw new RuntimeException("Username already taken");
            }
        } else {
            // Generate from name when username is not provided.
            username = request.getName().toLowerCase().replaceAll("\\s+", "_");
            int counter = 0;
            String baseUsername = username;
            while (userRepository.existsByUsername(username)) {
                counter++;
                username = baseUsername + counter;
            }
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

        // Initialize leaderboard score row
        userScoreRepository.save(com.fedf.entity.UserScore.builder()
            .user(savedUser)
            .totalSolved(0)
            .githubScore(0)
            .quizScore(0)
            .build());
        
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

    public String issueRefreshTokenForEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return issueRefreshToken(user);
    }

    public String issueRefreshToken(User user) {
        String token = UUID.randomUUID().toString().replace("-", "");
        RefreshToken refreshToken = RefreshToken.builder()
                .user(user)
                .token(token)
                .expiresAt(LocalDateTime.now().plusSeconds(refreshExpirationMs / 1000))
                .revoked(false)
                .build();
        refreshTokenRepository.save(refreshToken);
        return token;
    }

    public AuthResponse refreshAccessToken(String refreshTokenValue) {
        if (refreshTokenValue == null || refreshTokenValue.isBlank()) {
            throw new RuntimeException("Refresh token missing");
        }

        RefreshToken stored = refreshTokenRepository.findByToken(refreshTokenValue)
                .orElseThrow(() -> new RuntimeException("Invalid refresh token"));

        if (stored.isRevoked()) {
            throw new RuntimeException("Refresh token revoked");
        }
        if (stored.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Refresh token expired");
        }

        // rotate: revoke the token that was just used
        stored.setRevoked(true);
        refreshTokenRepository.save(stored);

        User user = stored.getUser();
        String token = jwtTokenProvider.generateToken(user.getEmail());
        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .user(mapToUserDTO(user))
                .build();
    }

    public void revokeRefreshToken(String refreshTokenValue) {
        if (refreshTokenValue == null || refreshTokenValue.isBlank()) {
            return;
        }
        refreshTokenRepository.findByToken(refreshTokenValue)
                .ifPresent(rt -> {
                    rt.setRevoked(true);
                    refreshTokenRepository.save(rt);
                });
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
                .codeChef(user.getLinkCodeChef())
                .codeForces(user.getLinkCodeForces())
                .hackerRank(user.getLinkHackerRank())
                .atCoder(user.getLinkAtCoder())
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
