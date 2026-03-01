package com.fedf.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InsightDTO {
    private String id;
    private String title;
    private String description;
    private String type; // tip, achievement, milestone
    private String icon;
    private String timestamp;
}
