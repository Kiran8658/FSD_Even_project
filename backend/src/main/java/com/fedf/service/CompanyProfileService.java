package com.fedf.service;

import com.fedf.dto.company.CompanyProfileDTO;
import com.fedf.dto.company.RoleProfileDTO;
import com.fedf.integrations.RemotiveJobClient;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CompanyProfileService {

    private final RemotiveJobClient remotiveJobClient;

    public CompanyProfileDTO getCompanyProfile(String company) {
        String normalizedCompany = normalizeCompany(company);

        List<RoleProfileDTO> roles = new ArrayList<>();
        try {
            roles = buildRolesFromRemotive(normalizedCompany);
        } catch (Exception ignored) {
            // fall back below
        }

        if (roles.isEmpty()) {
            roles = buildFallbackRoles(normalizedCompany);
        }

        return CompanyProfileDTO.builder()
                .company(normalizedCompany)
                .lastSynced(LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME))
                .roles(roles)
                .build();
    }

    private List<RoleProfileDTO> buildRolesFromRemotive(String company) {
        List<RemotiveJobClient.RemotiveJob> jobs = remotiveJobClient.searchJobs(company);

        String companyLower = company.toLowerCase(Locale.ROOT);
        List<RemotiveJobClient.RemotiveJob> exactMatches = jobs.stream()
                .filter(job -> job != null && job.companyName != null)
                .filter(job -> job.companyName.toLowerCase(Locale.ROOT).contains(companyLower))
                .toList();

        List<RemotiveJobClient.RemotiveJob> chosen = !exactMatches.isEmpty() ? exactMatches : jobs;

        Map<String, RoleProfileDTO> roleByTitle = new LinkedHashMap<>();

        for (RemotiveJobClient.RemotiveJob job : chosen) {
            if (job == null) continue;

            String title = safe(job.title);
            if (title.isBlank()) continue;

            String sourceCompany = safe(job.companyName);
            String displayTitle = sourceCompany.isBlank() ? title : (title + " @ " + sourceCompany);

            roleByTitle.computeIfAbsent(displayTitle, key -> RoleProfileDTO.builder()
                    .title(displayTitle)
                    .salary(safe(job.salary).isBlank() ? "Not listed" : safe(job.salary))
                    .requiredSubjects(recommendSubjectsForTitle(title))
                    .interviewQuestions(recommendQuestionsForTitle(title))
                    .sourceUrl(safe(job.url).isBlank() ? null : safe(job.url))
                    .build());

            if (roleByTitle.size() >= 8) {
                break;
            }
        }

        return new ArrayList<>(roleByTitle.values());
    }

    private List<RoleProfileDTO> buildFallbackRoles(String company) {
        // Safe, generic fallback content (no scraped / copyrighted question lists).
        String seTitle = company + " Software Engineer";
        String daTitle = company + " Data Analyst";

        return List.of(
            RoleProfileDTO.builder()
                .title(seTitle)
                .salary("Not listed")
                .requiredSubjects(recommendSubjectsForTitle(seTitle))
                .interviewQuestions(recommendQuestionsForTitle(seTitle))
                .sourceUrl(null)
                .build(),
            RoleProfileDTO.builder()
                .title(daTitle)
                .salary("Not listed")
                .requiredSubjects(recommendSubjectsForTitle(daTitle))
                .interviewQuestions(recommendQuestionsForTitle(daTitle))
                .sourceUrl(null)
                .build()
        );
    }

    private List<String> recommendSubjectsForTitle(String title) {
        String t = title.toLowerCase(Locale.ROOT);

        List<String> subjects = new ArrayList<>();

        if (t.contains("data") || t.contains("analyst") || t.contains("analytics") || t.contains("bi")) {
            subjects.add("SQL joins & window functions");
            subjects.add("Statistics basics");
            subjects.add("A/B testing");
            subjects.add("Dashboards & storytelling");
        }

        if (t.contains("ml") || t.contains("machine learning") || t.contains("ai") || t.contains("data scientist")) {
            subjects.add("Python + data tooling");
            subjects.add("ML fundamentals");
            subjects.add("Model evaluation");
            subjects.add("Feature engineering");
        }

        if (t.contains("backend") || t.contains("server") || t.contains("api")) {
            subjects.add("APIs + authentication");
            subjects.add("Databases");
            subjects.add("Caching");
            subjects.add("Observability");
        }

        if (t.contains("frontend") || t.contains("react") || t.contains("ui")) {
            subjects.add("React + TypeScript");
            subjects.add("State management");
            subjects.add("Performance & accessibility");
        }

        if (subjects.isEmpty()) {
            subjects.addAll(List.of("Data Structures", "Algorithms", "SQL", "System Design basics"));
        }

        return subjects.stream().distinct().limit(6).toList();
    }

    private List<String> recommendQuestionsForTitle(String title) {
        String t = title.toLowerCase(Locale.ROOT);

        if (t.contains("data") || t.contains("analyst") || t.contains("analytics") || t.contains("bi")) {
            return takeQuestions(
                "Write a SQL query using window functions (RANK/DENSE_RANK/ROW_NUMBER).",
                "Explain how you would evaluate an A/B test end-to-end.",
                "Design a metric for retention and discuss common pitfalls.",
                "Given a funnel drop-off, how do you investigate root causes?",
                "Explain cohort analysis and when it’s useful.",
                "How do you handle missing data and outliers?",
                "Write a SQL query to compute week-over-week growth.",
                "Explain selection bias and how it can mislead analysis.",
                "What’s the difference between correlation and causation?",
                "How would you define north-star metrics for a new feature?",
                "Design a dashboard: what would you show to execs vs operators?",
                "Explain confidence intervals and practical significance.",
                "How do you choose a baseline and guardrail metrics for experiments?",
                "Write a SQL query to deduplicate events and compute unique users.",
                "How would you detect anomalies in time-series metrics?",
                "Explain attribution challenges in multi-touch funnels.",
                "How do you validate data quality in a pipeline?",
                "Tell me about an analysis you did that changed a product decision."
            );
        }

        if (t.contains("ml") || t.contains("machine learning") || t.contains("ai") || t.contains("data scientist")) {
            return takeQuestions(
                "Explain bias/variance trade-off with an example.",
                "How do you handle class imbalance?",
                "Describe a feature pipeline for production ML.",
                "How do you evaluate a ranking model?",
                "Explain cross-validation and when it can fail.",
                "What is data leakage? Provide examples.",
                "How would you choose metrics for a classifier in a high-imbalance setting?",
                "Explain precision/recall trade-offs.",
                "How do you monitor model drift in production?",
                "Explain calibration and why it matters.",
                "How do you handle categorical features?",
                "Describe the difference between batch and online inference.",
                "How would you do feature importance analysis safely?",
                "What’s the difference between L1 and L2 regularization?",
                "How do you do hyperparameter tuning efficiently?",
                "Explain embeddings and one practical use.",
                "How do you design an offline-to-online experiment for ML changes?",
                "Describe a time you shipped a model and what you learned."
            );
        }

        if (t.contains("frontend") || t.contains("react") || t.contains("ui")) {
            return takeQuestions(
                "Explain React rendering and how to optimize it.",
                "Implement a debounced search input.",
                "How do you ensure accessibility in a UI component?",
                "Debug a performance regression in a SPA.",
                "Explain when to use memoization (useMemo/useCallback) and when not to.",
                "How do you design a component API for reusability?",
                "Explain browser critical rendering path and performance levers.",
                "How do you manage state in a complex form?",
                "Explain CORS and how it impacts frontend apps.",
                "How would you implement infinite scroll safely?",
                "What causes layout shift and how to prevent it?",
                "How do you handle error states and retries in UI?",
                "Explain SSR vs CSR trade-offs.",
                "How do you test UI components (unit vs e2e)?",
                "How do you structure a large React codebase?",
                "How do you secure tokens in a SPA?",
                "Explain how the event loop affects UI responsiveness.",
                "Describe a hard UI bug you fixed and your approach."
            );
        }

        return takeQuestions(
            "Implement an LRU cache and analyze complexity.",
            "Solve a graph traversal problem and justify your approach.",
            "Design a rate limiter (high-level).",
            "Explain ACID vs BASE and when to use each.",
            "Design an API for file uploads and handle retries.",
            "Explain how to choose an index strategy for a relational DB.",
            "Describe how you’d troubleshoot a production latency spike.",
            "Implement a thread-safe counter and discuss trade-offs.",
            "Design a messaging/notification system.",
            "Explain consistency models (strong vs eventual) with examples.",
            "Given a large dataset, how would you process it efficiently?",
            "Design a cache invalidation strategy.",
            "Explain CAP theorem and how it impacts design decisions.",
            "Design a logging/metrics/tracing approach for a service.",
            "Explain backpressure and where it shows up in systems.",
            "How would you design a feature flag system?",
            "Implement a top-K frequent elements solution.",
            "Explain pagination strategies (offset vs cursor) and trade-offs."
        );
    }

        private List<String> takeQuestions(String... questions) {
        // Ensure we return 15–25 questions. We cap at 20 to keep UI readable.
        int max = 20;
        int min = 15;
        List<String> base = List.of(questions);
        if (base.size() <= max) {
            return base;
        }
        List<String> trimmed = base.subList(0, max);
        // If a future edit accidentally goes below min, keep it as-is rather than duplicating.
        return trimmed.size() < min ? base : trimmed;
        }

    private String normalizeCompany(String company) {
        String c = safe(company);
        if (c.isBlank()) return "Company";
        return c.trim();
    }

    private String safe(String value) {
        return value == null ? "" : value.trim();
    }
}
