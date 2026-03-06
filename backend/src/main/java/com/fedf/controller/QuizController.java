package com.fedf.controller;

import com.fedf.dto.ApiResponse;
import com.fedf.dto.QuizOverviewDTO;
import com.fedf.dto.company.CompanyProfileDTO;
import com.fedf.service.CompanyProfileService;
import com.fedf.service.QuizService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/quiz")
@RequiredArgsConstructor
public class QuizController {

    private final QuizService quizService;
    private final CompanyProfileService companyProfileService;

    @GetMapping("/kits")
    public ResponseEntity<ApiResponse<QuizOverviewDTO>> getCompanyKits(
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            QuizOverviewDTO overview = quizService.getCompanyKits(userDetails.getUsername());
            return ResponseEntity.ok(ApiResponse.success(overview));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/company/{company}")
    public ResponseEntity<ApiResponse<CompanyProfileDTO>> getCompanyProfile(
            @PathVariable String company,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            // userDetails is kept to ensure this endpoint remains protected like the rest of /api/quiz
            CompanyProfileDTO profile = companyProfileService.getCompanyProfile(company);
            return ResponseEntity.ok(ApiResponse.success(profile));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
