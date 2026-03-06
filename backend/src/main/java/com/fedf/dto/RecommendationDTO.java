package com.fedf.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecommendationDTO {
    private String weakestTopic;
    private String companyKit;
    private String difficulty;
    private String reasoning;
}
