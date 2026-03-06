package com.fedf.dto.company;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoleProfileDTO {
    private String title;
    private String salary;
    private List<String> requiredSubjects;
    private List<String> interviewQuestions;
    private String sourceUrl;
}
