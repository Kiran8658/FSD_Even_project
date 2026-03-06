package com.fedf.service;

import com.fedf.dto.GitHubStatsDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
@Slf4j
public class GitHubService {

    @Value("${github.token:}")
    private String githubToken;

    private WebClient buildClient() {
        WebClient.Builder builder = WebClient.builder()
                .baseUrl("https://api.github.com")
                .defaultHeader(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE)
                .defaultHeader(HttpHeaders.USER_AGENT, "fedf-backend");

        if (githubToken != null && !githubToken.isBlank()) {
            builder.defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + githubToken.trim());
        }

        return builder.build();
    }

    @Cacheable(cacheNames = "githubStats", key = "#username", unless = "#result == null")
    public GitHubStatsDTO getGitHubStats(String username) {
        if (username == null || username.isBlank()) {
            throw new RuntimeException("username is required");
        }

        WebClient client = buildClient();
        String u = username.trim();

        GitHubUser user = client.get()
                .uri("/users/{username}", u)
                .retrieve()
                .bodyToMono(GitHubUser.class)
                .block();

        if (user == null) {
            throw new RuntimeException("GitHub user not found");
        }

        GitHubRepo[] repos = client.get()
                .uri("/users/{username}/repos?per_page=100&type=public&sort=updated", u)
                .retrieve()
                .bodyToMono(GitHubRepo[].class)
                .block();

        int totalStars = Arrays.stream(repos == null ? new GitHubRepo[0] : repos)
                .filter(Objects::nonNull)
                .mapToInt(r -> r.stargazers_count != null ? r.stargazers_count : 0)
                .sum();

        GitHubEvent[] events = client.get()
                .uri("/users/{username}/events/public?per_page=10", u)
                .retrieve()
                .bodyToMono(GitHubEvent[].class)
                .block();

        List<GitHubStatsDTO.RecentEventDTO> recent = Arrays.stream(events == null ? new GitHubEvent[0] : events)
                .filter(Objects::nonNull)
                .map(e -> GitHubStatsDTO.RecentEventDTO.builder()
                        .type(e.type)
                        .repo(e.repo != null ? e.repo.name : null)
                        .createdAt(normalizeIso(e.created_at))
                        .build())
                .toList();

        return GitHubStatsDTO.builder()
                .username(u)
                .publicRepos(user.public_repos != null ? user.public_repos : 0)
                .totalStars(totalStars)
                .followers(user.followers != null ? user.followers : 0)
                .recentEvents(recent)
                .build();
    }

    private String normalizeIso(String iso) {
        if (iso == null) return null;
        try {
            return OffsetDateTime.parse(iso).format(DateTimeFormatter.ISO_OFFSET_DATE_TIME);
        } catch (Exception ex) {
            return iso;
        }
    }

    // Minimal GitHub API projections (avoid adding extra DTO files)
    private static class GitHubUser {
        public Integer followers;
        public Integer public_repos;
    }

    private static class GitHubRepo {
        public Integer stargazers_count;
    }

    private static class GitHubEvent {
        public String type;
        public String created_at;
        public GitHubRepoRef repo;
    }

    private static class GitHubRepoRef {
        public String name;
    }
}
