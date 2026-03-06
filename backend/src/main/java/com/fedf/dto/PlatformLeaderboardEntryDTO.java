package com.fedf.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlatformLeaderboardEntryDTO {
    private Integer rank;

    private String userId;
    private String username;
    private String name;
    private String avatar;

    /** Metric value used for ranking (e.g. total solved, LeetCode solved, etc.). */
    private Integer value;

    /** Platform details for the selected metric (e.g. LeetCode/CodeChef/Codeforces). */
    private PlatformStatDTO platform;
}
