package com.fedf.controller;

import com.fedf.dto.ApiResponse;
import com.fedf.dto.PlatformStatsDTO;
import com.fedf.service.PlatformStatsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/public/platform-stats")
@RequiredArgsConstructor
public class PublicPlatformStatsController {

    private final PlatformStatsService platformStatsService;

    @GetMapping("/{username}")
    public ResponseEntity<ApiResponse<PlatformStatsDTO>> getPlatformStats(@PathVariable String username) {
        PlatformStatsDTO stats = platformStatsService.getStatsForAppUsername(username);
        return ResponseEntity.ok(ApiResponse.success(stats));
    }
}
