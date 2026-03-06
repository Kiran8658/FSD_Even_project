package com.fedf.service;

import com.fedf.dto.PlatformStatDTO;
import com.fedf.dto.PlatformStatsDTO;
import com.fedf.entity.User;
import com.fedf.repository.UserRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.Instant;
import java.time.Duration;
import java.net.URI;
import java.util.Objects;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class PlatformStatsService {

    private static final Duration HTTP_TIMEOUT = Duration.ofSeconds(10);
    private static final Duration CACHE_TTL = Duration.ofMinutes(5);

    private static final String BROWSER_UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

    private static final String LEETCODE_PREFIX = "https://leetcode.com/u/";
    private static final String CODECHEF_PREFIX = "https://www.codechef.com/users/";
    private static final String CODEFORCES_PREFIX = "https://codeforces.com/profile/";
    private static final String HACKERRANK_PREFIX = "https://www.hackerrank.com/profile/";
    private static final String ATCODER_PREFIX = "https://atcoder.jp/users/";

    private static final Pattern CODECHEF_TOTAL_SOLVED_PATTERN = Pattern.compile(
            "Total\\s+Problems\\s+Solved\\s*:?\\s*(\\d+)",
            Pattern.CASE_INSENSITIVE
    );

        private static final Pattern CODECHEF_RATING_PATTERN = Pattern.compile(
            "href=['\"]https://www\\.codechef\\.com/ratings/all['\"][^>]*class=['\"]rating['\"][^>]*>(\\d+)",
            Pattern.CASE_INSENSITIVE
        );

        private static final Pattern CODECHEF_GLOBAL_RANK_PATTERN = Pattern.compile(
            "id=['\"]global-rank-all['\"][^>]*>.*?<strong[^>]*class=['\"]global-rank['\"][^>]*>(\\d+)</strong>",
            Pattern.CASE_INSENSITIVE | Pattern.DOTALL
        );

    private final UserRepository userRepository;
    private final WebClient.Builder webClientBuilder;
    private final ObjectMapper objectMapper;

    private final ConcurrentMap<String, CachedStats> cache = new ConcurrentHashMap<>();

    public PlatformStatsDTO getStatsForAppUsername(String appUsername) {
        User user = userRepository.findByUsername(appUsername)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return getStatsForUser(user);
    }

        public PlatformStatsDTO getStatsForUser(User user) {
        if (user == null || user.getUsername() == null || user.getUsername().isBlank()) {
            throw new IllegalArgumentException("user and username are required");
        }

        CachedStats cached = cache.get(user.getUsername());
        if (cached != null && !cached.isExpired()) {
            return cached.stats;
        }

        PlatformStatsDTO computed = computeStatsForUser(user);
        cache.put(user.getUsername(), new CachedStats(computed, Instant.now().toEpochMilli()));
        return computed;
        }

        private PlatformStatsDTO computeStatsForUser(User user) {
        Map<String, PlatformStatDTO> platforms = new HashMap<>();

        String leetHandle = extractHandle(user.getLinkLeetCode(), LEETCODE_PREFIX);
        String ccHandle = extractHandle(user.getLinkCodeChef(), CODECHEF_PREFIX);
        String cfHandle = extractHandle(user.getLinkCodeForces(), CODEFORCES_PREFIX);

        platforms.put("leetcode", fetchLeetCode(leetHandle));
        platforms.put("codechef", fetchCodeChef(ccHandle));
        platforms.put("codeforces", fetchCodeforces(cfHandle));

        // Not implemented yet (no stable public API without scraping/keys)
        String hrHandle = extractHandle(user.getLinkHackerRank(), HACKERRANK_PREFIX);
        platforms.put("hackerrank", PlatformStatDTO.builder()
            .handle(hrHandle)
            .profileUrl(hrHandle == null ? null : HACKERRANK_PREFIX + hrHandle)
            .solved(null)
            .error(hrHandle == null ? null : "Not supported yet")
            .build());

        String atHandle = extractHandle(user.getLinkAtCoder(), ATCODER_PREFIX);
        platforms.put("atcoder", PlatformStatDTO.builder()
            .handle(atHandle)
            .profileUrl(atHandle == null ? null : ATCODER_PREFIX + atHandle)
            .solved(null)
            .error(atHandle == null ? null : "Not supported yet")
            .build());

        int total = platforms.values().stream()
            .map(PlatformStatDTO::getSolved)
            .filter(v -> v != null)
            .mapToInt(Integer::intValue)
            .sum();

        return PlatformStatsDTO.builder()
            .totalSolved(total)
            .platforms(platforms)
            .build();
        }

        private static final class CachedStats {
        private final PlatformStatsDTO stats;
        private final long createdAtEpochMs;

        private CachedStats(PlatformStatsDTO stats, long createdAtEpochMs) {
            this.stats = stats;
            this.createdAtEpochMs = createdAtEpochMs;
        }

        private boolean isExpired() {
            return (Instant.now().toEpochMilli() - createdAtEpochMs) > CACHE_TTL.toMillis();
        }
        }

    private PlatformStatDTO fetchLeetCode(String handle) {
        if (handle == null || handle.isBlank()) {
            return PlatformStatDTO.builder().handle(null).profileUrl(null).solved(null).build();
        }

        try {
            WebClient client = webClientBuilder.build();

            Map<String, Object> body = Map.of(
                    "query",
                    "query userProfile($username: String!) { matchedUser(username: $username) { profile { ranking } submitStatsGlobal { acSubmissionNum { difficulty count } } } userContestRanking(username: $username) { attendedContestsCount } }",
                    "variables",
                    Map.of("username", handle)
            );

            String raw = client.post()
                    .uri("https://leetcode.com/graphql")
                    .contentType(Objects.requireNonNull(MediaType.APPLICATION_JSON))
                    .bodyValue(Objects.requireNonNull(body))
                    .retrieve()
                    .bodyToMono(String.class)
                    .block(HTTP_TIMEOUT);

            if (raw == null || raw.isBlank()) {
                return PlatformStatDTO.builder()
                        .handle(handle)
                        .profileUrl(LEETCODE_PREFIX + handle)
                        .solved(null)
                        .error("Empty response")
                        .build();
            }

            JsonNode root = objectMapper.readTree(raw);
            JsonNode matchedUser = root.path("data").path("matchedUser");
            if (matchedUser.isMissingNode() || matchedUser.isNull()) {
                return PlatformStatDTO.builder()
                        .handle(handle)
                        .profileUrl(LEETCODE_PREFIX + handle)
                        .solved(null)
                        .error("User not found")
                        .build();
            }

            Integer globalRank = null;
            JsonNode rankingNode = matchedUser.path("profile").path("ranking");
            if (!rankingNode.isMissingNode() && !rankingNode.isNull()) {
                int r = rankingNode.asInt(-1);
                if (r >= 0) globalRank = r;
            }

            Integer contests = null;
            JsonNode contestNode = root.path("data").path("userContestRanking").path("attendedContestsCount");
            if (!contestNode.isMissingNode() && !contestNode.isNull()) {
                int c = contestNode.asInt(-1);
                if (c >= 0) contests = c;
            }

            JsonNode arr = matchedUser.path("submitStatsGlobal").path("acSubmissionNum");

            Integer all = null;
            Integer easy = null;
            Integer medium = null;
            Integer hard = null;

            if (arr.isArray()) {
                for (JsonNode item : arr) {
                    String diff = item.path("difficulty").asText("");
                    int count = item.path("count").asInt(0);
                    switch (diff) {
                        case "All" -> all = count;
                        case "Easy" -> easy = count;
                        case "Medium" -> medium = count;
                        case "Hard" -> hard = count;
                        default -> {
                        }
                    }
                }
            }

            return PlatformStatDTO.builder()
                    .handle(handle)
                    .profileUrl(LEETCODE_PREFIX + handle)
                    .solved(all)
                    .globalRank(globalRank)
                    .contests(contests)
                    .easy(easy)
                    .medium(medium)
                    .hard(hard)
                    .build();
        } catch (Exception e) {
            return PlatformStatDTO.builder()
                    .handle(handle)
                    .profileUrl(LEETCODE_PREFIX + handle)
                    .solved(null)
                    .error("Failed to fetch")
                    .build();
        }
    }

    private PlatformStatDTO fetchCodeforces(String handle) {
        if (handle == null || handle.isBlank()) {
            return PlatformStatDTO.builder().handle(null).profileUrl(null).solved(null).build();
        }

        try {
            WebClient client = webClientBuilder.build();

            Integer rating = null;
            String rankText = null;
            Integer contests = null;

            // Fetch rating + rank text (fast)
            try {
                String infoRaw = client.get()
                        .uri("https://codeforces.com/api/user.info?handles={h}", handle)
                        .retrieve()
                        .bodyToMono(String.class)
                        .block(HTTP_TIMEOUT);

                if (infoRaw != null && !infoRaw.isBlank()) {
                    JsonNode infoRoot = objectMapper.readTree(infoRaw);
                    if ("OK".equalsIgnoreCase(infoRoot.path("status").asText()) && infoRoot.path("result").isArray() && infoRoot.path("result").size() > 0) {
                        JsonNode u = infoRoot.path("result").get(0);
                        if (!u.path("rating").isMissingNode() && !u.path("rating").isNull()) {
                            int r = u.path("rating").asInt(-1);
                            if (r >= 0) rating = r;
                        }
                        String rt = u.path("rank").asText(null);
                        if (rt != null && !rt.isBlank()) rankText = rt;
                    }
                }
            } catch (Exception ignored) {
                // best-effort
            }

            // Fetch contests participated count (best-effort)
            try {
                String ratingRaw = client.get()
                        .uri("https://codeforces.com/api/user.rating?handle={h}", handle)
                        .retrieve()
                        .bodyToMono(String.class)
                        .block(HTTP_TIMEOUT);

                if (ratingRaw != null && !ratingRaw.isBlank()) {
                    JsonNode ratingRoot = objectMapper.readTree(ratingRaw);
                    if ("OK".equalsIgnoreCase(ratingRoot.path("status").asText()) && ratingRoot.path("result").isArray()) {
                        contests = ratingRoot.path("result").size();
                    }
                }
            } catch (Exception ignored) {
                // best-effort
            }

            String raw = client.get()
                    .uri("https://codeforces.com/api/user.status?handle={h}&from=1&count=10000", handle)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block(HTTP_TIMEOUT);

            if (raw == null || raw.isBlank()) {
                return PlatformStatDTO.builder()
                        .handle(handle)
                        .profileUrl(CODEFORCES_PREFIX + handle)
                        .solved(null)
                        .error("Empty response")
                        .build();
            }

            JsonNode root = objectMapper.readTree(raw);
            if (!"OK".equalsIgnoreCase(root.path("status").asText())) {
                return PlatformStatDTO.builder()
                        .handle(handle)
                        .profileUrl(CODEFORCES_PREFIX + handle)
                        .solved(null)
                        .error(root.path("comment").asText("Failed to fetch"))
                        .build();
            }

            Set<String> solved = new HashSet<>();
            JsonNode result = root.path("result");
            if (result.isArray()) {
                for (JsonNode sub : result) {
                    if (!"OK".equalsIgnoreCase(sub.path("verdict").asText())) {
                        continue;
                    }

                    JsonNode p = sub.path("problem");
                    String contestId = p.path("contestId").asText("");
                    String index = p.path("index").asText("");
                    String name = p.path("name").asText("");

                    String key = contestId + "-" + index + "-" + name;
                    solved.add(key);
                }
            }

            return PlatformStatDTO.builder()
                    .handle(handle)
                    .profileUrl(CODEFORCES_PREFIX + handle)
                    .solved(solved.size())
                    .rating(rating)
                    .rankText(rankText)
                    .contests(contests)
                    .build();
        } catch (Exception e) {
            return PlatformStatDTO.builder()
                    .handle(handle)
                    .profileUrl(CODEFORCES_PREFIX + handle)
                    .solved(null)
                    .error("Failed to fetch")
                    .build();
        }
    }

    private PlatformStatDTO fetchCodeChef(String handle) {
        if (handle == null || handle.isBlank()) {
            return PlatformStatDTO.builder().handle(null).profileUrl(null).solved(null).build();
        }

        String profileUrl = CODECHEF_PREFIX + handle;

        try {
            WebClient client = webClientBuilder.build();
            String raw = client.get()
                    .uri(profileUrl)
                    .accept(MediaType.TEXT_HTML)
                    .header(HttpHeaders.USER_AGENT, BROWSER_UA)
                    .header(HttpHeaders.ACCEPT_LANGUAGE, "en-US,en;q=0.9")
                    .retrieve()
                    .bodyToMono(String.class)
                    .block(HTTP_TIMEOUT);

            if (raw == null || raw.isBlank()) {
                return PlatformStatDTO.builder()
                        .handle(handle)
                        .profileUrl(profileUrl)
                        .solved(null)
                        .error("Empty response")
                        .build();
            }

            Integer rating = null;
            Matcher ratingMatch = CODECHEF_RATING_PATTERN.matcher(raw);
            if (ratingMatch.find()) {
                try {
                    rating = Integer.parseInt(ratingMatch.group(1));
                } catch (Exception ignored) {
                }
            }

            Integer globalRank = null;
            Matcher gr = CODECHEF_GLOBAL_RANK_PATTERN.matcher(raw);
            if (gr.find()) {
                try {
                    globalRank = Integer.parseInt(gr.group(1));
                } catch (Exception ignored) {
                }
            }

            Integer contests = null;
            try {
                JsonNode settings = extractCodeChefDrupalSettings(raw);
                JsonNode arr = settings == null ? null : settings.path("date_versus_rating").path("all");
                if (arr != null && arr.isArray()) {
                    contests = arr.size();
                }
            } catch (Exception ignored) {
            }

            Matcher m = CODECHEF_TOTAL_SOLVED_PATTERN.matcher(raw);
            if (!m.find()) {
                return PlatformStatDTO.builder()
                        .handle(handle)
                        .profileUrl(profileUrl)
                        .solved(null)
                        .error("Could not parse")
                        .build();
            }

            int solved = Integer.parseInt(m.group(1));
            return PlatformStatDTO.builder()
                    .handle(handle)
                    .profileUrl(profileUrl)
                    .solved(solved)
                    .rating(rating)
                    .globalRank(globalRank)
                    .contests(contests)
                    .build();
        } catch (Exception e) {
            return PlatformStatDTO.builder()
                    .handle(handle)
                    .profileUrl(profileUrl)
                    .solved(null)
                    .error("Failed to fetch")
                    .build();
        }
    }

    private JsonNode extractCodeChefDrupalSettings(String html) {
        if (html == null || html.isBlank()) return null;

        String marker = "jQuery.extend(Drupal.settings,";
        int idx = html.indexOf(marker);
        if (idx < 0) return null;

        int braceStart = html.indexOf('{', idx);
        if (braceStart < 0) return null;

        int depth = 0;
        for (int i = braceStart; i < html.length(); i++) {
            char c = html.charAt(i);
            if (c == '{') depth++;
            else if (c == '}') {
                depth--;
                if (depth == 0) {
                    String json = html.substring(braceStart, i + 1);
                    try {
                        return objectMapper.readTree(json);
                    } catch (Exception ignored) {
                        return null;
                    }
                }
            }
        }
        return null;
    }

    private String extractHandle(String url, String prefix) {
        if (url == null || url.isBlank()) return null;

        String trimmed = url.trim();
        if (trimmed.isBlank()) return null;

        // If a known prefix matches exactly, strip it first.
        if (prefix != null && !prefix.isBlank() && trimmed.startsWith(prefix)) {
            trimmed = trimmed.substring(prefix.length());
        }

        // Remove query/fragment if present (works for both URLs and pasted paths).
        int q = trimmed.indexOf('?');
        if (q >= 0) trimmed = trimmed.substring(0, q);
        int h = trimmed.indexOf('#');
        if (h >= 0) trimmed = trimmed.substring(0, h);

        // If user pasted a URL (or a URL-like string), extract last path segment.
        try {
            String maybeUrl = trimmed;
            if (maybeUrl.startsWith("www.")) {
                maybeUrl = "https://" + maybeUrl;
            }
            if (maybeUrl.startsWith("http://") || maybeUrl.startsWith("https://")) {
                URI uri = URI.create(maybeUrl);
                String path = uri.getPath();
                if (path != null && !path.isBlank()) {
                    String seg = lastPathSegment(path);
                    if (seg != null) {
                        trimmed = seg;
                    }
                }
            } else if (trimmed.contains("/")) {
                String seg = lastPathSegment(trimmed);
                if (seg != null) {
                    trimmed = seg;
                }
            }
        } catch (Exception ignored) {
            // fall back to original trimmed
        }

        trimmed = trimmed.trim();
        while (trimmed.endsWith("/")) trimmed = trimmed.substring(0, trimmed.length() - 1);
        return trimmed.isBlank() ? null : trimmed;
    }

    private static String lastPathSegment(String path) {
        if (path == null) return null;
        String p = path;
        while (p.endsWith("/")) p = p.substring(0, p.length() - 1);
        int idx = p.lastIndexOf('/');
        String seg = idx >= 0 ? p.substring(idx + 1) : p;
        if (seg == null) return null;
        seg = seg.trim();
        if (seg.isBlank()) return null;
        // Guard against prefixes accidentally becoming the segment.
        if ("users".equalsIgnoreCase(seg) || "profile".equalsIgnoreCase(seg) || "u".equalsIgnoreCase(seg)) {
            return null;
        }
        return seg;
    }
}
