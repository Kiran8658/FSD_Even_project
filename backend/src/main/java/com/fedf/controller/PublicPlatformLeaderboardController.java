package com.fedf.controller;

import com.fedf.dto.ApiResponse;
import com.fedf.dto.PlatformLeaderboardEntryDTO;
import com.fedf.service.PlatformLeaderboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/public/platform-leaderboard")
@RequiredArgsConstructor
public class PublicPlatformLeaderboardController {

    private final PlatformLeaderboardService platformLeaderboardService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<PlatformLeaderboardEntryDTO>>> getPlatformLeaderboard(
            @RequestParam(defaultValue = "totalSolved") String metric,
            @RequestParam(defaultValue = "20") int limit,
            @RequestParam(required = false) String includeUser
    ) {
        List<PlatformLeaderboardEntryDTO> items = platformLeaderboardService.getLeaderboard(metric, limit, includeUser);
        return ResponseEntity.ok(ApiResponse.success(items));
    }
}
