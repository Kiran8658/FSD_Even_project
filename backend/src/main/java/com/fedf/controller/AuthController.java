package com.fedf.controller;

import com.fedf.dto.*;
import com.fedf.service.AuthService;
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

    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<AuthResponse>> signUp(@Valid @RequestBody SignUpRequest request) {
        try {
            AuthResponse response = authService.signUp(request);
            return ResponseEntity.ok(ApiResponse.success("Registration successful", response));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/signin")
    public ResponseEntity<ApiResponse<AuthResponse>> signIn(@Valid @RequestBody SignInRequest request) {
        try {
            AuthResponse response = authService.signIn(request);
            return ResponseEntity.ok(ApiResponse.success("Login successful", response));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Invalid email or password"));
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
    public ResponseEntity<ApiResponse<String>> signOut() {
        // JWT is stateless, so we just return success
        // Client should remove the token from storage
        return ResponseEntity.ok(ApiResponse.success("Signed out successfully", null));
    }
}
