package com.fedf.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NoteUpsertRequest {

    @NotBlank
    private String title;

    private String content;

    private String color;
}
