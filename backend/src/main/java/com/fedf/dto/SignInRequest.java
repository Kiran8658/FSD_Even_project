package com.fedf.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SignInRequest {
    
    @JsonAlias({"email", "username"})
    @NotBlank(message = "Email or username is required")
    private String identifier;
    
    @NotBlank(message = "Password is required")
    private String password;
}
