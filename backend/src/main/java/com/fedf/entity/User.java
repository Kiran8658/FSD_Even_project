package com.fedf.entity;

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
    private String password;
    
    private String name;
    
    private String avatar;
    
    @Column(columnDefinition = "TEXT")
    private String bio;
    
    private String college;
    
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
