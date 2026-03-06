package com.fedf.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NoteDTO {
    private Long id;
    private String title;
    private String content;
    private String color;
    private String createdAt;
    private String updatedAt;
}
