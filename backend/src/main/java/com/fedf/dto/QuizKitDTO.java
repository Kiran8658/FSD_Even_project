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
public class QuizKitDTO {
    private String id;
    private String company;
    private String focusArea;
    private String difficulty;
    private int questionCount;
    private int completionRate;
    private String status;
    private String lastUpdated;
    private List<String> tags;
}
