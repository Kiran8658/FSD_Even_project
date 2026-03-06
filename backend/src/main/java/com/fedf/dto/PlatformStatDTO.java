package com.fedf.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlatformStatDTO {
    private String handle;
    private String profileUrl;

    /** Total solved on this platform (if available). */
    private Integer solved;

    /** Global rank on the platform (if available). */
    private Integer globalRank;

    /** Number of contests/tests participated (if available). */
    private Integer contests;

    /** Rating/score on the platform (if available). */
    private Integer rating;

    /** Optional rank title (e.g. Codeforces rank string). */
    private String rankText;

    /** Optional breakdown (primarily for LeetCode). */
    private Integer easy;
    private Integer medium;
    private Integer hard;

    /** If the platform couldn't be fetched/parsed, include a reason. */
    private String error;
}
