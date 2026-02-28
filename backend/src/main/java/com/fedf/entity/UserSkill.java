package com.fedf.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "user_skills")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserSkill {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "skill_id", nullable = false)
    private Skill skill;
    
    @Builder.Default
    @Column(nullable = false)
    private Integer level = 0; // 0-100
}
