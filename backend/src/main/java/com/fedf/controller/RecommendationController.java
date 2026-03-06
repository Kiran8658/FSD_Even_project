package com.fedf.controller;

import com.fedf.dto.ApiResponse;
import com.fedf.dto.RecommendationDTO;
import com.fedf.service.RecommendationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/recommendation")
@RequiredArgsConstructor
public class RecommendationController {

    private final RecommendationService recommendationService;

    @GetMapping
    public ResponseEntity<ApiResponse<RecommendationDTO>> getRecommendation(@AuthenticationPrincipal UserDetails userDetails) {
        RecommendationDTO dto = recommendationService.recommendForUserEmail(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(dto));
    }
}
