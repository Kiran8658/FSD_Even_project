package com.fedf.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @Column(unique = true, nullable = false)
    private String username;
    
    @Column(unique = true, nullable = false)
    private String email;
    
    @Column(nullable = false)
    @JsonIgnore
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private String password;
    
    private String name;
    
    private String avatar;
    
    @Column(columnDefinition = "TEXT")
    private String bio;
    
    private String college;

    @Column(name = "link_linkedin")
    private String linkLinkedIn;

    @Column(name = "link_github")
    private String linkGithub;

    @Column(name = "link_twitter")
    private String linkTwitter;

    @Column(name = "link_website")
    private String linkWebsite;

    @Column(name = "link_resume")
    private String linkResume;

    @Column(name = "link_telegram")
    private String linkTelegram;

    @Column(name = "link_leetcode")
    private String linkLeetCode;

    @Column(name = "link_codechef")
    private String linkCodeChef;

    @Column(name = "link_codeforces")
    private String linkCodeForces;

    @Column(name = "link_hackerrank")
    private String linkHackerRank;

    @Column(name = "link_atcoder")
    private String linkAtCoder;

    @Column(name = "join_date")
    private LocalDateTime joinDate;
    
    @Column(name = "last_activity")
    private LocalDateTime lastActivity;
    
    @Builder.Default
    @Column(name = "current_streak")
    private Integer currentStreak = 0;
    
    @Builder.Default
    @Column(name = "longest_streak")
    private Integer longestStreak = 0;
    
    @Builder.Default
    @Column(name = "total_activities")
    private Integer totalActivities = 0;
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Activity> activities = new ArrayList<>();
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<UserSkill> skills = new ArrayList<>();
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Insight> insights = new ArrayList<>();
    
    @PrePersist
    protected void onCreate() {
        joinDate = LocalDateTime.now();
        lastActivity = LocalDateTime.now();
    }
}
