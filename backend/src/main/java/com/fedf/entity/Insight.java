package com.fedf.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "insights")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Insight {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(nullable = false)
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private InsightType type;
    
    private String icon;
    
    private LocalDateTime timestamp;
    
    @Builder.Default
    @Column(name = "is_read")
    private Boolean isRead = false;
    
    @PrePersist
    protected void onCreate() {
        timestamp = LocalDateTime.now();
    }
    
    public enum InsightType {
        TIP, ACHIEVEMENT, MILESTONE
    }
}
