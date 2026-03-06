package com.fedf.controller;

import com.fedf.dto.ApiResponse;
import com.fedf.dto.LeaderboardEntryDTO;
import com.fedf.dto.PageResponse;
import com.fedf.service.LeaderboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/leaderboard")
@RequiredArgsConstructor
public class LeaderboardController {

    private final LeaderboardService leaderboardService;

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<LeaderboardEntryDTO>>> getLeaderboard(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        return ResponseEntity.ok(ApiResponse.success(leaderboardService.getLeaderboard(page, size)));
    }
}
