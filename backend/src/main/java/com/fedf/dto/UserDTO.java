package com.fedf.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDTO {
    private String id;
    private String username;
    private String email;
    private String name;
    private String avatar;
    private String bio;
    private String college;
    private String joinDate;
    private Links links;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Links {
        private String linkedIn;
        private String github;
        private String twitter;
        private String website;
        private String resume;
        private String telegram;
        private String leetCode;
    }
}
