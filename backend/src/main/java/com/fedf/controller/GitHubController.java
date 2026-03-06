package com.fedf.controller;

import com.fedf.dto.ApiResponse;
import com.fedf.dto.GitHubStatsDTO;
import com.fedf.service.GitHubService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/github")
@RequiredArgsConstructor
public class GitHubController {

    private final GitHubService gitHubService;

    @GetMapping("/{username}")
    public ResponseEntity<ApiResponse<GitHubStatsDTO>> getGitHubStats(@PathVariable String username) {
        GitHubStatsDTO stats = gitHubService.getGitHubStats(username);
        return ResponseEntity.ok(ApiResponse.success(stats));
    }
}
