package com.fedf.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardStatsDTO {
    private Integer totalActivities;
    private Integer currentStreak;
    private Integer longestStreak;
    private Integer consistencyRate;
    private Integer skillsLearned;
}
