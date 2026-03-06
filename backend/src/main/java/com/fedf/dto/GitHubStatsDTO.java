package com.fedf.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GitHubStatsDTO {
    private String username;
    private Integer publicRepos;
    private Integer totalStars;
    private Integer followers;
    private List<RecentEventDTO> recentEvents;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RecentEventDTO {
        private String type;
        private String repo;
        private String createdAt;
    }
}
