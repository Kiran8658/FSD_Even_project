package com.fedf.service;

import com.fedf.dto.RecommendationDTO;
import com.fedf.entity.User;
import com.fedf.entity.UserSkill;
import com.fedf.repository.UserRepository;
import com.fedf.repository.UserSkillRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class RecommendationService {

    private final UserRepository userRepository;
    private final UserSkillRepository userSkillRepository;

    public RecommendationDTO recommendForUserEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<UserSkill> skills = userSkillRepository.findByUserWithSkill(user);
        if (skills.isEmpty()) {
            return RecommendationDTO.builder()
                    .weakestTopic("General")
                    .companyKit("Amazon SDE")
                    .difficulty("Easy")
                    .reasoning("No skill history found yet; start with general foundations and build momentum.")
                    .build();
        }

        // Weakest topic = lowest skill level
        UserSkill weakest = skills.stream()
                .min(Comparator.comparingInt(s -> s.getLevel() != null ? s.getLevel() : 0))
                .orElse(skills.get(skills.size() - 1));

        int avg = (int) Math.round(skills.stream()
                .mapToInt(s -> s.getLevel() != null ? s.getLevel() : 0)
                .average()
                .orElse(0));

        String topic = weakest.getSkill() != null ? weakest.getSkill().getName() : "General";
        String kit = pickCompanyKit(topic);
        String difficulty = slightlyAbove(avg);

        String reasoning = "Weakest topic detected as '" + topic + "' (level " + (weakest.getLevel() != null ? weakest.getLevel() : 0)
                + "). Average level is about " + avg + ", so recommended difficulty is '" + difficulty + "' to stretch slightly.";

        return RecommendationDTO.builder()
                .weakestTopic(topic)
                .companyKit(kit)
                .difficulty(difficulty)
                .reasoning(reasoning)
                .build();
    }

    private String pickCompanyKit(String topic) {
        String t = topic.toLowerCase();
        if (t.contains("react") || t.contains("css") || t.contains("typescript")) return "Meta Frontend";
        if (t.contains("spring") || t.contains("java")) return "Amazon Backend";
        if (t.contains("database") || t.contains("sql")) return "Uber Analytics";
        if (t.contains("devops") || t.contains("docker")) return "Microsoft Cloud";
        return "Google Algorithms";
    }

    private String slightlyAbove(int avg) {
        // Deterministic mapping. "Slightly above" shifts one step up where possible.
        if (avg < 35) return "Easy";
        if (avg < 70) return "Medium";
        return "Hard";
    }
}
