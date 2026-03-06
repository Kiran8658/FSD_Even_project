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
                        .build(),
                QuizKitDTO.builder()
                        .id("apple-ios")
                        .company("Apple")
                        .focusArea("iOS + Performance")
                        .difficulty("Medium")
                        .questionCount(34)
                        .completionRate(22)
                        .status("Ready")
                        .lastUpdated(LocalDateTime.now().minusDays(6).format(formatter))
                        .tags(List.of("Swift", "Memory", "Concurrency"))
                        .build(),
                QuizKitDTO.builder()
                        .id("netflix-platform")
                        .company("Netflix")
                        .focusArea("Distributed Systems")
                        .difficulty("Hard")
                        .questionCount(38)
                        .completionRate(18)
                        .status("Ready")
                        .lastUpdated(LocalDateTime.now().minusDays(7).format(formatter))
                        .tags(List.of("Caching", "Resilience", "Observability"))
                        .build(),
                QuizKitDTO.builder()
                        .id("tesla-embedded")
                        .company("Tesla")
                        .focusArea("Embedded & Systems")
                        .difficulty("Hard")
                        .questionCount(26)
                        .completionRate(11)
                        .status("In Progress")
                        .lastUpdated(LocalDateTime.now().minusDays(8).format(formatter))
                        .tags(List.of("C/C++", "RTOS", "Debugging"))
                        .build(),
                QuizKitDTO.builder()
                        .id("adobe-frontend")
                        .company("Adobe")
                        .focusArea("Frontend Architecture")
                        .difficulty("Medium")
                        .questionCount(29)
                        .completionRate(33)
                        .status("Ready")
                        .lastUpdated(LocalDateTime.now().minusDays(9).format(formatter))
                        .tags(List.of("React", "TypeScript", "Perf"))
                        .build(),
                QuizKitDTO.builder()
                        .id("salesforce-crm")
                        .company("Salesforce")
                        .focusArea("Backend + Data Modeling")
                        .difficulty("Medium")
                        .questionCount(31)
                        .completionRate(27)
                        .status("Ready")
                        .lastUpdated(LocalDateTime.now().minusDays(10).format(formatter))
                        .tags(List.of("APIs", "DB", "Security"))
                        .build(),
                QuizKitDTO.builder()
                        .id("oracle-java")
                        .company("Oracle")
                        .focusArea("Java + Systems")
                        .difficulty("Medium")
                        .questionCount(33)
                        .completionRate(41)
                        .status("Ready")
                        .lastUpdated(LocalDateTime.now().minusDays(11).format(formatter))
                        .tags(List.of("Java", "JVM", "Concurrency"))
                        .build(),
                QuizKitDTO.builder()
                        .id("ibm-cloud")
                        .company("IBM")
                        .focusArea("Cloud Fundamentals")
                        .difficulty("Easy")
                        .questionCount(22)
                        .completionRate(49)
                        .status("Ready")
                        .lastUpdated(LocalDateTime.now().minusDays(12).format(formatter))
                        .tags(List.of("Cloud", "Linux", "Networking"))
                        .build(),
                QuizKitDTO.builder()
                        .id("intuit-fintech")
                        .company("Intuit")
                        .focusArea("Fintech + Data")
                        .difficulty("Medium")
                        .questionCount(27)
                        .completionRate(36)
                        .status("Ready")
                        .lastUpdated(LocalDateTime.now().minusDays(13).format(formatter))
                        .tags(List.of("SQL", "APIs", "Testing"))
                        .build(),
                QuizKitDTO.builder()
                        .id("stripe-payments")
                        .company("Stripe")
                        .focusArea("Payments + Reliability")
                        .difficulty("Hard")
                        .questionCount(35)
                        .completionRate(15)
                        .status("Ready")
                        .lastUpdated(LocalDateTime.now().minusDays(14).format(formatter))
                        .tags(List.of("Idempotency", "Queues", "APIs"))
                        .build(),
                QuizKitDTO.builder()
                        .id("airbnb-fullstack")
                        .company("Airbnb")
                        .focusArea("Full-stack Product")
                        .difficulty("Medium")
                        .questionCount(30)
                        .completionRate(24)
                        .status("Ready")
                        .lastUpdated(LocalDateTime.now().minusDays(15).format(formatter))
                        .tags(List.of("React", "APIs", "Testing"))
                        .build(),
                QuizKitDTO.builder()
                        .id("linkedin-search")
                        .company("LinkedIn")
                        .focusArea("Search + Ranking")
                        .difficulty("Hard")
                        .questionCount(32)
                        .completionRate(19)
                        .status("In Progress")
                        .lastUpdated(LocalDateTime.now().minusDays(16).format(formatter))
                        .tags(List.of("Ranking", "Indexing", "Scale"))
                        .build(),
                QuizKitDTO.builder()
                        .id("atlassian-platform")
                        .company("Atlassian")
                        .focusArea("Platform Engineering")
                        .difficulty("Medium")
                        .questionCount(26)
                        .completionRate(29)
                        .status("Ready")
                        .lastUpdated(LocalDateTime.now().minusDays(17).format(formatter))
                        .tags(List.of("APIs", "Microservices", "CI/CD"))
                        .build(),
                QuizKitDTO.builder()
                        .id("paypal-risk")
                        .company("PayPal")
                        .focusArea("Risk + Data")
                        .difficulty("Medium")
                        .questionCount(25)
                        .completionRate(34)
                        .status("Ready")
                        .lastUpdated(LocalDateTime.now().minusDays(18).format(formatter))
                        .tags(List.of("SQL", "Fraud", "APIs"))
                        .build(),
                QuizKitDTO.builder()
                        .id("bloomberg-systems")
                        .company("Bloomberg")
                        .focusArea("Systems + Networking")
                        .difficulty("Hard")
                        .questionCount(28)
                        .completionRate(13)
                        .status("Ready")
                        .lastUpdated(LocalDateTime.now().minusDays(19).format(formatter))
                        .tags(List.of("Networking", "C++", "Latency"))
                        .build(),
                QuizKitDTO.builder()
                        .id("goldman-quant")
                        .company("Goldman Sachs")
                        .focusArea("Quant + Problem Solving")
                        .difficulty("Hard")
                        .questionCount(24)
                        .completionRate(9)
                        .status("In Progress")
                        .lastUpdated(LocalDateTime.now().minusDays(20).format(formatter))
                        .tags(List.of("Probability", "DSA", "Math"))
                        .build(),
                QuizKitDTO.builder()
                        .id("jpmorgan-java")
                        .company("JPMorgan")
                        .focusArea("Java + Microservices")
                        .difficulty("Medium")
                        .questionCount(26)
                        .completionRate(21)
                        .status("Ready")
                        .lastUpdated(LocalDateTime.now().minusDays(21).format(formatter))
                        .tags(List.of("Java", "Spring", "SQL"))
                        .build(),
                QuizKitDTO.builder()
                        .id("shopify-backend")
                        .company("Shopify")
                        .focusArea("Backend + Scaling")
                        .difficulty("Medium")
                        .questionCount(27)
                        .completionRate(26)
                        .status("Ready")
                        .lastUpdated(LocalDateTime.now().minusDays(22).format(formatter))
                        .tags(List.of("APIs", "DB", "Scale"))
                        .build(),
                QuizKitDTO.builder()
                        .id("twilio-apis")
                        .company("Twilio")
                        .focusArea("API Design")
                        .difficulty("Medium")
                        .questionCount(23)
                        .completionRate(31)
                        .status("Ready")
                        .lastUpdated(LocalDateTime.now().minusDays(23).format(formatter))
                        .tags(List.of("REST", "Idempotency", "Webhooks"))
                        .build(),
                QuizKitDTO.builder()
                        .id("spotify-data")
                        .company("Spotify")
                        .focusArea("Data + Experimentation")
                        .difficulty("Medium")
                        .questionCount(21)
                        .completionRate(38)
                        .status("Ready")
                        .lastUpdated(LocalDateTime.now().minusDays(24).format(formatter))
                        .tags(List.of("Metrics", "A/B", "SQL"))
                        .build()
        );
    }
}
