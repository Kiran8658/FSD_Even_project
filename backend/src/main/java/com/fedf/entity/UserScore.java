package com.fedf.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "user_scores", indexes = {
        @Index(name = "idx_user_scores_total_score", columnList = "total_score")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserScore {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Builder.Default
    @Column(name = "total_solved", nullable = false)
    private Integer totalSolved = 0;

    @Builder.Default
    @Column(name = "github_score", nullable = false)
    private Integer githubScore = 0;

    @Builder.Default
    @Column(name = "quiz_score", nullable = false)
    private Integer quizScore = 0;

    @Builder.Default
    @Column(name = "total_score", nullable = false)
    private Integer totalScore = 0;

    @PrePersist
    @PreUpdate
    void updateTotalScore() {
        int solved = totalSolved != null ? totalSolved : 0;
        int github = githubScore != null ? githubScore : 0;
        int quiz = quizScore != null ? quizScore : 0;
        totalScore = solved + github + quiz;
    }
}
