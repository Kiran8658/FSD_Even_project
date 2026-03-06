package com.fedf.controller;

import com.fedf.dto.*;
import com.fedf.service.AuthService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    private static final String REFRESH_COOKIE = "refresh_token";

    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<AuthResponse>> signUp(@Valid @RequestBody SignUpRequest request, HttpServletResponse response) {
        try {
            AuthResponse body = authService.signUp(request);
            setRefreshCookie(response, authService.issueRefreshTokenForEmail(body.getUser().getEmail()));
            return ResponseEntity.ok(ApiResponse.success("Registration successful", body));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/signin")
    public ResponseEntity<ApiResponse<AuthResponse>> signIn(@Valid @RequestBody SignInRequest request, HttpServletResponse response) {
        try {
            AuthResponse body = authService.signIn(request);
            setRefreshCookie(response, authService.issueRefreshTokenForEmail(body.getUser().getEmail()));
            return ResponseEntity.ok(ApiResponse.success("Login successful", body));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Invalid email or password"));
        }
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<AuthResponse>> refresh(HttpServletRequest request, HttpServletResponse response) {
        try {
            String refreshToken = readCookie(request, REFRESH_COOKIE);
            AuthResponse refreshed = authService.refreshAccessToken(refreshToken);
            // rotate cookie on refresh
            setRefreshCookie(response, authService.issueRefreshTokenForEmail(refreshed.getUser().getEmail()));
            return ResponseEntity.ok(ApiResponse.success("Token refreshed", refreshed));
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(ApiResponse.error(ex.getMessage()));
        }
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserDTO>> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        try {
            UserDTO user = authService.getCurrentUser(userDetails.getUsername());
            return ResponseEntity.ok(ApiResponse.success(user));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/signout")
    public ResponseEntity<ApiResponse<String>> signOut(HttpServletRequest request, HttpServletResponse response) {
        String refreshToken = readCookie(request, REFRESH_COOKIE);
        authService.revokeRefreshToken(refreshToken);
        clearRefreshCookie(response);
        return ResponseEntity.ok(ApiResponse.success("Signed out successfully", null));
    }

    private void setRefreshCookie(HttpServletResponse response, String token) {
        Cookie cookie = new Cookie(REFRESH_COOKIE, token);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(60 * 60 * 24 * 30);
        response.addCookie(cookie);
    }

    private void clearRefreshCookie(HttpServletResponse response) {
        Cookie cookie = new Cookie(REFRESH_COOKIE, "");
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        response.addCookie(cookie);
    }

    private String readCookie(HttpServletRequest request, String name) {
        Cookie[] cookies = request.getCookies();
        if (cookies == null) return null;
        for (Cookie cookie : cookies) {
            if (name.equals(cookie.getName())) {
                return cookie.getValue();
            }
        }
        return null;
    }
}
