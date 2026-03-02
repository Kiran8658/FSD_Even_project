package com.fedf.service;

import com.fedf.dto.QuizKitDTO;
import com.fedf.dto.QuizOverviewDTO;
import com.fedf.entity.User;
import com.fedf.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuizService {

    private final UserRepository userRepository;

    public QuizOverviewDTO getCompanyKits(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<QuizKitDTO> kits = buildSampleKits();
        List<String> recommendedCompanies = kits.stream()
                .filter(kit -> "Ready".equalsIgnoreCase(kit.getStatus()))
                .sorted(Comparator.comparingInt(QuizKitDTO::getCompletionRate).reversed())
                .limit(3)
                .map(QuizKitDTO::getCompany)
                .collect(Collectors.toList());

        String displayName = Optional.ofNullable(user.getName())
                .filter(name -> !name.isBlank())
                .orElse(user.getUsername());

        return QuizOverviewDTO.builder()
                .username(displayName)
                .lastSynced(LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME))
                .recommendedCompanies(recommendedCompanies)
                .kits(kits)
                .build();
    }

    private List<QuizKitDTO> buildSampleKits() {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM dd");

        return List.of(
                QuizKitDTO.builder()
                        .id("amazon-sde")
                        .company("Amazon")
                        .focusArea("Data Structures & Leadership Principles")
                        .difficulty("Medium")
                        .questionCount(45)
                        .completionRate(72)
                        .status("Ready")
                        .lastUpdated(LocalDateTime.now().minusDays(1).format(formatter))
                        .tags(List.of("Arrays", "Graphs", "LP"))
                        .build(),
                QuizKitDTO.builder()
                        .id("microsoft-swe")
                        .company("Microsoft")
                        .focusArea("System Design Warmups")
                        .difficulty("Medium")
                        .questionCount(30)
                        .completionRate(64)
                        .status("Ready")
                        .lastUpdated(LocalDateTime.now().minusDays(3).format(formatter))
                        .tags(List.of("Design", "APIs", "Scalability"))
                        .build(),
                QuizKitDTO.builder()
                        .id("google-llm")
                        .company("Google")
                        .focusArea("Algorithmic Patterns")
                        .difficulty("Hard")
                        .questionCount(50)
                        .completionRate(51)
                        .status("In Progress")
                        .lastUpdated(LocalDateTime.now().minusDays(2).format(formatter))
                        .tags(List.of("DP", "Greedy", "Graphs"))
                        .build(),
                QuizKitDTO.builder()
                        .id("meta-ml")
                        .company("Meta")
                        .focusArea("ML Fundamentals & Product Thinking")
                        .difficulty("Medium")
                        .questionCount(28)
                        .completionRate(57)
                        .status("Ready")
                        .lastUpdated(LocalDateTime.now().minusDays(4).format(formatter))
                        .tags(List.of("ML", "Product", "Math"))
                        .build(),
                QuizKitDTO.builder()
                        .id("uber-analytics")
                        .company("Uber")
                        .focusArea("SQL & Experimentation")
                        .difficulty("Easy")
                        .questionCount(24)
                        .completionRate(83)
                        .status("Ready")
                        .lastUpdated(LocalDateTime.now().minusDays(5).format(formatter))
                        .tags(List.of("SQL", "Case Study", "Metrics"))
                        .build()
        );
    }
}
