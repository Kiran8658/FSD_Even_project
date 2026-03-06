package com.fedf.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlatformStatsDTO {
    /** Total solved across all platforms that returned a solved count. */
    private int totalSolved;

    /** Platform key -> stats (e.g. leetcode, codechef, codeforces). */
    private Map<String, PlatformStatDTO> platforms;
}
